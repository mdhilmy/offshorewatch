import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { useBuoyData } from '../hooks/useBuoyData';
import { getNdbcStations } from '../services/api/ndbcBuoyService';
import { formatDateTime, formatRelativeTime } from '../utils/dateUtils';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Waves, RefreshCw, MapPin, Thermometer, Wind, Gauge } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const BuoysPage = () => {
  const { state } = useApp();
  const stations = useMemo(() => getNdbcStations(state.currentRegion), [state.currentRegion]);
  const [selectedStation, setSelectedStation] = useState(stations[0]?.id || '42001');

  const { data, isLoading, error, refetch } = useBuoyData(selectedStation);

  const selectedInfo = stations.find((s) => s.id === selectedStation);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Waves className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buoy Data</h1>
            <p className="text-gray-600">Real-time observations from NOAA NDBC buoy stations</p>
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

      {/* Station selector */}
      <Card title="Select Buoy Station">
        <div className="space-y-3">
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="input-field max-w-lg"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.name}
              </option>
            ))}
          </select>
          {selectedInfo && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {selectedInfo.lat.toFixed(3)}°N, {Math.abs(selectedInfo.lon).toFixed(3)}°{selectedInfo.lon < 0 ? 'W' : 'E'}
            </p>
          )}
        </div>
      </Card>

      {isLoading ? (
        <LoadingSpinner message={`Fetching data for station ${selectedStation}...`} />
      ) : error ? (
        <ErrorMessage error={error} onRetry={refetch} />
      ) : data?.latest ? (
        <>
          {/* Latest observation cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <ObsCard
              icon={<Waves className="w-4 h-4 text-blue-500" />}
              label="Wave Height"
              value={data.latest.waveHeight?.toFixed(1)}
              unit="m"
            />
            <ObsCard
              icon={<Waves className="w-4 h-4 text-purple-500" />}
              label="Dom. Period"
              value={data.latest.dominantPeriod?.toFixed(0)}
              unit="s"
            />
            <ObsCard
              icon={<Wind className="w-4 h-4 text-green-500" />}
              label="Wind Speed"
              value={data.latest.windSpeed?.toFixed(1)}
              unit="m/s"
            />
            <ObsCard
              icon={<Wind className="w-4 h-4 text-amber-500" />}
              label="Wind Gusts"
              value={data.latest.windGusts?.toFixed(1)}
              unit="m/s"
            />
            <ObsCard
              icon={<Thermometer className="w-4 h-4 text-red-500" />}
              label="Air Temp"
              value={data.latest.airTemp?.toFixed(1)}
              unit="°C"
            />
            <ObsCard
              icon={<Gauge className="w-4 h-4 text-gray-500" />}
              label="Pressure"
              value={data.latest.pressure?.toFixed(0)}
              unit="hPa"
            />
          </div>

          {/* Wave Height History Chart */}
          <Card title="Recent Wave Height" subtitle={`Last ${data.observations.length} observations`}>
            <BuoyWaveChart observations={data.observations} />
          </Card>

          {/* Wind Speed History Chart */}
          <Card title="Recent Wind Speed" subtitle="Wind speed and gusts">
            <BuoyWindChart observations={data.observations} />
          </Card>

          {/* Observations table */}
          <Card title="Observation History" subtitle={`Station ${data.stationId}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Time (UTC)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Wave (m)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Period (s)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Wind (m/s)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Gusts (m/s)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Air (°C)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Water (°C)</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-600">Press (hPa)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.observations.slice(0, 24).map((obs, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-1.5 px-2 text-gray-700 whitespace-nowrap text-xs">
                        {formatDateTime(obs.time, 'MMM d, HH:mm')}
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.waveHeight?.toFixed(1) ?? '—'}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.dominantPeriod?.toFixed(0) ?? '—'}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.windSpeed?.toFixed(1) ?? '—'}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.windGusts?.toFixed(1) ?? '—'}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.airTemp?.toFixed(1) ?? '—'}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.waterTemp?.toFixed(1) ?? '—'}</td>
                      <td className="py-1.5 px-2 text-right font-mono text-xs">{obs.pressure?.toFixed(0) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <p className="text-xs text-gray-400 text-right">
            Source: NOAA NDBC | Station {data.stationId} | Updated: {data.fetchedAt ? formatRelativeTime(data.fetchedAt) : 'N/A'}
          </p>
        </>
      ) : (
        <Card>
          <p className="text-gray-500">No buoy data available. Select a station and try again.</p>
        </Card>
      )}
    </div>
  );
};

const ObsCard = ({ icon, label, value, unit }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-3">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <p className="text-xs text-gray-500">{label}</p>
    </div>
    <p className="text-lg font-semibold text-gray-900">
      {value ?? 'N/A'} <span className="text-xs font-normal text-gray-500">{value ? unit : ''}</span>
    </p>
  </div>
);

const BuoyWaveChart = ({ observations }) => {
  const reversed = [...observations].reverse();
  const chartData = {
    labels: reversed.map((o) => formatDateTime(o.time, 'HH:mm')),
    datasets: [
      {
        label: 'Wave Height (m)',
        data: reversed.map((o) => o.waveHeight),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y?.toFixed(1) ?? 'N/A'} m` } },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 10, font: { size: 10 } }, grid: { display: false } },
      y: { beginAtZero: true, title: { display: true, text: 'm' }, grid: { color: 'rgba(0,0,0,0.06)' } },
    },
  };

  return (
    <div className="h-[250px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

const BuoyWindChart = ({ observations }) => {
  const reversed = [...observations].reverse();
  const chartData = {
    labels: reversed.map((o) => formatDateTime(o.time, 'HH:mm')),
    datasets: [
      {
        label: 'Wind Speed (m/s)',
        data: reversed.map((o) => o.windSpeed),
        borderColor: '#10b981',
        tension: 0.3,
        pointRadius: 2,
      },
      {
        label: 'Gusts (m/s)',
        data: reversed.map((o) => o.windGusts),
        borderColor: '#f59e0b',
        borderDash: [4, 4],
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 10, font: { size: 10 } }, grid: { display: false } },
      y: { beginAtZero: true, title: { display: true, text: 'm/s' }, grid: { color: 'rgba(0,0,0,0.06)' } },
    },
  };

  return (
    <div className="h-[250px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BuoysPage;
