const express = require('express');
const router = express.Router();
const {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter
} = require('../controllers/chapterController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

router
  .route('/')
  .get(getChapters)
  .post(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    createChapter
  );

router
  .route('/:id')
  .get(getChapter)
  .put(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    updateChapter
  )
  .delete(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ),
    deleteChapter
  );

module.exports = router;
