import { formatDateTime } from '../utils/dateUtils';

/**
 * Export data as CSV file and trigger browser download.
 */
export const exportToCsv = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h];
        // Escape commas and quotes in CSV values
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Export weather forecast data as CSV.
 */
export const exportWeatherCsv = (hourlyData, regionName) => {
  if (!hourlyData?.length) return;

  const rows = hourlyData.map((h) => ({
    'Time (UTC)': formatDateTime(h.time, 'yyyy-MM-dd HH:mm'),
    'Wave Height (m)': h.waveHeight?.toFixed(2) ?? '',
    'Swell Height (m)': h.swellHeight?.toFixed(2) ?? '',
    'Wave Period (s)': h.wavePeriod?.toFixed(1) ?? '',
    'Wind Speed (m/s)': h.windSpeed?.toFixed(1) ?? '',
    'Wind Gusts (m/s)': h.windGusts?.toFixed(1) ?? '',
    'Wind Direction (°)': h.windDirection ?? '',
    'Temperature (°C)': h.temperature?.toFixed(1) ?? '',
    'Pressure (hPa)': h.pressure?.toFixed(1) ?? '',
    'Visibility (m)': h.visibility ?? '',
  }));

  const date = formatDateTime(new Date(), 'yyyy-MM-dd');
  exportToCsv(rows, `weather-forecast-${regionName}-${date}.csv`);
};

/**
 * Export operations window data as CSV.
 */
export const exportWindowsCsv = (windows, operationType, regionName) => {
  if (!windows?.length) return;

  const rows = windows.map((w, i) => ({
    'Window #': i + 1,
    'Start Time': formatDateTime(w.startTime, 'yyyy-MM-dd HH:mm'),
    'End Time': formatDateTime(w.endTime, 'yyyy-MM-dd HH:mm'),
    'Duration (hours)': w.durationHours,
    'Operation Type': operationType,
    'Region': regionName,
  }));

  const date = formatDateTime(new Date(), 'yyyy-MM-dd');
  exportToCsv(rows, `weather-windows-${operationType}-${date}.csv`);
};

/**
 * Generate a printable weather report as HTML and open in a new window for printing/PDF.
 */
export const exportWeatherPdf = (weatherData, regionName, thresholds) => {
  if (!weatherData?.hourly?.length) return;

  const current = weatherData.hourly[0];
  const reportDate = formatDateTime(new Date(), 'MMMM d, yyyy HH:mm');

  // Build daily summaries
  const dailySummaries = [];
  for (let i = 0; i < weatherData.hourly.length; i += 24) {
    const daySlice = weatherData.hourly.slice(i, i + 24);
    if (!daySlice.length) break;

    const waves = daySlice.map((h) => h.waveHeight).filter((v) => v != null);
    const winds = daySlice.map((h) => h.windSpeed).filter((v) => v != null);
    const temps = daySlice.map((h) => h.temperature).filter((v) => v != null);

    dailySummaries.push({
      date: formatDateTime(daySlice[0].time, 'EEE, MMM d'),
      maxWave: waves.length ? Math.max(...waves).toFixed(1) : 'N/A',
      minWave: waves.length ? Math.min(...waves).toFixed(1) : 'N/A',
      maxWind: winds.length ? Math.max(...winds).toFixed(1) : 'N/A',
      avgTemp: temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : 'N/A',
    });
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Weather Report - ${regionName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin-top: 24px; margin-bottom: 8px; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; }
    .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
    .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .stat-label { font-size: 11px; color: #64748b; }
    .stat-value { font-size: 20px; font-weight: 600; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th { text-align: left; padding: 8px; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: 600; }
    td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
    tr:hover td { background: #f8fafc; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Weather Forecast Report</h1>
  <p class="meta">${regionName} | Generated: ${reportDate} UTC | Source: Open-Meteo</p>

  <h2>Current Conditions</h2>
  <div class="grid">
    <div class="stat"><div class="stat-label">Wave Height</div><div class="stat-value">${current.waveHeight?.toFixed(1) ?? 'N/A'} m</div></div>
    <div class="stat"><div class="stat-label">Wind Speed</div><div class="stat-value">${current.windSpeed?.toFixed(1) ?? 'N/A'} m/s</div></div>
    <div class="stat"><div class="stat-label">Temperature</div><div class="stat-value">${current.temperature?.toFixed(1) ?? 'N/A'} °C</div></div>
    <div class="stat"><div class="stat-label">Swell Height</div><div class="stat-value">${current.swellHeight?.toFixed(1) ?? 'N/A'} m</div></div>
    <div class="stat"><div class="stat-label">Wind Gusts</div><div class="stat-value">${current.windGusts?.toFixed(1) ?? 'N/A'} m/s</div></div>
    <div class="stat"><div class="stat-label">Pressure</div><div class="stat-value">${current.pressure?.toFixed(0) ?? 'N/A'} hPa</div></div>
  </div>

  <h2>7-Day Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Wave Min (m)</th>
        <th>Wave Max (m)</th>
        <th>Max Wind (m/s)</th>
        <th>Avg Temp (°C)</th>
      </tr>
    </thead>
    <tbody>
      ${dailySummaries.map((d) => `
      <tr>
        <td>${d.date}</td>
        <td>${d.minWave}</td>
        <td>${d.maxWave}</td>
        <td>${d.maxWind}</td>
        <td>${d.avgTemp}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>OffshoreWatch - Global Offshore Operations Weather & Safety Planning Platform</p>
    <p>This report is generated from Open-Meteo forecast data and is for planning purposes only.</p>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    // Auto-trigger print dialog after a brief delay
    setTimeout(() => printWindow.print(), 500);
  }
};

/**
 * Export buoy observations as CSV.
 */
export const exportBuoyCsv = (observations, stationId) => {
  if (!observations?.length) return;

  const rows = observations.map((o) => ({
    'Time (UTC)': formatDateTime(o.time, 'yyyy-MM-dd HH:mm'),
    'Wave Height (m)': o.waveHeight?.toFixed(2) ?? '',
    'Dom Period (s)': o.dominantPeriod?.toFixed(0) ?? '',
    'Wind Speed (m/s)': o.windSpeed?.toFixed(1) ?? '',
    'Wind Gusts (m/s)': o.windGusts?.toFixed(1) ?? '',
    'Wind Dir (°)': o.windDirection ?? '',
    'Air Temp (°C)': o.airTemp?.toFixed(1) ?? '',
    'Water Temp (°C)': o.waterTemp?.toFixed(1) ?? '',
    'Pressure (hPa)': o.pressure?.toFixed(1) ?? '',
  }));

  const date = formatDateTime(new Date(), 'yyyy-MM-dd');
  exportToCsv(rows, `buoy-${stationId}-${date}.csv`);
};

// --- Helpers ---

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
