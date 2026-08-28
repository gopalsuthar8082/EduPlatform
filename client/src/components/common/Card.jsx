import React from 'react';

/**
 * Card Component
 * Container card with optional header, title, subtitle, action buttons, and footer
 */
const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  padding = true,
  hoverable = false,
  onClick,
  ...rest
}) => {
  const hasHeader = Boolean(title || subtitle || headerAction);

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
        ${hoverable ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
      {...rest}
    >
      {/* Optional Card Header */}
      {hasHeader && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="px-6 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
