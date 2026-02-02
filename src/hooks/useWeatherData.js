import { useState, useEffect, useCallback } from 'react';
import { fetchCombinedWeather } from '../services/api/openMeteoService';
import { getCachedData, setCachedData } from '../services/cacheService';
import { CACHE_DURATIONS } from '../utils/constants';

export const useWeatherData = (latitude, longitude) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const cacheKey = latitude && longitude ? `${latitude},${longitude}` : null;

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!latitude || !longitude) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try cache first if not forcing refresh
      if (!forceRefresh && cacheKey) {
        const cached = await getCachedData('weatherCache', cacheKey);
        if (cached) {
          setData(cached);
          setLastFetch(cached.fetchedAt);
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetchCombinedWeather(latitude, longitude);
      setData(freshData);
      setLastFetch(freshData.fetchedAt);

      // Cache the data
      if (cacheKey) {
        await setCachedData('weatherCache', cacheKey, freshData, CACHE_DURATIONS.WEATHER);
      }
    } catch (err) {
      console.error('Weather data fetch error:', err);
      setError({
        title: 'Weather Data Unavailable',
        message: err.message || 'Unable to fetch weather data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, cacheKey]);

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
    lastFetch,
    refetch,
  };
};
