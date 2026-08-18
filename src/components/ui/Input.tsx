import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function Input({
  label,
  hint,
  error,
  icon,
  iconRight,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-white text-sm text-neutral-800
            placeholder:text-neutral-400 outline-none transition-all duration-150
            py-2.5
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${iconRight ? 'pr-10' : 'pr-3.5'}
            ${error
              ? 'border-error-500 focus:ring-2 focus:ring-error-200'
              : 'border-neutral-200 focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft'
            }
            disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {iconRight && (
          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-error-600">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
