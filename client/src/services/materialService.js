import api from './api.js';

/**
 * Get study materials with optional query filters
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getMaterials = async (params = {}) => {
  const response = await api.get('/materials', { params });
  return response.data;
};

/**
 * Get study material by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getMaterial = async (id) => {
  const response = await api.get(`/materials/${id}`);
  return response.data;
};

/**
 * Create new study material (supports FormData for file uploads)
 * @param {FormData|Object} formData
 * @returns {Promise<Object>} Response data
 */
export const createMaterial = async (formData) => {
  const headers = formData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : undefined;
  const response = await api.post('/materials', formData, { headers });
  return response.data;
};

/**
 * Update an existing study material
 * @param {string} id
 * @param {Object|FormData} data
 * @returns {Promise<Object>} Response data
 */
export const updateMaterial = async (id, data) => {
  const headers = data instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : undefined;
  const response = await api.put(`/materials/${id}`, data, { headers });
  return response.data;
};

/**
 * Delete a study material
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const deleteMaterial = async (id) => {
  const response = await api.delete(`/materials/${id}`);
  return response.data;
};

/**
 * Bookmark or unbookmark a study material
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const bookmarkMaterial = async (id) => {
  const response = await api.post(`/materials/${id}/bookmark`);
  return response.data;
};

const materialService = {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bookmarkMaterial
};

export default materialService;
