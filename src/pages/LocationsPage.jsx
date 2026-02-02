import { MapPin } from 'lucide-react';
import { Card } from '../components/common/Card';

const LocationsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <MapPin className="w-8 h-8 text-primary-600" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Locations</h1>
        <p className="text-gray-600">Manage your favorite offshore locations</p>
      </div>
    </div>

    <Card>
      <p className="text-gray-600">
        Location management interface will be implemented here, allowing users to save, edit,
        and organize their offshore platform and field locations.
      </p>
    </Card>
  </div>
);

export default LocationsPage;
