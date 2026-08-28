import toast from 'react-hot-toast';

/**
 * Custom Toast Notifications Wrapper
 * Provides styled alert toasts (success, error, info, warning, loading) using react-hot-toast
 */

const defaultOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '12px',
    background: '#1f2937',
    color: '#f9fafb',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }
};

/**
 * Show Success Toast
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultOptions,
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff'
    },
    ...options
  });
};

/**
 * Show Error Toast
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultOptions,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff'
    },
    ...options
  });
};

/**
 * Show Info Toast
 */
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    icon: 'ℹ️',
    ...options
  });
};

/**
 * Show Warning Toast
 */
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    icon: '⚠️',
    ...options
  });
};

/**
 * Show Loading Toast
 */
export const showLoading = (message = 'Processing...', options = {}) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options
  });
};

/**
 * Dismiss Toast
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Toast Promise Handler
 */
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'An error occurred'
    },
    {
      ...defaultOptions,
      ...options
    }
  );
};

const Toast = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
  dismiss: dismissToast,
  promise: showPromise,
  showSuccess,
  showError,
  showInfo,
  showWarning
};

export default Toast;
