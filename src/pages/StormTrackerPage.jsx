import { CloudLightning } from 'lucide-react';
import { useStormData } from '../hooks/useStormData';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

const StormTrackerPage = () => {
  const { data, isLoading, error } = useStormData('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CloudLightning className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storm Tracker</h1>
          <p className="text-gray-600">Active tropical cyclone monitoring and forecasts</p>
        </div>
      </div>

      <Card title="Active Tropical Systems">
        {isLoading ? (
          <LoadingSpinner message="Loading storm data..." />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : data?.storms?.length > 0 ? (
          <div className="space-y-3">
            {data.storms.map((storm) => (
              <div key={storm.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{storm.name}</h3>
                    <p className="text-sm text-gray-600">{storm.type} - {storm.basin}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {storm.intensity.windSpeed} kt
                    </p>
                    <p className="text-xs text-gray-500">
                      Advisory #{storm.advisoryNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active tropical systems</p>
        )}
      </Card>
    </div>
  );
};

export default StormTrackerPage;
