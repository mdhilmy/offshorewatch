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
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}app_state`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, isOnline: navigator.onLine };
      }
    } catch (e) {
      console.error('Failed to load app state:', e);
    }
    return init;
  });

  useEffect(() => {
    try {
      const { isOnline, ...persistable } = state;
      localStorage.setItem(`${STORAGE_PREFIX}app_state`, JSON.stringify(persistable));
    } catch (e) {
      console.error('Failed to save app state:', e);
    }
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
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
