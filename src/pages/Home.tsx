import React from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Package, ArrowRight, AlertTriangle, Sparkles,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useDreEntries } from '@/hooks/useDreEntries';
import { summarize } from '@/lib/dreCalc';
import { formatCurrency } from '@/lib/format';

interface HomeProps {
  onNavChange: (id: string) => void;
  userName?: string;
}

export default function Home({ onNavChange, userName }: HomeProps) {
  const { entries, loading } = useDreEntries();
  const summary = summarize(entries);
  const hasData = entries.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={userName ? `Olá, ${userName.split(' ')[0]}!` : 'Olá, Empreendedor!'}
        subtitle="O ANT ajuda você a organizar e acompanhar seu negócio."
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* KPI Cards */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Visão Geral
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Receita Total"
              value={loading ? '...' : formatCurrency(summary.receita)}
              icon={<TrendingUp size={18} className="text-ant-green" />}
              iconBg="bg-ant-green-soft"
              subtitle={hasData ? `${entries.filter(e => e.type === 'receita').length} lançamento(s)` : 'Sem lançamentos ainda'}
            />
            <StatCard
              label="Despesas"
              value={loading ? '...' : formatCurrency(summary.despesa)}
              icon={<TrendingDown size={18} className="text-error-500" />}
              iconBg="bg-error-100"
              subtitle={hasData ? `${entries.filter(e => e.type === 'despesa').length} lançamento(s)` : 'Sem lançamentos ainda'}
            />
            <StatCard
              label="Lucro Líquido"
              value={loading ? '...' : formatCurrency(summary.lucro)}
              icon={<DollarSign size={18} className="text-ant-purple" />}
              iconBg="bg-ant-purple-soft"
              subtitle={hasData ? `Margem: ${summary.margem.toFixed(1)}%` : 'Receita menos despesas'}
            />
            <StatCard
              label="Impacto"
              value={loading ? '...' : (hasData ? (summary.margem >= 0 ? 'Positivo' : 'Atenção') : '—')}
              icon={<Sparkles size={18} className="text-warning-600" />}
              iconBg="bg-warning-100"
              subtitle={hasData ? (summary.margem >= 15 ? 'Negócio saudável' : summary.margem >= 0 ? 'Lucro apertado' : 'Operando no vermelho') : 'Cadastre dados para ver'}
            />
          </div>
        </section>

        {/* DRE Preview + Alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DRE Preview */}
          <Card className="lg:col-span-2 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-neutral-800">DRE Simplificada</h3>
                <p className="text-sm text-neutral-400">Resumo do período</p>
              </div>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => onNavChange('dre')}>
                Ver completo
              </Button>
            </div>

            {hasData ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2.5 border-b border-neutral-50">
                  <span className="text-sm text-neutral-600">(+) Receita Bruta</span>
                  <span className="text-sm font-bold text-ant-green">{formatCurrency(summary.receita)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-neutral-50">
                  <span className="text-sm text-neutral-600">(−) Despesas Totais</span>
                  <span className="text-sm font-bold text-error-500">{formatCurrency(summary.despesa)}</span>
                </div>
                <div className="flex items-center justify-between py-3 mt-1 bg-gradient-to-r from-ant-purple-soft to-white rounded-xl border border-ant-purple/10 px-4">
                  <span className="text-sm font-bold text-neutral-800">(=) Resultado Líquido</span>
                  <span className={`text-base font-bold ${summary.lucro >= 0 ? 'text-ant-purple' : 'text-error-600'}`}>
                    {formatCurrency(summary.lucro)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-ant-purple-soft flex items-center justify-center">
                  <DollarSign size={20} className="text-ant-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Você ainda não possui lançamentos.</p>
                  <p className="text-xs text-neutral-400 mt-1">Cadastre receitas e despesas na DRE para ver os resultados.</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => onNavChange('dre')}>Ir para a DRE</Button>
              </div>
            )}
          </Card>

          {/* Alerts */}
          <Card className="p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Alertas</h3>
              <p className="text-sm text-neutral-400">Pontos de atenção</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {!hasData ? (
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Sem alertas no momento</p>
                    <p className="text-xs text-neutral-400 mt-1">Os alertas aparecerão conforme você cadastrar dados.</p>
                  </div>
                </div>
              ) : (
                <>
                  {summary.lucro < 0 && (
                    <div className="flex items-start gap-3 p-3 bg-error-50 rounded-xl border border-error-100">
                      <AlertTriangle size={16} className="text-error-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-error-700">Resultado negativo</p>
                        <p className="text-xs text-error-600 mt-0.5">Suas despesas superam as receitas no período.</p>
                      </div>
                    </div>
                  )}
                  {summary.margem >= 0 && summary.margem < 15 && (
                    <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-xl border border-warning-100">
                      <AlertTriangle size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning-700">Margem baixa</p>
                        <p className="text-xs text-warning-600 mt-0.5">Sua margem de lucro está abaixo de 15%.</p>
                      </div>
                    </div>
                  )}
                  {summary.margem >= 15 && (
                    <div className="flex items-start gap-3 p-3 bg-success-50 rounded-xl border border-success-100">
                      <TrendingUp size={16} className="text-success-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-success-700">Negócio saudável</p>
                        <p className="text-xs text-success-600 mt-0.5">Sua margem de lucro está acima de 15%.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
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
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">Acesso Rápido</h2>
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
