import React from 'react';

/**
 * Tabs Component
 * Navigation tabs with underline indicator, badge counts, and smooth active transitions
 */
const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline',
  className = ''
}) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      {variant === 'underline' && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onChange && onChange(tab.key)}
                  className={`
                    whitespace-nowrap py-3.5 px-1 border-b-2 font-medium text-sm transition-all duration-150 flex items-center gap-2 focus:outline-none select-none
                    ${
                      isActive
                        ? 'border-indigo-600 text-indigo-600 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                  )}
                  <span>{tab.label}</span>
                  {(tab.count !== undefined || tab.badge !== undefined) && (
                    <span
                      className={`
                        px-2 py-0.5 text-xs font-semibold rounded-full transition-colors
                        ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {tab.count !== undefined ? tab.count : tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {variant === 'pills' && (
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange && onChange(tab.key)}
                className={`
                  whitespace-nowrap py-2 px-3.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-2 focus:outline-none select-none
                  ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }
                `}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                {(tab.count !== undefined || tab.badge !== undefined) && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count !== undefined ? tab.count : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tabs;
