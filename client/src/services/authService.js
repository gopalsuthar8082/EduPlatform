import api from './api.js';

export const login = async (credentialsOrEmail, password) => {
  const payload = typeof credentialsOrEmail === 'string' ? { email: credentialsOrEmail, password } : credentialsOrEmail;
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const register = async (userDataOrName, email, password) => {
  const payload = typeof userDataOrName === 'string' ? { name: userDataOrName, email, password } : userDataOrName;
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (resetToken, data) => {
  const response = await api.put(`/auth/reset-password/${resetToken}`, data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/updatedetails', data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put('/auth/updatepassword', data);
  return response.data;
};

export const logout = async () => {
  try {
    await api.get('/auth/logout');
  } catch (err) {
    console.warn('Logout API failed, clearing local session anyway:', err);
  }
};

export const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  updatePassword,
  logout,
};

export default authService;

