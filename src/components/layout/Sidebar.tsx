import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Activity,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { NavLink } from '@/types/nav';

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  onLogout: () => void;
  userName?: string;
}

const navItems: NavLink[] = [
  { id: 'home',         label: 'Início',           icon: LayoutDashboard },
  { id: 'dre',          label: 'Minha DRE',         icon: TrendingUp },
  { id: 'estoque',      label: 'Estoque',            icon: Package },
  { id: 'saude',        label: 'Saúde do Negócio',  icon: Activity },
];

const bottomItems: NavLink[] = [
  { id: 'perfil',       label: 'Perfil',            icon: User },
  { id: 'configuracoes',label: 'Configurações',      icon: Settings },
];

export default function Sidebar({ activeNav, onNavChange, onLogout, userName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center px-0' : ''}`}>
        <img
          src="/assets/images/ant.png"
          alt="ANT Logo"
          className="w-9 h-9 object-contain flex-shrink-0"
        />
        {!collapsed && (
          <div>
            <span className="font-bold text-neutral-800 text-lg leading-none">ANT</span>
            <p className="text-[10px] text-neutral-400 leading-none mt-0.5">Automate and Transform</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-neutral-100 mb-4" />

      {/* Main nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { onNavChange(id); setMobileOpen(false); }}
            className={`ant-sidebar-link ${activeNav === id ? 'active' : ''} ${collapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 mb-2">
        <div className="border-t border-neutral-100 pt-3 flex flex-col gap-1">
          {bottomItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavChange(id); setMobileOpen(false); }}
              className={`ant-sidebar-link ${activeNav === id ? 'active' : ''} ${collapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}

          <button
            onClick={onLogout}
            className={`ant-sidebar-link text-error-500 hover:bg-error-50 hover:text-error-600 ${collapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* User info */}
      {!collapsed && userName && (
        <div className="mx-3 mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ant-purple to-ant-purple-light flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-700 truncate">{userName}</p>
              <p className="text-[10px] text-neutral-400">Empreendedor(a)</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full border border-neutral-200 bg-white shadow-sm text-neutral-500 hover:text-ant-purple absolute -right-3 top-20 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-card border border-neutral-100"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} className="text-neutral-600" /> : <Menu size={20} className="text-neutral-600" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full z-40
          bg-white shadow-sidebar border-r border-neutral-100
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64
        `}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:block relative flex-shrink-0 h-full
          bg-white border-r border-neutral-100 shadow-sidebar
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
