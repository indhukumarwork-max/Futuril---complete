import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  disabled = false,
  error = false,
  ...props
}) => {
  const baseClasses =
    'w-full rounded-lg px-3.5 py-2.5 text-sm border bg-surface text-ink placeholder:text-ink-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  const borderClasses = error
    ? 'border-destructive focus:ring-destructive'
    : 'border-border focus:border-accent';

  return (
    <input
      className={`${baseClasses} ${borderClasses} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
