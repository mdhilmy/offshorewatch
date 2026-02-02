export const conversions = {
  // Wind speed
  msToKnots: (ms) => ms * 1.94384,
  knotsToMs: (kt) => kt / 1.94384,
  knotsToMph: (kt) => kt * 1.15078,
  mphToKnots: (mph) => mph / 1.15078,
  msToKmh: (ms) => ms * 3.6,
  kmhToMs: (kmh) => kmh / 3.6,

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

export const UNIT_LABELS = {
  windSpeed: {
    knots: 'kt',
    mph: 'mph',
    ms: 'm/s',
    kmh: 'km/h',
  },
  waveHeight: {
    meters: 'm',
    feet: 'ft',
  },
  temperature: {
    celsius: '°C',
    fahrenheit: '°F',
  },
  distance: {
    km: 'km',
    miles: 'mi',
    nm: 'NM',
  },
  pressure: {
    mb: 'mb',
    inhg: 'inHg',
  },
};

export const formatValue = (value, unit, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return `${Number(value).toFixed(decimals)} ${unit}`;
};

export const formatWithUnit = (value, unitType, unitSystem = 'metric', decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';

  let convertedValue = value;
  let unit = '';

  switch (unitType) {
    case 'windSpeed':
      if (unitSystem === 'knots') {
        unit = UNIT_LABELS.windSpeed.knots;
      } else if (unitSystem === 'mph') {
        convertedValue = conversions.msToKmh(value) * 0.621371;
        unit = UNIT_LABELS.windSpeed.mph;
      } else {
        unit = UNIT_LABELS.windSpeed.ms;
      }
      break;

    case 'waveHeight':
      if (unitSystem === 'imperial') {
        convertedValue = conversions.metersToFeet(value);
        unit = UNIT_LABELS.waveHeight.feet;
      } else {
        unit = UNIT_LABELS.waveHeight.meters;
      }
      break;

    case 'temperature':
      if (unitSystem === 'fahrenheit') {
        convertedValue = conversions.celsiusToFahrenheit(value);
        unit = UNIT_LABELS.temperature.fahrenheit;
      } else {
        unit = UNIT_LABELS.temperature.celsius;
      }
      break;

    default:
      unit = '';
  }

  return `${convertedValue.toFixed(decimals)} ${unit}`;
};
