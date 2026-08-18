import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  onLogout: () => void;
  userName?: string;
  children: React.ReactNode;
}

export default function Layout({ activeNav, onNavChange, onLogout, userName, children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
        userName={userName}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
