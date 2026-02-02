# Product Requirements Document (PRD)
# OffshoreWatch - Global Offshore Operations Weather & Safety Planning Platform

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Status:** Development Ready

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [File Structure](#2-file-structure)
3. [Naming Patterns](#3-naming-patterns)
4. [UI Design System](#4-ui-design-system)
5. [Key Features & User Flows](#5-key-features--user-flows)
6. [Constraints & Guardrails](#6-constraints--guardrails)
7. [Security Architecture](#7-security-architecture)
8. [API Integration Reference](#8-api-integration-reference)
9. [Data Models & Schemas](#9-data-models--schemas)
10. [Offline Caching Strategy](#10-offline-caching-strategy)
11. [Error Handling Standards](#11-error-handling-standards)
12. [Performance Requirements](#12-performance-requirements)
13. [Testing Requirements](#13-testing-requirements)
14. [Deployment Configuration](#14-deployment-configuration)
15. [Industry References & Sources](#15-industry-references--sources)

---

## 1. Product Overview

### 1.1 Executive Summary

**OffshoreWatch** is a comprehensive, browser-based weather and safety planning platform designed for petroleum engineers, offshore operations planners, HSE (Health, Safety, and Environment) managers, marine coordinators, and logistics personnel operating in the global offshore oil and gas industry. The platform aggregates real-time marine weather data, tropical cyclone tracking, seismic monitoring, and infrastructure mapping into a unified decision-support tool that enables users to assess weather windows, plan safe operations, and monitor environmental risks across seven major offshore producing regions worldwide.

### 1.2 Target Users

| User Role | Primary Use Cases |
|-----------|------------------|
| **Operations Planners** | Weather window assessment, activity scheduling, multi-location comparison |
| **HSE Managers** | Threshold monitoring, safety alerts, compliance documentation |
| **Marine Coordinators** | Vessel movements, rig tow planning, sea state monitoring |
| **Logistics Personnel** | Helicopter scheduling, personnel transfer planning, supply vessel coordination |
| **Drilling Supervisors** | Crane operations planning, diving window assessment |
| **Emergency Response Teams** | Hurricane/cyclone tracking, evacuation planning |

### 1.3 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | React.js | 18.x | Component-based UI architecture |
| **Routing** | React Router (HashRouter) | 6.x | Client-side routing for GitHub Pages compatibility |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework (light theme) |
| **State Management** | React Context + useReducer | Native | Global state for settings, cached data |
| **Mapping** | Leaflet + React-Leaflet | 1.9.x / 4.x | Interactive map visualization |
| **Charts** | Chart.js + react-chartjs-2 | 4.x / 5.x | Weather forecast charts, time series |
| **Offline Storage** | Dexie.js (IndexedDB wrapper) | 3.x | Persistent offline data caching |
| **Service Worker** | Workbox | 7.x | Caching strategies, offline support |
| **HTTP Client** | Native Fetch API | - | API requests with error handling |
| **Date Handling** | date-fns | 2.x | Date formatting and manipulation |
| **Icons** | Lucide React | Latest | Consistent icon system |
| **Build Tool** | Vite | 5.x | Fast development and optimized builds |

### 1.4 Global Coverage Regions

The platform supports seven major offshore producing regions:

| Region | Coordinates | Production | Key Challenges |
|--------|-------------|------------|----------------|
| **Gulf of Mexico (USA)** | 26°N-29°N, 87°W-97°W | 1.8-1.9M b/d | Hurricanes, Loop Current |
| **North Sea (UK/Norway)** | 56°N-71°N, 3°W-10°E | ~3M boe/d | Winter storms, 4m+ waves |
| **Southeast Asia (Malaysia/Indonesia)** | 5°N-8°N, 100°E-120°E | ~4.86M boe/d | Monsoons, typhoons |
| **Brazil Pre-salt** | 23°S-28°S, 40°W-45°W | 3.4-4.0M boe/d | South Atlantic swells |
| **West Africa (Nigeria/Angola/Ghana)** | 4°N-6°N, 2°E-8°E | ~2.5M b/d | Generally calm; long swells |
| **Australia (NWS/Bass Strait)** | 19°S-40°S, 114°E-150°E | Major LNG exports | Cyclones (Nov-Apr) |
| **Middle East (Persian Gulf)** | 24°N-30°N, 48°E-56°E | 20M b/d (Hormuz) | Shamal winds, extreme heat |

---

## 2. File Structure

```
offshorewatch/
├── public/
│   ├── index.html                    # Entry HTML with meta tags
│   ├── favicon.ico                   # App favicon
│   ├── manifest.json                 # PWA manifest
│   ├── robots.txt                    # SEO configuration
│   └── data/
│       ├── regions.json              # Predefined region configurations
│       ├── platforms-gom.json        # Gulf of Mexico platform data (static)
│       ├── platforms-northsea.json   # North Sea platform data (static)
│       ├── thresholds-default.json   # Default operational thresholds
│       └── buoy-stations.json        # NDBC buoy station metadata
│
├── src/
│   ├── index.jsx                     # Application entry point
│   ├── App.jsx                       # Root component with router
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx            # Main navigation header
│   │   │   ├── Footer.jsx            # Footer with attribution
│   │   │   ├── Sidebar.jsx           # Collapsible sidebar navigation
│   │   │   ├── LoadingSpinner.jsx    # Loading indicator component
│   │   │   ├── ErrorBoundary.jsx     # React error boundary
│   │   │   ├── ErrorMessage.jsx      # Error display component
│   │   │   ├── Toast.jsx             # Toast notification component
│   │   │   ├── Modal.jsx             # Reusable modal component
│   │   │   ├── Card.jsx              # Card container component
│   │   │   ├── Button.jsx            # Styled button component
│   │   │   ├── Input.jsx             # Form input component
│   │   │   ├── Select.jsx            # Dropdown select component
│   │   │   ├── Toggle.jsx            # Toggle switch component
│   │   │   ├── Tooltip.jsx           # Tooltip component
│   │   │   ├── Badge.jsx             # Status badge component
│   │   │   ├── Tabs.jsx              # Tab navigation component
│   │   │   ├── Accordion.jsx         # Collapsible accordion
│   │   │   ├── DataTable.jsx         # Sortable data table
│   │   │   ├── EmptyState.jsx        # Empty state placeholder
│   │   │   └── OfflineIndicator.jsx  # Offline status indicator
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardOverview.jsx       # Main dashboard layout
│   │   │   ├── RegionSelector.jsx          # Region quick-select dropdown
│   │   │   ├── WeatherSummaryCard.jsx      # Current conditions summary
│   │   │   ├── AlertsPanel.jsx             # Active alerts display
│   │   │   ├── QuickForecastWidget.jsx     # 24-hour forecast preview
│   │   │   ├── ActiveStormWidget.jsx       # Active tropical systems
│   │   │   ├── RecentEarthquakeWidget.jsx  # Recent seismic activity
│   │   │   └── FavoriteLocationsWidget.jsx # Saved locations quick view
│   │   │
│   │   ├── weather/
│   │   │   ├── WeatherForecast.jsx         # 7-day forecast display
│   │   │   ├── MarineConditions.jsx        # Wave, swell, SST display
│   │   │   ├── WindDisplay.jsx             # Wind speed/direction
│   │   │   ├── WaveHeightChart.jsx         # Wave height time series
│   │   │   ├── WindSpeedChart.jsx          # Wind speed time series
│   │   │   ├── TemperatureChart.jsx        # Temperature time series
│   │   │   ├── ForecastTable.jsx           # Tabular forecast data
│   │   │   ├── HourlyForecast.jsx          # Hourly breakdown
│   │   │   ├── HistoricalComparison.jsx    # Historical data overlay
│   │   │   └── WeatherSourceIndicator.jsx  # Data source attribution
│   │   │
│   │   ├── map/
│   │   │   ├── MapContainer.jsx            # Main map wrapper
│   │   │   ├── MapControls.jsx             # Zoom, layer controls
│   │   │   ├── MapLayerPanel.jsx           # Layer toggle panel
│   │   │   ├── PlatformMarker.jsx          # Platform icon marker
│   │   │   ├── PlatformPopup.jsx           # Platform info popup
│   │   │   ├── PlatformCluster.jsx         # Clustered platform markers
│   │   │   ├── BuoyMarker.jsx              # Buoy station marker
│   │   │   ├── WeatherOverlay.jsx          # Weather heatmap overlay
│   │   │   ├── HurricaneTrackLayer.jsx     # Storm track visualization
│   │   │   ├── HurricaneConeLayer.jsx      # Uncertainty cone layer
│   │   │   ├── WindRadiiLayer.jsx          # Wind radii circles
│   │   │   ├── EarthquakeMarker.jsx        # Earthquake location marker
│   │   │   ├── LeaseBlockLayer.jsx         # Lease block boundaries
│   │   │   ├── PipelineLayer.jsx           # Pipeline routes
│   │   │   ├── SafetyZoneCircle.jsx        # Operational safety zone
│   │   │   ├── LocationSearch.jsx          # Coordinate/name search
│   │   │   ├── MeasurementTool.jsx         # Distance measurement
│   │   │   └── MapLegend.jsx               # Map legend component
│   │   │
│   │   ├── storms/
│   │   │   ├── StormTracker.jsx            # Active storm list
│   │   │   ├── StormDetailPanel.jsx        # Individual storm details
│   │   │   ├── StormForecastTable.jsx      # Position/intensity forecast
│   │   │   ├── StormHistoryChart.jsx       # Intensity history chart
│   │   │   ├── StormImpactAssessment.jsx   # Platform impact analysis
│   │   │   ├── BasinSelector.jsx           # Ocean basin filter
│   │   │   ├── StormArchiveSearch.jsx      # Historical storm search
│   │   │   └── StormAlertConfig.jsx        # Storm alert settings
│   │   │
│   │   ├── seismic/
│   │   │   ├── SeismicMonitor.jsx          # Earthquake feed display
│   │   │   ├── EarthquakeList.jsx          # Recent earthquakes list
│   │   │   ├── EarthquakeDetail.jsx        # Individual quake detail
│   │   │   ├── SeismicFilterPanel.jsx      # Magnitude/region filters
│   │   │   ├── SeismicMapLayer.jsx         # Map integration
│   │   │   └── SeismicAlertConfig.jsx      # Seismic alert settings
│   │   │
│   │   ├── operations/
│   │   │   ├── WeatherWindowCalculator.jsx   # Operation window finder
│   │   │   ├── OperationTypeSelector.jsx     # Operation type dropdown
│   │   │   ├── ThresholdDisplay.jsx          # Current threshold values
│   │   │   ├── WindowResultsTable.jsx        # Available windows list
│   │   │   ├── WindowTimeline.jsx            # Visual timeline chart
│   │   │   ├── MultiLocationCompare.jsx      # Side-by-side comparison
│   │   │   ├── RigMoveCalculator.jsx         # Transit window calculator
│   │   │   ├── HelicopterOpsPlanner.jsx      # Helo ops assessment
│   │   │   ├── CraneOpsAssessment.jsx        # Crane lift windows
│   │   │   ├── DivingOpsAssessment.jsx       # Diving conditions
│   │   │   └── PersonnelTransferAssessment.jsx # POB transfer windows
│   │   │
│   │   ├── locations/
│   │   │   ├── LocationManager.jsx           # Saved locations list
│   │   │   ├── LocationForm.jsx              # Add/edit location form
│   │   │   ├── LocationCard.jsx              # Location summary card
│   │   │   ├── LocationImport.jsx            # CSV/JSON import
│   │   │   ├── LocationExport.jsx            # Export locations
│   │   │   └── CoordinateInput.jsx           # Lat/lon input component
│   │   │
│   │   ├── buoys/
│   │   │   ├── BuoyDataDisplay.jsx           # Buoy observations
│   │   │   ├── BuoySelector.jsx              # Nearby buoy finder
│   │   │   ├── BuoyHistoryChart.jsx          # Historical buoy data
│   │   │   └── BuoyComparisonTable.jsx       # Multi-buoy comparison
│   │   │
│   │   ├── reports/
│   │   │   ├── ReportGenerator.jsx           # Report builder
│   │   │   ├── WeatherReportTemplate.jsx     # Weather report format
│   │   │   ├── OperationsReportTemplate.jsx  # Ops window report
│   │   │   ├── StormReportTemplate.jsx       # Storm tracking report
│   │   │   ├── ReportPreview.jsx             # Report preview
│   │   │   └── ReportExport.jsx              # PDF/CSV export
│   │   │
│   │   └── settings/
│   │       ├── SettingsPanel.jsx             # Settings main panel
│   │       ├── ApiKeyManager.jsx             # API key configuration
│   │       ├── ApiKeyInput.jsx               # Individual key input
│   │       ├── ApiKeyValidator.jsx           # Key validation display
│   │       ├── ThresholdSettings.jsx         # Custom thresholds
│   │       ├── UnitPreferences.jsx           # Unit system settings
│   │       ├── NotificationSettings.jsx      # Alert preferences
│   │       ├── DisplayPreferences.jsx        # UI customization
│   │       ├── DataCacheSettings.jsx         # Cache management
│   │       ├── ExportImportSettings.jsx      # Settings backup
│   │       └── AboutSection.jsx              # App info, credits
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx           # Dashboard page wrapper
│   │   ├── WeatherPage.jsx             # Weather forecast page
│   │   ├── MapPage.jsx                 # Full-screen map page
│   │   ├── StormTrackerPage.jsx        # Storm tracking page
│   │   ├── SeismicPage.jsx             # Seismic monitoring page
│   │   ├── OperationsPage.jsx          # Operations planning page
│   │   ├── LocationsPage.jsx           # Location management page
│   │   ├── BuoysPage.jsx               # Buoy data page
│   │   ├── ReportsPage.jsx             # Report generation page
│   │   ├── SettingsPage.jsx            # Settings page
│   │   └── NotFoundPage.jsx            # 404 page
│   │
│   ├── hooks/
│   │   ├── useWeatherData.js           # Weather API fetching hook
│   │   ├── useMarineData.js            # Marine conditions hook
│   │   ├── useStormData.js             # Hurricane/cyclone data hook
│   │   ├── useSeismicData.js           # Earthquake data hook
│   │   ├── useBuoyData.js              # NDBC buoy data hook
│   │   ├── useTideData.js              # Tide/current data hook
│   │   ├── usePlatformData.js          # Platform/infrastructure hook
│   │   ├── useWeatherWindow.js         # Window calculation hook
│   │   ├── useOfflineData.js           # Offline cache hook
│   │   ├── useApiKeys.js               # API key management hook
│   │   ├── useLocalStorage.js          # localStorage wrapper hook
│   │   ├── useDebounce.js              # Debounce utility hook
│   │   ├── useGeolocation.js           # Browser geolocation hook
│   │   ├── useOnlineStatus.js          # Network status hook
│   │   ├── useNotifications.js         # Toast/alert hook
│   │   └── useUnits.js                 # Unit conversion hook
│   │
│   ├── context/
│   │   ├── AppContext.jsx              # Global app state context
│   │   ├── SettingsContext.jsx         # User settings context
│   │   ├── LocationContext.jsx         # Active location context
│   │   ├── WeatherContext.jsx          # Cached weather data context
│   │   └── NotificationContext.jsx     # Notification state context
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── openMeteoService.js     # Open-Meteo API integration
│   │   │   ├── noaaWeatherService.js   # NOAA Weather.gov API
│   │   │   ├── ndbcBuoyService.js      # NDBC buoy data service
│   │   │   ├── noaaTidesService.js     # CO-OPS tides/currents
│   │   │   ├── usgsSeismicService.js   # USGS earthquake API
│   │   │   ├── nhcStormService.js      # NHC hurricane tracking
│   │   │   ├── jtwcStormService.js     # JTWC Western Pacific
│   │   │   ├── bomCycloneService.js    # BOM Australia cyclones
│   │   │   ├── ibtracksService.js      # IBTrACS historical
│   │   │   ├── boemPlatformService.js  # BOEM platform data
│   │   │   ├── npdPlatformService.js   # Norwegian NPD data
│   │   │   └── mapboxService.js        # Mapbox tiles (optional)
│   │   │
│   │   ├── cacheService.js             # IndexedDB cache management
│   │   ├── offlineService.js           # Offline data synchronization
│   │   ├── notificationService.js      # Browser notifications
│   │   ├── exportService.js            # Data export utilities
│   │   └── validationService.js        # API key validation
│   │
│   ├── utils/
│   │   ├── constants.js                # App-wide constants
│   │   ├── config.js                   # Configuration settings
│   │   ├── thresholds.js               # Operational thresholds
│   │   ├── regions.js                  # Region definitions
│   │   ├── units.js                    # Unit conversion utilities
│   │   ├── dateUtils.js                # Date formatting utilities
│   │   ├── coordinateUtils.js          # Coordinate calculations
│   │   ├── weatherUtils.js             # Weather data processing
│   │   ├── stormUtils.js               # Storm track calculations
│   │   ├── windowCalculator.js         # Weather window algorithm
│   │   ├── colorScales.js              # Color scale definitions
│   │   ├── formatters.js               # Display formatters
│   │   ├── validators.js               # Input validation
│   │   └── errorMessages.js            # Error message catalog
│   │
│   ├── styles/
│   │   ├── index.css                   # Main Tailwind imports
│   │   ├── components.css              # Custom component styles
│   │   ├── map.css                     # Map-specific styles
│   │   └── print.css                   # Print stylesheet
│   │
│   └── assets/
│       ├── icons/
│       │   ├── platform-icon.svg       # Platform marker icon
│       │   ├── buoy-icon.svg           # Buoy marker icon
│       │   ├── hurricane-icon.svg      # Hurricane marker icon
│       │   ├── earthquake-icon.svg     # Earthquake marker icon
│       │   └── logo.svg                # App logo
│       └── images/
│           └── placeholder.png         # Image placeholder
│
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore patterns
├── index.html                          # Vite entry HTML
├── package.json                        # Dependencies and scripts
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.js                  # Tailwind configuration
├── vite.config.js                      # Vite build configuration
├── PRD.md                              # This document
├── CLAUDE.md                           # Claude Code context guide
├── INSTRUCTIONS.md                     # Development instructions
└── README.md                           # Project readme
```

---

## 3. Naming Patterns

### 3.1 File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **React Components** | PascalCase.jsx | `WeatherForecast.jsx` |
| **Pages** | PascalCase + "Page" suffix | `DashboardPage.jsx` |
| **Hooks** | camelCase with "use" prefix | `useWeatherData.js` |
| **Services** | camelCase + "Service" suffix | `openMeteoService.js` |
| **Utilities** | camelCase + descriptive name | `coordinateUtils.js` |
| **Constants** | camelCase or UPPER_SNAKE_CASE | `constants.js` |
| **Context** | PascalCase + "Context" suffix | `SettingsContext.jsx` |
| **CSS Files** | kebab-case | `components.css` |
| **JSON Data** | kebab-case | `platforms-gom.json` |

### 3.2 Component Naming Conventions

```javascript
// Component files
WeatherForecast.jsx         // Main forecast display
WeatherForecastCard.jsx     // Card variant
WeatherForecastTable.jsx    // Table variant
WeatherForecastChart.jsx    // Chart variant

// Props naming
interface WeatherForecastProps {
  locationId: string;           // camelCase
  forecastData: ForecastData;   // camelCase, type suffix optional
  onRefresh: () => void;        // "on" prefix for handlers
  isLoading: boolean;           // "is/has/should" prefix for booleans
  showDetails?: boolean;        // optional with "?"
}
```

### 3.3 Function Naming Conventions

```javascript
// API service functions
fetchWeatherData()          // "fetch" prefix for API calls
getMarineConditions()       // "get" prefix for data retrieval
postLocation()              // "post" prefix for creation
updateThreshold()           // "update" prefix for modifications
deleteLocation()            // "delete" prefix for removal
validateApiKey()            // "validate" prefix for validation

// Utility functions
calculateWeatherWindow()    // "calculate" for computations
formatTemperature()         // "format" for display formatting
parseApiResponse()          // "parse" for data transformation
convertKnotsToMph()         // "convert" for unit conversion

// Event handlers (in components)
handleSubmit()              // "handle" prefix
handleLocationChange()
handleRefreshClick()

// Boolean functions
isWithinThreshold()         // "is" prefix for boolean returns
hasValidApiKey()            // "has" prefix
shouldShowAlert()           // "should" prefix
```

### 3.4 CSS Class Naming (Tailwind + Custom)

```css
/* Custom classes use BEM-like naming */
.weather-card {}
.weather-card__header {}
.weather-card__body {}
.weather-card--alert {}
.weather-card--loading {}

/* Component-specific prefixes */
.ow-btn {}                  /* ow = offshorewatch prefix */
.ow-btn-primary {}
.ow-card {}
.ow-map-control {}
```

### 3.5 State Variable Naming

```javascript
// useState patterns
const [weather, setWeather] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [selectedLocation, setSelectedLocation] = useState(null);

// useReducer action types
const ACTION_TYPES = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_LOCATION: 'SET_LOCATION',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  CLEAR_CACHE: 'CLEAR_CACHE',
};
```

### 3.6 Constants and Configuration

```javascript
// constants.js - UPPER_SNAKE_CASE for true constants
export const API_ENDPOINTS = {
  OPEN_METEO_MARINE: 'https://marine-api.open-meteo.com/v1/marine',
  USGS_EARTHQUAKE: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
  NHC_STORM_TRACK: 'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer',
};

export const CACHE_DURATIONS = {
  WEATHER_FORECAST: 15 * 60 * 1000,    // 15 minutes
  STORM_DATA: 30 * 60 * 1000,          // 30 minutes
  SEISMIC_DATA: 5 * 60 * 1000,         // 5 minutes
  PLATFORM_DATA: 24 * 60 * 60 * 1000,  // 24 hours
};

export const DEFAULT_THRESHOLDS = {
  HELICOPTER_OPS: { maxWind: 35, maxWave: 8, minVisibility: 3 },
  CRANE_LIFT: { maxWind: 20, maxWave: 6 },
  DIVING_OPS: { maxWave: 2.5, maxCurrent: 1.5 },
  RIG_MOVE: { maxWind: 15, maxWave: 1.2 },
};
```

---

## 4. UI Design System

### 4.1 Design Theme

**Theme:** Light Professional Maritime
**Mood:** Clean, trustworthy, data-focused, accessible
**Inspiration:** Maritime navigation systems, weather dashboards, financial terminals

### 4.2 Color Palette

```javascript
// tailwind.config.js color extensions
colors: {
  // Primary - Ocean Blue
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',   // Main primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Secondary - Slate Gray
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',   // Main secondary
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Status Colors
  success: {
    light: '#DCFCE7',
    DEFAULT: '#22C55E',
    dark: '#166534',
  },
  warning: {
    light: '#FEF9C3',
    DEFAULT: '#EAB308',
    dark: '#A16207',
  },
  danger: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#B91C1C',
  },
  info: {
    light: '#DBEAFE',
    DEFAULT: '#3B82F6',
    dark: '#1E40AF',
  },
  
  // Weather Severity Scale
  weather: {
    calm: '#22C55E',       // Green - safe conditions
    moderate: '#84CC16',   // Lime - approaching limits
    elevated: '#EAB308',   // Yellow - caution
    high: '#F97316',       // Orange - marginal
    severe: '#EF4444',     // Red - dangerous
    extreme: '#7C2D12',    // Dark red - extreme
  },
  
  // Storm Category Colors (Saffir-Simpson)
  storm: {
    td: '#60A5FA',         // Tropical Depression
    ts: '#34D399',         // Tropical Storm
    cat1: '#FBBF24',       // Category 1
    cat2: '#F97316',       // Category 2
    cat3: '#EF4444',       // Category 3
    cat4: '#DC2626',       // Category 4
    cat5: '#7F1D1D',       // Category 5
  },
  
  // Earthquake Magnitude Colors
  seismic: {
    minor: '#93C5FD',      // < 4.0
    light: '#86EFAC',      // 4.0-4.9
    moderate: '#FDE047',   // 5.0-5.9
    strong: '#FB923C',     // 6.0-6.9
    major: '#F87171',      // 7.0-7.9
    great: '#DC2626',      // 8.0+
  },
}
```

### 4.3 Typography

```javascript
// tailwind.config.js font configuration
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
},

fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'base': ['1rem', { lineHeight: '1.5rem' }],
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
},
```

**Typography Usage:**
| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Page Title | 2xl-3xl | Bold (700) | Main page headings |
| Section Title | xl | Semibold (600) | Card/section headers |
| Subsection | lg | Medium (500) | Subsection headers |
| Body Text | base | Regular (400) | Main content |
| Small Text | sm | Regular (400) | Secondary info, labels |
| Micro Text | xs | Medium (500) | Timestamps, metadata |
| Data Values | lg-xl | Semibold (600) | Key metrics display |
| Monospace | sm-base | Regular (400) | Coordinates, codes |

### 4.4 Spacing System

```javascript
// Using Tailwind's default spacing scale
// Base unit: 4px (0.25rem)
spacing: {
  'px': '1px',
  '0': '0',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '2': '0.5rem',      // 8px
  '3': '0.75rem',     // 12px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '8': '2rem',        // 32px
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
}
```

**Spacing Guidelines:**
| Context | Spacing | Example |
|---------|---------|---------|
| Component padding | 4-6 | `p-4` to `p-6` |
| Card padding | 4-6 | `p-4 md:p-6` |
| Section margin | 6-8 | `mb-6` to `mb-8` |
| Element gap | 2-4 | `gap-2` to `gap-4` |
| Icon-text gap | 2 | `gap-2` |
| Form field gap | 4 | `space-y-4` |
| Page padding | 4-8 | `px-4 md:px-8` |

### 4.5 Component Styles

#### Cards
```jsx
// Standard card
<div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">

// Elevated card (for important info)
<div className="bg-white rounded-lg shadow-md border border-secondary-200 p-4">

// Alert card
<div className="bg-danger-light rounded-lg border border-danger p-4">

// Interactive card
<div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 
                hover:shadow-md hover:border-primary-300 transition-all cursor-pointer">
```

#### Buttons
```jsx
// Primary button
<button className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium
                   hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 
                   focus:ring-offset-2 transition-colors">

// Secondary button
<button className="bg-secondary-100 text-secondary-700 px-4 py-2 rounded-md font-medium
                   hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500 
                   focus:ring-offset-2 transition-colors border border-secondary-300">

// Danger button
<button className="bg-danger text-white px-4 py-2 rounded-md font-medium
                   hover:bg-danger-dark focus:ring-2 focus:ring-danger 
                   focus:ring-offset-2 transition-colors">

// Icon button
<button className="p-2 rounded-md text-secondary-600 hover:bg-secondary-100 
                   hover:text-secondary-900 transition-colors">
```

#### Form Elements
```jsx
// Text input
<input className="w-full px-3 py-2 rounded-md border border-secondary-300 
                  focus:border-primary-500 focus:ring-1 focus:ring-primary-500 
                  placeholder-secondary-400 transition-colors" />

// Select dropdown
<select className="w-full px-3 py-2 rounded-md border border-secondary-300 
                   focus:border-primary-500 focus:ring-1 focus:ring-primary-500 
                   bg-white transition-colors">

// Checkbox
<input type="checkbox" className="h-4 w-4 rounded border-secondary-300 
                                   text-primary-600 focus:ring-primary-500" />
```

### 4.6 Icons

**Icon Library:** Lucide React (https://lucide.dev/)

**Icon Categories:**
| Category | Icons |
|----------|-------|
| Navigation | `Home`, `Map`, `Settings`, `Menu`, `ChevronLeft`, `ChevronRight` |
| Weather | `Cloud`, `Sun`, `Wind`, `Droplets`, `Thermometer`, `Waves` |
| Storms | `CloudLightning`, `AlertTriangle`, `Navigation`, `Target` |
| Operations | `Plane`, `Anchor`, `Ship`, `Wrench`, `Clock` |
| Status | `CheckCircle`, `XCircle`, `AlertCircle`, `Info`, `Loader` |
| Actions | `Plus`, `Minus`, `Edit`, `Trash`, `Download`, `Upload`, `Refresh` |
| Data | `Database`, `BarChart`, `TrendingUp`, `MapPin`, `Layers` |

**Icon Sizing:**
| Size | Class | Usage |
|------|-------|-------|
| Small | `w-4 h-4` | Inline with text, buttons |
| Medium | `w-5 h-5` | Navigation, form labels |
| Large | `w-6 h-6` | Section headers, cards |
| XL | `w-8 h-8` | Dashboard widgets |
| Hero | `w-12 h-12` | Empty states, modals |

### 4.7 Responsive Breakpoints

```javascript
// tailwind.config.js
screens: {
  'sm': '640px',    // Mobile landscape
  'md': '768px',    // Tablet portrait
  'lg': '1024px',   // Tablet landscape / small laptop
  'xl': '1280px',   // Desktop
  '2xl': '1536px',  // Large desktop
}
```

**Layout Behavior:**

| Breakpoint | Sidebar | Cards per Row | Map Size |
|------------|---------|---------------|----------|
| < 640px (Mobile) | Hidden (hamburger) | 1 | Full width, 50vh |
| 640-767px | Hidden (hamburger) | 1-2 | Full width, 60vh |
| 768-1023px | Collapsible | 2-3 | 60% width |
| 1024-1279px | Visible | 3-4 | 70% width |
| ≥1280px | Visible | 4+ | 75% width |

### 4.8 Animation & Transitions

```javascript
// tailwind.config.js
transitionDuration: {
  DEFAULT: '150ms',
  '75': '75ms',
  '100': '100ms',
  '150': '150ms',
  '200': '200ms',
  '300': '300ms',
},

// Custom animations
animation: {
  'spin-slow': 'spin 3s linear infinite',
  'pulse-slow': 'pulse 3s ease-in-out infinite',
  'fade-in': 'fadeIn 0.3s ease-out',
  'slide-in': 'slideIn 0.3s ease-out',
  'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
},

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideIn: {
    '0%': { transform: 'translateY(-10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  bounceSubtle: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
}
```

**Animation Usage:**
| Element | Animation | Trigger |
|---------|-----------|---------|
| Loading spinner | `animate-spin` | While fetching data |
| Alert pulse | `animate-pulse-slow` | Active alerts |
| Toast notification | `animate-slide-in` | On appear |
| Modal | `animate-fade-in` | On open |
| Refresh icon | `animate-spin` | During refresh |
| Data update | Flash background | On new data |

### 4.9 Data Visualization Standards

#### Chart Colors
```javascript
const chartColors = {
  primary: 'rgb(59, 130, 246)',     // Blue - main data
  secondary: 'rgb(100, 116, 139)',  // Gray - comparison
  success: 'rgb(34, 197, 94)',      // Green - safe values
  warning: 'rgb(234, 179, 8)',      // Yellow - caution
  danger: 'rgb(239, 68, 68)',       // Red - exceeded
  
  // Multi-series palette
  series: [
    'rgb(59, 130, 246)',   // Blue
    'rgb(16, 185, 129)',   // Emerald
    'rgb(245, 158, 11)',   // Amber
    'rgb(139, 92, 246)',   // Violet
    'rgb(236, 72, 153)',   // Pink
    'rgb(20, 184, 166)',   // Teal
  ],
};
```

#### Chart Configuration
```javascript
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { family: 'Inter', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgb(30, 41, 59)',
      titleFont: { family: 'Inter', size: 13, weight: 600 },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 12,
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgb(226, 232, 240)' },
      ticks: { font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: 'rgb(226, 232, 240)' },
      ticks: { font: { family: 'Inter', size: 11 } },
    },
  },
};
```

---

## 5. Key Features & User Flows

### 5.1 Core Features

#### 5.1.1 Dashboard (Home)
- **Region quick-select** dropdown for global regions
- **Current conditions summary** for active location
- **Active alerts panel** showing threshold exceedances
- **24-hour forecast preview** with key metrics
- **Active tropical systems** widget for relevant basins
- **Recent earthquakes** near offshore assets
- **Favorite locations** quick access

#### 5.1.2 Marine Weather Forecasts
- **7-day marine forecast** with hourly granularity
- **Wave conditions**: significant height, swell height/direction/period, wind waves
- **Wind data**: speed, gusts, direction
- **Sea surface temperature**
- **Visibility conditions**
- **Time-series charts** for all parameters
- **Data source indicator** (Open-Meteo, NOAA, buoys)
- **Historical comparison** overlay

#### 5.1.3 Interactive Map
- **Global coverage** with region presets
- **Platform markers** with status indicators
- **Buoy stations** with real-time data
- **Weather overlay** (optional heatmap)
- **Storm tracks** with forecast cones
- **Earthquake locations** with magnitude circles
- **Lease block boundaries** (GOM, North Sea)
- **Pipeline routes** where available
- **Layer controls** for toggling overlays
- **Location search** by name or coordinates
- **Distance measurement** tool

#### 5.1.4 Storm Tracker
- **Active storm list** by basin (Atlantic, E. Pacific, W. Pacific, Indian, Australian)
- **Storm detail view** with current position, intensity, movement
- **5-day forecast track** with uncertainty cone
- **Wind radii visualization** (34kt, 50kt, 64kt)
- **Impact assessment** for saved locations
- **Historical storm search** (IBTrACS)
- **Basin selector** for regional focus
- **Storm alerts** for approaching systems

#### 5.1.5 Seismic Monitor
- **Real-time earthquake feed** from USGS
- **Magnitude/region filters**
- **Map integration** with depth indicators
- **Earthquake details** (location, depth, time, felt reports)
- **Proximity alerts** for saved locations
- **Historical seismic data** search

#### 5.1.6 Operations Planning
- **Weather window calculator** for:
  - Helicopter operations (35kt wind, 8ft waves, 3mi visibility)
  - Crane lifts (20kt wind, 6ft waves)
  - Diving operations (2.5m waves, 1.5kt current)
  - Rig moves/towing (15kt wind, 4ft waves)
  - Personnel transfer (vessel/W2W thresholds)
- **Custom threshold configuration**
- **Multi-location comparison**
- **Window timeline visualization**
- **Exportable operations report**

#### 5.1.7 Location Management
- **Save custom locations** with coordinates
- **Location groups/folders**
- **Import from CSV/JSON**
- **Export locations**
- **Default location setting**
- **Location-based alerts**

#### 5.1.8 Buoy Data
- **Nearby buoy finder** based on location
- **Real-time buoy observations**
- **Historical buoy data charts**
- **Multi-buoy comparison**
- **NDBC station metadata**

#### 5.1.9 Reports
- **Weather summary report** for location
- **Operations window report**
- **Storm tracking report**
- **Preview and export** (PDF, CSV)
- **Custom date ranges**

#### 5.1.10 Settings
- **API key management** for optional services
- **Custom operational thresholds**
- **Unit preferences** (Imperial/Metric/Nautical)
- **Notification preferences**
- **Display preferences** (theme adjustments)
- **Data cache management**
- **Settings export/import**

### 5.2 Page Hierarchy & Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo | Region Selector | Location Search | Settings │
├─────────────────────────────────────────────────────────────┤
│  Sidebar        │  Main Content Area                         │
│  ───────────    │                                            │
│  Dashboard      │  [Page Content Based on Route]             │
│  Weather        │                                            │
│  Map            │                                            │
│  Storm Tracker  │                                            │
│  Seismic        │                                            │
│  Operations     │                                            │
│  Locations      │                                            │
│  Buoys          │                                            │
│  Reports        │                                            │
│  ───────────    │                                            │
│  Settings       │                                            │
│  Offline Status │                                            │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 User Flows

#### 5.3.1 First-Time User Onboarding
```
1. User lands on Dashboard
   ↓
2. Welcome modal explains key features
   ↓
3. Prompt to select default region (or auto-detect)
   ↓
4. Prompt to add first location (coordinates or search)
   ↓
5. Optional: Configure API keys for enhanced features
   ↓
6. Dashboard loads with selected location data
```

#### 5.3.2 Weather Window Assessment Flow
```
1. Navigate to Operations page
   ↓
2. Select operation type (Helicopter, Crane, Diving, etc.)
   ↓
3. Select location(s) for assessment
   ↓
4. View threshold configuration (use defaults or customize)
   ↓
5. Click "Calculate Windows"
   ↓
6. View results:
   - Timeline visualization showing safe/unsafe periods
   - Table of available windows with start/end times
   - Current conditions vs. thresholds comparison
   ↓
7. Optional: Export report or compare multiple locations
```

#### 5.3.3 Storm Monitoring Flow
```
1. Navigate to Storm Tracker
   ↓
2. Select basin (Atlantic, Pacific, etc.)
   ↓
3. View list of active storms
   ↓
4. Select storm for details
   ↓
5. View:
   - Current position and intensity
   - 5-day forecast track on map
   - Wind radii visualization
   - Forecast table (position, wind, pressure)
   ↓
6. Click "Check Impact" with saved locations
   ↓
7. View proximity analysis and potential impact timeline
```

#### 5.3.4 Location Setup Flow
```
1. Navigate to Locations page
   ↓
2. Click "Add Location"
   ↓
3. Enter details:
   - Name (e.g., "Thunder Horse PDQ")
   - Latitude/Longitude (manual or map click)
   - Region (auto-detected or manual)
   - Optional: Group/folder assignment
   ↓
4. Save location
   ↓
5. Location appears in list and dropdowns
   ↓
6. Optional: Set as default location
```

#### 5.3.5 Settings Configuration Flow
```
1. Navigate to Settings page
   ↓
2. Tabs: API Keys | Thresholds | Units | Notifications | Display | Cache
   ↓
3. API Keys tab:
   - View status of free APIs (always available)
   - Enter optional API keys (Mapbox, etc.)
   - Validate keys with test request
   ↓
4. Thresholds tab:
   - Modify default thresholds per operation type
   - Create custom threshold profiles
   ↓
5. Units tab:
   - Select wind speed unit (knots, mph, m/s, km/h)
   - Select wave height unit (feet, meters)
   - Select temperature unit (°F, °C)
   - Select pressure unit (mb, inHg)
   ↓
6. Changes auto-save to localStorage
```

### 5.4 Feature-API Mapping

| Feature | Primary API | Fallback | Auth Required |
|---------|-------------|----------|---------------|
| Marine Weather Forecast | Open-Meteo Marine | - | No |
| Current Conditions | NOAA Weather.gov | Open-Meteo | No |
| Buoy Observations | NOAA NDBC | - | No |
| Tides & Currents | NOAA CO-OPS | - | No |
| Atlantic Hurricanes | NOAA NHC | IBTrACS | No |
| Pacific Typhoons | JTWC / JMA | IBTrACS | No |
| Australian Cyclones | BOM | IBTrACS | No |
| Earthquake Data | USGS | - | No |
| GOM Platforms | BOEM | Static JSON | No |
| North Sea Platforms | NPD | Static JSON | No |
| Base Map Tiles | OpenStreetMap | Mapbox (optional) | OSM: No, Mapbox: Yes |
| Satellite Imagery | Mapbox | - | Yes (optional) |

---

## 6. Constraints & Guardrails

### 6.1 Development Constraints

1. **Single Page Application**: All navigation via HashRouter (`/#/path`)
2. **No Server-Side Code**: Pure client-side application
3. **Static Hosting Compatible**: Must work on GitHub Pages
4. **No Build-Time Secrets**: All API keys handled client-side
5. **Offline-First Design**: Core features work without network
6. **No External State**: All state in browser (localStorage, IndexedDB)
7. **Responsive Required**: Must support 320px to 2560px widths

### 6.2 Technical Guardrails

1. **No Server Proxies**: All API calls direct from browser
2. **CORS Compliance**: Only use APIs with CORS headers or JSONP
3. **Rate Limit Respect**: Implement client-side rate limiting
4. **No Paid API Dependencies**: Core features use free APIs only
5. **Graceful Degradation**: Features degrade gracefully without optional APIs
6. **Data Freshness Indicators**: Always show data timestamp
7. **Error Recovery**: All errors are catchable and recoverable

### 6.3 UX Guardrails

1. **Loading States**: Every async operation shows loading indicator
2. **Error Messages**: User-friendly error messages with recovery actions
3. **Empty States**: Meaningful empty states with call-to-action
4. **Confirmation Dialogs**: Destructive actions require confirmation
5. **Offline Indication**: Clear indicator when offline
6. **Data Source Attribution**: Credit data sources (NOAA, USGS, etc.)
7. **Accessibility**: WCAG 2.1 AA compliance target

### 6.4 Performance Guardrails

1. **Initial Load**: < 3 seconds on 3G connection
2. **Time to Interactive**: < 5 seconds
3. **API Response Caching**: Minimum 5-minute cache for forecasts
4. **Lazy Loading**: Non-critical components lazy loaded
5. **Image Optimization**: All images optimized, lazy loaded
6. **Bundle Size**: Main bundle < 500KB gzipped

### 6.5 Out of Scope

The following are explicitly **NOT** included in this project:

1. User authentication / accounts
2. Server-side data storage
3. Real-time push notifications (browser notifications only)
4. Mobile native apps
5. Multi-language support (English only)
6. Print-optimized reports (basic print CSS only)
7. Integration with operational systems (SAP, Maximo, etc.)
8. AIS vessel tracking (requires paid API)
9. Proprietary platform databases
10. Weather model data downloads (GRIB files)

---

## 7. Security Architecture

### 7.1 API Key Strategy

The application uses a **hybrid security model** prioritizing free, no-auth APIs while supporting optional authenticated APIs for enhanced features.

#### 7.1.1 API Categories

| Category | APIs | Storage | Security Level |
|----------|------|---------|----------------|
| **Free (No Auth)** | Open-Meteo, USGS, NOAA, NDBC | Not applicable | Public |
| **Free (User-Agent)** | NOAA Weather.gov | Hardcoded | Low |
| **Optional (User Key)** | Mapbox, OpenWeatherMap | localStorage | User-controlled |

#### 7.1.2 Client-Side Key Storage

```javascript
// API keys stored in localStorage with prefix
const API_KEY_PREFIX = 'offshorewatch_apikey_';

// Storage structure
localStorage.setItem('offshorewatch_apikey_mapbox', 'pk.user_key_here');
localStorage.setItem('offshorewatch_apikey_openweather', 'user_key_here');

// Retrieval with default fallback
const getApiKey = (service) => {
  return localStorage.getItem(`${API_KEY_PREFIX}${service}`) || null;
};
```

#### 7.1.3 Key Validation Flow

```javascript
// Validate API key before storage
const validateApiKey = async (service, key) => {
  const testEndpoints = {
    mapbox: `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${key}`,
    openweather: `https://api.openweathermap.org/data/2.5/weather?lat=0&lon=0&appid=${key}`,
  };
  
  try {
    const response = await fetch(testEndpoints[service]);
    return response.ok;
  } catch {
    return false;
  }
};
```

### 7.2 GitHub Security

#### 7.2.1 .gitignore Configuration

```gitignore
# Environment files (should not exist, but safety)
.env
.env.local
.env.*.local

# API key backup files
**/api-keys*.json
**/keys*.json

# IDE settings that might contain paths
.idea/
.vscode/settings.json

# Build outputs
dist/
build/

# Dependencies
node_modules/
```

#### 7.2.2 No Secrets in Code

```javascript
// ❌ NEVER DO THIS
const MAPBOX_KEY = 'pk.abc123...';

// ✅ CORRECT - User provides key
const mapboxKey = localStorage.getItem('offshorewatch_apikey_mapbox');
if (!mapboxKey) {
  // Show UI prompt for user to enter key
  showApiKeyPrompt('mapbox');
}
```

### 7.3 Data Security

#### 7.3.1 No Sensitive Data Storage

The application does not store:
- Personal identifying information
- Authentication credentials (except user-provided API keys)
- Location history beyond current session
- Usage analytics

#### 7.3.2 localStorage Data

| Key | Data Type | Sensitivity |
|-----|-----------|-------------|
| `offshorewatch_settings` | JSON | Low - User preferences |
| `offshorewatch_locations` | JSON | Low - Coordinates only |
| `offshorewatch_apikey_*` | String | Medium - User's API keys |
| `offshorewatch_cache_*` | JSON | Low - Cached weather data |

#### 7.3.3 IndexedDB Data

| Store | Purpose | Retention |
|-------|---------|-----------|
| `weatherCache` | Cached forecast data | 24 hours |
| `stormCache` | Storm track data | 6 hours |
| `platformData` | Platform locations | 7 days |
| `buoyData` | Buoy observations | 1 hour |

### 7.4 Content Security

#### 7.4.1 External Resources

All external resources are loaded via HTTPS:
- API endpoints (HTTPS only)
- Map tiles (HTTPS)
- CDN resources (HTTPS)

#### 7.4.2 Input Validation

```javascript
// Coordinate validation
const isValidLatitude = (lat) => !isNaN(lat) && lat >= -90 && lat <= 90;
const isValidLongitude = (lon) => !isNaN(lon) && lon >= -180 && lon <= 180;

// Sanitize user input before display
const sanitizeInput = (input) => {
  return String(input)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
```

---

## 8. API Integration Reference

### 8.1 Free APIs (No Authentication Required)

#### 8.1.1 Open-Meteo Marine API

**Purpose:** Global marine weather forecasts (16-day)  
**Base URL:** `https://marine-api.open-meteo.com/v1/marine`  
**Rate Limit:** 10,000 requests/day (non-commercial)  
**Documentation:** https://open-meteo.com/en/docs/marine-weather-api

**Request Parameters:**
```javascript
const params = {
  latitude: 27.5,
  longitude: -90.5,
  hourly: [
    'wave_height',
    'wave_direction',
    'wave_period',
    'wind_wave_height',
    'wind_wave_direction',
    'wind_wave_period',
    'swell_wave_height',
    'swell_wave_direction',
    'swell_wave_period',
    'ocean_current_velocity',
    'ocean_current_direction',
  ].join(','),
  daily: [
    'wave_height_max',
    'wind_wave_height_max',
    'swell_wave_height_max',
  ].join(','),
  timezone: 'UTC',
  forecast_days: 7,
};
```

**Response Schema:**
```json
{
  "latitude": 27.5,
  "longitude": -90.5,
  "generationtime_ms": 0.5,
  "utc_offset_seconds": 0,
  "timezone": "UTC",
  "hourly_units": {
    "time": "iso8601",
    "wave_height": "m",
    "wave_direction": "°",
    "wave_period": "s"
  },
  "hourly": {
    "time": ["2026-01-31T00:00", "2026-01-31T01:00"],
    "wave_height": [1.5, 1.6],
    "wave_direction": [180, 185],
    "wave_period": [8.5, 8.7]
  }
}
```

#### 8.1.2 Open-Meteo Weather API

**Purpose:** Atmospheric weather data (temperature, wind, pressure)  
**Base URL:** `https://api.open-meteo.com/v1/forecast`  
**Rate Limit:** 10,000 requests/day  
**Documentation:** https://open-meteo.com/en/docs

**Request Parameters:**
```javascript
const params = {
  latitude: 27.5,
  longitude: -90.5,
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(','),
  daily: [
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
  ].join(','),
  timezone: 'UTC',
  forecast_days: 7,
};
```

#### 8.1.3 USGS Earthquake API

**Purpose:** Global earthquake monitoring  
**Base URL:** `https://earthquake.usgs.gov/fdsnws/event/1/query`  
**Rate Limit:** Unlimited (reasonable use)  
**Documentation:** https://earthquake.usgs.gov/fdsnws/event/1/

**Request Parameters:**
```javascript
const params = {
  format: 'geojson',
  starttime: '2026-01-24',  // 7 days ago
  endtime: '2026-01-31',
  minmagnitude: 4.0,
  latitude: 27.5,           // Optional: center point
  longitude: -90.5,
  maxradiuskm: 500,         // Optional: radius filter
  orderby: 'time',
};
```

**Response Schema (GeoJSON):**
```json
{
  "type": "FeatureCollection",
  "metadata": {
    "generated": 1706745600000,
    "count": 15,
    "title": "USGS Earthquakes"
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": 5.2,
        "place": "120km S of City, Region",
        "time": 1706745600000,
        "updated": 1706746000000,
        "tz": null,
        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/...",
        "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?...",
        "felt": 10,
        "cdi": 4.5,
        "mmi": 4.0,
        "alert": null,
        "status": "reviewed",
        "tsunami": 0,
        "sig": 400,
        "net": "us",
        "code": "abc123",
        "ids": ",usabc123,",
        "sources": ",us,",
        "types": ",origin,phase-data,",
        "nst": 50,
        "dmin": 1.5,
        "rms": 0.8,
        "gap": 60,
        "magType": "mb",
        "type": "earthquake",
        "title": "M 5.2 - 120km S of City"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-90.5, 27.0, 10.0]
      },
      "id": "usabc123"
    }
  ]
}
```

#### 8.1.4 NOAA National Hurricane Center (NHC)

**Purpose:** Atlantic and Eastern Pacific hurricane tracking  
**Base URL:** `https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer`  
**Rate Limit:** Reasonable use  
**Documentation:** https://www.nhc.noaa.gov/gis/

**Key Layers:**
| Layer ID | Name | Content |
|----------|------|---------|
| 6 | Forecast Points | Position + 120hr forecast |
| 7 | Forecast Track | Line geometry |
| 8 | Forecast Cone | Uncertainty polygon |
| 9 | Watches/Warnings | Coastal zones |
| 11 | Past Track | Historical positions |
| 12 | Wind Swath | Wind extent |
| 16 | Forecast Wind Radii | 34/50/64kt radii |

**Example Query:**
```javascript
// Fetch forecast track
const url = `https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/7/query?where=1%3D1&outFields=*&f=geojson`;
```

**Response Schema (Layer 7 - Forecast Track):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "STORMNAME": "MILTON",
        "STORMTYPE": "HU",
        "ADVDATE": "1100 AM EDT Wed Oct 09 2024",
        "ADVISNUM": "15",
        "STORMNUM": 14,
        "FCSTPRD": 120,
        "BASIN": "AL"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[-82.5, 21.0], [-84.0, 24.5], ...]
      }
    }
  ]
}
```

#### 8.1.5 NOAA National Data Buoy Center (NDBC)

**Purpose:** Real-time marine observations from buoys  
**Base URL:** `https://www.ndbc.noaa.gov/data/realtime2/`  
**Rate Limit:** Unlimited  
**Documentation:** https://www.ndbc.noaa.gov/docs/ndbc_web_data_guide.pdf

**Data Format:** Space-delimited text files

**Example Request:**
```javascript
// Standard meteorological data
const url = `https://www.ndbc.noaa.gov/data/realtime2/42001.txt`;

// Spectral wave data
const specUrl = `https://www.ndbc.noaa.gov/data/realtime2/42001.spec`;
```

**Text File Columns (Standard Meteorological):**
```
#YY  MM DD hh mm WDIR WSPD GST  WVHT   DPD   APD MWD   PRES  ATMP  WTMP  DEWP  VIS PTDY  TIDE
#yr  mo dy hr mn degT m/s  m/s     m   sec   sec degT   hPa  degC  degC  degC  nmi  hPa    ft
2026 01 31 12 00  180  8.5 10.2   1.5   8.0   6.0  180 1015.0  22.5  24.0  18.5   MM   MM    MM
```

**Parsing Note:** Values of "MM" indicate missing data.

#### 8.1.6 NOAA CO-OPS Tides and Currents

**Purpose:** Tide predictions, water levels, currents  
**Base URL:** `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`  
**Rate Limit:** 4 days for 1-min data, 31 days for 6-min, 1 year for hourly  
**Documentation:** https://tidesandcurrents.noaa.gov/api/

**Request Parameters:**
```javascript
const params = {
  begin_date: '20260131',
  end_date: '20260201',
  station: '8775870',      // Station ID
  product: 'predictions',   // predictions, water_level, currents, etc.
  datum: 'MLLW',           // Vertical datum
  units: 'metric',
  time_zone: 'gmt',
  format: 'json',
  interval: 'h',           // h=hourly, 6=6-minute, 1=1-minute
};
```

**Response Schema (Predictions):**
```json
{
  "predictions": [
    { "t": "2026-01-31 00:00", "v": "0.152" },
    { "t": "2026-01-31 01:00", "v": "0.305" }
  ]
}
```

#### 8.1.7 NOAA Weather.gov API

**Purpose:** Point forecasts for US locations  
**Base URL:** `https://api.weather.gov`  
**Rate Limit:** Generous (requires User-Agent)  
**Documentation:** https://www.weather.gov/documentation/services-web-api

**Required Header:**
```javascript
const headers = {
  'User-Agent': 'OffshoreWatch (contact@example.com)',
  'Accept': 'application/geo+json',
};
```

**Two-Step Process:**
```javascript
// Step 1: Get forecast grid
const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
const pointData = await fetch(pointUrl, { headers }).then(r => r.json());

// Step 2: Get forecast
const forecastUrl = pointData.properties.forecast;
const forecast = await fetch(forecastUrl, { headers }).then(r => r.json());
```

### 8.2 Optional APIs (User-Provided Key)

#### 8.2.1 Mapbox

**Purpose:** High-quality base maps, satellite imagery, geocoding  
**Free Tier:** 50,000 map loads/month, 100,000 geocoding requests  
**Get Key:** https://account.mapbox.com/

**Usage:**
```javascript
// Map tiles
const mapboxKey = localStorage.getItem('offshorewatch_apikey_mapbox');
const tileUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`;

// Geocoding
const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxKey}`;
```

**Fallback:** OpenStreetMap tiles (no key required)
```javascript
const osmTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
```

#### 8.2.2 OpenWeatherMap (Optional)

**Purpose:** Additional weather data source  
**Free Tier:** 1,000,000 calls/month  
**Get Key:** https://openweathermap.org/api

**Usage:**
```javascript
const owmKey = localStorage.getItem('offshorewatch_apikey_openweather');
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmKey}&units=metric`;
```

### 8.3 API Error Handling

```javascript
// Standard error response structure
const ApiError = {
  code: 'API_ERROR',
  message: 'Human-readable message',
  service: 'openmeteo',
  endpoint: '/v1/marine',
  status: 429,
  retryAfter: 60,
};

// Error codes
const API_ERROR_CODES = {
  NETWORK_ERROR: 'Network connection failed',
  TIMEOUT: 'Request timed out',
  RATE_LIMITED: 'Rate limit exceeded',
  INVALID_KEY: 'API key is invalid',
  INVALID_PARAMS: 'Invalid request parameters',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error',
  CORS_ERROR: 'CORS policy blocked request',
  PARSE_ERROR: 'Failed to parse response',
};
```

### 8.4 API Request Wrapper

```javascript
// services/api/apiClient.js
const apiRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 30000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw {
        code: response.status === 429 ? 'RATE_LIMITED' : 'API_ERROR',
        status: response.status,
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
    
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Request timed out' };
    }
    throw error;
  }
};
```

---

## 9. Data Models & Schemas

### 9.1 Location Model

```typescript
interface Location {
  id: string;                    // UUID
  name: string;                  // "Thunder Horse PDQ"
  latitude: number;              // 28.1234
  longitude: number;             // -88.5678
  region: RegionCode;            // "gom" | "northsea" | "seasia" | etc.
  type: LocationType;            // "platform" | "fpso" | "buoy" | "custom"
  groupId?: string;              // Optional folder/group
  operator?: string;             // "BP"
  waterDepth?: number;           // Meters
  installDate?: string;          // ISO date
  isDefault: boolean;            // Default location flag
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

type RegionCode = 'gom' | 'northsea' | 'seasia' | 'brazil' | 'westafrica' | 'australia' | 'middleeast';
type LocationType = 'platform' | 'fpso' | 'drillship' | 'buoy' | 'port' | 'custom';
```

### 9.2 Weather Data Model

```typescript
interface MarineWeatherData {
  location: {
    latitude: number;
    longitude: number;
  };
  fetchedAt: string;              // ISO timestamp
  source: string;                 // "open-meteo"
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

interface HourlyForecast {
  time: string;                   // ISO timestamp
  waveHeight: number | null;      // meters
  waveDirection: number | null;   // degrees
  wavePeriod: number | null;      // seconds
  swellHeight: number | null;     // meters
  swellDirection: number | null;  // degrees
  swellPeriod: number | null;     // seconds
  windWaveHeight: number | null;  // meters
  windSpeed: number | null;       // m/s
  windDirection: number | null;   // degrees
  windGusts: number | null;       // m/s
  seaSurfaceTemp: number | null;  // celsius
  visibility: number | null;      // km
  currentVelocity: number | null; // m/s
  currentDirection: number | null;// degrees
}

interface DailyForecast {
  date: string;                   // YYYY-MM-DD
  waveHeightMax: number | null;
  windSpeedMax: number | null;
  windGustsMax: number | null;
  temperatureMax: number | null;
  temperatureMin: number | null;
}
```

### 9.3 Storm Data Model

```typescript
interface TropicalStorm {
  id: string;                     // "AL142024" (basin + number + year)
  name: string;                   // "MILTON"
  basin: StormBasin;              // "atlantic" | "epac" | "wpac" | etc.
  type: StormType;                // "TD" | "TS" | "HU" | etc.
  category?: number;              // 1-5 for hurricanes
  currentPosition: {
    latitude: number;
    longitude: number;
    time: string;                 // ISO timestamp
  };
  movement: {
    direction: number;            // degrees
    speed: number;                // knots
  };
  intensity: {
    windSpeed: number;            // knots (1-min sustained)
    pressure: number;             // mb
    windRadii?: WindRadii;
  };
  forecast: StormForecastPoint[];
  pastTrack: StormTrackPoint[];
  advisoryNumber: string;
  advisoryTime: string;
  source: string;                 // "NHC" | "JTWC" | "BOM"
}

type StormBasin = 'atlantic' | 'epac' | 'cpac' | 'wpac' | 'nio' | 'sio' | 'aus' | 'spa';
type StormType = 'TD' | 'TS' | 'HU' | 'TY' | 'STY' | 'TC' | 'EX' | 'SS' | 'SD';

interface WindRadii {
  34kt: QuadrantRadii;            // Tropical storm force
  50kt?: QuadrantRadii;           // Damaging winds
  64kt?: QuadrantRadii;           // Hurricane force
}

interface QuadrantRadii {
  ne: number;                     // nautical miles
  se: number;
  sw: number;
  nw: number;
}

interface StormForecastPoint {
  time: string;                   // ISO timestamp
  hour: number;                   // Forecast hour (0, 12, 24, 36, ...)
  latitude: number;
  longitude: number;
  maxWind: number;                // knots
  windGusts?: number;
  pressure?: number;              // mb
  type: StormType;
}
```

### 9.4 Earthquake Data Model

```typescript
interface Earthquake {
  id: string;                     // USGS event ID
  magnitude: number;
  magnitudeType: string;          // "mb", "ml", "mw"
  location: {
    latitude: number;
    longitude: number;
    depth: number;                // km
  };
  place: string;                  // "120km S of City, Region"
  time: string;                   // ISO timestamp
  updated: string;
  tsunami: boolean;
  felt?: number;                  // Number of felt reports
  cdi?: number;                   // Community intensity
  mmi?: number;                   // Modified Mercalli
  alert?: 'green' | 'yellow' | 'orange' | 'red';
  significance: number;
  url: string;                    // USGS event page
}
```

### 9.5 Operational Threshold Model

```typescript
interface OperationalThresholds {
  helicopterOps: {
    maxWindSpeed: number;         // knots
    maxWindGusts: number;         // knots
    maxWaveHeight: number;        // meters
    minVisibility: number;        // km
    minCeiling: number;           // feet
  };
  craneLift: {
    maxWindSpeed: number;         // knots
    maxWaveHeight: number;        // meters
  };
  divingOps: {
    maxWaveHeight: number;        // meters
    maxCurrentSpeed: number;      // knots
    maxWindSpeed: number;         // knots
  };
  rigMove: {
    maxWindSpeed: number;         // knots
    maxWaveHeight: number;        // meters
    minWindowHours: number;       // Required forecast window
  };
  personnelTransfer: {
    boat: {
      maxWaveHeight: number;      // meters
      maxWindSpeed: number;       // knots
    };
    w2w: {
      maxWaveHeight: number;      // meters
      maxWindSpeed: number;       // knots
    };
  };
}
```

### 9.6 Settings Model

```typescript
interface AppSettings {
  units: {
    windSpeed: 'knots' | 'mph' | 'ms' | 'kmh';
    waveHeight: 'feet' | 'meters';
    temperature: 'fahrenheit' | 'celsius';
    pressure: 'mb' | 'inhg';
    distance: 'nm' | 'km' | 'miles';
  };
  defaultRegion: RegionCode;
  defaultLocationId?: string;
  thresholds: OperationalThresholds;
  display: {
    mapStyle: 'streets' | 'satellite' | 'hybrid';
    showPlatforms: boolean;
    showBuoys: boolean;
    showPipelines: boolean;
    showLeaseBlocks: boolean;
  };
  notifications: {
    weatherAlerts: boolean;
    stormAlerts: boolean;
    seismicAlerts: boolean;
    thresholdAlerts: boolean;
  };
  cache: {
    enableOffline: boolean;
    maxCacheAge: number;          // hours
  };
}
```

---

## 10. Offline Caching Strategy

### 10.1 Cache Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser Storage                    │
├─────────────────────────────────────────────────────┤
│  localStorage (~5MB)                                │
│  ├── Settings, API keys, preferences                │
│  └── Small, frequently accessed data                │
├─────────────────────────────────────────────────────┤
│  IndexedDB (via Dexie.js) (~50MB+)                  │
│  ├── weatherCache: Forecast data                    │
│  ├── stormCache: Hurricane/cyclone data             │
│  ├── seismicCache: Earthquake events                │
│  ├── buoyCache: Buoy observations                   │
│  ├── platformData: Static platform info             │
│  └── mapTiles: Cached map tiles (limited)           │
├─────────────────────────────────────────────────────┤
│  Service Worker Cache (Workbox)                     │
│  ├── Static assets (JS, CSS, images)               │
│  ├── Map tile cache (LRU, 500 tiles)               │
│  └── API response cache (stale-while-revalidate)   │
└─────────────────────────────────────────────────────┘
```

### 10.2 Dexie.js Database Schema

```javascript
// services/cacheService.js
import Dexie from 'dexie';

const db = new Dexie('OffshoreWatchDB');

db.version(1).stores({
  weatherCache: '++id, locationKey, fetchedAt, expiresAt',
  stormCache: '++id, stormId, basin, fetchedAt, expiresAt',
  seismicCache: '++id, eventId, fetchedAt',
  buoyCache: '++id, stationId, fetchedAt, expiresAt',
  platformData: '++id, region, type, fetchedAt',
  locations: '++id, &locationId, name, region',
});

export default db;
```

### 10.3 Cache Duration Strategy

| Data Type | Cache Duration | Refresh Strategy |
|-----------|---------------|------------------|
| Weather Forecast | 15 minutes | Stale-while-revalidate |
| Marine Conditions | 15 minutes | Stale-while-revalidate |
| Storm Tracks | 30 minutes | Force refresh on advisory |
| Earthquake Feed | 5 minutes | Force refresh |
| Buoy Observations | 60 minutes | Stale-while-revalidate |
| Platform Data | 7 days | Background refresh |
| Map Tiles | 30 days | LRU eviction |
| Static Assets | Until update | Precache |

### 10.4 Service Worker Configuration

```javascript
// service-worker.js (Workbox)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Map tiles - CacheFirst with expiration
registerRoute(
  ({ url }) => url.hostname.includes('tile.openstreetmap.org') ||
               url.hostname.includes('api.mapbox.com'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Weather API - StaleWhileRevalidate
registerRoute(
  ({ url }) => url.hostname.includes('open-meteo.com'),
  new StaleWhileRevalidate({
    cacheName: 'weather-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 15 * 60, // 15 minutes
      }),
    ],
  })
);

// Storm/Seismic - NetworkFirst (prefer fresh)
registerRoute(
  ({ url }) => url.hostname.includes('earthquake.usgs.gov') ||
               url.hostname.includes('weather.noaa.gov'),
  new NetworkFirst({
    cacheName: 'critical-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 60, // 30 minutes
      }),
    ],
  })
);
```

### 10.5 Offline Indicators

```jsx
// hooks/useOnlineStatus.js
import { useState, useEffect } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastOnline };
};
```

---

## 11. Error Handling Standards

### 11.1 Error Categories

| Category | HTTP Codes | User Message | Recovery Action |
|----------|------------|--------------|-----------------|
| Network | - | "Unable to connect. Check your internet connection." | Retry, use cached data |
| Rate Limit | 429 | "Too many requests. Please wait a moment." | Auto-retry after delay |
| Auth Error | 401, 403 | "API key invalid or expired. Check settings." | Open settings |
| Not Found | 404 | "Data not available for this location." | Try different location |
| Server Error | 500-599 | "Server temporarily unavailable." | Retry later |
| Parse Error | - | "Error processing data." | Report issue |
| Validation | 400 | "Invalid input. Please check your entries." | Highlight fields |

### 11.2 Error Display Components

```jsx
// components/common/ErrorMessage.jsx
const ErrorMessage = ({ error, onRetry, onDismiss }) => (
  <div className="bg-danger-light border border-danger rounded-lg p-4 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-danger-dark font-medium">{error.title || 'Error'}</p>
      <p className="text-secondary-600 text-sm mt-1">{error.message}</p>
      {error.recoveryHint && (
        <p className="text-secondary-500 text-xs mt-2">{error.recoveryHint}</p>
      )}
    </div>
    <div className="flex gap-2">
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-primary-600 hover:text-primary-700">
          Retry
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="text-secondary-400 hover:text-secondary-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
```

### 11.3 API Key Validation Feedback

```jsx
// components/settings/ApiKeyValidator.jsx
const ApiKeyValidator = ({ service, apiKey, onValidate }) => {
  const [status, setStatus] = useState('idle'); // idle, validating, valid, invalid
  const [error, setError] = useState(null);

  const validate = async () => {
    setStatus('validating');
    try {
      const isValid = await validateApiKey(service, apiKey);
      setStatus(isValid ? 'valid' : 'invalid');
      setError(isValid ? null : 'Invalid API key');
    } catch (e) {
      setStatus('invalid');
      setError('Could not validate key');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status === 'idle' && <span className="text-secondary-400">Not validated</span>}
      {status === 'validating' && <Loader className="w-4 h-4 animate-spin text-primary-500" />}
      {status === 'valid' && <CheckCircle className="w-4 h-4 text-success" />}
      {status === 'invalid' && (
        <>
          <XCircle className="w-4 h-4 text-danger" />
          <span className="text-danger text-sm">{error}</span>
        </>
      )}
      <button onClick={validate} className="text-sm text-primary-600">
        {status === 'idle' ? 'Validate' : 'Re-validate'}
      </button>
    </div>
  );
};
```

---

## 12. Performance Requirements

### 12.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Main content visible |
| **FID** (First Input Delay) | < 100ms | Interactivity |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |
| **TTI** (Time to Interactive) | < 5s | Full interactivity |
| **FCP** (First Contentful Paint) | < 1.5s | First render |

### 12.2 Bundle Size Targets

| Bundle | Target Size (gzipped) |
|--------|----------------------|
| Main bundle | < 200KB |
| Vendor bundle | < 250KB |
| Map components (lazy) | < 100KB |
| Chart components (lazy) | < 80KB |
| Total initial | < 500KB |

### 12.3 API Response Handling

```javascript
// Timeout configuration
const API_TIMEOUTS = {
  weather: 15000,    // 15 seconds
  storm: 20000,      // 20 seconds
  seismic: 10000,    // 10 seconds
  buoy: 15000,       // 15 seconds
  platform: 30000,   // 30 seconds (large dataset)
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,   // 1 second
  maxDelay: 10000,   // 10 seconds
  backoffFactor: 2,
};
```

### 12.4 Lazy Loading Strategy

```javascript
// Lazy load heavy components
const MapPage = lazy(() => import('./pages/MapPage'));
const StormTrackerPage = lazy(() => import('./pages/StormTrackerPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/map" element={<MapPage />} />
    <Route path="/storms" element={<StormTrackerPage />} />
    <Route path="/reports" element={<ReportsPage />} />
  </Routes>
</Suspense>
```

---

## 13. Testing Requirements

### 13.1 Test Coverage Targets

| Category | Target Coverage |
|----------|-----------------|
| Utility functions | 90% |
| API services | 80% |
| Custom hooks | 80% |
| Components | 70% |
| Integration | 60% |

### 13.2 Test Categories

| Type | Tools | Focus |
|------|-------|-------|
| Unit Tests | Vitest | Utils, services, hooks |
| Component Tests | Vitest + Testing Library | React components |
| Integration Tests | Vitest + MSW | API integration |
| E2E Tests | Playwright (optional) | Critical user flows |

### 13.3 Mock Data Requirements

```javascript
// __mocks__/weatherData.js
export const mockMarineWeather = {
  latitude: 27.5,
  longitude: -90.5,
  hourly: {
    time: ['2026-01-31T00:00', '2026-01-31T01:00'],
    wave_height: [1.5, 1.6],
    wave_direction: [180, 185],
    wind_speed_10m: [8.5, 9.0],
  },
};

export const mockStormData = {
  id: 'AL142024',
  name: 'MILTON',
  type: 'HU',
  category: 5,
  // ...
};
```

---

## 14. Deployment Configuration

### 14.1 GitHub Pages Setup

**Repository Settings:**
1. Enable GitHub Pages in repository settings
2. Source: Deploy from branch (main or gh-pages)
3. Root folder: `/dist` or use GitHub Actions

### 14.2 Vite Configuration for GitHub Pages

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/offshorewatch/', // Repository name
  build: {
    outDir: 'dist',
    sourcemap: false,
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
});
```

### 14.3 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

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

### 14.4 HashRouter Configuration

```jsx
// src/App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/map" element={<MapPage />} />
        {/* ... other routes */}
      </Routes>
    </HashRouter>
  );
}
```

**URL Format:**
- Development: `http://localhost:5173/#/weather`
- Production: `https://username.github.io/offshorewatch/#/weather`

### 14.5 Environment Configuration

```javascript
// src/utils/config.js
export const config = {
  appName: 'OffshoreWatch',
  version: '1.0.0',
  basePath: import.meta.env.BASE_URL || '/',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
```

---

## 15. Industry References & Sources

### 15.1 Regional Production Data

| Region | Source | URL |
|--------|--------|-----|
| Gulf of Mexico | U.S. EIA | https://www.eia.gov/petroleum/drilling/pdf/gulf_summary.pdf |
| Gulf of Mexico | BOEM | https://www.boem.gov/oil-gas-energy/leasing/gulf-mexico-energy-security-act |
| North Sea (Norway) | Norwegian Petroleum | https://www.norskpetroleum.no/en/facts/field/ |
| North Sea (Norway) | U.S. EIA | https://www.eia.gov/international/content/analysis/countries_long/norway/ |
| Southeast Asia | Global Business Reports | https://www.gbreports.com/article/southeast-asias-upstream-oil-and-gas |
| Brazil Pre-salt | Enverus | https://www.enverus.com/solutions/energy-analytics/ep/prism/global/pre-salt-brazil/ |
| West Africa | Energy Capital & Power | https://energycapitalpower.com/west-africas-oil-and-gas-sector-key-highlights-of-2024/ |
| Australia | Woodside Energy | https://www.woodside.com/what-we-do/operations/bass-strait |
| Middle East | Oil & Gas Middle East | https://www.oilandgasmiddleeast.com/news/top-10-oil-producing-fields-in-the-middle-east |
| Persian Gulf | Institute for Energy Research | https://www.instituteforenergyresearch.org/fossil-fuels/gas-and-oil/persian-gulf-oil-exports-and-the-strait-of-hormuz/ |

### 15.2 Weather & Environmental APIs

| API | Provider | Documentation |
|-----|----------|---------------|
| Open-Meteo Marine | Open-Meteo | https://open-meteo.com/en/docs/marine-weather-api |
| Open-Meteo Weather | Open-Meteo | https://open-meteo.com/en/docs |
| USGS Earthquake | USGS | https://earthquake.usgs.gov/fdsnws/event/1/ |
| NOAA CO-OPS | NOAA | https://api.tidesandcurrents.noaa.gov/api/prod/ |
| NOAA NDBC | NOAA | https://www.ndbc.noaa.gov/ |
| NHC Hurricane | NOAA NHC | https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer |

### 15.3 Infrastructure Data Sources

| Region | Source | URL |
|--------|--------|-----|
| GOM Platforms | BOEM | https://www.data.boem.gov/Main/Platform.aspx |
| Norway Fields | NPD/Sodir | https://www.sodir.no/en/facts/data-and-analyses/open-data/ |
| UK Offshore | NSTA | https://open-data-ukcs-transition.hub.arcgis.com/ |
| Australia | NOPTA | https://www.nopta.gov.au/maps-and-public-data/nopims-info.html |
| Global Oil/Gas | EDF OGIM | https://developers.google.com/earth-engine/datasets/catalog/EDF_OGIM_current |

### 15.4 Safety Standards & Thresholds

| Standard | Organization | Reference |
|----------|--------------|-----------|
| Helicopter Operations | UK CAA | CAP 437, Edition 9, February 2023 |
| Offshore Diving | IMCA | IMCA D014 Rev 3.1 |
| Crane Operations | ISO | ISO 4302:2016 |
| Rig Towing | IMO | Guidelines for Safe Ocean Towing |

**Threshold References:**
- Helicopter wind limits: PPRuNe Forums (https://www.pprune.org/archive/index.php/t-606250.html)
- CAP 437 standards: WISE Group (https://wisegroupsystems.com/cap-437-standards-for-offshore-helicopter-landing-areas/)
- Crane wind limits: Scarlet Tech (https://scarlet-tech.com/how-does-wind-influence-crane-safety/), Windcrane (https://www.windcrane.com/anemometer-wind-crane)
- Diving standards: IMCA D014 (https://www.mds.uy/media/attachments/2022/08/05/imca_international_code_of_practice_for.pdf)

### 15.5 Technical Libraries

| Library | Purpose | Documentation |
|---------|---------|---------------|
| Leaflet | Mapping | https://leafletjs.com/ |
| deck.gl | Large-scale visualization | https://deck.gl/ |
| leaflet-velocity | Wind/current animation | https://github.com/onaci/leaflet-velocity |
| Dexie.js | IndexedDB wrapper | https://dexie.org/ |
| Workbox | Service worker | https://developer.chrome.com/docs/workbox/ |

### 15.6 Economic & Safety Statistics

| Statistic | Source |
|-----------|--------|
| Offshore downtime costs | GE/Kimberlite Study, Innovapptive 2024 |
| Hurricane production impacts | NOAA NHC, BSEE |
| Safety incident rates | IOGP Global Safety Statistics 2024 |
| North Sea safety | UK HSE Offshore Statistics |
| Digital transformation ROI | McKinsey Energy Insights |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-31 | Claude | Initial comprehensive PRD |

---

*End of Product Requirements Document*
