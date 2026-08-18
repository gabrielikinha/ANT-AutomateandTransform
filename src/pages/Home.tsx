import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface HomeProps {
  onNavChange: (id: string) => void;
  userName?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Home({ onNavChange, userName }: HomeProps) {
  const greeting = getGreeting();
  const displayName = userName ? `, ${userName.split(' ')[0]}` : '';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={`${greeting}${displayName}!`}
        subtitle="Aqui está um resumo do seu negócio hoje."
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Visão Geral do Mês
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Receita Total"
              value="R$ —"
              icon={<DollarSign size={18} className="text-ant-green" />}
              iconBg="bg-ant-green-soft"
              subtitle="Nenhuma receita registrada ainda"
            />
            <StatCard
              label="Despesas"
              value="R$ —"
              icon={<TrendingDown size={18} className="text-error-500" />}
              iconBg="bg-error-100"
              subtitle="Nenhuma despesa registrada ainda"
            />
            <StatCard
              label="Lucro Líquido"
              value="R$ —"
              icon={<TrendingUp size={18} className="text-ant-purple" />}
              iconBg="bg-ant-purple-soft"
              subtitle="Receita menos despesas"
            />
            <StatCard
              label="Itens em Estoque"
              value="—"
              icon={<Package size={18} className="text-warning-600" />}
              iconBg="bg-warning-100"
              subtitle="Nenhum produto cadastrado ainda"
            />
          </div>
        </section>

        {/* Quick access */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DRE Preview */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-neutral-800">Minha DRE</h3>
                <p className="text-sm text-neutral-400">Demonstrativo simplificado do período</p>
              </div>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => onNavChange('dre')}>
                Ver completo
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Receita Bruta', value: 'R$ —', color: 'text-ant-green' },
                { label: 'Custo das Mercadorias Vendidas (CMV)', value: 'R$ —', color: 'text-neutral-600' },
                { label: 'Lucro Bruto', value: 'R$ —', color: 'text-ant-green' },
                { label: 'Despesas Operacionais', value: 'R$ —', color: 'text-error-500' },
                { label: 'Resultado Líquido', value: 'R$ —', color: 'text-ant-purple font-bold' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
                  <span className="text-sm text-neutral-600">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-ant-purple-soft rounded-xl">
              <p className="text-xs text-ant-purple text-center">
                Cadastre suas receitas e despesas na DRE para ver os resultados aqui.
              </p>
            </div>
          </Card>

          {/* Alerts / Quick info */}
          <Card className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Alertas</h3>
              <p className="text-sm text-neutral-400">Pontos de atenção do negócio</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-neutral-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Sem alertas no momento</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Os alertas aparecerão conforme você cadastrar dados no sistema.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconRight={<ArrowRight size={14} />}
              onClick={() => onNavChange('saude')}
            >
              Saúde do Negócio
            </Button>
          </Card>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Registrar Receita', nav: 'dre', color: 'from-ant-green/10 to-ant-green-soft', textColor: 'text-ant-green', icon: <TrendingUp size={20} /> },
              { label: 'Registrar Despesa', nav: 'dre', color: 'from-error-100 to-error-50', textColor: 'text-error-500', icon: <TrendingDown size={20} /> },
              { label: 'Gerenciar Estoque', nav: 'estoque', color: 'from-warning-100 to-warning-50', textColor: 'text-warning-600', icon: <Package size={20} /> },
              { label: 'Ver DRE Completa', nav: 'dre', color: 'from-ant-purple-soft to-white', textColor: 'text-ant-purple', icon: <DollarSign size={20} /> },
            ].map(({ label, nav, color, textColor, icon }) => (
              <Card
                key={label}
                hover
                onClick={() => onNavChange(nav)}
                className={`p-4 bg-gradient-to-br ${color} border-0`}
              >
                <div className="flex flex-col gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center ${textColor}`}>
                    {icon}
                  </div>
                  <p className={`text-sm font-semibold ${textColor}`}>{label}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
