import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon, Layers, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { REGIONS } from '../utils/regions';
import { getPlatformsForRegion, getBuoyStationsForRegion } from '../utils/platformData';

// Fix Leaflet default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const platformIcon = new L.DivIcon({
  html: `<div style="background:#2563eb;width:12px;height:12px;border-radius:2px;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const buoyIcon = new L.DivIcon({
  html: `<div style="background:#f59e0b;width:10px;height:10px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

// Component to handle map view changes when region changes
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
};

const MapPage = () => {
  const { state } = useApp();
  const { settings } = useSettings();
  const region = REGIONS[state.currentRegion];
  const center = region?.center || [27.5, -90.5];
  const zoom = region?.zoom || 6;

  const [showLegend, setShowLegend] = useState(true);

  const platforms = useMemo(() => getPlatformsForRegion(state.currentRegion), [state.currentRegion]);
  const buoyStations = useMemo(() => getBuoyStationsForRegion(state.currentRegion), [state.currentRegion]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interactive Map</h1>
            <p className="text-gray-600">{region?.name} — offshore infrastructure and conditions</p>
          </div>
        </div>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700"
        >
          <Layers className="w-4 h-4" />
          Legend
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="h-[65vh]">
          <MapContainer
            center={center}
            zoom={zoom}
            className="h-full w-full"
            zoomControl={true}
          >
            <MapViewController center={center} zoom={zoom} />

            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="CartoDB Positron">
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Esri Ocean">
                <TileLayer
                  attribution='&copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {/* Platform Markers */}
            {settings.display.showPlatforms && platforms.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lon]} icon={platformIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-gray-600">Operator: {p.operator}</p>
                    <p className="text-gray-500 text-xs">
                      {p.lat.toFixed(3)}°, {p.lon.toFixed(3)}°
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Buoy Markers */}
            {settings.display.showBuoys && buoyStations.map((b) => (
              <Marker key={b.id} position={[b.lat, b.lon]} icon={buoyIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Buoy {b.id}</p>
                    <p className="text-gray-600">{b.name}</p>
                    <p className="text-gray-500 text-xs">
                      {b.lat.toFixed(3)}°, {b.lon.toFixed(3)}°
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend overlay */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-sm border border-white shadow-sm" />
                <span className="text-xs text-gray-600">Platform ({platforms.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full border border-white shadow-sm" />
                <span className="text-xs text-gray-600">Buoy ({buoyStations.length})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-right">
        Map tiles: OpenStreetMap | Platforms: Sample data
      </p>
    </div>
  );
};

export default MapPage;
