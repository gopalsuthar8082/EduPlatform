import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi2';
import Button from './Button.jsx';

/**
 * EmptyState Component
 * Displays a placeholder when lists, queries, or pages have no data
 */
const EmptyState = ({
  icon: Icon = HiOutlineInbox,
  title = 'No records found',
  description = 'There is nothing to display here right now.',
  action,
  className = '',
  children
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-2xs ${className}`}
    >
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 text-gray-400 shadow-2xs">
        {Icon && <Icon className="w-8 h-8 text-gray-400" />}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Custom Children */}
      {children}

      {/* Action Button */}
      {action && action.label && (
        <Button
          variant={action.variant || 'primary'}
          size="md"
          icon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
