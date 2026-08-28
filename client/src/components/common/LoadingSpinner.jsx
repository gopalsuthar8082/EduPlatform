import React from 'react';

/**
 * LoadingSpinner Component
 * Circular spinning indicator with multiple sizes and full-screen overlay mode
 */
const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  text,
  color = 'indigo',
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colors = {
    indigo: 'border-indigo-200 border-t-indigo-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
    emerald: 'border-emerald-200 border-t-emerald-600'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizes[size] || sizes.md}
          ${colors[color] || colors.indigo}
          rounded-full animate-spin
        `}
        role="status"
        aria-label="loading"
      />
      {text && (
        <p className="text-xs sm:text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center p-4">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
