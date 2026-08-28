import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

/**
 * Custom hook to fetch data from an API endpoint
 * @param {string|null} url - Endpoint URL
 * @param {Array} [deps=[]] - Dependency array to trigger refetch
 * @param {Object} [options={}] - Axios request config options
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function }}
 */
export const useFetch = (url, deps = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [url, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
