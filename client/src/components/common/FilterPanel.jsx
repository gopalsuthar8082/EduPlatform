import React from 'react';
import { HiOutlineFunnel, HiOutlineArrowPath, HiOutlineXMark } from 'react-icons/hi2';

/**
 * FilterPanel Component
 * Responsive filter controls supporting selects, multiselects, and active filter reset
 */
const FilterPanel = ({
  filters = [],
  values = {},
  onChange,
  onReset,
  className = ''
}) => {
  const handleSelectChange = (key, value) => {
    if (!onChange) return;
    const newValues = { ...values, [key]: value };
    onChange(newValues, key, value);
  };

  const handleMultiSelectToggle = (key, itemValue) => {
    if (!onChange) return;
    const currentList = Array.isArray(values[key]) ? values[key] : [];
    const isSelected = currentList.includes(itemValue);
    const updatedList = isSelected
      ? currentList.filter((v) => v !== itemValue)
      : [...currentList, itemValue];

    const newValues = { ...values, [key]: updatedList };
    onChange(newValues, key, updatedList);
  };

  // Check if any filter is active
  const activeCount = Object.entries(values).reduce((count, [k, v]) => {
    if (v === '' || v === null || v === undefined || v === 'all') return count;
    if (Array.isArray(v)) return count + (v.length > 0 ? 1 : 0);
    return count + 1;
  }, 0);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}
    >
      {/* Filters Title & Inputs Container */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
          <HiOutlineFunnel className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>

        {filters.map((filter) => {
          const { key, label, type = 'select', options = [] } = filter;
          const currentVal = values[key];

          if (type === 'multiselect') {
            const selectedItems = Array.isArray(currentVal) ? currentVal : [];
            return (
              <div key={key} className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">{label}:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {options.map((opt) => {
                    const isSelected = selectedItems.includes(opt.value);
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => handleMultiSelectToggle(key, opt.value)}
                        className={`
                          px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                          ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Default: select dropdown
          return (
            <div key={key} className="flex items-center gap-2 min-w-[140px]">
              <select
                id={`filter-${key}`}
                value={currentVal !== undefined ? currentVal : ''}
                onChange={(e) => handleSelectChange(key, e.target.value)}
                className="w-full text-xs font-medium py-1.5 px-3 bg-gray-50/80 border border-gray-200 rounded-lg text-gray-700 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="">{label || 'All'}</option>
                {options.map((opt) => (
                  <option key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      {activeCount > 0 && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded-md hover:bg-red-50 focus:outline-none self-end md:self-auto"
        >
          <HiOutlineArrowPath className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
