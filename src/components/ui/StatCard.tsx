import React from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
}

export default function StatCard({ label, value, icon, iconBg = 'bg-ant-purple-soft', trend, subtitle }: StatCardProps) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend.positive ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'}`}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
        {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
}
