import api from './api.js';

/**
 * Get tests with optional filters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getTests = async (params = {}) => {
  const response = await api.get('/tests', { params });
  return response.data;
};

/**
 * Get test details by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getTest = async (id) => {
  const response = await api.get(`/tests/${id}`);
  return response.data;
};

/**
 * Create a new test
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createTest = async (data) => {
  const response = await api.post('/tests', data);
  return response.data;
};

/**
 * Start a test attempt
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const startTest = async (id) => {
  const response = await api.post(`/tests/${id}/start`);
  return response.data;
};

/**
 * Save an answer during test
 * @param {string} id
 * @param {Object} data - { questionId, selectedOption, answerText, timeSpent }
 * @returns {Promise<Object>} Response data
 */
export const saveAnswer = async (id, data) => {
  const response = await api.post(`/tests/${id}/save-answer`, data);
  return response.data;
};

/**
 * Mark or unmark a question for review
 * @param {string} id
 * @param {Object} data - { questionId, markedForReview }
 * @returns {Promise<Object>} Response data
 */
export const markForReview = async (id, data) => {
  const response = await api.post(`/tests/${id}/mark-review`, data);
  return response.data;
};

/**
 * Submit the entire test
 * @param {string} id
 * @param {Object} [data]
 * @returns {Promise<Object>} Response data
 */
export const submitTest = async (id, data = {}) => {
  const response = await api.post(`/tests/${id}/submit`, data);
  return response.data;
};

/**
 * Get test result by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getTestResult = async (id) => {
  const response = await api.get(`/tests/${id}/result`);
  return response.data;
};

/**
 * Get detailed test performance analysis
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getTestAnalysis = async (id) => {
  const response = await api.get(`/tests/${id}/analysis`);
  return response.data;
};

const testService = {
  getTests,
  getTest,
  createTest,
  startTest,
  saveAnswer,
  markForReview,
  submitTest,
  getTestResult,
  getTestAnalysis
};

export default testService;
