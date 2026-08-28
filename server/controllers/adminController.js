const { User } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { USER_ROLES, RESOURCES, ACTIONS, PERMISSIONS } = require('../config/constants');

/**
 * Default permission presets per role
 */
const ROLE_PERMISSIONS_MAP = {
  [USER_ROLES.SUPERADMIN]: [
    { resource: '*', actions: ['*'] }
  ],
  [USER_ROLES.ADMIN]: [
    { resource: '*', actions: ['create', 'read', 'update', 'delete', 'manage'] }
  ],
  [USER_ROLES.CONTENT_MANAGER]: [
    { resource: 'courses', actions: ['create', 'read', 'update', 'delete', 'publish'] },
    { resource: 'subjects', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'chapters', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'topics', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'study_materials', actions: ['create', 'read', 'update', 'delete', 'publish'] },
    { resource: 'lectures', actions: ['create', 'read', 'update', 'delete', 'publish'] },
    { resource: 'announcements', actions: ['create', 'read', 'update', 'delete'] }
  ],
  [USER_ROLES.INSTRUCTOR]: [
    { resource: 'courses', actions: ['read', 'update'] },
    { resource: 'lectures', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'study_materials', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'questions', actions: ['create', 'read', 'update'] },
    { resource: 'quizzes', actions: ['create', 'read', 'update'] },
    { resource: 'tests', actions: ['create', 'read', 'update'] },
    { resource: 'discussions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'polls', actions: ['create', 'read', 'update'] },
    { resource: 'announcements', actions: ['create', 'read'] }
  ],
  [USER_ROLES.QUESTION_MANAGER]: [
    { resource: 'questions', actions: ['create', 'read', 'update', 'delete', 'review', 'publish'] },
    { resource: 'question_papers', actions: ['create', 'read', 'update', 'delete', 'publish'] },
    { resource: 'quizzes', actions: ['create', 'read', 'update', 'delete', 'publish'] },
    { resource: 'tests', actions: ['create', 'read', 'update', 'delete', 'publish'] }
  ],
  [USER_ROLES.REVIEWER]: [
    { resource: 'questions', actions: ['read', 'review'] },
    { resource: 'study_materials', actions: ['read', 'review'] },
    { resource: 'lectures', actions: ['read', 'review'] }
  ],
  [USER_ROLES.MODERATOR]: [
    { resource: 'discussions', actions: ['read', 'update', 'delete', 'manage'] },
    { resource: 'polls', actions: ['read', 'update', 'delete'] }
  ],
  [USER_ROLES.STUDENT]: [
    { resource: 'courses', actions: ['read'] },
    { resource: 'lectures', actions: ['read'] },
    { resource: 'study_materials', actions: ['read'] },
    { resource: 'quizzes', actions: ['read'] },
    { resource: 'tests', actions: ['read'] },
    { resource: 'discussions', actions: ['create', 'read', 'update'] },
    { resource: 'polls', actions: ['read'] }
  ]
};

/**
 * @desc    Get all users with search, role filter & pagination
 * @route   GET /api/admin/users
 * @access  Private (Superadmin, Admin)
 */
const getUsers = async (req, res, next) => {
  try {
    const {
      role,
      status,
      isActive,
      isVerified,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: users
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private (Superadmin, Admin)
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new user by Admin
 * @route   POST /api/admin/users
 * @access  Private (Superadmin, Admin)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions, profile } = req.body;

    if (!email || !password || !name) {
      return next(new ErrorResponse('Please provide name, email, and password', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User with this email already exists', 400));
    }

    // Set default role permissions if none explicitly provided
    const userRole = role || USER_ROLES.STUDENT;
    const userPermissions = permissions || ROLE_PERMISSIONS_MAP[userRole] || [];

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      permissions: userPermissions,
      profile: profile || {},
      isVerified: true
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userObj
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile & details
 * @route   PUT /api/admin/users/:id
 * @access  Private (Superadmin, Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    // Do not allow password update directly through this endpoint
    delete req.body.password;

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete / deactivate user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Superadmin, Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    // Prevent deleting superadmin
    if (user.role === USER_ROLES.SUPERADMIN) {
      return next(new ErrorResponse('Superadmin account cannot be deactivated or deleted', 400));
    }

    // Soft delete: set isActive to false
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Superadmin, Admin)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !Object.values(USER_ROLES).includes(role)) {
      return next(new ErrorResponse('Please provide a valid user role', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    // Only superadmin can assign or change superadmin role
    if (
      (role === USER_ROLES.SUPERADMIN || user.role === USER_ROLES.SUPERADMIN) &&
      req.user.role !== USER_ROLES.SUPERADMIN
    ) {
      return next(new ErrorResponse('Only superadmin can modify superadmin roles', 403));
    }

    user.role = role;
    // Set default permissions for the new role if not customized
    user.permissions = ROLE_PERMISSIONS_MAP[role] || [];
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}' successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user's granular permissions
 * @route   PUT /api/admin/users/:id/permissions
 * @access  Private (Superadmin, Admin)
 */
const updateUserPermissions = async (req, res, next) => {
  try {
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return next(
        new ErrorResponse('Permissions must be an array of { resource, actions } objects', 400)
      );
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    user.permissions = permissions;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User permissions updated successfully',
      data: {
        id: user._id,
        name: user.name,
        permissions: user.permissions
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all system roles and their default permission matrices
 * @route   GET /api/admin/roles
 * @access  Private (Superadmin, Admin)
 */
const getRoles = async (req, res, next) => {
  try {
    const rolesList = Object.entries(USER_ROLES).map(([key, roleValue]) => ({
      key,
      role: roleValue,
      name: roleValue
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      defaultPermissions: ROLE_PERMISSIONS_MAP[roleValue] || [],
      description: `Role assigned for ${roleValue.replace('_', ' ')}`
    }));

    res.status(200).json({
      success: true,
      count: rolesList.length,
      data: rolesList
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserPermissions,
  getRoles
};
