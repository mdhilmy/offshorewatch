import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { useWeatherData } from '../hooks/useWeatherData';
import { REGIONS } from '../utils/regions';
import { calculateWeatherWindows } from '../utils/windowCalculator';
import { exportToCsv, exportWeatherCsv, exportWeatherPdf } from '../services/exportService';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { FileText, Download, FileSpreadsheet, Printer, Cloud, Wrench, RefreshCw } from 'lucide-react';

const REPORT_TYPES = [
  {
    key: 'weather',
    name: 'Weather Forecast Report',
    description: 'Current conditions and 7-day marine/atmospheric forecast.',
    icon: Cloud,
    formats: ['pdf', 'csv'],
  },
  {
    key: 'operations',
    name: 'Operations Window Report',
    description: 'Weather windows for all operation types with go/no-go assessment.',
    icon: Wrench,
    formats: ['csv'],
  },
];

const OPERATION_LABELS = {
  helicopterOps: 'Helicopter Operations',
  craneLift: 'Crane Lift',
  divingOps: 'Diving Operations',
  rigMove: 'Rig Move',
  personnelTransferBoat: 'Personnel Transfer (Boat)',
  personnelTransferW2W: 'Personnel Transfer (W2W)',
};

const ReportsPage = () => {
  const { state } = useApp();
  const { settings } = useSettings();
  const region = REGIONS[state.currentRegion];
  const [lat, lon] = region?.center || [27.5, -90.5];

  const { data, isLoading, error, refetch } = useWeatherData(lat, lon);

  const [generating, setGenerating] = useState(null);

  const handleExport = (reportType, format) => {
    if (!data?.hourly) return;
    setGenerating(`${reportType}-${format}`);

    try {
      if (reportType === 'weather' && format === 'csv') {
        exportWeatherCsv(data.hourly, region?.shortName || 'region');
      } else if (reportType === 'weather' && format === 'pdf') {
        exportWeatherPdf(data, region?.name || 'Region', settings.thresholds);
      } else if (reportType === 'operations' && format === 'csv') {
        // Export all operation windows into one CSV
        const allOps = Object.keys(OPERATION_LABELS);
        const allRows = [];
        allOps.forEach((opKey) => {
          const windows = calculateWeatherWindows(data.hourly, settings.thresholds, opKey);
          windows.forEach((w, i) => {
            allRows.push({
              'Operation Type': OPERATION_LABELS[opKey],
              'Window #': i + 1,
              'Start Time': w.startTime,
              'End Time': w.endTime,
              'Duration (hours)': w.durationHours,
            });
          });
        });

        const date = new Date().toISOString().split('T')[0];
        if (allRows.length > 0) {
          exportToCsv(allRows, `operations-windows-${region?.shortName || 'region'}-${date}.csv`);
        } else {
          // Create a summary CSV even with no windows
          const summaryRows = allOps.map((opKey) => {
            const windows = calculateWeatherWindows(data.hourly, settings.thresholds, opKey);
            return {
              'Operation Type': OPERATION_LABELS[opKey],
              'Windows Found': windows.length,
              'Total Hours': windows.reduce((sum, w) => sum + w.durationHours, 0),
            };
          });
          exportToCsv(summaryRows, `operations-summary-${region?.shortName || 'region'}-${date}.csv`);
        }
      }
    } catch (err) {
      console.error('Export error:', err);
    }

    setTimeout(() => setGenerating(null), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and export weather and operations reports for {region?.name}</p>
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
        <LoadingSpinner message="Loading data for report generation..." />
      ) : error ? (
        <ErrorMessage error={error} onRetry={refetch} />
      ) : !data ? (
        <Card>
          <p className="text-gray-500">No data available. Weather data is needed to generate reports.</p>
        </Card>
      ) : (
        <>
          {/* Report cards */}
          <div className="space-y-4">
            {REPORT_TYPES.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.key}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {report.formats.includes('pdf') && (
                          <button
                            onClick={() => handleExport(report.key, 'pdf')}
                            disabled={generating === `${report.key}-pdf`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50"
                          >
                            <Printer className="w-4 h-4" />
                            {generating === `${report.key}-pdf` ? 'Generating...' : 'PDF / Print'}
                          </button>
                        )}
                        {report.formats.includes('csv') && (
                          <button
                            onClick={() => handleExport(report.key, 'csv')}
                            disabled={generating === `${report.key}-csv`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                            {generating === `${report.key}-csv` ? 'Exporting...' : 'CSV Export'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick data summary */}
          <Card title="Data Summary" subtitle="Overview of available data for export">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Forecast Hours</p>
                <p className="text-lg font-semibold text-gray-900">{data.hourly?.length || 0}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Forecast Days</p>
                <p className="text-lg font-semibold text-gray-900">{Math.ceil((data.hourly?.length || 0) / 24)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Data Source</p>
                <p className="text-lg font-semibold text-gray-900">Open-Meteo</p>
              </div>
            </div>
          </Card>

          {/* Operations windows summary */}
          <Card title="Operations Windows Summary" subtitle="Quick overview of available windows by operation type">
            <div className="space-y-2">
              {Object.entries(OPERATION_LABELS).map(([opKey, label]) => {
                const windows = calculateWeatherWindows(data.hourly, settings.thresholds, opKey);
                const totalHours = windows.reduce((sum, w) => sum + w.durationHours, 0);
                return (
                  <div key={opKey} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${windows.length > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {windows.length} window{windows.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-500">{totalHours}h total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
