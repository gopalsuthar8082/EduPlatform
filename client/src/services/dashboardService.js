import api from './api.js';

/**
 * Get student dashboard data (stats, enrolled courses, upcoming tests, recent activity)
 * @returns {Promise<Object>} Response data
 */
export const getStudentDashboard = async () => {
  const response = await api.get('/dashboard/student');
  return response.data;
};

/**
 * Get admin dashboard data (system overview, user counts, performance metrics)
 * @returns {Promise<Object>} Response data
 */
export const getAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};

/**
 * Get instructor dashboard data (assigned courses, student enrollments, pending reviews)
 * @returns {Promise<Object>} Response data
 */
export const getInstructorDashboard = async () => {
  const response = await api.get('/dashboard/instructor');
  return response.data;
};

const dashboardService = {
  getStudentDashboard,
  getAdminDashboard,
  getInstructorDashboard
};

export default dashboardService;
