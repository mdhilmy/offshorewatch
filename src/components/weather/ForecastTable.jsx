import { useState } from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ROWS_PER_PAGE = 24;

export const ForecastTable = ({ hourlyData }) => {
  const [page, setPage] = useState(0);

  if (!hourlyData?.length) return <p className="text-gray-500 text-sm">No data available</p>;

  const totalPages = Math.ceil(hourlyData.length / ROWS_PER_PAGE);
  const pageData = hourlyData.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-600">Time</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Waves (m)</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Swell (m)</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Wind (m/s)</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Gusts (m/s)</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Temp (°C)</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Pressure (hPa)</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-700 whitespace-nowrap">
                  {formatDateTime(row.time, 'MMM d, HH:mm')}
                </td>
                <td className="py-2 px-3 text-right font-mono">
                  <span className={getWaveColor(row.waveHeight)}>
                    {row.waveHeight?.toFixed(1) ?? '—'}
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-mono">
                  {row.swellHeight?.toFixed(1) ?? '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono">
                  {row.windSpeed?.toFixed(1) ?? '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono">
                  {row.windGusts?.toFixed(1) ?? '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono">
                  {row.temperature?.toFixed(1) ?? '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono">
                  {row.pressure?.toFixed(0) ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, hourlyData.length)} of {hourlyData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getWaveColor = (height) => {
  if (height == null) return 'text-gray-400';
  if (height < 1) return 'text-green-600';
  if (height < 2) return 'text-yellow-600';
  if (height < 3) return 'text-orange-600';
  return 'text-red-600';
};
