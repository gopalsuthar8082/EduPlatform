import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api.js';
import * as authService from '../services/authService.js';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set or remove axios default Authorization header
  const setAuthHeader = (authToken) => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthHeader(storedToken);
        try {
          const res = await authService.getMe();
          setUser(res.data?.user || res.data || res.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to authenticate token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthHeader(null);
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Log in user with credentials
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const authToken = res.data?.token || res.token;
      const userData = res.data?.user || res.user || res.data;

      localStorage.setItem('token', authToken);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setAuthHeader(authToken);
      setToken(authToken);
      setUser(userData);
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  /**
   * Register a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authService.register(name, email, password);
      const authToken = res.data?.token || res.token;
      const userData = res.data?.user || res.user || res.data;

      if (authToken) {
        localStorage.setItem('token', authToken);
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setAuthHeader(authToken);
        setToken(authToken);
        setUser(userData);
      }
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  /**
   * Log out the current user
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthHeader(null);
    setUser(null);
    setToken(null);
  }, []);

  /**
   * Update user profile
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    const updatedUser = res.data?.user || res.data || res.user;
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
