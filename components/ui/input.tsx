import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default';
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'rounded-md px-3 py-2 border border-border bg-surface text-ink placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <input
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
