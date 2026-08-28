import api from './api.js';

/**
 * Get question papers with optional filters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getQuestionPapers = async (params = {}) => {
  const response = await api.get('/question-papers', { params });
  return response.data;
};

/**
 * Get single question paper by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getQuestionPaper = async (id) => {
  const response = await api.get(`/question-papers/${id}`);
  return response.data;
};

/**
 * Create a new question paper
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createQuestionPaper = async (data) => {
  const response = await api.post('/question-papers', data);
  return response.data;
};

const questionPaperService = {
  getQuestionPapers,
  getQuestionPaper,
  createQuestionPaper
};

export default questionPaperService;
