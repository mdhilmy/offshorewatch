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
} from 'chart.js';
import { formatDateTime } from '../../utils/dateUtils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const TemperatureChart = ({ hourlyData }) => {
  const chartData = useMemo(() => {
    if (!hourlyData?.length) return null;

    const labels = hourlyData.map((h) => formatDateTime(h.time, 'MMM d HH:mm'));
    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: hourlyData.map((h) => h.temperature),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
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
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1) ?? 'N/A'} °C`,
        },
      },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 12, maxRotation: 45, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Temperature (°C)' },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
    },
  }), []);

  if (!chartData) return <p className="text-gray-500 text-sm">No temperature data available</p>;

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};
