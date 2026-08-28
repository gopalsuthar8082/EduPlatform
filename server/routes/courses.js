const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  enrollCourse,
  getCourseProgress
} = require('../controllers/courseController');
const { protect, optionalAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

// Nested / special routes (must precede /:id)
router.put(
  '/:id/status',
  protect,
  authorize(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN, USER_ROLES.CONTENT_MANAGER),
  updateCourseStatus
);

router.post('/:id/enroll', protect, enrollCourse);
router.get('/:id/progress', protect, getCourseProgress);

// Root course routes
router
  .route('/')
  .get(getCourses)
  .post(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    createCourse
  );

router
  .route('/:id')
  .get(optionalAuth, getCourse)
  .put(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    updateCourse
  )
  .delete(
    protect,
    authorize(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
    deleteCourse
  );

module.exports = router;
