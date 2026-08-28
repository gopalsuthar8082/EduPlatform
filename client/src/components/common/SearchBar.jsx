import React from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';

/**
 * SearchBar Component
 * Search input field with leading icon, clear button, and submit handler
 */
const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
  onSubmit,
  disabled = false,
  autoFocus = false
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && value) {
      handleClear();
    } else if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <HiOutlineMagnifyingGlass className="w-4 h-4" />
      </div>

      {/* Text Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {/* Clear Button */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        >
          <HiOutlineXMark className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
