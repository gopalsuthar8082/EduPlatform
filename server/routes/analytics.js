const express = require('express');
const router = express.Router();
const {
  getPerformance,
  getSubjectWisePerformance,
  getTestHistory,
  getLeaderboard,
  getRecommendations
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/performance', protect, getPerformance);
router.get('/subjects', protect, getSubjectWisePerformance);
router.get('/test-history', protect, getTestHistory);
router.get('/leaderboard', getLeaderboard);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
