/**
 * Calculate weather windows for a given operation type based on forecast data and thresholds.
 */
export const calculateWeatherWindows = (hourlyData, thresholds, operationType) => {
  if (!hourlyData?.length || !thresholds) return [];

  const limits = getOperationLimits(thresholds, operationType);
  if (!limits) return [];

  const windows = [];
  let currentWindow = null;

  hourlyData.forEach((hour, index) => {
    const isSafe = checkConditions(hour, limits);

    if (isSafe && !currentWindow) {
      currentWindow = {
        startTime: hour.time,
        startIndex: index,
        conditions: [],
      };
    }

    if (currentWindow) {
      currentWindow.conditions.push({
        time: hour.time,
        waveHeight: hour.waveHeight,
        windSpeed: hour.windSpeed,
        windGusts: hour.windGusts,
        visibility: hour.visibility,
      });
    }

    if (!isSafe && currentWindow) {
      currentWindow.endTime = hourlyData[index - 1]?.time || hour.time;
      currentWindow.durationHours = index - currentWindow.startIndex;
      windows.push(currentWindow);
      currentWindow = null;
    }
  });

  // Close window at end of forecast
  if (currentWindow) {
    currentWindow.endTime = hourlyData[hourlyData.length - 1].time;
    currentWindow.durationHours = hourlyData.length - currentWindow.startIndex;
    windows.push(currentWindow);
  }

  return windows;
};

const getOperationLimits = (thresholds, operationType) => {
  switch (operationType) {
    case 'helicopterOps':
      return {
        maxWindSpeed: thresholds.helicopterOps?.maxWindSpeed,
        maxWaveHeight: thresholds.helicopterOps?.maxWaveHeight,
        minVisibility: thresholds.helicopterOps?.minVisibility,
      };
    case 'craneLift':
      return {
        maxWindSpeed: thresholds.craneLift?.maxWindSpeed,
        maxWaveHeight: thresholds.craneLift?.maxWaveHeight,
      };
    case 'divingOps':
      return {
        maxWaveHeight: thresholds.divingOps?.maxWaveHeight,
        maxWindSpeed: thresholds.divingOps?.maxWindSpeed,
      };
    case 'rigMove':
      return {
        maxWindSpeed: thresholds.rigMove?.maxWindSpeed,
        maxWaveHeight: thresholds.rigMove?.maxWaveHeight,
      };
    case 'personnelTransferBoat':
      return {
        maxWindSpeed: thresholds.personnelTransfer?.boat?.maxWindSpeed,
        maxWaveHeight: thresholds.personnelTransfer?.boat?.maxWaveHeight,
      };
    case 'personnelTransferW2W':
      return {
        maxWindSpeed: thresholds.personnelTransfer?.w2w?.maxWindSpeed,
        maxWaveHeight: thresholds.personnelTransfer?.w2w?.maxWaveHeight,
      };
    default:
      return null;
  }
};

const checkConditions = (conditions, limits) => {
  // Wind speed: Open-Meteo returns km/h, thresholds are in knots
  // Convert km/h to knots for comparison
  if (limits.maxWindSpeed != null && conditions.windSpeed != null) {
    const windKnots = conditions.windSpeed * 0.539957; // km/h to knots
    if (windKnots > limits.maxWindSpeed) return false;
  }

  if (limits.maxWaveHeight != null && conditions.waveHeight != null) {
    if (conditions.waveHeight > limits.maxWaveHeight) return false;
  }

  // Visibility: Open-Meteo returns meters, thresholds are in km
  if (limits.minVisibility != null && conditions.visibility != null) {
    const visKm = conditions.visibility / 1000;
    if (visKm < limits.minVisibility) return false;
  }

  return true;
};

/**
 * Get a summary of all operation statuses based on current conditions.
 */
export const getOperationSummary = (currentConditions, thresholds) => {
  if (!currentConditions || !thresholds) return [];

  const operations = [
    { key: 'helicopterOps', name: 'Helicopter Operations', icon: '🚁' },
    { key: 'craneLift', name: 'Crane Lift', icon: '🏗️' },
    { key: 'divingOps', name: 'Diving Operations', icon: '🤿' },
    { key: 'rigMove', name: 'Rig Move', icon: '🚢' },
    { key: 'personnelTransferBoat', name: 'Personnel Transfer (Boat)', icon: '⛴️' },
    { key: 'personnelTransferW2W', name: 'Personnel Transfer (W2W)', icon: '🔄' },
  ];

  return operations.map((op) => {
    const limits = getOperationLimits(thresholds, op.key);
    const isSafe = limits ? checkConditions(currentConditions, limits) : null;
    return {
      ...op,
      status: isSafe === null ? 'unknown' : isSafe ? 'go' : 'no-go',
    };
  });
};
