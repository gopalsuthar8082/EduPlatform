import api from './api.js';

/**
 * Get discussions with optional filters and search
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getDiscussions = async (params = {}) => {
  const response = await api.get('/discussions', { params });
  return response.data;
};

/**
 * Get discussion details by ID including replies
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getDiscussion = async (id) => {
  const response = await api.get(`/discussions/${id}`);
  return response.data;
};

/**
 * Create a new discussion topic
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createDiscussion = async (data) => {
  const response = await api.post('/discussions', data);
  return response.data;
};

/**
 * Update an existing discussion
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const updateDiscussion = async (id, data) => {
  const response = await api.put(`/discussions/${id}`, data);
  return response.data;
};

/**
 * Delete a discussion
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const deleteDiscussion = async (id) => {
  const response = await api.delete(`/discussions/${id}`);
  return response.data;
};

/**
 * Add a reply to a discussion
 * @param {string} id
 * @param {Object} data - { content, replyToId }
 * @returns {Promise<Object>} Response data
 */
export const addReply = async (id, data) => {
  const response = await api.post(`/discussions/${id}/replies`, data);
  return response.data;
};

/**
 * Upvote a discussion
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const upvoteDiscussion = async (id) => {
  const response = await api.post(`/discussions/${id}/upvote`);
  return response.data;
};

/**
 * Downvote a discussion
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const downvoteDiscussion = async (id) => {
  const response = await api.post(`/discussions/${id}/downvote`);
  return response.data;
};

/**
 * Mark a reply as accepted or helpful
 * @param {string} replyId
 * @returns {Promise<Object>} Response data
 */
export const markReplyHelpful = async (replyId) => {
  const response = await api.post(`/discussions/replies/${replyId}/helpful`);
  return response.data;
};

const discussionService = {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  upvoteDiscussion,
  downvoteDiscussion,
  markReplyHelpful
};

export default discussionService;
