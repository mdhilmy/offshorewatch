import { API_ENDPOINTS } from '../../utils/constants';

export const fetchActiveStorms = async () => {
  try {
    const url = `${API_ENDPOINTS.NHC_STORM}/7/query?where=1%3D1&outFields=*&f=geojson`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`NHC API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return {
        storms: [],
        fetchedAt: new Date().toISOString(),
        source: 'nhc',
      };
    }

    return {
      storms: data.features.map((f) => ({
        id: `${f.properties.BASIN || 'UNK'}${f.properties.STORMNUM || '00'}`,
        name: f.properties.STORMNAME || 'Unknown',
        basin: getBasinName(f.properties.BASIN),
        type: f.properties.STORMTYPE || 'Unknown',
        category: getCategory(f.properties.STORMTYPE, f.properties.MAXWIND),
        advisoryNumber: f.properties.ADVISNUM,
        movement: {
          direction: f.properties.MOVEMENTDIR || null,
          speed: f.properties.MOVEMENTSPD || null,
        },
        intensity: {
          windSpeed: f.properties.MAXWIND || null,
          pressure: f.properties.MINPRES || null,
        },
        coordinates: f.geometry.coordinates,
        geometry: f.geometry,
      })),
      fetchedAt: new Date().toISOString(),
      source: 'nhc',
    };
  } catch (error) {
    console.error('NHC storm fetch error:', error);
    // Return empty storms instead of throwing to allow graceful degradation
    return {
      storms: [],
      fetchedAt: new Date().toISOString(),
      source: 'nhc',
      error: error.message,
    };
  }
};

const getBasinName = (basinCode) => {
  const basins = {
    AL: 'atlantic',
    EP: 'epac',
    CP: 'cpac',
    WP: 'wpac',
    IO: 'nio',
    SH: 'aus',
  };
  return basins[basinCode] || basinCode;
};

const getCategory = (type, windSpeed) => {
  if (type === 'TD') return 0; // Tropical Depression
  if (type === 'TS') return 0; // Tropical Storm
  if (!windSpeed) return null;

  // Saffir-Simpson scale (in knots)
  if (windSpeed >= 137) return 5; // Cat 5: 157+ mph (137+ kt)
  if (windSpeed >= 113) return 4; // Cat 4: 130-156 mph (113-136 kt)
  if (windSpeed >= 96) return 3;  // Cat 3: 111-129 mph (96-112 kt)
  if (windSpeed >= 83) return 2;  // Cat 2: 96-110 mph (83-95 kt)
  if (windSpeed >= 64) return 1;  // Cat 1: 74-95 mph (64-82 kt)

  return 0;
};

export const getStormCategoryColor = (category, type) => {
  if (type === 'TD') return '#60a5fa'; // Tropical Depression
  if (type === 'TS') return '#34d399'; // Tropical Storm

  const colors = {
    1: '#fbbf24',
    2: '#f97316',
    3: '#ef4444',
    4: '#dc2626',
    5: '#7f1d1d',
  };

  return colors[category] || '#94a3b8';
};

export const getStormCategoryLabel = (category, type) => {
  if (type === 'TD') return 'Tropical Depression';
  if (type === 'TS') return 'Tropical Storm';
  if (category === null || category === 0) return 'Tropical System';

  return `Category ${category} Hurricane`;
};
