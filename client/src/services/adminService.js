import api from './api.js';

/**
 * Get users list with pagination and filtering
 * @param {Object} [params]
 * @returns {Promise<Object>} Response data
 */
export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

/**
 * Get single user by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const getUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

/**
 * Create a new user (admin provisioned)
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const createUser = async (data) => {
  const response = await api.post('/admin/users', data);
  return response.data;
};

/**
 * Update user details
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>} Response data
 */
export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

/**
 * Delete a user by ID
 * @param {string} id
 * @returns {Promise<Object>} Response data
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

/**
 * Update user role
 * @param {string} id
 * @param {string} role
 * @returns {Promise<Object>} Response data
 */
export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

/**
 * Update user granular permissions
 * @param {string} id
 * @param {Object|Array} permissions
 * @returns {Promise<Object>} Response data
 */
export const updateUserPermissions = async (id, permissions) => {
  const response = await api.put(`/admin/users/${id}/permissions`, { permissions });
  return response.data;
};

/**
 * Get system roles and permissions list
 * @returns {Promise<Object>} Response data
 */
export const getRoles = async () => {
  const response = await api.get('/admin/roles');
  return response.data;
};

const adminService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserPermissions,
  getRoles
};

export default adminService;
