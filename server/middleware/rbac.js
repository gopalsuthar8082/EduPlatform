const { ErrorResponse } = require('./errorHandler');
const { USER_ROLES } = require('../config/constants');

/**
 * Grant access to specific roles
 * @param  {...string} roles - Allowed roles
 * @returns {import('express').RequestHandler}
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('User is not authenticated', 401));
    }

    // Superadmin bypasses role restrictions
    if (req.user.role === USER_ROLES.SUPERADMIN) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Check granular permissions for a resource and action
 * @param {string} resource - Target resource name (e.g. 'courses', 'questions')
 * @param {string} action - Action requested (e.g. 'create', 'update', 'delete', 'publish')
 * @returns {import('express').RequestHandler}
 */
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('User is not authenticated', 401));
    }

    // Superadmin and Admin bypass granular permission check
    if (
      req.user.role === USER_ROLES.SUPERADMIN ||
      req.user.role === USER_ROLES.ADMIN
    ) {
      return next();
    }

    // Check user's granular permissions array
    const userPermissions = req.user.permissions || [];
    const resourcePermission = userPermissions.find(
      (perm) => perm.resource === resource || perm.resource === '*'
    );

    if (
      resourcePermission &&
      (resourcePermission.actions.includes(action) ||
        resourcePermission.actions.includes('*') ||
        resourcePermission.actions.includes('manage'))
    ) {
      return next();
    }

    return next(
      new ErrorResponse(
        `Permission denied. You do not have permission to '${action}' on '${resource}'.`,
        403
      )
    );
  };
};

module.exports = {
  authorize,
  checkPermission
};
