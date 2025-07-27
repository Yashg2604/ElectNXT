import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <div className="text-center">
        <Loader2 className={`${sizes[size]} text-brand-orange animate-spin mx-auto mb-4`} />
        {text && <p className="text-text-secondary">{text}</p>}
      </div>
    </div>
  );
}