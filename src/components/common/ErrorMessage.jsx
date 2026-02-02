import { AlertCircle, RefreshCw, X } from 'lucide-react';

export const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  const { title, message } = typeof error === 'object' && error !== null
    ? error
    : { title: 'Error', message: error || 'An unknown error occurred' };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-red-800">{title}</h4>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-700 hover:text-red-800 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
