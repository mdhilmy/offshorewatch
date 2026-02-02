import { useState, useEffect, useCallback } from 'react';
import { fetchRecentEarthquakes } from '../services/api/usgsSeismicService';
import { getCachedData, setCachedData } from '../services/cacheService';
import { CACHE_DURATIONS } from '../utils/constants';

export const useSeismicData = (options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    latitude,
    longitude,
    radiusKm = 500,
    minMagnitude = 4.0,
    days = 7,
  } = options;

  const cacheKey = latitude && longitude
    ? `seismic_${latitude}_${longitude}_${radiusKm}`
    : 'seismic_global';

  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = await getCachedData('seismicCache', cacheKey);
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetchRecentEarthquakes({
        latitude,
        longitude,
        radiusKm,
        minMagnitude,
        days,
      });

      setData(freshData);

      // Cache the data
      await setCachedData('seismicCache', cacheKey, freshData, CACHE_DURATIONS.SEISMIC);
    } catch (err) {
      console.error('Seismic data fetch error:', err);
      setError({
        title: 'Seismic Data Unavailable',
        message: err.message || 'Unable to fetch earthquake data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, radiusKm, minMagnitude, days, cacheKey]);

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
