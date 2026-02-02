# INSTRUCTIONS.md
# OffshoreWatch - Complete Development Instructions

Step-by-step instructions to build the OffshoreWatch platform from scratch.

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- VS Code or preferred IDE

---

## Phase 1: Project Initialization

### Step 1.1: Create Vite React Project

```bash
npm create vite@latest offshorewatch -- --template react
cd offshorewatch
```

### Step 1.2: Install Dependencies

```bash
# Core dependencies
npm install react-router-dom@6

# Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# UI utilities
npm install lucide-react date-fns

# Data visualization
npm install chart.js react-chartjs-2

# Mapping
npm install leaflet react-leaflet

# Offline storage
npm install dexie
```

### Step 1.3: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
          300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6',
          600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a',
        },
        weather: {
          calm: '#22c55e', moderate: '#84cc16', elevated: '#eab308',
          high: '#f97316', severe: '#ef4444', extreme: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
}
```

### Step 1.4: Configure Vite for GitHub Pages

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/offshorewatch/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          maps: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
})
```

### Step 1.5: Setup CSS

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import 'leaflet/dist/leaflet.css';

@layer base {
  body { @apply bg-gray-50 text-gray-900 antialiased; }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-md font-medium
           hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 
           focus:ring-offset-2 transition-colors disabled:opacity-50;
  }
  .btn-secondary {
    @apply bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium
           border border-gray-300 hover:bg-gray-200 transition-colors;
  }
  .input-field {
    @apply w-full px-3 py-2 rounded-md border border-gray-300 
           focus:border-primary-500 focus:ring-1 focus:ring-primary-500;
  }
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
  }
}
```

### Step 1.6: Create Directory Structure

```bash
mkdir -p src/{components/{common,dashboard,weather,map,storms,seismic,operations,locations,settings},pages,hooks,context,services/api,utils}
```

---

## Phase 2: Core Infrastructure

### Step 2.1: Create Constants File

Create `src/utils/constants.js`:

```javascript
export const API_ENDPOINTS = {
  OPEN_METEO_MARINE: 'https://marine-api.open-meteo.com/v1/marine',
  OPEN_METEO_WEATHER: 'https://api.open-meteo.com/v1/forecast',
  USGS_EARTHQUAKE: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
  NHC_STORM: 'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer',
  NDBC_BUOY: 'https://www.ndbc.noaa.gov/data/realtime2',
  NOAA_TIDES: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
};

export const CACHE_DURATIONS = {
  WEATHER: 15 * 60 * 1000,
  STORM: 30 * 60 * 1000,
  SEISMIC: 5 * 60 * 1000,
  BUOY: 60 * 60 * 1000,
};

export const STORAGE_PREFIX = 'offshorewatch_';
```

### Step 2.2: Create Regions Configuration

Create `src/utils/regions.js`:

```javascript
export const REGIONS = {
  gom: {
    id: 'gom',
    name: 'Gulf of Mexico',
    shortName: 'GOM',
    center: [27.5, -90.5],
    zoom: 6,
    stormBasins: ['atlantic', 'epac'],
  },
  northsea: {
    id: 'northsea',
    name: 'North Sea',
    shortName: 'NS',
    center: [58, 2],
    zoom: 5,
    stormBasins: [],
  },
  seasia: {
    id: 'seasia',
    name: 'Southeast Asia',
    shortName: 'SEA',
    center: [5, 110],
    zoom: 5,
    stormBasins: ['wpac'],
  },
  brazil: {
    id: 'brazil',
    name: 'Brazil Pre-salt',
    shortName: 'BRZ',
    center: [-24, -42],
    zoom: 6,
    stormBasins: [],
  },
  westafrica: {
    id: 'westafrica',
    name: 'West Africa',
    shortName: 'WAF',
    center: [4, 4],
    zoom: 6,
    stormBasins: [],
  },
  australia: {
    id: 'australia',
    name: 'Australia',
    shortName: 'AUS',
    center: [-25, 125],
    zoom: 4,
    stormBasins: ['aus'],
  },
  middleeast: {
    id: 'middleeast',
    name: 'Middle East',
    shortName: 'ME',
    center: [26, 52],
    zoom: 6,
    stormBasins: ['nio'],
  },
};

export const getRegionById = (id) => REGIONS[id] || null;
export const getRegionList = () => Object.values(REGIONS);
```

### Step 2.3: Create Thresholds Configuration

Create `src/utils/thresholds.js`:

```javascript
export const DEFAULT_THRESHOLDS = {
  helicopterOps: {
    name: 'Helicopter Operations',
    maxWindSpeed: 35,      // knots
    maxWaveHeight: 2.4,    // meters
    minVisibility: 4.8,    // km
  },
  craneLift: {
    name: 'Crane Lift',
    maxWindSpeed: 20,
    maxWaveHeight: 1.8,
  },
  divingOps: {
    name: 'Diving Operations',
    maxWaveHeight: 2.5,
    maxCurrentSpeed: 1.5,
  },
  rigMove: {
    name: 'Rig Move',
    maxWindSpeed: 15,
    maxWaveHeight: 1.2,
    minWindowHours: 12,
  },
};

export const getThresholdStatus = (value, threshold, inverse = false) => {
  if (value === null) return 'unknown';
  if (inverse) {
    if (value >= threshold) return 'safe';
    if (value >= threshold * 0.8) return 'caution';
    return 'exceeded';
  }
  if (value <= threshold * 0.7) return 'safe';
  if (value <= threshold) return 'caution';
  return 'exceeded';
};
```

### Step 2.4: Create Unit Conversion Utilities

Create `src/utils/units.js`:

```javascript
export const conversions = {
  msToKnots: (ms) => ms * 1.94384,
  knotsToMs: (kt) => kt / 1.94384,
  metersToFeet: (m) => m * 3.28084,
  feetToMeters: (ft) => ft / 3.28084,
  celsiusToFahrenheit: (c) => (c * 9/5) + 32,
  fahrenheitToCelsius: (f) => (f - 32) * 5/9,
};

export const UNIT_LABELS = {
  windSpeed: { knots: 'kt', mph: 'mph', ms: 'm/s' },
  waveHeight: { meters: 'm', feet: 'ft' },
  temperature: { celsius: '°C', fahrenheit: '°F' },
};

export const formatValue = (value, unit, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  return `${Number(value).toFixed(decimals)} ${unit}`;
};
```

### Step 2.5: Create Date Utilities

Create `src/utils/dateUtils.js`:

```javascript
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDateTime = (dateString, formatStr = 'MMM d, yyyy HH:mm') => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return 'Invalid date';
  return format(date, formatStr);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getHourLabel = (dateString) => formatDateTime(dateString, 'ha');
export const formatShortDate = (dateString) => formatDateTime(dateString, 'MMM d');
```

---

## Phase 3: Context Providers

### Step 3.1: Create App Context

Create `src/context/AppContext.jsx`:

```jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_PREFIX } from '../utils/constants';

const AppContext = createContext(null);

const initialState = {
  currentRegion: 'gom',
  currentLocation: null,
  isOnline: navigator.onLine,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_REGION':
      return { ...state, currentRegion: action.payload };
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}app_state`);
    if (saved) {
      try {
        return { ...init, ...JSON.parse(saved), isOnline: navigator.onLine };
      } catch (e) {
        return init;
      }
    }
    return init;
  });

  useEffect(() => {
    const { isOnline, ...persistable } = state;
    localStorage.setItem(`${STORAGE_PREFIX}app_state`, JSON.stringify(persistable));
  }, [state]);

  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

### Step 3.2: Create Settings Context

Create `src/context/SettingsContext.jsx`:

```jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_PREFIX } from '../utils/constants';
import { DEFAULT_THRESHOLDS } from '../utils/thresholds';

const SettingsContext = createContext(null);

const defaultSettings = {
  units: {
    windSpeed: 'knots',
    waveHeight: 'meters',
    temperature: 'celsius',
  },
  thresholds: DEFAULT_THRESHOLDS,
  display: { mapStyle: 'streets', showPlatforms: true, showBuoys: true },
  notifications: { weatherAlerts: true, stormAlerts: true },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_UNITS':
      return { ...state, units: { ...state.units, ...action.payload } };
    case 'UPDATE_THRESHOLDS':
      return { ...state, thresholds: { ...state.thresholds, ...action.payload } };
    case 'UPDATE_DISPLAY':
      return { ...state, display: { ...state.display, ...action.payload } };
    case 'RESET_SETTINGS':
      return defaultSettings;
    default:
      return state;
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, (init) => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    return saved ? { ...init, ...JSON.parse(saved) } : init;
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
```

### Step 3.3: Create Notification Context

Create `src/context/NotificationContext.jsx`:

```jsx
import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, duration: 5000, ...notification }]);
    if (notification.duration !== 0) {
      setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 
        notification.duration || 5000);
    }
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
```

---

## Phase 4: API Services

### Step 4.1: Create Cache Service

Create `src/services/cacheService.js`:

```javascript
import Dexie from 'dexie';
import { CACHE_DURATIONS } from '../utils/constants';

export const db = new Dexie('OffshoreWatchDB');

db.version(1).stores({
  weatherCache: '++id, locationKey, fetchedAt, expiresAt',
  stormCache: '++id, stormId, basin, fetchedAt',
  seismicCache: '++id, region, fetchedAt',
  locations: '++id, &locationId, name, region',
});

export const getCachedData = async (store, key) => {
  try {
    const cached = await db[store].where('locationKey').equals(key).first();
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      await db[store].delete(cached.id);
      return null;
    }
    return cached.data;
  } catch (error) {
    console.error(`Cache read error:`, error);
    return null;
  }
};

export const setCachedData = async (store, key, data, duration = CACHE_DURATIONS.WEATHER) => {
  try {
    await db[store].where('locationKey').equals(key).delete();
    await db[store].add({
      locationKey: key,
      data,
      fetchedAt: Date.now(),
      expiresAt: Date.now() + duration,
    });
  } catch (error) {
    console.error(`Cache write error:`, error);
  }
};

export const clearCache = async (store) => {
  try {
    if (store) await db[store].clear();
    else {
      await db.weatherCache.clear();
      await db.stormCache.clear();
      await db.seismicCache.clear();
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};
```

### Step 4.2: Create Open-Meteo Service

Create `src/services/api/openMeteoService.js`:

```javascript
import { API_ENDPOINTS } from '../../utils/constants';

export const fetchMarineWeather = async (latitude, longitude, days = 7) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'wave_height,wave_direction,wave_period,swell_wave_height,wind_wave_height',
    daily: 'wave_height_max',
    timezone: 'UTC',
    forecast_days: days.toString(),
  });

  const response = await fetch(`${API_ENDPOINTS.OPEN_METEO_MARINE}?${params}`);
  if (!response.ok) throw new Error(`Marine API error: ${response.status}`);
  return transformMarineData(await response.json());
};

export const fetchAtmosphericWeather = async (latitude, longitude, days = 7) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,pressure_msl',
    daily: 'temperature_2m_max,temperature_2m_min,wind_speed_10m_max',
    timezone: 'UTC',
    forecast_days: days.toString(),
  });

  const response = await fetch(`${API_ENDPOINTS.OPEN_METEO_WEATHER}?${params}`);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return transformWeatherData(await response.json());
};

export const fetchCombinedWeather = async (latitude, longitude, days = 7) => {
  const [marine, atmospheric] = await Promise.all([
    fetchMarineWeather(latitude, longitude, days),
    fetchAtmosphericWeather(latitude, longitude, days),
  ]);

  return {
    location: { latitude, longitude },
    fetchedAt: new Date().toISOString(),
    source: 'open-meteo',
    hourly: marine.hourly.map((hour, i) => ({ ...hour, ...atmospheric.hourly[i] })),
    daily: { marine: marine.daily, atmospheric: atmospheric.daily },
  };
};

const transformMarineData = (raw) => ({
  hourly: raw.hourly.time.map((time, i) => ({
    time,
    waveHeight: raw.hourly.wave_height?.[i] ?? null,
    waveDirection: raw.hourly.wave_direction?.[i] ?? null,
    wavePeriod: raw.hourly.wave_period?.[i] ?? null,
    swellHeight: raw.hourly.swell_wave_height?.[i] ?? null,
    windWaveHeight: raw.hourly.wind_wave_height?.[i] ?? null,
  })),
  daily: raw.daily.time.map((date, i) => ({
    date,
    waveHeightMax: raw.daily.wave_height_max?.[i] ?? null,
  })),
});

const transformWeatherData = (raw) => ({
  hourly: raw.hourly.time.map((time, i) => ({
    time,
    temperature: raw.hourly.temperature_2m?.[i] ?? null,
    windSpeed: raw.hourly.wind_speed_10m?.[i] ?? null,
    windDirection: raw.hourly.wind_direction_10m?.[i] ?? null,
    windGusts: raw.hourly.wind_gusts_10m?.[i] ?? null,
    visibility: raw.hourly.visibility?.[i] ?? null,
    pressure: raw.hourly.pressure_msl?.[i] ?? null,
  })),
  daily: raw.daily.time.map((date, i) => ({
    date,
    tempMax: raw.daily.temperature_2m_max?.[i] ?? null,
    tempMin: raw.daily.temperature_2m_min?.[i] ?? null,
    windSpeedMax: raw.daily.wind_speed_10m_max?.[i] ?? null,
  })),
});
```

### Step 4.3: Create USGS Earthquake Service

Create `src/services/api/usgsSeismicService.js`:

```javascript
import { API_ENDPOINTS } from '../../utils/constants';

export const fetchRecentEarthquakes = async (options = {}) => {
  const { minMagnitude = 4.0, days = 7, latitude, longitude, radiusKm = 500 } = options;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startDate.toISOString().split('T')[0],
    minmagnitude: minMagnitude.toString(),
    orderby: 'time',
  });

  if (latitude && longitude) {
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());
    params.append('maxradiuskm', radiusKm.toString());
  }

  const response = await fetch(`${API_ENDPOINTS.USGS_EARTHQUAKE}?${params}`);
  if (!response.ok) throw new Error(`USGS API error: ${response.status}`);

  const data = await response.json();
  return {
    fetchedAt: new Date().toISOString(),
    source: 'usgs',
    count: data.metadata.count,
    earthquakes: data.features.map((f) => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place,
      time: new Date(f.properties.time).toISOString(),
      location: {
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        depth: f.geometry.coordinates[2],
      },
      tsunami: f.properties.tsunami === 1,
      url: f.properties.url,
    })),
  };
};
```

### Step 4.4: Create NHC Storm Service

Create `src/services/api/nhcStormService.js`:

```javascript
import { API_ENDPOINTS } from '../../utils/constants';

export const fetchActiveStorms = async () => {
  const url = `${API_ENDPOINTS.NHC_STORM}/7/query?where=1%3D1&outFields=*&f=geojson`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`NHC API error: ${response.status}`);

  const data = await response.json();
  
  if (!data.features || data.features.length === 0) {
    return { storms: [], fetchedAt: new Date().toISOString() };
  }

  return {
    storms: data.features.map((f) => ({
      id: `${f.properties.BASIN}${f.properties.STORMNUM}`,
      name: f.properties.STORMNAME,
      basin: f.properties.BASIN === 'AL' ? 'atlantic' : f.properties.BASIN === 'EP' ? 'epac' : f.properties.BASIN,
      type: f.properties.STORMTYPE,
      category: getCategory(f.properties.STORMTYPE, f.properties.MAXWIND),
      advisoryNumber: f.properties.ADVISNUM,
      movement: { direction: f.properties.MOVEMENTDIR, speed: f.properties.MOVEMENTSPD },
      intensity: { windSpeed: f.properties.MAXWIND, pressure: f.properties.MINPRES },
      coordinates: f.geometry.coordinates,
    })),
    fetchedAt: new Date().toISOString(),
    source: 'nhc',
  };
};

const getCategory = (type, windSpeed) => {
  if (type === 'TD' || type === 'TS') return 0;
  if (!windSpeed) return null;
  if (windSpeed >= 157) return 5;
  if (windSpeed >= 130) return 4;
  if (windSpeed >= 111) return 3;
  if (windSpeed >= 96) return 2;
  if (windSpeed >= 74) return 1;
  return 0;
};
```

---

## Phase 5: Custom Hooks

### Step 5.1: Create Weather Data Hook

Create `src/hooks/useWeatherData.js`:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { fetchCombinedWeather } from '../services/api/openMeteoService';
import { getCachedData, setCachedData } from '../services/cacheService';
import { CACHE_DURATIONS } from '../utils/constants';

export const useWeatherData = (latitude, longitude) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const cacheKey = `${latitude},${longitude}`;

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!latitude || !longitude) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cached = await getCachedData('weatherCache', cacheKey);
        if (cached) {
          setData(cached);
          setLastFetch(cached.fetchedAt);
          setIsLoading(false);
          return;
        }
      }

      const freshData = await fetchCombinedWeather(latitude, longitude);
      setData(freshData);
      setLastFetch(freshData.fetchedAt);
      await setCachedData('weatherCache', cacheKey, freshData, CACHE_DURATIONS.WEATHER);
    } catch (err) {
      setError({ title: 'Weather Unavailable', message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, lastFetch, refetch: () => fetchData(true) };
};
```

### Step 5.2: Create Seismic Data Hook

Create `src/hooks/useSeismicData.js`:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { fetchRecentEarthquakes } from '../services/api/usgsSeismicService';
import { getCachedData, setCachedData } from '../services/cacheService';
import { CACHE_DURATIONS } from '../utils/constants';

export const useSeismicData = (options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { latitude, longitude, radiusKm = 500, minMagnitude = 4.0 } = options;
  const cacheKey = latitude ? `seismic_${latitude}_${longitude}` : 'seismic_global';

  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cached = await getCachedData('seismicCache', cacheKey);
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      const freshData = await fetchRecentEarthquakes({ latitude, longitude, radiusKm, minMagnitude });
      setData(freshData);
      await setCachedData('seismicCache', cacheKey, freshData, CACHE_DURATIONS.SEISMIC);
    } catch (err) {
      setError({ title: 'Seismic Data Unavailable', message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, radiusKm, minMagnitude, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: () => fetchData(true) };
};
```

### Step 5.3: Create Storm Data Hook

Create `src/hooks/useStormData.js`:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { fetchActiveStorms } from '../services/api/nhcStormService';
import { getCachedData, setCachedData } from '../services/cacheService';
import { CACHE_DURATIONS } from '../utils/constants';

export const useStormData = (basin = 'all') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cached = await getCachedData('stormCache', `storms_${basin}`);
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      const freshData = await fetchActiveStorms();
      if (basin !== 'all') {
        freshData.storms = freshData.storms.filter((s) => s.basin === basin);
      }
      setData(freshData);
      await setCachedData('stormCache', `storms_${basin}`, freshData, CACHE_DURATIONS.STORM);
    } catch (err) {
      setError({ title: 'Storm Data Unavailable', message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [basin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: () => fetchData(true) };
};
```

---

## Phase 6: Common Components

### Step 6.1: Create Loading Spinner

Create `src/components/common/LoadingSpinner.jsx`:

```jsx
import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', message }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader className={`${sizes[size]} text-primary-600 animate-spin`} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};
```

### Step 6.2: Create Error Message

Create `src/components/common/ErrorMessage.jsx`:

```jsx
import { AlertCircle, RefreshCw, X } from 'lucide-react';

export const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  const { title, message } = typeof error === 'object' ? error : { title: 'Error', message: error };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">{title}</h4>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-2 text-sm text-red-700 hover:text-red-800 flex items-center gap-1">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          )}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
```

### Step 6.3: Create Card Component

Create `src/components/common/Card.jsx`:

```jsx
export const Card = ({ children, title, subtitle, action, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);
```

### Step 6.4: Create Error Boundary

Create `src/components/common/ErrorBoundary.jsx`:

```jsx
import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="btn-primary flex items-center gap-2 mx-auto">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## Phase 7: Layout Components

### Step 7.1: Create Header

Create `src/components/common/Header.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { Menu, Settings, MapPin } from 'lucide-react';
import { RegionSelector } from '../dashboard/RegionSelector';

export const Header = ({ onMenuClick }) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
    <div className="h-full px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold hidden sm:block">OffshoreWatch</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <RegionSelector />
        <Link to="/settings" className="p-2 rounded-md hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </div>
  </header>
);
```

### Step 7.2: Create Sidebar

Create `src/components/common/Sidebar.jsx`:

```jsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cloud, Map, CloudLightning, Activity, Wrench, MapPin, Waves, FileText, Settings, X } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/weather', icon: Cloud, label: 'Weather' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/storms', icon: CloudLightning, label: 'Storm Tracker' },
  { path: '/seismic', icon: Activity, label: 'Seismic' },
  { path: '/operations', icon: Wrench, label: 'Operations' },
  { path: '/locations', icon: MapPin, label: 'Locations' },
  { path: '/buoys', icon: Waves, label: 'Buoys' },
  { path: '/reports', icon: FileText, label: 'Reports' },
];

export const Sidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
    <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="lg:hidden p-4 border-b">
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Icon className="w-5 h-5" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <NavLink to="/settings" onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <Settings className="w-5 h-5" />Settings
          </NavLink>
        </div>
      </div>
    </aside>
  </>
);
```

### Step 7.3: Create Layout

Create `src/components/common/Layout.jsx`:

```jsx
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
```

---

## Phase 8: Dashboard Components

### Step 8.1: Create Region Selector

Create `src/components/dashboard/RegionSelector.jsx`:

```jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { REGIONS, getRegionList } from '../../utils/regions';

export const RegionSelector = () => {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentRegion = REGIONS[state.currentRegion];

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentRegion?.name || 'Region'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
          {getRegionList().map((region) => (
            <button key={region.id} onClick={() => { dispatch({ type: 'SET_REGION', payload: region.id }); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${state.currentRegion === region.id ? 'bg-primary-50 text-primary-700' : ''}`}>
              {region.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Phase 9: Pages

### Step 9.1: Create Dashboard Page

Create `src/pages/DashboardPage.jsx`:

```jsx
import { useApp } from '../context/AppContext';
import { useWeatherData } from '../hooks/useWeatherData';
import { useStormData } from '../hooks/useStormData';
import { useSeismicData } from '../hooks/useSeismicData';
import { REGIONS } from '../utils/regions';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CloudLightning, Activity } from 'lucide-react';

const DashboardPage = () => {
  const { state } = useApp();
  const region = REGIONS[state.currentRegion];
  const [lat, lon] = region?.center || [27.5, -90.5];

  const { data: weatherData, isLoading: weatherLoading } = useWeatherData(lat, lon);
  const { data: stormData, isLoading: stormLoading } = useStormData(region?.stormBasins?.[0] || 'atlantic');
  const { data: seismicData, isLoading: seismicLoading } = useSeismicData({ latitude: lat, longitude: lon });

  const current = weatherData?.hourly?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">{region?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Current Conditions">
          {weatherLoading ? <LoadingSpinner size="sm" /> : current ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Waves:</span> <span className="font-semibold">{current.waveHeight?.toFixed(1) || 'N/A'} m</span></div>
              <div><span className="text-gray-500">Wind:</span> <span className="font-semibold">{current.windSpeed?.toFixed(0) || 'N/A'} m/s</span></div>
              <div><span className="text-gray-500">Temp:</span> <span className="font-semibold">{current.temperature?.toFixed(0) || 'N/A'}°C</span></div>
              <div><span className="text-gray-500">Visibility:</span> <span className="font-semibold">{current.visibility ? `${(current.visibility/1000).toFixed(0)} km` : 'N/A'}</span></div>
            </div>
          ) : <p className="text-gray-500 text-sm">No data</p>}
        </Card>

        <Card title="Active Storms" action={<CloudLightning className="w-4 h-4 text-gray-400" />}>
          {stormLoading ? <LoadingSpinner size="sm" /> : stormData?.storms?.length ? (
            <div className="space-y-2">
              {stormData.storms.slice(0, 3).map((s) => (
                <div key={s.id} className="flex justify-between py-1 border-b last:border-0">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-sm text-gray-600">{s.intensity.windSpeed} kt</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No active storms</p>}
        </Card>

        <Card title="Recent Earthquakes" action={<Activity className="w-4 h-4 text-gray-400" />}>
          {seismicLoading ? <LoadingSpinner size="sm" /> : seismicData?.earthquakes?.length ? (
            <div className="space-y-2">
              {seismicData.earthquakes.slice(0, 3).map((eq) => (
                <div key={eq.id} className="flex justify-between py-1 border-b last:border-0">
                  <span className="font-medium">M{eq.magnitude.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">{eq.place}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No recent earthquakes</p>}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
```

### Step 9.2: Create Remaining Pages (Placeholders)

Create placeholder pages for: WeatherPage, MapPage, StormTrackerPage, SeismicPage, OperationsPage, LocationsPage, BuoysPage, ReportsPage, SettingsPage, NotFoundPage

Example `src/pages/WeatherPage.jsx`:

```jsx
const WeatherPage = () => <div><h1 className="text-2xl font-bold">Weather Forecast</h1><p className="text-gray-600">7-day marine forecast - implement weather display components</p></div>;
export default WeatherPage;
```

Repeat pattern for all other pages.

---

## Phase 10: App Entry Points

### Step 10.1: Create Main Entry

Update `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 10.2: Create App Component

Create `src/App.jsx`:

```jsx
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { Layout } from './components/common/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const StormTrackerPage = lazy(() => import('./pages/StormTrackerPage'));
const SeismicPage = lazy(() => import('./pages/SeismicPage'));
const OperationsPage = lazy(() => import('./pages/OperationsPage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const BuoysPage = lazy(() => import('./pages/BuoysPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SettingsProvider>
          <NotificationProvider>
            <HashRouter>
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/storms" element={<StormTrackerPage />} />
                    <Route path="/seismic" element={<SeismicPage />} />
                    <Route path="/operations" element={<OperationsPage />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route path="/buoys" element={<BuoysPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Layout>
            </HashRouter>
          </NotificationProvider>
        </SettingsProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
```

---

## Phase 11: Build & Test

### Step 11.1: Run Development Server

```bash
npm run dev
```

### Step 11.2: Build for Production

```bash
npm run build
```

### Step 11.3: Preview Production Build

```bash
npm run preview
```

---

## Phase 12: Deploy to GitHub Pages

### Step 12.1: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Step 12.2: Enable GitHub Pages

1. Go to repository Settings > Pages
2. Select "GitHub Actions" as source
3. Push to main branch to trigger deployment

---

## Completion Checklist

- [ ] Project initialized with Vite + React
- [ ] Tailwind CSS configured with light theme
- [ ] HashRouter configured for GitHub Pages
- [ ] Context providers (App, Settings, Notification)
- [ ] API services (Open-Meteo, USGS, NHC)
- [ ] IndexedDB caching with Dexie
- [ ] Custom hooks for data fetching
- [ ] Common UI components
- [ ] Layout (Header, Sidebar)
- [ ] All pages created
- [ ] Error boundaries implemented
- [ ] Offline indicators
- [ ] Production build tested
- [ ] Deployed to GitHub Pages

---

*End of Instructions*
