import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-medium"
      >
        <Home className="w-5 h-5" />
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
