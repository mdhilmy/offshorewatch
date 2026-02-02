import { Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSeismicData } from '../hooks/useSeismicData';
import { REGIONS } from '../utils/regions';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatRelativeTime } from '../utils/dateUtils';

const SeismicPage = () => {
  const { state } = useApp();
  const region = REGIONS[state.currentRegion];
  const [lat, lon] = region?.center || [27.5, -90.5];

  const { data, isLoading, error } = useSeismicData({ latitude: lat, longitude: lon });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seismic Monitor</h1>
          <p className="text-gray-600">Real-time earthquake monitoring near {region?.name}</p>
        </div>
      </div>

      <Card title="Recent Earthquakes">
        {isLoading ? (
          <LoadingSpinner message="Loading earthquake data..." />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : data?.earthquakes?.length > 0 ? (
          <div className="space-y-2">
            {data.earthquakes.map((eq) => (
              <div key={eq.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">M{eq.magnitude.toFixed(1)}</h3>
                    <p className="text-sm text-gray-600">{eq.place}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Depth: {eq.location.depth.toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {formatRelativeTime(eq.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent earthquakes in this region</p>
        )}
      </Card>
    </div>
  );
};

export default SeismicPage;
