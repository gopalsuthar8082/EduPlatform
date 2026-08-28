/**
 * Application Environment Configuration
 * Centralizes all Vite import.meta.env variables with robust fallbacks
 */

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const ENV = {
  // Backend & API URLs
  API_URL: import.meta.env.VITE_API_URL || '/api',
  BACKEND_URL: backendUrl,
  UPLOADS_URL: import.meta.env.VITE_UPLOADS_URL || (backendUrl + '/uploads'),

  // Application Details
  APP_NAME: import.meta.env.VITE_APP_NAME || 'EduPlatform',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'EduPlatform - Digital Education & Exam Preparation',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Digital Education & Exam Preparation Platform',

  // Server & Environment State
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE || 'development',
};

/**
 * Resolve full media / asset URL
 * @param {string} path - Relative asset/upload path or full URL
 * @returns {string} Fully resolved URL
 */
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : ('/' + path);
  if (cleanPath.startsWith('/uploads')) {
    return ENV.BACKEND_URL + cleanPath;
  }
  return ENV.UPLOADS_URL + cleanPath;
};

export default ENV;

