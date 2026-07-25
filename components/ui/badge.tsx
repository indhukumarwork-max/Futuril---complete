import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'outline';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-colors';
  const variantClasses = {
    default: 'bg-surface2 text-ink border border-border',
    primary: 'bg-accent-subtle text-accent border border-accent-border',
    secondary: 'bg-secondary text-ink-onAccent',
    destructive: 'bg-destructive-bg text-destructive border border-destructive/20',
    success: 'bg-success-bg text-success border border-success/20',
    outline: 'bg-transparent text-ink border border-border',
  }[variant];

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
