const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  bookmarkQuestion,
  getBookmarkedQuestions,
  getIncorrectQuestions
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

const staffRoles = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.INSTRUCTOR,
  USER_ROLES.QUESTION_MANAGER,
  USER_ROLES.REVIEWER
];

// Special routes (must come before /:id)
router.get('/bookmarks', protect, getBookmarkedQuestions);
router.get('/incorrect', protect, getIncorrectQuestions);
router.post('/bulk', protect, authorize(...staffRoles), bulkCreateQuestions);

// General question routes
router
  .route('/')
  .get(getQuestions)
  .post(protect, authorize(...staffRoles), createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .put(protect, authorize(...staffRoles), updateQuestion)
  .delete(protect, authorize(...staffRoles), deleteQuestion);

// Bookmark toggle route
router.post('/:id/bookmark', protect, bookmarkQuestion);

module.exports = router;
