const crypto = require('crypto');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');
const { USER_ROLES } = require('../config/constants');

/**
 * Helper to generate token response with HTTP cookie and JSON body
 * @param {import('../models/User')} user
 * @param {number} statusCode
 * @param {import('express').Response} res
 * @param {string} [message]
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    profile: user.profile || {},
    studyStreak: user.studyStreak || { current: 0, longest: 0 },
    badges: user.badges || [],
    achievements: user.achievements || [],
    isActive: user.isActive,
    isVerified: user.isVerified
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    ...(message && { message }),
    token,
    user: userData
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, profile } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return next(
        new ErrorResponse('Please provide name, email, and password', 400)
      );
    }

    if (password.length < 6) {
      return next(
        new ErrorResponse('Password must be at least 6 characters long', 400)
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return next(
        new ErrorResponse('An account with this email already exists', 400)
      );
    }

    // Role assignment (disallow creating superadmin/admin via public registration)
    let assignedRole = USER_ROLES.STUDENT;
    if (role && [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR].includes(role)) {
      assignedRole = role;
    }

    // Generate random avatar if none provided
    const avatarSeed = encodeURIComponent(name.trim());
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      avatar: defaultAvatar,
      profile: profile || {}
    });

    sendTokenResponse(user, 201, res, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse('Please provide an email and password', 400)
      );
    }

    // Find user with password selected
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    if (!user.isActive) {
      return next(
        new ErrorResponse('Your account is deactivated. Please contact support.', 403)
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Update lastActive timestamp
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile || {},
      studyStreak: user.studyStreak || { current: 0, longest: 0 },
      badges: user.badges || [],
      achievements: user.achievements || [],
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      data: userData,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, profile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (name) {
      user.name = name.trim();
    }

    if (avatar) {
      user.avatar = avatar;
    }

    if (profile && typeof profile === 'object') {
      user.profile = {
        bio: profile.bio !== undefined ? profile.bio : user.profile?.bio || '',
        phone: profile.phone !== undefined ? profile.phone : user.profile?.phone || '',
        institution: profile.institution !== undefined ? profile.institution : user.profile?.institution || '',
        dateOfBirth: profile.dateOfBirth !== undefined ? profile.dateOfBirth : user.profile?.dateOfBirth,
        city: profile.city !== undefined ? profile.city : user.profile?.city || '',
        state: profile.state !== undefined ? profile.state : user.profile?.state || ''
      };
    }

    await user.save();

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(
        new ErrorResponse('Please provide current password and new password', 400)
      );
    }

    if (newPassword.length < 6) {
      return next(
        new ErrorResponse('New password must be at least 6 characters long', 400)
      );
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Current password does not match', 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Forgot password - Generate reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse('Please provide an email address', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return next(new ErrorResponse('No account found with this email address', 404));
    }

    // Generate random reset token (20 bytes hex)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration: 10 minutes from now
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Mock reset URL for development and testing
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: 'Password reset token generated and sent to email (simulated)',
      ...(process.env.NODE_ENV === 'development' && {
        resetToken,
        resetUrl
      })
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return next(new ErrorResponse('Please provide a new password', 400));
    }

    if (password.length < 6) {
      return next(
        new ErrorResponse('Password must be at least 6 characters long', 400)
      );
    }

    // Hash the url token param to match database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};
