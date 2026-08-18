import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import DRE from '@/pages/DRE';
import Estoque from '@/pages/Estoque';
import SaudeNegocio from '@/pages/SaudeNegocio';
import Perfil from '@/pages/Perfil';
import Configuracoes from '@/pages/Configuracoes';

type NavId = 'home' | 'dre' | 'estoque' | 'saude' | 'perfil' | 'configuracoes';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img src="/assets/images/ant.png" alt="ANT" className="w-12 h-12 object-contain animate-pulse" />
        <p className="text-sm text-neutral-400 font-medium">Carregando...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { session, user, loading } = useAuth();
  const [activeNav, setActiveNav] = useState<NavId>('home');

  if (loading) return <LoadingScreen />;
  if (!session) return <Login />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Empreendedor';
  const userEmail = user?.email || '';

  const renderPage = () => {
    switch (activeNav) {
      case 'home':        return <Home onNavChange={setActiveNav} userName={userName} />;
      case 'dre':         return <DRE />;
      case 'estoque':     return <Estoque />;
      case 'saude':       return <SaudeNegocio />;
      case 'perfil':      return <Perfil userName={userName} userEmail={userEmail} />;
      case 'configuracoes': return <Configuracoes />;
      default:            return <Home onNavChange={setActiveNav} userName={userName} />;
    }
  };

  return (
    <Layout
      activeNav={activeNav}
      onNavChange={(id) => setActiveNav(id as NavId)}
      onLogout={handleLogout}
      userName={userName}
    >
      {renderPage()}
    </Layout>
  );
}
