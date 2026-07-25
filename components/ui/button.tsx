import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses =
    'rounded-md px-4 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    default: 'bg-surface text-ink border border-border hover:bg-surface2',
    primary: 'bg-accent text-white hover:bg-accentTint',
    secondary: 'bg-secondary text-white hover:bg-accentTint',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
