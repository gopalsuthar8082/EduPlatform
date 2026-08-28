const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic
} = require('../controllers/topicController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

router
  .route('/')
  .get(getTopics)
  .post(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    createTopic
  );

router
  .route('/:id')
  .get(getTopic)
  .put(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    updateTopic
  )
  .delete(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ),
    deleteTopic
  );

module.exports = router;
