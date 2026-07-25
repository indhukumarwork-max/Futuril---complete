import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const baseClasses = 'bg-surface border border-border rounded-lg shadow-sm p-4';
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
};
