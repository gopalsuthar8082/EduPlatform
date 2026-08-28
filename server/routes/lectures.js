const express = require('express');
const router = express.Router();
const {
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
  updateProgress,
  getProgress
} = require('../controllers/lectureController');
const { protect, optionalAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

// Nested / progress routes (must precede /:id)
router
  .route('/:id/progress')
  .get(protect, getProgress)
  .put(protect, updateProgress);

// Root lecture routes
router
  .route('/')
  .get(getLectures)
  .post(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    createLecture
  );

router
  .route('/:id')
  .get(optionalAuth, getLecture)
  .put(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    updateLecture
  )
  .delete(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    deleteLecture
  );

module.exports = router;
