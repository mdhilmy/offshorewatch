# CLAUDE.md
# OffshoreWatch - Claude Code Context Guide

This document provides essential context and instructions for Claude Code when working on the OffshoreWatch project. It serves as a persistent memory to avoid repeating project-specific information in every prompt.

---

## Permissions

**Full Access Granted:** Claude Code has been granted complete permissions to edit, access, and update all files and items within this project folder. No additional permissions are required for any operations including file creation, modification, deletion, package installation, or configuration changes.

---

## Project Identity

**Name:** OffshoreWatch  
**Type:** Global Offshore Operations Weather & Safety Planning Platform  
**Stack:** React 18 + Vite + Tailwind CSS (light theme) + HashRouter  
**Deployment:** GitHub Pages (static hosting)

---

## Quick Reference

### Critical Constraints

1. **HashRouter Required** - All routes must use `/#/path` format for GitHub Pages
2. **No Server-Side Code** - Pure client-side application
3. **Free APIs First** - Prioritize no-auth APIs; optional APIs are user-provided
4. **Offline-First** - Core features must work without network
5. **Light Theme** - All UI uses light Tailwind theme (NOT dark)

### File Locations

| Type | Location | Pattern |
|------|----------|---------|
| Components | `src/components/{category}/` | PascalCase.jsx |
| Pages | `src/pages/` | PascalCasePage.jsx |
| Hooks | `src/hooks/` | useCamelCase.js |
| Services | `src/services/api/` | camelCaseService.js |
| Utils | `src/utils/` | camelCase.js |
| Context | `src/context/` | PascalCaseContext.jsx |

### Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "tailwindcss": "^3.x",
  "leaflet": "^1.9.x",
  "react-leaflet": "^4.x",
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x",
  "dexie": "^3.x",
  "date-fns": "^2.x",
  "lucide-react": "latest"
}
```

---

## API Integration Rules

### Free APIs (No Authentication)

These APIs are the **primary data sources** and must always be available:

| API | Purpose | Base URL |
|-----|---------|----------|
| **Open-Meteo Marine** | Wave forecasts | `https://marine-api.open-meteo.com/v1/marine` |
| **Open-Meteo Weather** | Atmospheric data | `https://api.open-meteo.com/v1/forecast` |
| **USGS Earthquake** | Seismic data | `https://earthquake.usgs.gov/fdsnws/event/1/query` |
| **NOAA NHC** | Atlantic hurricanes | `https://mapservices.weather.noaa.gov/tropical/...` |
| **NOAA NDBC** | Buoy observations | `https://www.ndbc.noaa.gov/data/realtime2/` |
| **NOAA CO-OPS** | Tides/currents | `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` |

### Optional APIs (User Provides Key)

These enhance features but are **not required** for core functionality:

| API | Purpose | Storage Key |
|-----|---------|-------------|
| Mapbox | Satellite tiles | `offshorewatch_apikey_mapbox` |
| OpenWeatherMap | Alt weather | `offshorewatch_apikey_openweather` |

### API Request Pattern

```javascript
// Always use this pattern for API calls
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 15000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // Always provide user-friendly error
    console.error(`API Error: ${url}`, error);
    throw {
      message: getUserFriendlyMessage(error),
      original: error,
      url,
    };
  }
};
```

### API Key Handling

```javascript
// Store keys in localStorage with prefix
const API_KEY_PREFIX = 'offshorewatch_apikey_';

// Get key (returns null if not set)
const getApiKey = (service) => 
  localStorage.getItem(`${API_KEY_PREFIX}${service}`);

// Set key after validation
const setApiKey = (service, key) => 
  localStorage.setItem(`${API_KEY_PREFIX}${service}`, key);

// Check if optional API is available
const hasApiKey = (service) => 
  !!getApiKey(service);
```

---

## Component Patterns

### Standard Component Structure

```jsx
// components/weather/WeatherForecast.jsx
import { useState, useEffect } from 'react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Card } from '../common/Card';

export const WeatherForecast = ({ locationId, onError }) => {
  const { data, isLoading, error, refetch } = useWeatherData(locationId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return <EmptyState message="No forecast data available" />;

  return (
    <Card>
      {/* Component content */}
    </Card>
  );
};
```

### Hook Pattern

```javascript
// hooks/useWeatherData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchMarineWeather } from '../services/api/openMeteoService';
import { getCachedData, setCachedData } from '../services/cacheService';

export const useWeatherData = (locationId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!locationId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Try cache first
      const cached = await getCachedData('weather', locationId);
      if (cached && !isExpired(cached)) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      // Fetch fresh data
      const freshData = await fetchMarineWeather(locationId);
      setData(freshData);
      await setCachedData('weather', locationId, freshData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
```

### Service Pattern

```javascript
// services/api/openMeteoService.js
const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';

export const fetchMarineWeather = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude,
    longitude,
    hourly: 'wave_height,wave_direction,wave_period,swell_wave_height,wind_wave_height',
    daily: 'wave_height_max',
    timezone: 'UTC',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data = await response.json();
  return transformMarineData(data); // Transform to standard format
};

const transformMarineData = (raw) => ({
  source: 'open-meteo',
  fetchedAt: new Date().toISOString(),
  hourly: raw.hourly.time.map((time, i) => ({
    time,
    waveHeight: raw.hourly.wave_height?.[i] ?? null,
    waveDirection: raw.hourly.wave_direction?.[i] ?? null,
    wavePeriod: raw.hourly.wave_period?.[i] ?? null,
    swellHeight: raw.hourly.swell_wave_height?.[i] ?? null,
    windWaveHeight: raw.hourly.wind_wave_height?.[i] ?? null,
  })),
});
```

---

## UI Implementation

### Tailwind Light Theme Classes

```jsx
// Card component
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

// Primary button
<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">

// Secondary button  
<button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200">

// Input field
<input className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

// Alert/error box
<div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">

// Success message
<div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">

// Warning message
<div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4">
```

### Color Scale for Weather Conditions

```javascript
// utils/colorScales.js
export const getConditionColor = (value, thresholds) => {
  if (value <= thresholds.safe) return 'text-green-600 bg-green-50';
  if (value <= thresholds.caution) return 'text-yellow-600 bg-yellow-50';
  if (value <= thresholds.warning) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

export const WAVE_COLORS = {
  calm: '#22c55e',      // < 1m
  moderate: '#84cc16',  // 1-2m
  elevated: '#eab308',  // 2-3m
  high: '#f97316',      // 3-4m
  severe: '#ef4444',    // > 4m
};

export const STORM_CATEGORY_COLORS = {
  TD: '#60a5fa',  // Tropical Depression
  TS: '#34d399',  // Tropical Storm
  1: '#fbbf24',   // Cat 1
  2: '#f97316',   // Cat 2
  3: '#ef4444',   // Cat 3
  4: '#dc2626',   // Cat 4
  5: '#7f1d1d',   // Cat 5
};
```

### Responsive Breakpoints

```jsx
// Mobile-first responsive pattern
<div className="
  grid grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4
">

// Sidebar visibility
<aside className="
  hidden lg:block lg:w-64
  fixed lg:static
  inset-y-0 left-0
">

// Map container responsive height
<div className="h-[50vh] md:h-[60vh] lg:h-[70vh]">
```

---

## Offline Caching

### Dexie.js Database Schema

```javascript
// services/cacheService.js
import Dexie from 'dexie';

export const db = new Dexie('OffshoreWatchDB');

db.version(1).stores({
  weatherCache: '++id, locationKey, fetchedAt, expiresAt',
  stormCache: '++id, stormId, basin, fetchedAt',
  seismicCache: '++id, eventId, fetchedAt',
  buoyCache: '++id, stationId, fetchedAt',
  locations: '++id, &locationId, name, region',
  settings: 'key',
});
```

### Cache Duration Constants

```javascript
// utils/constants.js
export const CACHE_DURATIONS = {
  WEATHER: 15 * 60 * 1000,      // 15 minutes
  STORM: 30 * 60 * 1000,        // 30 minutes
  SEISMIC: 5 * 60 * 1000,       // 5 minutes
  BUOY: 60 * 60 * 1000,         // 1 hour
  PLATFORM: 7 * 24 * 60 * 60 * 1000, // 7 days
};
```

### Cache Check Pattern

```javascript
const getCachedData = async (type, key) => {
  const cached = await db[`${type}Cache`]
    .where('locationKey')
    .equals(key)
    .first();
    
  if (!cached) return null;
  
  const isExpired = Date.now() > cached.expiresAt;
  if (isExpired) {
    await db[`${type}Cache`].delete(cached.id);
    return null;
  }
  
  return cached.data;
};
```

---

## Operational Thresholds

### Default Values (Industry Standards)

```javascript
// utils/thresholds.js
export const DEFAULT_THRESHOLDS = {
  helicopterOps: {
    maxWindSpeed: 35,      // knots
    maxWindGusts: 45,      // knots
    maxWaveHeight: 2.4,    // meters (8 ft)
    minVisibility: 4.8,    // km (3 mi)
    minCeiling: 305,       // meters (1000 ft)
  },
  craneLift: {
    maxWindSpeed: 20,      // knots
    maxWaveHeight: 1.8,    // meters (6 ft)
  },
  divingOps: {
    maxWaveHeight: 2.5,    // meters
    maxCurrentSpeed: 1.5,  // knots
    maxWindSpeed: 21,      // knots (Beaufort 5)
  },
  rigMove: {
    maxWindSpeed: 15,      // knots
    maxWaveHeight: 1.2,    // meters (4 ft)
    minWindowHours: 12,    // hours
  },
  personnelTransfer: {
    boat: { maxWaveHeight: 2.0, maxWindSpeed: 25 },
    w2w: { maxWaveHeight: 3.0, maxWindSpeed: 38 },
  },
};
```

### Window Calculation Logic

```javascript
// utils/windowCalculator.js
export const calculateWeatherWindows = (forecast, thresholds, operationType) => {
  const limits = thresholds[operationType];
  const windows = [];
  let currentWindow = null;

  forecast.hourly.forEach((hour, index) => {
    const isSafe = checkConditions(hour, limits);
    
    if (isSafe && !currentWindow) {
      // Start new window
      currentWindow = { start: hour.time, startIndex: index };
    } else if (!isSafe && currentWindow) {
      // End current window
      currentWindow.end = forecast.hourly[index - 1].time;
      currentWindow.duration = index - currentWindow.startIndex;
      windows.push(currentWindow);
      currentWindow = null;
    }
  });

  // Handle window extending to end of forecast
  if (currentWindow) {
    currentWindow.end = forecast.hourly[forecast.hourly.length - 1].time;
    currentWindow.duration = forecast.hourly.length - currentWindow.startIndex;
    windows.push(currentWindow);
  }

  return windows;
};

const checkConditions = (conditions, limits) => {
  if (limits.maxWindSpeed && conditions.windSpeed > limits.maxWindSpeed) return false;
  if (limits.maxWaveHeight && conditions.waveHeight > limits.maxWaveHeight) return false;
  if (limits.minVisibility && conditions.visibility < limits.minVisibility) return false;
  return true;
};
```

---

## Error Handling

### Error Message Catalog

```javascript
// utils/errorMessages.js
export const ERROR_MESSAGES = {
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Unable to connect. Check your internet connection.',
    action: 'retry',
  },
  API_TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long. Please try again.',
    action: 'retry',
  },
  RATE_LIMITED: {
    title: 'Too Many Requests',
    message: 'Please wait a moment before trying again.',
    action: 'wait',
  },
  INVALID_API_KEY: {
    title: 'Invalid API Key',
    message: 'The API key is invalid or expired. Check your settings.',
    action: 'settings',
  },
  NO_DATA: {
    title: 'No Data Available',
    message: 'Weather data is not available for this location.',
    action: 'none',
  },
  PARSE_ERROR: {
    title: 'Data Error',
    message: 'Error processing the received data.',
    action: 'retry',
  },
};
```

### Error Display Component Usage

```jsx
// Always show user-friendly errors
{error && (
  <ErrorMessage 
    error={error}
    onRetry={handleRetry}
    onDismiss={() => setError(null)}
  />
)}
```

---

## Global Regions

### Region Configuration

```javascript
// utils/regions.js
export const REGIONS = {
  gom: {
    name: 'Gulf of Mexico',
    center: [27.5, -90.5],
    zoom: 6,
    bounds: [[24, -98], [31, -82]],
    stormBasins: ['atlantic', 'epac'],
    timezone: 'America/Chicago',
  },
  northsea: {
    name: 'North Sea',
    center: [58, 2],
    zoom: 5,
    bounds: [[51, -5], [62, 10]],
    stormBasins: [],
    timezone: 'Europe/London',
  },
  seasia: {
    name: 'Southeast Asia',
    center: [5, 110],
    zoom: 5,
    bounds: [[-5, 95], [15, 125]],
    stormBasins: ['wpac'],
    timezone: 'Asia/Singapore',
  },
  brazil: {
    name: 'Brazil Pre-salt',
    center: [-24, -42],
    zoom: 6,
    bounds: [[-28, -50], [-20, -35]],
    stormBasins: [],
    timezone: 'America/Sao_Paulo',
  },
  westafrica: {
    name: 'West Africa',
    center: [4, 4],
    zoom: 6,
    bounds: [[-5, -5], [10, 15]],
    stormBasins: [],
    timezone: 'Africa/Lagos',
  },
  australia: {
    name: 'Australia',
    center: [-25, 125],
    zoom: 4,
    bounds: [[-45, 110], [-10, 155]],
    stormBasins: ['aus'],
    timezone: 'Australia/Perth',
  },
  middleeast: {
    name: 'Middle East',
    center: [26, 52],
    zoom: 6,
    bounds: [[22, 48], [32, 58]],
    stormBasins: ['nio'],
    timezone: 'Asia/Dubai',
  },
};
```

---

## Unit Conversions

### Conversion Utilities

```javascript
// utils/units.js
export const UNIT_CONVERSIONS = {
  // Wind speed
  msToKnots: (ms) => ms * 1.94384,
  knotsToMs: (kt) => kt / 1.94384,
  knotsToMph: (kt) => kt * 1.15078,
  mphToKnots: (mph) => mph / 1.15078,
  msToKmh: (ms) => ms * 3.6,
  
  // Distance
  kmToNm: (km) => km / 1.852,
  nmToKm: (nm) => nm * 1.852,
  kmToMiles: (km) => km / 1.60934,
  milesToKm: (mi) => mi * 1.60934,
  
  // Height
  metersToFeet: (m) => m * 3.28084,
  feetToMeters: (ft) => ft / 3.28084,
  
  // Temperature
  celsiusToFahrenheit: (c) => (c * 9/5) + 32,
  fahrenheitToCelsius: (f) => (f - 32) * 5/9,
  
  // Pressure
  mbToInhg: (mb) => mb * 0.02953,
  inhgToMb: (inhg) => inhg / 0.02953,
};

// Format with units
export const formatWithUnit = (value, unit, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)} ${unit}`;
};
```

---

## Important Reminders

### DO

- ✅ Always handle loading, error, and empty states
- ✅ Use HashRouter for all navigation
- ✅ Cache API responses in IndexedDB
- ✅ Show data source and timestamp
- ✅ Provide offline fallback with cached data
- ✅ Validate API keys before storing
- ✅ Use Tailwind light theme classes
- ✅ Include Lucide icons consistently
- ✅ Test on mobile viewports

### DON'T

- ❌ Never hardcode API keys in source
- ❌ Never use BrowserRouter (breaks GitHub Pages)
- ❌ Never assume network availability
- ❌ Never show raw API errors to users
- ❌ Never use dark theme colors
- ❌ Never skip error boundaries
- ❌ Never forget loading spinners

### Common Mistakes to Avoid

1. **Using `<Link to="/path">` without hash** - Always verify HashRouter is wrapping the app
2. **Forgetting CORS** - Some NOAA endpoints need proxy; Open-Meteo works directly
3. **Not handling null data** - Always check for null/undefined before rendering
4. **Missing cleanup in useEffect** - Always return cleanup function for subscriptions
5. **Not debouncing search inputs** - Use `useDebounce` hook for location search

---

## Testing Checklist

Before considering any feature complete:

- [ ] Works offline with cached data
- [ ] Shows appropriate loading state
- [ ] Handles API errors gracefully
- [ ] Responsive on mobile (320px)
- [ ] Responsive on desktop (1920px)
- [ ] Keyboard accessible
- [ ] Color contrast meets WCAG AA
- [ ] No console errors
- [ ] Data source attributed

---

*This document should be updated as the project evolves.*
