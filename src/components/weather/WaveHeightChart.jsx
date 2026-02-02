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

export const WaveHeightChart = ({ hourlyData, thresholds }) => {
  const chartData = useMemo(() => {
    if (!hourlyData?.length) return null;

    const labels = hourlyData.map((h) => formatDateTime(h.time, 'MMM d HH:mm'));
    return {
      labels,
      datasets: [
        {
          label: 'Wave Height (m)',
          data: hourlyData.map((h) => h.waveHeight),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHitRadius: 8,
        },
        {
          label: 'Swell Height (m)',
          data: hourlyData.map((h) => h.swellHeight),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHitRadius: 8,
        },
        {
          label: 'Wind Wave (m)',
          data: hourlyData.map((h) => h.windWaveHeight),
          borderColor: '#06b6d4',
          borderDash: [4, 4],
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
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1) ?? 'N/A'} m`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 12,
          maxRotation: 45,
          font: { size: 10 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Height (m)' },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
    },
    annotation: thresholds?.maxWaveHeight ? {
      annotations: {
        threshold: {
          type: 'line',
          yMin: thresholds.maxWaveHeight,
          yMax: thresholds.maxWaveHeight,
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [6, 6],
          label: {
            display: true,
            content: `Limit: ${thresholds.maxWaveHeight}m`,
            position: 'end',
          },
        },
      },
    } : undefined,
  }), [thresholds]);

  if (!chartData) return <p className="text-gray-500 text-sm">No wave data available</p>;

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};
