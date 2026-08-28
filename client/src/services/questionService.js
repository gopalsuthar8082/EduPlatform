import api from './api.js';

/**
 * Get questions with optional filters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getQuestions = async (params = {}) => {
  const response = await api.get('/questions', { params });
  return response.data;
};

/**
 * Get single question by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getQuestion = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

/**
 * Create a new question
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createQuestion = async (data) => {
  const response = await api.post('/questions', data);
  return response.data;
};

/**
 * Update an existing question
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const updateQuestion = async (id, data) => {
  const response = await api.put(`/questions/${id}`, data);
  return response.data;
};

/**
 * Delete a question by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};

/**
 * Bulk create or import questions
 * @param {Array|Object} data
 * @returns {Promise<Object>} Response data
 */
export const bulkCreateQuestions = async (data) => {
  const response = await api.post('/questions/bulk', data);
  return response.data;
};

/**
 * Bookmark or unbookmark a question
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const bookmarkQuestion = async (id) => {
  const response = await api.post(`/questions/${id}/bookmark`);
  return response.data;
};

/**
 * Get all bookmarked questions for current user
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getBookmarkedQuestions = async (params = {}) => {
  const response = await api.get('/questions/bookmarked', { params });
  return response.data;
};

/**
 * Get questions answered incorrectly for practice
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getIncorrectQuestions = async (params = {}) => {
  const response = await api.get('/questions/incorrect', { params });
  return response.data;
};

const questionService = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  bookmarkQuestion,
  getBookmarkedQuestions,
  getIncorrectQuestions
};

export default questionService;
