import api from './api.js';

/**
 * Get announcements with optional filter params
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getAnnouncements = async (params = {}) => {
  const response = await api.get('/announcements', { params });
  return response.data;
};

/**
 * Create a new announcement
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createAnnouncement = async (data) => {
  const response = await api.post('/announcements', data);
  return response.data;
};

/**
 * Update an announcement
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const updateAnnouncement = async (id, data) => {
  const response = await api.put(`/announcements/${id}`, data);
  return response.data;
};

/**
 * Delete an announcement
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

const announcementService = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};

export default announcementService;
