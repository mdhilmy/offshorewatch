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

  const response = await fetch(`${API_ENDPOINTS.OPEN_METEO_MARINE}?${params}`, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Marine API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return transformMarineData(data);
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

  const response = await fetch(`${API_ENDPOINTS.OPEN_METEO_WEATHER}?${params}`, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return transformWeatherData(data);
};

export const fetchCombinedWeather = async (latitude, longitude, days = 7) => {
  try {
    const [marine, atmospheric] = await Promise.all([
      fetchMarineWeather(latitude, longitude, days),
      fetchAtmosphericWeather(latitude, longitude, days),
    ]);

    return {
      location: { latitude, longitude },
      fetchedAt: new Date().toISOString(),
      source: 'open-meteo',
      hourly: marine.hourly.map((hour, i) => ({
        ...hour,
        ...atmospheric.hourly[i],
      })),
      daily: {
        marine: marine.daily,
        atmospheric: atmospheric.daily,
      },
    };
  } catch (error) {
    console.error('Combined weather fetch error:', error);
    throw error;
  }
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
