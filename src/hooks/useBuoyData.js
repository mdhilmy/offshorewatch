import { useState, useEffect, useCallback } from 'react';
import { fetchBuoyData } from '../services/api/ndbcBuoyService';

export const useBuoyData = (stationId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!stationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const buoyData = await fetchBuoyData(stationId);
      setData(buoyData);
    } catch (err) {
      console.error('Buoy data fetch error:', err);
      setError({
        title: 'Buoy Data Unavailable',
        message: err.message || `Unable to fetch data for station ${stationId}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
