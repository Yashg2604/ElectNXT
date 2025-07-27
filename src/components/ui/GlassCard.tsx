import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function GlassCard({ children, className, hover = true, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl',
        hover && 'hover:bg-white/10 transition-all duration-300',
        'hover:shadow-[0_20px_40px_rgba(255,107,71,0.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}