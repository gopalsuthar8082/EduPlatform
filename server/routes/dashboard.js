const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getAdminDashboard,
  getInstructorDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

router.get('/student', protect, getStudentDashboard);
router.get(
  '/admin',
  protect,
  authorize(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  getAdminDashboard
);
router.get(
  '/instructor',
  protect,
  authorize(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR),
  getInstructorDashboard
);

module.exports = router;
