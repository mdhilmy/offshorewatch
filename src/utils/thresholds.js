export const DEFAULT_THRESHOLDS = {
  helicopterOps: {
    name: 'Helicopter Operations',
    maxWindSpeed: 35,      // knots
    maxWindGusts: 45,      // knots
    maxWaveHeight: 2.4,    // meters (8 ft)
    minVisibility: 4.8,    // km (3 mi)
    minCeiling: 305,       // meters (1000 ft)
  },
  craneLift: {
    name: 'Crane Lift',
    maxWindSpeed: 20,      // knots
    maxWaveHeight: 1.8,    // meters (6 ft)
  },
  divingOps: {
    name: 'Diving Operations',
    maxWaveHeight: 2.5,    // meters
    maxCurrentSpeed: 1.5,  // knots
    maxWindSpeed: 21,      // knots (Beaufort 5)
  },
  rigMove: {
    name: 'Rig Move',
    maxWindSpeed: 15,      // knots
    maxWaveHeight: 1.2,    // meters (4 ft)
    minWindowHours: 12,    // hours
  },
  personnelTransfer: {
    name: 'Personnel Transfer',
    boat: {
      maxWaveHeight: 2.0,  // meters
      maxWindSpeed: 25,    // knots
    },
    w2w: {
      maxWaveHeight: 3.0,  // meters
      maxWindSpeed: 38,    // knots
    },
  },
};

export const getThresholdStatus = (value, threshold, inverse = false) => {
  if (value === null || value === undefined) return 'unknown';

  if (inverse) {
    // For inverse checks (e.g., visibility - higher is better)
    if (value >= threshold) return 'safe';
    if (value >= threshold * 0.8) return 'caution';
    return 'exceeded';
  }

  // For normal checks (e.g., wind speed - lower is better)
  if (value <= threshold * 0.7) return 'safe';
  if (value <= threshold) return 'caution';
  return 'exceeded';
};

export const getStatusColor = (status) => {
  const colors = {
    safe: 'text-green-700 bg-green-50 border-green-200',
    caution: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    exceeded: 'text-red-700 bg-red-50 border-red-200',
    unknown: 'text-gray-700 bg-gray-50 border-gray-200',
  };
  return colors[status] || colors.unknown;
};
