import { useState, useEffect, useCallback } from 'react';
import { fetchActiveStorms } from '../services/api/nhcStormService';
import { getCachedData, setCachedData } from '../services/cacheService';
import { CACHE_DURATIONS } from '../utils/constants';

export const useStormData = (basin = 'all') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `storms_${basin}`;

  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = await getCachedData('stormCache', cacheKey);
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetchActiveStorms();

      // Filter by basin if specified
      if (basin !== 'all' && freshData.storms) {
        freshData.storms = freshData.storms.filter((s) => s.basin === basin);
      }

      setData(freshData);

      // Cache the data
      await setCachedData('stormCache', cacheKey, freshData, CACHE_DURATIONS.STORM);
    } catch (err) {
      console.error('Storm data fetch error:', err);
      setError({
        title: 'Storm Data Unavailable',
        message: err.message || 'Unable to fetch storm data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [basin, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
