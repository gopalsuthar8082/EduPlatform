import React, { useState } from 'react';
import {
  HiOutlineChevronUpDown,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineInbox
} from 'react-icons/hi2';

/**
 * Table Component
 * Responsive data table with sortable columns, loading skeleton states, and empty states
 */
const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  onSort,
  sortKey: externalSortKey,
  sortDirection: externalSortDirection,
  onRowClick,
  className = ''
}) => {
  const [internalSortKey, setInternalSortKey] = useState(null);
  const [internalSortDir, setInternalSortDir] = useState('asc');

  const currentSortKey = externalSortKey !== undefined ? externalSortKey : internalSortKey;
  const currentSortDir = externalSortDirection !== undefined ? externalSortDirection : internalSortDir;

  const handleSort = (key) => {
    let nextDir = 'asc';
    if (currentSortKey === key) {
      nextDir = currentSortDir === 'asc' ? 'desc' : 'asc';
    }

    if (onSort) {
      onSort(key, nextDir);
    } else {
      setInternalSortKey(key);
      setInternalSortDir(nextDir);
    }
  };

  // Local sorting if onSort is not handled externally
  let displayData = [...(data || [])];
  if (!onSort && currentSortKey) {
    displayData.sort((a, b) => {
      const valA = a[currentSortKey];
      const valB = b[currentSortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'string') {
        return currentSortDir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return currentSortDir === 'asc' ? valA - valB : valB - valA;
    });
  }

  return (
    <div className={`w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {columns.map((col) => {
                const isSorted = currentSortKey === col.key;
                const isSortable = Boolean(col.sortable);

                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={`px-6 py-3.5 ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    } ${isSortable ? 'cursor-pointer select-none hover:bg-gray-100/70 transition-colors' : ''}`}
                    onClick={() => isSortable && handleSort(col.key)}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.label}</span>
                      {isSortable && (
                        <span className="text-gray-400">
                          {isSorted ? (
                            currentSortDir === 'asc' ? (
                              <HiOutlineChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                              <HiOutlineChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                            )
                          ) : (
                            <HiOutlineChevronUpDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {/* Loading Skeleton */}
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {columns.map((col, cIndex) => (
                    <td key={`skeleton-col-${cIndex}`} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData.length === 0 ? (
              /* Empty State */
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <HiOutlineInbox className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              /* Data Rows */
              displayData.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row, rowIndex)}
                  className={`
                    hover:bg-indigo-50/30 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : row[col.key] !== undefined && row[col.key] !== null
                        ? String(row[col.key])
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
