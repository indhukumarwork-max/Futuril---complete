import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];

  const variantClasses = {
    default: 'bg-surface text-ink border border-border hover:bg-surface2 hover:border-border-hover',
    primary: 'bg-accent text-ink-onAccent hover:bg-accent-hover',
    secondary: 'bg-secondary text-ink-onAccent hover:bg-secondary-hover',
    outline: 'bg-transparent text-ink border border-border hover:bg-surface2',
    destructive: 'bg-destructive text-ink-onAccent hover:opacity-90',
    ghost: 'bg-transparent text-ink hover:bg-surface2 shadow-none',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
