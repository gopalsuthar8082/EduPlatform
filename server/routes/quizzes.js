const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  startQuiz,
  submitQuiz,
  getQuizResult,
  getQuizHistory
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

const staffRoles = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.INSTRUCTOR
];

// Quiz interaction routes
router.post('/:id/start', protect, startQuiz);
router.put('/:id/submit', protect, submitQuiz);
router.post('/:id/submit', protect, submitQuiz); // support POST submit as well
router.get('/:id/result/:attemptId', protect, getQuizResult);
router.get('/:id/history', protect, getQuizHistory);

// Standard CRUD routes
router
  .route('/')
  .get(getQuizzes)
  .post(protect, authorize(...staffRoles), createQuiz);

router
  .route('/:id')
  .get(getQuiz)
  .put(protect, authorize(...staffRoles), updateQuiz)
  .delete(protect, authorize(...staffRoles), deleteQuiz);

module.exports = router;
