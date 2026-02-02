import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { REGIONS, getRegionList } from '../../utils/regions';

export const RegionSelector = () => {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentRegion = REGIONS[state.currentRegion];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleRegionChange = (regionId) => {
    dispatch({ type: 'SET_REGION', payload: regionId });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentRegion?.name || 'Select Region'}</span>
        <span className="sm:hidden">{currentRegion?.shortName || 'Region'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {getRegionList().map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionChange(region.id)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                state.currentRegion === region.id
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{region.name}</span>
                <span className="text-xs text-gray-500">{region.shortName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
