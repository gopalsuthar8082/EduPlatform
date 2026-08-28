const express = require('express');
const router = express.Router();
const {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  startTest,
  saveAnswer,
  markForReview,
  submitTest,
  getTestResult,
  getTestAnalysis
} = require('../controllers/testController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

const staffRoles = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.INSTRUCTOR
];

// Attempt interaction routes (specific routes before parameterized test routes)
router.put('/attempts/:attemptId/save-answer', protect, saveAnswer);
router.put('/attempts/:attemptId/mark-review', protect, markForReview);
router.put('/attempts/:attemptId/submit', protect, submitTest);
router.post('/attempts/:attemptId/submit', protect, submitTest);
router.get('/attempts/:attemptId/result', protect, getTestResult);
router.get('/attempts/:attemptId/analysis', protect, getTestAnalysis);

// Test start route
router.post('/:id/start', protect, startTest);

// Base CRUD routes
router
  .route('/')
  .get(getTests)
  .post(protect, authorize(...staffRoles), createTest);

router
  .route('/:id')
  .get(getTest)
  .put(protect, authorize(...staffRoles), updateTest)
  .delete(protect, authorize(...staffRoles), deleteTest);

module.exports = router;
