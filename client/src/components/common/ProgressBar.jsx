import React from 'react';

/**
 * ProgressBar Component
 * Visual horizontal completion bar with animated fill and custom labels
 */
const ProgressBar = ({
  value = 0,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  label,
  className = '',
  animate = true
}) => {
  // Clamp value between 0 and 100
  const percentage = Math.min(Math.max(Number(value) || 0, 0), 100);

  const colors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  const trackSizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Optional Top Label */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-gray-700">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}

      {/* Progress Track */}
      <div
        className={`w-full bg-gray-200/80 rounded-full overflow-hidden ${trackSizes[size] || trackSizes.md}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {/* Progress Fill */}
        <div
          className={`
            h-full rounded-full ${colors[color] || colors.indigo}
            ${animate ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
