import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-card border border-neutral-100
        ${hover ? 'transition-shadow duration-200 cursor-pointer hover:shadow-card-hover' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
