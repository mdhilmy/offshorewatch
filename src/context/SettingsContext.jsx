import { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_PREFIX } from '../utils/constants';
import { DEFAULT_THRESHOLDS } from '../utils/thresholds';

const SettingsContext = createContext(null);

const defaultSettings = {
  units: {
    windSpeed: 'knots',
    waveHeight: 'meters',
    temperature: 'celsius',
    distance: 'km',
  },
  thresholds: DEFAULT_THRESHOLDS,
  display: {
    mapStyle: 'streets',
    showPlatforms: true,
    showBuoys: true,
    showStorms: true,
  },
  notifications: {
    weatherAlerts: true,
    stormAlerts: true,
    seismicAlerts: true,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_UNITS':
      return { ...state, units: { ...state.units, ...action.payload } };
    case 'UPDATE_THRESHOLDS':
      return { ...state, thresholds: { ...state.thresholds, ...action.payload } };
    case 'UPDATE_DISPLAY':
      return { ...state, display: { ...state.display, ...action.payload } };
    case 'UPDATE_NOTIFICATIONS':
      return { ...state, notifications: { ...state.notifications, ...action.payload } };
    case 'RESET_SETTINGS':
      return defaultSettings;
    default:
      return state;
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, (init) => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return init;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
