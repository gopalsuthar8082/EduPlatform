const express = require('express');
const router = express.Router();
const {
  getQuestionPapers,
  getQuestionPaper,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper
} = require('../controllers/questionPaperController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

const staffRoles = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.INSTRUCTOR,
  USER_ROLES.QUESTION_MANAGER
];

router
  .route('/')
  .get(getQuestionPapers)
  .post(protect, authorize(...staffRoles), createQuestionPaper);

router
  .route('/:id')
  .get(getQuestionPaper)
  .put(protect, authorize(...staffRoles), updateQuestionPaper)
  .delete(protect, authorize(...staffRoles), deleteQuestionPaper);

module.exports = router;
