const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorResponse } = require('./errorHandler');

/**
 * Protect routes - JWT authentication middleware
 * Extracts token from Authorization header (Bearer) or cookies,
 * verifies it and attaches authenticated user to req.user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header for Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies for token
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Verify token presence
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route. No token provided.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_dev');

    // Find user by decoded ID and check if active
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User belonging to this token no longer exists.', 401));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account has been deactivated. Please contact support.', 403));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route. Invalid or expired token.', 401));
  }
};

/**
 * Optional Authentication middleware
 * If a valid token is provided, attaches the authenticated user to req.user.
 * If not provided or invalid, continues silently with req.user = null.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_dev');
    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

module.exports = {
  protect,
  optionalAuth
};

