export const API_ENDPOINTS = {
  OPEN_METEO_MARINE: 'https://marine-api.open-meteo.com/v1/marine',
  OPEN_METEO_WEATHER: 'https://api.open-meteo.com/v1/forecast',
  USGS_EARTHQUAKE: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
  NHC_STORM: 'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer',
  NDBC_BUOY: 'https://www.ndbc.noaa.gov/data/realtime2',
  NOAA_TIDES: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
};

export const CACHE_DURATIONS = {
  WEATHER: 15 * 60 * 1000,      // 15 minutes
  STORM: 30 * 60 * 1000,        // 30 minutes
  SEISMIC: 5 * 60 * 1000,       // 5 minutes
  BUOY: 60 * 60 * 1000,         // 1 hour
  PLATFORM: 24 * 60 * 60 * 1000, // 24 hours
};

export const STORAGE_PREFIX = 'offshorewatch_';

export const DEFAULT_LOCATION = {
  latitude: 27.5,
  longitude: -90.5,
  name: 'Gulf of Mexico',
};
