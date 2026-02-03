import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { DEFAULT_THRESHOLDS } from '../utils/thresholds';
import { STORAGE_PREFIX } from '../utils/constants';
import { Card } from '../components/common/Card';
import { Settings, RotateCcw, Key, Eye, EyeOff, Check, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  const { settings, dispatch } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your preferences, thresholds, and API keys</p>
        </div>
      </div>

      {/* Unit Preferences */}
      <Card title="Unit Preferences" subtitle="Choose your preferred measurement units">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UnitSelect
            label="Wind Speed"
            value={settings.units.windSpeed}
            options={[
              { value: 'knots', label: 'Knots (kt)' },
              { value: 'ms', label: 'Meters/sec (m/s)' },
              { value: 'mph', label: 'Miles/hour (mph)' },
              { value: 'kmh', label: 'Kilometers/hour (km/h)' },
            ]}
            onChange={(v) => dispatch({ type: 'UPDATE_UNITS', payload: { windSpeed: v } })}
          />
          <UnitSelect
            label="Wave Height"
            value={settings.units.waveHeight}
            options={[
              { value: 'meters', label: 'Meters (m)' },
              { value: 'feet', label: 'Feet (ft)' },
            ]}
            onChange={(v) => dispatch({ type: 'UPDATE_UNITS', payload: { waveHeight: v } })}
          />
          <UnitSelect
            label="Temperature"
            value={settings.units.temperature}
            options={[
              { value: 'celsius', label: 'Celsius (°C)' },
              { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
            ]}
            onChange={(v) => dispatch({ type: 'UPDATE_UNITS', payload: { temperature: v } })}
          />
          <UnitSelect
            label="Distance"
            value={settings.units.distance}
            options={[
              { value: 'km', label: 'Kilometers (km)' },
              { value: 'miles', label: 'Miles (mi)' },
              { value: 'nm', label: 'Nautical Miles (NM)' },
            ]}
            onChange={(v) => dispatch({ type: 'UPDATE_UNITS', payload: { distance: v } })}
          />
        </div>
      </Card>

      {/* Operational Thresholds */}
      <Card
        title="Operational Thresholds"
        subtitle="Customize limits used for weather window calculations"
        action={
          <button
            onClick={() => dispatch({ type: 'UPDATE_THRESHOLDS', payload: DEFAULT_THRESHOLDS })}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset defaults
          </button>
        }
      >
        <div className="space-y-6">
          {/* Helicopter Ops */}
          <ThresholdSection
            title="Helicopter Operations"
            fields={[
              { key: 'maxWindSpeed', label: 'Max Wind Speed', unit: 'knots', value: settings.thresholds.helicopterOps?.maxWindSpeed },
              { key: 'maxWindGusts', label: 'Max Wind Gusts', unit: 'knots', value: settings.thresholds.helicopterOps?.maxWindGusts },
              { key: 'maxWaveHeight', label: 'Max Wave Height', unit: 'm', value: settings.thresholds.helicopterOps?.maxWaveHeight },
              { key: 'minVisibility', label: 'Min Visibility', unit: 'km', value: settings.thresholds.helicopterOps?.minVisibility },
              { key: 'minCeiling', label: 'Min Ceiling', unit: 'm', value: settings.thresholds.helicopterOps?.minCeiling },
            ]}
            onChange={(key, val) =>
              dispatch({ type: 'UPDATE_THRESHOLDS', payload: {
                helicopterOps: { ...settings.thresholds.helicopterOps, [key]: val },
              }})
            }
          />

          {/* Crane Lift */}
          <ThresholdSection
            title="Crane Lift"
            fields={[
              { key: 'maxWindSpeed', label: 'Max Wind Speed', unit: 'knots', value: settings.thresholds.craneLift?.maxWindSpeed },
              { key: 'maxWaveHeight', label: 'Max Wave Height', unit: 'm', value: settings.thresholds.craneLift?.maxWaveHeight },
            ]}
            onChange={(key, val) =>
              dispatch({ type: 'UPDATE_THRESHOLDS', payload: {
                craneLift: { ...settings.thresholds.craneLift, [key]: val },
              }})
            }
          />

          {/* Diving Ops */}
          <ThresholdSection
            title="Diving Operations"
            fields={[
              { key: 'maxWaveHeight', label: 'Max Wave Height', unit: 'm', value: settings.thresholds.divingOps?.maxWaveHeight },
              { key: 'maxCurrentSpeed', label: 'Max Current Speed', unit: 'knots', value: settings.thresholds.divingOps?.maxCurrentSpeed },
              { key: 'maxWindSpeed', label: 'Max Wind Speed', unit: 'knots', value: settings.thresholds.divingOps?.maxWindSpeed },
            ]}
            onChange={(key, val) =>
              dispatch({ type: 'UPDATE_THRESHOLDS', payload: {
                divingOps: { ...settings.thresholds.divingOps, [key]: val },
              }})
            }
          />

          {/* Rig Move */}
          <ThresholdSection
            title="Rig Move"
            fields={[
              { key: 'maxWindSpeed', label: 'Max Wind Speed', unit: 'knots', value: settings.thresholds.rigMove?.maxWindSpeed },
              { key: 'maxWaveHeight', label: 'Max Wave Height', unit: 'm', value: settings.thresholds.rigMove?.maxWaveHeight },
              { key: 'minWindowHours', label: 'Min Window Duration', unit: 'hours', value: settings.thresholds.rigMove?.minWindowHours },
            ]}
            onChange={(key, val) =>
              dispatch({ type: 'UPDATE_THRESHOLDS', payload: {
                rigMove: { ...settings.thresholds.rigMove, [key]: val },
              }})
            }
          />

          {/* Personnel Transfer */}
          <ThresholdSection
            title="Personnel Transfer (Boat)"
            fields={[
              { key: 'maxWaveHeight', label: 'Max Wave Height', unit: 'm', value: settings.thresholds.personnelTransfer?.boat?.maxWaveHeight },
              { key: 'maxWindSpeed', label: 'Max Wind Speed', unit: 'knots', value: settings.thresholds.personnelTransfer?.boat?.maxWindSpeed },
            ]}
            onChange={(key, val) =>
              dispatch({ type: 'UPDATE_THRESHOLDS', payload: {
                personnelTransfer: {
                  ...settings.thresholds.personnelTransfer,
                  boat: { ...settings.thresholds.personnelTransfer?.boat, [key]: val },
                },
              }})
            }
          />

          <ThresholdSection
            title="Personnel Transfer (W2W)"
            fields={[
              { key: 'maxWaveHeight', label: 'Max Wave Height', unit: 'm', value: settings.thresholds.personnelTransfer?.w2w?.maxWaveHeight },
              { key: 'maxWindSpeed', label: 'Max Wind Speed', unit: 'knots', value: settings.thresholds.personnelTransfer?.w2w?.maxWindSpeed },
            ]}
            onChange={(key, val) =>
              dispatch({ type: 'UPDATE_THRESHOLDS', payload: {
                personnelTransfer: {
                  ...settings.thresholds.personnelTransfer,
                  w2w: { ...settings.thresholds.personnelTransfer?.w2w, [key]: val },
                },
              }})
            }
          />
        </div>
      </Card>

      {/* Display Preferences */}
      <Card title="Display Preferences" subtitle="Map layer visibility settings">
        <div className="space-y-3">
          <ToggleSetting
            label="Show Platforms"
            checked={settings.display.showPlatforms}
            onChange={(v) => dispatch({ type: 'UPDATE_DISPLAY', payload: { showPlatforms: v } })}
          />
          <ToggleSetting
            label="Show Buoys"
            checked={settings.display.showBuoys}
            onChange={(v) => dispatch({ type: 'UPDATE_DISPLAY', payload: { showBuoys: v } })}
          />
          <ToggleSetting
            label="Show Storm Tracks"
            checked={settings.display.showStorms}
            onChange={(v) => dispatch({ type: 'UPDATE_DISPLAY', payload: { showStorms: v } })}
          />
        </div>
      </Card>

      {/* API Keys */}
      <ApiKeysSection />

      {/* Cache Management */}
      <CacheSection />

      {/* About */}
      <Card title="About">
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>OffshoreWatch</strong> — Global Offshore Operations Weather & Safety Planning Platform</p>
          <p>Version 1.1.0</p>
          <p className="text-xs">Data sources: Open-Meteo, NOAA NHC, USGS, NDBC, NOAA CO-OPS</p>
          <p className="text-xs text-gray-400 mt-3">Built with React, Vite, Tailwind CSS, Chart.js, and Leaflet</p>
        </div>
      </Card>
    </div>
  );
};

// --- Sub-components ---

const UnitSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const ThresholdSection = ({ title, fields, onChange }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs text-gray-500 mb-1">{f.label} ({f.unit})</label>
          <input
            type="number"
            step="0.1"
            value={f.value ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value);
              onChange(f.key, val);
            }}
            className="input-field text-sm"
          />
        </div>
      ))}
    </div>
  </div>
);

const ToggleSetting = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </label>
);

const ApiKeysSection = () => {
  const [mapboxKey, setMapboxKey] = useState(() => localStorage.getItem(`${STORAGE_PREFIX}apikey_mapbox`) || '');
  const [owmKey, setOwmKey] = useState(() => localStorage.getItem(`${STORAGE_PREFIX}apikey_openweather`) || '');
  const [showMapbox, setShowMapbox] = useState(false);
  const [showOwm, setShowOwm] = useState(false);

  const saveKey = (service, key) => {
    if (key.trim()) {
      localStorage.setItem(`${STORAGE_PREFIX}apikey_${service}`, key.trim());
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}apikey_${service}`);
    }
  };

  return (
    <Card title="API Keys (Optional)" subtitle="Add API keys for enhanced map tiles and weather data">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mapbox Access Token</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showMapbox ? 'text' : 'password'}
                value={mapboxKey}
                onChange={(e) => setMapboxKey(e.target.value)}
                placeholder="pk.ey..."
                className="input-field pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowMapbox(!showMapbox)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showMapbox ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={() => saveKey('mapbox', mapboxKey)}
              className="btn-primary text-sm"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Used for satellite map tiles</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OpenWeatherMap API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showOwm ? 'text' : 'password'}
                value={owmKey}
                onChange={(e) => setOwmKey(e.target.value)}
                placeholder="API key..."
                className="input-field pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowOwm(!showOwm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOwm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={() => saveKey('openweather', owmKey)}
              className="btn-primary text-sm"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Used for alternative weather data</p>
        </div>
      </div>
    </Card>
  );
};

const CacheSection = () => {
  const [cleared, setCleared] = useState(false);

  const handleClearCache = async () => {
    try {
      const { clearCache } = await import('../services/cacheService');
      await clearCache();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
  };

  return (
    <Card title="Data Cache" subtitle="Manage cached weather and API data">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Clear all cached weather, storm, and seismic data.</p>
        <button
          onClick={handleClearCache}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border ${
            cleared
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
          }`}
        >
          {cleared ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          {cleared ? 'Cleared' : 'Clear Cache'}
        </button>
      </div>
    </Card>
  );
};

export default SettingsPage;
