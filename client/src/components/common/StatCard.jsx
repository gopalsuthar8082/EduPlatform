import React from 'react';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';

/**
 * StatCard Component
 * Metric summary card for dashboards with KPI values, icon branding, and trend analytics
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'indigo',
  subtitle,
  className = '',
  onClick
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'hover:border-indigo-200'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-200'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-200'
    },
    red: {
      bg: 'bg-red-50 text-red-600',
      border: 'hover:border-red-200'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-200'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-200'
    }
  };

  const selectedTheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 p-5 shadow-xs transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${selectedTheme.border}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Metric info */}
        <div className="min-w-0 flex-1">
          {title && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
              {title}
            </p>
          )}
          <h4 className="text-2xl font-extrabold text-gray-900 mt-1.5 tracking-tight truncate">
            {value !== undefined && value !== null ? value : '—'}
          </h4>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={`p-3 rounded-2xl flex-shrink-0 shadow-xs ${selectedTheme.bg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs">
          {trend.isPositive ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
              <HiArrowTrendingUp className="w-3.5 h-3.5" />
              {trend.value}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-red-600 font-semibold">
              <HiArrowTrendingDown className="w-3.5 h-3.5" />
              {trend.value}
            </span>
          )}
          <span className="text-gray-400">
            {trend.label || 'vs last period'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
