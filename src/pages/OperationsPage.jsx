import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { useWeatherData } from '../hooks/useWeatherData';
import { REGIONS } from '../utils/regions';
import { calculateWeatherWindows, getOperationSummary } from '../utils/windowCalculator';
import { formatDateTime } from '../utils/dateUtils';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Wrench, CheckCircle, XCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';

const OPERATION_TYPES = [
  { key: 'helicopterOps', label: 'Helicopter Operations' },
  { key: 'craneLift', label: 'Crane Lift' },
  { key: 'divingOps', label: 'Diving Operations' },
  { key: 'rigMove', label: 'Rig Move' },
  { key: 'personnelTransferBoat', label: 'Personnel Transfer (Boat)' },
  { key: 'personnelTransferW2W', label: 'Personnel Transfer (W2W)' },
];

const OperationsPage = () => {
  const { state } = useApp();
  const { settings } = useSettings();
  const region = REGIONS[state.currentRegion];
  const [lat, lon] = region?.center || [27.5, -90.5];
  const [selectedOp, setSelectedOp] = useState('helicopterOps');

  const { data, isLoading, error, refetch } = useWeatherData(lat, lon);

  const currentConditions = data?.hourly?.[0];
  const operationSummary = useMemo(
    () => getOperationSummary(currentConditions, settings.thresholds),
    [currentConditions, settings.thresholds]
  );

  const windows = useMemo(
    () => data?.hourly ? calculateWeatherWindows(data.hourly, settings.thresholds, selectedOp) : [],
    [data?.hourly, settings.thresholds, selectedOp]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operations Planning</h1>
            <p className="text-gray-600">Weather window calculator for {region?.name}</p>
          </div>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading weather data for operations assessment..." />
      ) : error ? (
        <ErrorMessage error={error} onRetry={refetch} />
      ) : (
        <>
          {/* Current Go/No-Go Status */}
          <Card title="Current Operations Status" subtitle="Based on current conditions">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {operationSummary.map((op) => (
                <div
                  key={op.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    op.status === 'go'
                      ? 'bg-green-50 border-green-200'
                      : op.status === 'no-go'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {op.status === 'go' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : op.status === 'no-go' ? (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      op.status === 'go' ? 'text-green-800' : op.status === 'no-go' ? 'text-red-800' : 'text-gray-700'
                    }`}>
                      {op.name}
                    </p>
                    <p className={`text-xs ${
                      op.status === 'go' ? 'text-green-600' : op.status === 'no-go' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {op.status === 'go' ? 'GO — within limits' : op.status === 'no-go' ? 'NO-GO — exceeds limits' : 'No data'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Weather Window Calculator */}
          <Card title="Weather Window Calculator" subtitle="Find available operation windows in the 7-day forecast">
            <div className="space-y-4">
              {/* Operation Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type</label>
                <select
                  value={selectedOp}
                  onChange={(e) => setSelectedOp(e.target.value)}
                  className="input-field max-w-md"
                >
                  {OPERATION_TYPES.map((op) => (
                    <option key={op.key} value={op.key}>{op.label}</option>
                  ))}
                </select>
              </div>

              {/* Threshold Display */}
              <ThresholdInfo operationType={selectedOp} thresholds={settings.thresholds} />

              {/* Window Results */}
              {windows.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Found {windows.length} weather window{windows.length !== 1 ? 's' : ''}
                  </h4>
                  <div className="space-y-2">
                    {windows.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-lg bg-green-50 border border-green-200"
                      >
                        <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800">
                            Window {i + 1}: {w.durationHours}h
                          </p>
                          <p className="text-xs text-green-600">
                            {formatDateTime(w.startTime, 'MMM d, HH:mm')} — {formatDateTime(w.endTime, 'MMM d, HH:mm')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-700">
                            Max wave: {getMaxInWindow(w.conditions, 'waveHeight')} m
                          </p>
                          <p className="text-xs text-green-700">
                            Max wind: {getMaxInWindow(w.conditions, 'windSpeed')} m/s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-medium">No weather windows found</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Conditions do not meet the operational thresholds within the 7-day forecast period.
                  </p>
                </div>
              )}

              {/* Timeline Visualization */}
              {data?.hourly && (
                <WindowTimeline hourlyData={data.hourly} windows={windows} />
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

const ThresholdInfo = ({ operationType, thresholds }) => {
  const info = getThresholdDisplay(operationType, thresholds);
  if (!info.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {info.map((item, i) => (
        <div key={i} className="px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-xs text-gray-500">{item.label}:</span>{' '}
          <span className="text-xs font-medium text-gray-700">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const getThresholdDisplay = (operationType, thresholds) => {
  const items = [];
  const t = thresholds;

  switch (operationType) {
    case 'helicopterOps':
      if (t.helicopterOps?.maxWindSpeed) items.push({ label: 'Max Wind', value: `${t.helicopterOps.maxWindSpeed} kt` });
      if (t.helicopterOps?.maxWaveHeight) items.push({ label: 'Max Wave', value: `${t.helicopterOps.maxWaveHeight} m` });
      if (t.helicopterOps?.minVisibility) items.push({ label: 'Min Vis', value: `${t.helicopterOps.minVisibility} km` });
      break;
    case 'craneLift':
      if (t.craneLift?.maxWindSpeed) items.push({ label: 'Max Wind', value: `${t.craneLift.maxWindSpeed} kt` });
      if (t.craneLift?.maxWaveHeight) items.push({ label: 'Max Wave', value: `${t.craneLift.maxWaveHeight} m` });
      break;
    case 'divingOps':
      if (t.divingOps?.maxWaveHeight) items.push({ label: 'Max Wave', value: `${t.divingOps.maxWaveHeight} m` });
      if (t.divingOps?.maxWindSpeed) items.push({ label: 'Max Wind', value: `${t.divingOps.maxWindSpeed} kt` });
      break;
    case 'rigMove':
      if (t.rigMove?.maxWindSpeed) items.push({ label: 'Max Wind', value: `${t.rigMove.maxWindSpeed} kt` });
      if (t.rigMove?.maxWaveHeight) items.push({ label: 'Max Wave', value: `${t.rigMove.maxWaveHeight} m` });
      break;
    case 'personnelTransferBoat':
      if (t.personnelTransfer?.boat?.maxWindSpeed) items.push({ label: 'Max Wind', value: `${t.personnelTransfer.boat.maxWindSpeed} kt` });
      if (t.personnelTransfer?.boat?.maxWaveHeight) items.push({ label: 'Max Wave', value: `${t.personnelTransfer.boat.maxWaveHeight} m` });
      break;
    case 'personnelTransferW2W':
      if (t.personnelTransfer?.w2w?.maxWindSpeed) items.push({ label: 'Max Wind', value: `${t.personnelTransfer.w2w.maxWindSpeed} kt` });
      if (t.personnelTransfer?.w2w?.maxWaveHeight) items.push({ label: 'Max Wave', value: `${t.personnelTransfer.w2w.maxWaveHeight} m` });
      break;
  }
  return items;
};

const getMaxInWindow = (conditions, field) => {
  const values = conditions.map((c) => c[field]).filter((v) => v != null);
  if (!values.length) return 'N/A';
  return Math.max(...values).toFixed(1);
};

const WindowTimeline = ({ hourlyData, windows }) => {
  if (!hourlyData?.length) return null;

  // Build a simple bar timeline showing go/no-go per hour
  const totalHours = Math.min(hourlyData.length, 168); // Max 7 days
  const windowSet = new Set();
  windows.forEach((w) => {
    for (let i = w.startIndex; i < w.startIndex + w.durationHours && i < totalHours; i++) {
      windowSet.add(i);
    }
  });

  // Group by day for labels
  const days = [];
  for (let i = 0; i < totalHours; i += 24) {
    days.push({
      label: formatDateTime(hourlyData[i]?.time, 'MMM d'),
      startIdx: i,
    });
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">7-Day Timeline</h4>
      <div className="flex gap-px overflow-hidden rounded-md">
        {Array.from({ length: totalHours }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-6 min-w-[1px] ${windowSet.has(i) ? 'bg-green-400' : 'bg-red-300'}`}
            title={`${formatDateTime(hourlyData[i]?.time, 'MMM d HH:mm')} — ${windowSet.has(i) ? 'GO' : 'NO-GO'}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        {days.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <span>Within limits</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-300 rounded-sm" />
          <span>Exceeds limits</span>
        </div>
      </div>
    </div>
  );
};

export default OperationsPage;
