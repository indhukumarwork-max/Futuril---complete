import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const baseClasses = 'bg-surface border border-border rounded-xl shadow-sm p-6 text-ink';
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
};
