import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const config: Record<AlertVariant, { icon: React.ReactNode; classes: string }> = {
  info: {
    icon: <Info size={16} />,
    classes: 'bg-ant-purple-soft text-ant-purple border-ant-purple/20',
  },
  success: {
    icon: <CheckCircle size={16} />,
    classes: 'bg-success-50 text-success-700 border-success-100',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    classes: 'bg-warning-50 text-warning-700 border-warning-100',
  },
  error: {
    icon: <AlertCircle size={16} />,
    classes: 'bg-error-50 text-error-700 border-error-100',
  },
};

export default function Alert({ variant = 'info', title, children, onClose, className = '' }: AlertProps) {
  const { icon, classes } = config[variant];
  return (
    <div className={`flex gap-3 p-4 rounded-xl border text-sm ${classes} ${className}`}>
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
