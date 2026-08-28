import api from './api.js';

/**
 * Get overall performance analytics for the authenticated user
 * @returns {Promise<Object>} Response data
 */
export const getPerformance = async () => {
  const response = await api.get('/analytics/performance');
  return response.data;
};

/**
 * Get subject-wise score and accuracy breakdown
 * @returns {Promise<Object>} Response data
 */
export const getSubjectWisePerformance = async () => {
  const response = await api.get('/analytics/subject-wise');
  return response.data;
};

/**
 * Get test attempt history with scores and timelines
 * @returns {Promise<Object>} Response data
 */
export const getTestHistory = async () => {
  const response = await api.get('/analytics/test-history');
  return response.data;
};

/**
 * Get leaderboard rankings
 * @param {Object} [params] - { timeframe, courseId, limit, page }
 * @returns {Promise<Object>} Response data
 */
export const getLeaderboard = async (params = {}) => {
  const response = await api.get('/analytics/leaderboard', { params });
  return response.data;
};

/**
 * Get personalized study and test recommendations based on weak areas
 * @returns {Promise<Object>} Response data
 */
export const getRecommendations = async () => {
  const response = await api.get('/analytics/recommendations');
  return response.data;
};

const analyticsService = {
  getPerformance,
  getSubjectWisePerformance,
  getTestHistory,
  getLeaderboard,
  getRecommendations
};

export default analyticsService;
