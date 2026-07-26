import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const baseClasses =
    'bg-[#0c0d12]/75 backdrop-blur-3xl border border-white/[0.12] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.18)] text-white p-8 relative overflow-hidden transition-all duration-300 hover:border-white/[0.2]';
  return (
    <div className={`${baseClasses} ${className}`}>
      {/* Subtle pearl-silver glass specular highlight */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
