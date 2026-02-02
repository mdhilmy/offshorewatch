import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { useWeatherData } from '../hooks/useWeatherData';
import { useUnits } from '../hooks/useUnits';
import { REGIONS } from '../utils/regions';
import { formatRelativeTime } from '../utils/dateUtils';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { WaveHeightChart } from '../components/weather/WaveHeightChart';
import { WindSpeedChart } from '../components/weather/WindSpeedChart';
import { TemperatureChart } from '../components/weather/TemperatureChart';
import { ForecastTable } from '../components/weather/ForecastTable';
import { Cloud, RefreshCw, Table, BarChart3 } from 'lucide-react';

const WeatherPage = () => {
  const { state } = useApp();
  const { settings } = useSettings();
  const { formatWind, formatWave, formatTemp, formatPressure } = useUnits();
  const region = REGIONS[state.currentRegion];
  const [lat, lon] = region?.center || [27.5, -90.5];
  const [view, setView] = useState('charts');

  const { data, isLoading, error, lastFetch, refetch } = useWeatherData(lat, lon);

  const current = data?.hourly?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Cloud className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
            <p className="text-gray-600">7-day marine and atmospheric forecast for {region?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-md p-0.5">
            <button
              onClick={() => setView('charts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === 'charts' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Charts
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === 'table' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Table
            </button>
          </div>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {current && !isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <ConditionCard label="Wave Height" formatted={formatWave(current.waveHeight)} color={getWaveColor(current.waveHeight)} />
          <ConditionCard label="Swell" formatted={formatWave(current.swellHeight)} />
          <ConditionCard label="Wind Speed" formatted={formatWind(current.windSpeed)} />
          <ConditionCard label="Wind Gusts" formatted={formatWind(current.windGusts)} />
          <ConditionCard label="Temperature" formatted={formatTemp(current.temperature)} />
          <ConditionCard label="Pressure" formatted={formatPressure(current.pressure)} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner message="Loading forecast data..." />
      ) : error ? (
        <ErrorMessage error={error} onRetry={refetch} />
      ) : data ? (
        <>
          {view === 'charts' ? (
            <div className="space-y-6">
              <Card title="Wave Height Forecast" subtitle="Significant wave height, swell, and wind waves">
                <WaveHeightChart
                  hourlyData={data.hourly}
                  thresholds={settings.thresholds?.helicopterOps}
                />
              </Card>
              <Card title="Wind Speed Forecast" subtitle="Sustained wind speed and gusts">
                <WindSpeedChart hourlyData={data.hourly} />
              </Card>
              <Card title="Temperature Forecast" subtitle="Air temperature at 2m">
                <TemperatureChart hourlyData={data.hourly} />
              </Card>
            </div>
          ) : (
            <Card title="Hourly Forecast Data" subtitle={`${data.hourly.length} hours of forecast data`}>
              <ForecastTable hourlyData={data.hourly} />
            </Card>
          )}

          <p className="text-xs text-gray-400 text-right">
            Source: Open-Meteo | Last updated: {lastFetch ? formatRelativeTime(lastFetch) : 'N/A'}
          </p>
        </>
      ) : (
        <Card>
          <p className="text-gray-500">No forecast data available for this region.</p>
        </Card>
      )}
    </div>
  );
};

const ConditionCard = ({ label, formatted, color = 'text-gray-900' }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-3">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-lg font-semibold ${color}`}>{formatted}</p>
  </div>
);

const getWaveColor = (h) => {
  if (h == null) return 'text-gray-900';
  if (h < 1) return 'text-green-600';
  if (h < 2) return 'text-yellow-600';
  if (h < 3) return 'text-orange-600';
  return 'text-red-600';
};

export default WeatherPage;
