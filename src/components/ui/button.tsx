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
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs tracking-wide',
    md: 'px-5 py-2.5 text-sm tracking-wide',
    lg: 'px-7 py-3.5 text-base tracking-wide',
  }[size];

  const variantClasses = {
    default:
      'bg-white/[0.08] backdrop-blur-xl text-white border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-white/[0.14] hover:border-white/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.08)]',
    primary:
      'bg-gradient-to-br from-white/95 to-slate-200/90 text-zinc-950 font-semibold border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(255,255,255,0.15)] hover:from-white hover:to-slate-100 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5),0_0_35px_rgba(255,255,255,0.3)]',
    secondary:
      'bg-white/[0.05] backdrop-blur-md text-zinc-200 border border-white/10 hover:bg-white/[0.1] hover:border-white/20',
    outline:
      'bg-black/40 backdrop-blur-2xl text-white border border-white/15 hover:bg-white/[0.08] hover:border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.3)]',
    destructive:
      'bg-red-500/20 backdrop-blur-xl text-red-100 border border-red-500/40 hover:bg-red-500/30 hover:border-red-500/60 shadow-[0_8px_24px_rgba(239,68,68,0.2)]',
    ghost:
      'bg-transparent text-zinc-300 hover:text-white hover:bg-white/[0.06] shadow-none',
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
