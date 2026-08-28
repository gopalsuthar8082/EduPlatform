import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapidly changing values (e.g. search inputs)
 * @template T
 * @param {T} value - The input value to debounce
 * @param {number} [delay=500] - The debounce delay in milliseconds
 * @returns {T} The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
