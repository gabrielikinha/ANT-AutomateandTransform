import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'purple' | 'green' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error:   'bg-error-100 text-error-700',
  purple:  'bg-ant-purple-soft text-ant-purple',
  green:   'bg-ant-green-soft text-ant-green',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
