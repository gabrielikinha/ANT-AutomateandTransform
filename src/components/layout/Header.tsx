import React from 'react';
import { Bell } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100 flex-shrink-0">
      {/* Page title */}
      <div className="pl-10 lg:pl-0">
        <h1 className="text-xl font-bold text-neutral-800">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {actions}
        <button className="relative p-2 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors">
          <Bell size={18} className="text-neutral-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-ant-purple rounded-full" />
        </button>
      </div>
    </header>
  );
}
