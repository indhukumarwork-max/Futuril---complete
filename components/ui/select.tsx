import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  options,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'w-full rounded-lg px-3.5 py-2.5 text-sm border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

  return (
    <select
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {options
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );
};
