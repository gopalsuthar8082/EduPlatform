import api from './api.js';

/**
 * Get quizzes with optional filters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getQuizzes = async (params = {}) => {
  const response = await api.get('/quizzes', { params });
  return response.data;
};

/**
 * Get quiz details by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getQuiz = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

/**
 * Create a new quiz
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createQuiz = async (data) => {
  const response = await api.post('/quizzes', data);
  return response.data;
};

/**
 * Start a quiz attempt
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const startQuiz = async (id) => {
  const response = await api.post(`/quizzes/${id}/start`);
  return response.data;
};

/**
 * Submit answers for a quiz
 * @param {string} id
 * @param {Array|Object} answers
 * @returns {Promise<Object>} Response data
 */
export const submitQuiz = async (id, answers) => {
  const response = await api.post(`/quizzes/${id}/submit`, { answers });
  return response.data;
};

/**
 * Get quiz result by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getQuizResult = async (id) => {
  const response = await api.get(`/quizzes/${id}/result`);
  return response.data;
};

/**
 * Get quiz attempt history
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getQuizHistory = async (id) => {
  const response = await api.get(`/quizzes/${id}/history`);
  return response.data;
};

const quizService = {
  getQuizzes,
  getQuiz,
  createQuiz,
  startQuiz,
  submitQuiz,
  getQuizResult,
  getQuizHistory
};

export default quizService;
