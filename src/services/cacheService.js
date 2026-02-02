import Dexie from 'dexie';
import { CACHE_DURATIONS } from '../utils/constants';

export const db = new Dexie('OffshoreWatchDB');

db.version(1).stores({
  weatherCache: '++id, locationKey, fetchedAt, expiresAt',
  stormCache: '++id, stormId, basin, fetchedAt, expiresAt',
  seismicCache: '++id, region, fetchedAt, expiresAt',
  buoyCache: '++id, stationId, fetchedAt, expiresAt',
  locations: '++id, &locationId, name, region',
  settings: 'key, value',
});

export const getCachedData = async (store, key) => {
  try {
    const cached = await db[store]
      .where('locationKey')
      .equals(key)
      .first();

    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      await db[store].delete(cached.id);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.error(`Cache read error (${store}):`, error);
    return null;
  }
};

export const setCachedData = async (store, key, data, duration = CACHE_DURATIONS.WEATHER) => {
  try {
    // Delete existing cache for this key
    await db[store]
      .where('locationKey')
      .equals(key)
      .delete();

    // Add new cache entry
    await db[store].add({
      locationKey: key,
      data,
      fetchedAt: Date.now(),
      expiresAt: Date.now() + duration,
    });

    return true;
  } catch (error) {
    console.error(`Cache write error (${store}):`, error);
    return false;
  }
};

export const clearCache = async (store) => {
  try {
    if (store) {
      await db[store].clear();
    } else {
      // Clear all caches
      await db.weatherCache.clear();
      await db.stormCache.clear();
      await db.seismicCache.clear();
      await db.buoyCache.clear();
    }
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

export const clearExpiredCache = async () => {
  try {
    const now = Date.now();
    const stores = ['weatherCache', 'stormCache', 'seismicCache', 'buoyCache'];

    for (const store of stores) {
      await db[store]
        .where('expiresAt')
        .below(now)
        .delete();
    }

    return true;
  } catch (error) {
    console.error('Clear expired cache error:', error);
    return false;
  }
};

export const getCacheStats = async () => {
  try {
    const stats = {
      weather: await db.weatherCache.count(),
      storms: await db.stormCache.count(),
      seismic: await db.seismicCache.count(),
      buoys: await db.buoyCache.count(),
      locations: await db.locations.count(),
    };
    return stats;
  } catch (error) {
    console.error('Get cache stats error:', error);
    return null;
  }
};
