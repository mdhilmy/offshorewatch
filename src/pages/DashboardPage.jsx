import { useApp } from '../context/AppContext';
import { useWeatherData } from '../hooks/useWeatherData';
import { useStormData } from '../hooks/useStormData';
import { useSeismicData } from '../hooks/useSeismicData';
import { useUnits } from '../hooks/useUnits';
import { REGIONS } from '../utils/regions';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { CloudLightning, Activity, Wind, Waves, Thermometer } from 'lucide-react';
import { formatRelativeTime } from '../utils/dateUtils';

const DashboardPage = () => {
  const { state } = useApp();
  const { formatWind, formatWave, formatTemp, formatVisibility } = useUnits();
  const region = REGIONS[state.currentRegion];
  const [lat, lon] = region?.center || [27.5, -90.5];

  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useWeatherData(lat, lon);
  const { data: stormData, isLoading: stormLoading } = useStormData(region?.stormBasins?.[0] || 'atlantic');
  const { data: seismicData, isLoading: seismicLoading } = useSeismicData({ latitude: lat, longitude: lon });

  const current = weatherData?.hourly?.[0];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">{region?.name}</p>
      </div>

      {/* Current conditions card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Current Conditions" subtitle={weatherData?.fetchedAt ? `Updated ${formatRelativeTime(weatherData.fetchedAt)}` : ''}>
          {weatherLoading ? (
            <LoadingSpinner size="sm" />
          ) : weatherError ? (
            <ErrorMessage error={weatherError} />
          ) : current ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Waves className="w-4 h-4" />
                  <span className="text-sm">Wave Height</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatWave(current.waveHeight)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Wind className="w-4 h-4" />
                  <span className="text-sm">Wind Speed</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatWind(current.windSpeed)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm">Temperature</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatTemp(current.temperature)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Visibility</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatVisibility(current.visibility)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No weather data available</p>
          )}
        </Card>

        {/* Active storms card */}
        <Card title="Active Storms" action={<CloudLightning className="w-4 h-4 text-gray-400" />}>
          {stormLoading ? (
            <LoadingSpinner size="sm" />
          ) : stormData?.storms?.length > 0 ? (
            <div className="space-y-2">
              {stormData.storms.slice(0, 3).map((storm) => (
                <div key={storm.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="font-medium text-gray-900">{storm.name}</span>
                    <p className="text-xs text-gray-500">{storm.type}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {storm.intensity.windSpeed ? `${storm.intensity.windSpeed} kt` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No active storms in this region</p>
          )}
        </Card>

        {/* Recent earthquakes card */}
        <Card title="Recent Earthquakes" action={<Activity className="w-4 h-4 text-gray-400" />}>
          {seismicLoading ? (
            <LoadingSpinner size="sm" />
          ) : seismicData?.earthquakes?.length > 0 ? (
            <div className="space-y-2">
              {seismicData.earthquakes.slice(0, 3).map((eq) => (
                <div key={eq.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900">M{eq.magnitude.toFixed(1)}</span>
                    <p className="text-xs text-gray-500 truncate">{eq.place}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatRelativeTime(eq.time)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent earthquakes in this region</p>
          )}
        </Card>
      </div>

      {/* Quick info */}
      <Card title="Quick Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Region Details</h4>
            <dl className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <dt>Coordinates:</dt>
                <dd className="font-mono">{region?.center[0]}, {region?.center[1]}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Timezone:</dt>
                <dd>{region?.timezone}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Weather: Open-Meteo API</li>
              <li>• Storms: NOAA NHC</li>
              <li>• Seismic: USGS</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
