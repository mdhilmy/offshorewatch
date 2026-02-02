import { Link } from 'react-router-dom';
import { Menu, Settings, MapPin } from 'lucide-react';
import { RegionSelector } from '../dashboard/RegionSelector';

export const Header = ({ onMenuClick }) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
    <div className="h-full px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 hidden sm:block">
            OffshoreWatch
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <RegionSelector />
        <Link
          to="/settings"
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </div>
  </header>
);
