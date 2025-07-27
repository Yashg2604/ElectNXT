import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  glow = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-orange to-accent-orange text-white hover:from-accent-orange hover:to-brand-orange hover:scale-105 shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    danger: 'bg-gradient-to-r from-error-red to-brand-red text-white hover:from-brand-red hover:to-error-red hover:scale-105',
    success: 'bg-gradient-to-r from-success-green to-emerald-500 text-white hover:from-emerald-500 hover:to-success-green hover:scale-105',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const glowEffect = glow ? 'shadow-[0_0_20px_rgba(255,107,71,0.5)]' : '';

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glowEffect,
        disabled && 'hover:scale-100',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </button>
  );
}