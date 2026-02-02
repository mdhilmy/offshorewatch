import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { conversions, UNIT_LABELS } from '../utils/units';

/**
 * Hook that provides unit-aware value formatting based on user settings.
 *
 * Open-Meteo base units:
 *   - windSpeed: km/h
 *   - waveHeight: meters
 *   - temperature: °C
 *   - visibility: meters
 *   - pressure: hPa
 *
 * Buoy (NDBC) base units:
 *   - windSpeed: m/s
 *   - waveHeight: meters
 *   - temperature: °C
 *   - pressure: hPa
 */
export const useUnits = () => {
  const { settings } = useSettings();
  const { units } = settings;

  /**
   * Format wind speed from km/h (Open-Meteo default) to the user's preferred unit.
   */
  const formatWind = useCallback((kmh, decimals = 1) => {
    if (kmh == null || isNaN(kmh)) return 'N/A';
    let value = kmh;
    let unit = 'km/h';

    switch (units.windSpeed) {
      case 'knots':
        value = kmh / 1.852;
        unit = UNIT_LABELS.windSpeed.knots;
        break;
      case 'mph':
        value = kmh / 1.60934;
        unit = UNIT_LABELS.windSpeed.mph;
        break;
      case 'ms':
        value = kmh / 3.6;
        unit = UNIT_LABELS.windSpeed.ms;
        break;
      case 'kmh':
      default:
        unit = UNIT_LABELS.windSpeed.kmh || 'km/h';
        break;
    }
    return `${value.toFixed(decimals)} ${unit}`;
  }, [units.windSpeed]);

  /**
   * Format wind speed from m/s (NDBC default) to the user's preferred unit.
   */
  const formatWindMs = useCallback((ms, decimals = 1) => {
    if (ms == null || isNaN(ms)) return 'N/A';
    const kmh = ms * 3.6;
    return formatWind(kmh, decimals);
  }, [formatWind]);

  /**
   * Format wave height from meters to the user's preferred unit.
   */
  const formatWave = useCallback((meters, decimals = 1) => {
    if (meters == null || isNaN(meters)) return 'N/A';
    let value = meters;
    let unit = UNIT_LABELS.waveHeight.meters;

    if (units.waveHeight === 'feet') {
      value = conversions.metersToFeet(meters);
      unit = UNIT_LABELS.waveHeight.feet;
    }
    return `${value.toFixed(decimals)} ${unit}`;
  }, [units.waveHeight]);

  /**
   * Format temperature from Celsius to the user's preferred unit.
   */
  const formatTemp = useCallback((celsius, decimals = 1) => {
    if (celsius == null || isNaN(celsius)) return 'N/A';
    let value = celsius;
    let unit = UNIT_LABELS.temperature.celsius;

    if (units.temperature === 'fahrenheit') {
      value = conversions.celsiusToFahrenheit(celsius);
      unit = UNIT_LABELS.temperature.fahrenheit;
    }
    return `${value.toFixed(decimals)} ${unit}`;
  }, [units.temperature]);

  /**
   * Format visibility from meters to the user's preferred distance unit.
   */
  const formatVisibility = useCallback((meters, decimals = 0) => {
    if (meters == null || isNaN(meters)) return 'N/A';
    let value = meters / 1000; // base km
    let unit = 'km';

    switch (units.distance) {
      case 'miles':
        value = (meters / 1000) / 1.60934;
        unit = 'mi';
        break;
      case 'nm':
        value = (meters / 1000) / 1.852;
        unit = 'NM';
        break;
      default:
        break;
    }
    return `${value.toFixed(decimals)} ${unit}`;
  }, [units.distance]);

  /**
   * Format pressure (always hPa, no conversion needed for now).
   */
  const formatPressure = useCallback((hpa, decimals = 0) => {
    if (hpa == null || isNaN(hpa)) return 'N/A';
    return `${hpa.toFixed(decimals)} hPa`;
  }, []);

  /**
   * Get the current unit label for a given measurement type.
   */
  const getWindUnit = useCallback(() => {
    const map = { knots: 'kt', mph: 'mph', ms: 'm/s', kmh: 'km/h' };
    return map[units.windSpeed] || 'km/h';
  }, [units.windSpeed]);

  const getWaveUnit = useCallback(() => {
    return units.waveHeight === 'feet' ? 'ft' : 'm';
  }, [units.waveHeight]);

  const getTempUnit = useCallback(() => {
    return units.temperature === 'fahrenheit' ? '°F' : '°C';
  }, [units.temperature]);

  /**
   * Convert a raw wind speed value (km/h) to the user's unit (numeric only).
   */
  const convertWind = useCallback((kmh) => {
    if (kmh == null) return null;
    switch (units.windSpeed) {
      case 'knots': return kmh / 1.852;
      case 'mph': return kmh / 1.60934;
      case 'ms': return kmh / 3.6;
      default: return kmh;
    }
  }, [units.windSpeed]);

  /**
   * Convert wind from m/s to the user's unit (numeric only).
   */
  const convertWindMs = useCallback((ms) => {
    if (ms == null) return null;
    return convertWind(ms * 3.6);
  }, [convertWind]);

  const convertWave = useCallback((meters) => {
    if (meters == null) return null;
    return units.waveHeight === 'feet' ? conversions.metersToFeet(meters) : meters;
  }, [units.waveHeight]);

  const convertTemp = useCallback((celsius) => {
    if (celsius == null) return null;
    return units.temperature === 'fahrenheit' ? conversions.celsiusToFahrenheit(celsius) : celsius;
  }, [units.temperature]);

  return {
    formatWind,
    formatWindMs,
    formatWave,
    formatTemp,
    formatVisibility,
    formatPressure,
    getWindUnit,
    getWaveUnit,
    getTempUnit,
    convertWind,
    convertWindMs,
    convertWave,
    convertTemp,
  };
};
