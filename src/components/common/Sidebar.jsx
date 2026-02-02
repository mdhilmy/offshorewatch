import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cloud,
  Map,
  CloudLightning,
  Activity,
  Wrench,
  MapPin,
  Waves,
  FileText,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/weather', icon: Cloud, label: 'Weather' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/storms', icon: CloudLightning, label: 'Storm Tracker' },
  { path: '/seismic', icon: Activity, label: 'Seismic' },
  { path: '/operations', icon: Wrench, label: 'Operations' },
  { path: '/locations', icon: MapPin, label: 'Locations' },
  { path: '/buoys', icon: Waves, label: 'Buoys' },
  { path: '/reports', icon: FileText, label: 'Reports' },
];

export const Sidebar = ({ isOpen, onClose }) => (
  <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}

    {/* Sidebar */}
    <aside
      className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Close button for mobile */}
        <div className="lg:hidden p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t border-gray-200">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  </>
);
