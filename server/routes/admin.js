const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserPermissions,
  getRoles
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

// Apply protection & Admin authorization to all admin routes
router.use(protect);
router.use(authorize(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN));

// Roles catalog
router.get('/roles', getRoles);

// Specific user actions
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/permissions', updateUserPermissions);

// User CRUD
router
  .route('/users')
  .get(getUsers)
  .post(createUser);

router
  .route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
