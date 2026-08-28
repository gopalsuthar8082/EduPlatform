import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi2';

/**
 * Breadcrumb Component
 * Navigation breadcrumb trail showing current page hierarchy
 * 
 * @param {Array<{label: string, path?: string, icon?: React.ComponentType}>} items
 * @param {string} className
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1.5 md:space-x-2">
        {/* Home link */}
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <HiOutlineHome className="w-4 h-4 flex-shrink-0" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const IconComponent = item.icon;

          return (
            <li key={item.path || item.label || index} className="inline-flex items-center">
              <HiOutlineChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1 flex-shrink-0" />
              {isLast || !item.path ? (
                <span
                  className="font-medium text-gray-800 flex items-center gap-1.5 truncate max-w-xs sm:max-w-sm"
                  aria-current="page"
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-indigo-600 font-normal transition-colors flex items-center gap-1.5 truncate max-w-xs sm:max-w-sm"
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
