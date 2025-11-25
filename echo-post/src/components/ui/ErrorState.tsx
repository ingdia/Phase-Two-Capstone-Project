import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
}

export default function ErrorState({ 
  message = 'Something went wrong', 
  onRetry,
  fullScreen = false,
  className = '' 
}: ErrorStateProps) {
  const containerClass = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}