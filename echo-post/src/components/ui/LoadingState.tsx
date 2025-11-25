import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className = '' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClass = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto text-gray-600`} />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
}