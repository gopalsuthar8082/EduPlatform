const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

router
  .route('/')
  .get(getSubjects)
  .post(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    createSubject
  );

router
  .route('/:id')
  .get(getSubject)
  .put(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    updateSubject
  )
  .delete(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ),
    deleteSubject
  );

module.exports = router;
