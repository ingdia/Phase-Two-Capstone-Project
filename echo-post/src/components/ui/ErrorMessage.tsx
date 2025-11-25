"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorMessage({ message, onRetry, showRetry = true }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <p className="text-gray-700 text-center">{message}</p>
      </div>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}