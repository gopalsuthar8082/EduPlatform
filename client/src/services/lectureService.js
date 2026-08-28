import api from './api.js';

/**
 * Get lectures with optional filter/pagination parameters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getLectures = async (params = {}) => {
  const response = await api.get('/lectures', { params });
  return response.data;
};

/**
 * Get lecture details by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getLecture = async (id) => {
  const response = await api.get(`/lectures/${id}`);
  return response.data;
};

/**
 * Create a new lecture
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createLecture = async (data) => {
  const response = await api.post('/lectures', data);
  return response.data;
};

/**
 * Update an existing lecture
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const updateLecture = async (id, data) => {
  const response = await api.put(`/lectures/${id}`, data);
  return response.data;
};

/**
 * Delete a lecture by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const deleteLecture = async (id) => {
  const response = await api.delete(`/lectures/${id}`);
  return response.data;
};

/**
 * Update watch progress for a lecture
 * @param {string} id
 * @param {Object} data - { progressPercent, watchedDuration, completed }
 * @returns {Promise<Object>} Response data
 */
export const updateProgress = async (id, data) => {
  const response = await api.post(`/lectures/${id}/progress`, data);
  return response.data;
};

/**
 * Get watch progress for a lecture
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getProgress = async (id) => {
  const response = await api.get(`/lectures/${id}/progress`);
  return response.data;
};

const lectureService = {
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
  updateProgress,
  getProgress
};

export default lectureService;
