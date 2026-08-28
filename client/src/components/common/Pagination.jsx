import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

/**
 * Pagination Component
 * Navigates multi-page datasets with smart ellipsis and range summary
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize = 10,
  showRange = true,
  className = ''
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) {
    return null;
  }

  // Calculate visible page range (e.g., Showing 1-10 of 100)
  let startItem = (currentPage - 1) * pageSize + 1;
  let endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;
  if (totalItems === 0) {
    startItem = 0;
    endItem = 0;
  }

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      if (onPageChange) {
        onPageChange(page);
      }
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-xs ${className}`}
    >
      {/* Range description */}
      {showRange && (
        <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          {totalItems !== undefined ? (
            <span>
              Showing <span className="font-medium text-gray-900">{startItem}</span> to{' '}
              <span className="font-medium text-gray-900">{endItem}</span> of{' '}
              <span className="font-medium text-gray-900">{totalItems}</span> results
            </span>
          ) : (
            <span>
              Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </span>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="inline-flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((item, index) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-xs text-gray-400 select-none"
              >
                &hellip;
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={`page-${item}`}
              type="button"
              onClick={() => handlePageClick(item)}
              aria-current={isActive ? 'page' : undefined}
              className={`
                min-w-[36px] h-9 px-2 text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }
              `}
            >
              {item}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
