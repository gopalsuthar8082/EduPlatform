import api from './api.js';

/**
 * Get polls with optional filters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getPolls = async (params = {}) => {
  const response = await api.get('/polls', { params });
  return response.data;
};

/**
 * Get single poll details by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getPoll = async (id) => {
  const response = await api.get(`/polls/${id}`);
  return response.data;
};

/**
 * Create a new poll
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createPoll = async (data) => {
  const response = await api.post('/polls', data);
  return response.data;
};

/**
 * Cast a vote on a poll option
 * @param {string} id
 * @param {number} optionIndex
 * @returns {Promise<Object>} Response data
 */
export const votePoll = async (id, optionIndex) => {
  const response = await api.post(`/polls/${id}/vote`, { optionIndex });
  return response.data;
};

const pollService = {
  getPolls,
  getPoll,
  createPoll,
  votePoll
};

export default pollService;
