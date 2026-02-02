import { API_ENDPOINTS } from '../../utils/constants';

export const fetchRecentEarthquakes = async (options = {}) => {
  const {
    minMagnitude = 4.0,
    days = 7,
    latitude,
    longitude,
    radiusKm = 500,
    limit = 100,
  } = options;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startDate.toISOString().split('T')[0],
    minmagnitude: minMagnitude.toString(),
    orderby: 'time',
    limit: limit.toString(),
  });

  if (latitude && longitude) {
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());
    params.append('maxradiuskm', radiusKm.toString());
  }

  const response = await fetch(`${API_ENDPOINTS.USGS_EARTHQUAKE}?${params}`, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
  }

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
      updated: new Date(f.properties.updated).toISOString(),
      location: {
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        depth: f.geometry.coordinates[2],
      },
      tsunami: f.properties.tsunami === 1,
      type: f.properties.type,
      status: f.properties.status,
      url: f.properties.url,
      felt: f.properties.felt,
      cdi: f.properties.cdi,
      mmi: f.properties.mmi,
      alert: f.properties.alert,
      sig: f.properties.sig,
    })),
  };
};

export const getMagnitudeColor = (magnitude) => {
  if (magnitude < 4.0) return '#93c5fd'; // minor
  if (magnitude < 5.0) return '#86efac'; // light
  if (magnitude < 6.0) return '#fde047'; // moderate
  if (magnitude < 7.0) return '#fb923c'; // strong
  if (magnitude < 8.0) return '#f87171'; // major
  return '#dc2626'; // great
};

export const getMagnitudeLabel = (magnitude) => {
  if (magnitude < 4.0) return 'Minor';
  if (magnitude < 5.0) return 'Light';
  if (magnitude < 6.0) return 'Moderate';
  if (magnitude < 7.0) return 'Strong';
  if (magnitude < 8.0) return 'Major';
  return 'Great';
};
