import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Fetch real-time buoy data from NOAA NDBC.
 * NDBC serves text files (not JSON), so we parse the fixed-width format.
 * Note: NDBC data is served from .txt files that may have CORS issues.
 * We use a CORS proxy fallback if the direct request fails.
 */

const CORS_PROXY = 'https://corsproxy.io/?';

export const fetchBuoyData = async (stationId) => {
  const url = `${API_ENDPOINTS.NDBC_BUOY}/${stationId}.txt`;

  let text;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`NDBC error: ${response.status}`);
    text = await response.text();
  } catch {
    // Try CORS proxy as fallback
    try {
      const proxyResponse = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!proxyResponse.ok) throw new Error(`Proxy error: ${proxyResponse.status}`);
      text = await proxyResponse.text();
    } catch (proxyError) {
      throw new Error(`Unable to fetch buoy ${stationId} data. NDBC may be temporarily unavailable.`);
    }
  }

  return parseNdbcData(stationId, text);
};

/**
 * Parse NDBC standard meteorological data format.
 * Format: https://www.ndbc.noaa.gov/faq/measdes.shtml
 * Columns: #YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
 */
const parseNdbcData = (stationId, text) => {
  const lines = text.trim().split('\n');
  if (lines.length < 3) {
    throw new Error(`No data available for buoy ${stationId}`);
  }

  // First line: header with field names
  // Second line: units
  // Data lines start at index 2
  const headers = lines[0].replace('#', '').trim().split(/\s+/);
  const observations = [];

  for (let i = 2; i < Math.min(lines.length, 50); i++) {
    const values = lines[i].trim().split(/\s+/);
    if (values.length < 10) continue;

    const year = values[0];
    const month = values[1];
    const day = values[2];
    const hour = values[3];
    const minute = values[4];

    const obs = {
      time: `${year}-${month}-${day}T${hour}:${minute}:00Z`,
      windDirection: parseNdbcValue(values[5]),   // WDIR (degrees)
      windSpeed: parseNdbcValue(values[6]),       // WSPD (m/s)
      windGusts: parseNdbcValue(values[7]),       // GST (m/s)
      waveHeight: parseNdbcValue(values[8]),      // WVHT (m)
      dominantPeriod: parseNdbcValue(values[9]),  // DPD (sec)
      averagePeriod: parseNdbcValue(values[10]),  // APD (sec)
      meanWaveDir: parseNdbcValue(values[11]),    // MWD (degrees)
      pressure: parseNdbcValue(values[12]),       // PRES (hPa)
      airTemp: parseNdbcValue(values[13]),        // ATMP (°C)
      waterTemp: parseNdbcValue(values[14]),      // WTMP (°C)
      dewpoint: parseNdbcValue(values[15]),       // DEWP (°C)
      visibility: parseNdbcValue(values[16]),     // VIS (nmi)
    };

    observations.push(obs);
  }

  return {
    stationId,
    fetchedAt: new Date().toISOString(),
    source: 'ndbc',
    observations,
    latest: observations[0] || null,
  };
};

/**
 * NDBC uses 'MM' or '99.0'/'999.0' for missing values
 */
const parseNdbcValue = (val) => {
  if (!val || val === 'MM' || val === '99.0' || val === '99.00' || val === '999' || val === '999.0' || val === '9999.0') {
    return null;
  }
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

/**
 * Get a list of popular NDBC buoy stations by region.
 */
export const getNdbcStations = (regionId) => {
  const stations = {
    gom: [
      { id: '42001', name: 'Mid Gulf - 250 NM SSW of Southwest Pass, LA', lat: 25.888, lon: -89.658 },
      { id: '42002', name: 'West Gulf - 207 NM ESE of Brownsville, TX', lat: 25.790, lon: -93.666 },
      { id: '42003', name: 'East Gulf - 265 NM S of Panama City, FL', lat: 25.925, lon: -85.612 },
      { id: '42019', name: 'Freeport, TX - 60 NM S', lat: 27.913, lon: -95.352 },
      { id: '42020', name: 'Corpus Christi, TX - 50 NM SE', lat: 26.966, lon: -96.694 },
      { id: '42035', name: 'Galveston, TX - 22 NM E', lat: 29.232, lon: -94.413 },
      { id: '42036', name: 'West Tampa, FL - 112 NM WNW', lat: 28.500, lon: -84.517 },
      { id: '42039', name: 'Pensacola, FL - 115 NM SSE', lat: 28.791, lon: -86.008 },
      { id: '42040', name: 'Luke Island, LA', lat: 29.185, lon: -88.226 },
    ],
    northsea: [
      { id: '62105', name: 'K13 Platform (Netherlands)', lat: 53.22, lon: 3.22 },
    ],
  };
  return stations[regionId] || stations.gom;
};
