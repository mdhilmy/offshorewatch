import { useMemo } from 'react';
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
import { formatDateTime } from '../../utils/dateUtils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const WindSpeedChart = ({ hourlyData }) => {
  const chartData = useMemo(() => {
    if (!hourlyData?.length) return null;

    const labels = hourlyData.map((h) => formatDateTime(h.time, 'MMM d HH:mm'));
    return {
      labels,
      datasets: [
        {
          label: 'Wind Speed (m/s)',
          data: hourlyData.map((h) => h.windSpeed),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHitRadius: 8,
        },
        {
          label: 'Wind Gusts (m/s)',
          data: hourlyData.map((h) => h.windGusts),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHitRadius: 8,
        },
      ],
    };
  }, [hourlyData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1) ?? 'N/A'} m/s`,
        },
      },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 12, maxRotation: 45, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Speed (m/s)' },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
    },
  }), []);

  if (!chartData) return <p className="text-gray-500 text-sm">No wind data available</p>;

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};
