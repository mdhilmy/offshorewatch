import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', message }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader className={`${sizes[size]} text-primary-600 animate-spin`} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};
