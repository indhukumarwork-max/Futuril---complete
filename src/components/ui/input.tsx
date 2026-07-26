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
    'w-full rounded-2xl px-5 py-3.5 text-sm bg-black/50 text-white placeholder:text-zinc-500 backdrop-blur-2xl transition-all duration-300 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed shadow-inner tracking-wide';
  const borderClasses = error
    ? 'border border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
    : 'border border-white/15 hover:border-white/25 focus:border-white/40 focus:ring-2 focus:ring-white/15 focus:shadow-[0_0_20px_rgba(255,255,255,0.08)]';

  return (
    <input
      className={`${baseClasses} ${borderClasses} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
