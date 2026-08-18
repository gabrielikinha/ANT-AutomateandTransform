import React from 'react';
import { Activity, TrendingUp, Target, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';

const indicators = [
  {
    label: 'Margem de Lucro',
    value: '—%',
    description: 'Percentual de lucro sobre a receita total',
    status: 'neutral' as const,
    tip: 'Ideal: acima de 15% para a maioria dos negócios',
  },
  {
    label: 'Ponto de Equilíbrio',
    value: 'R$ —',
    description: 'Receita mínima para cobrir todas as despesas',
    status: 'neutral' as const,
    tip: 'Vendas acima disso geram lucro',
  },
  {
    label: 'Ticket Médio',
    value: 'R$ —',
    description: 'Valor médio por venda realizada',
    status: 'neutral' as const,
    tip: 'Aumentar o ticket médio é uma das formas mais eficientes de crescer',
  },
  {
    label: 'Liquidez do Negócio',
    value: '—',
    description: 'Capacidade de pagar as contas em dia',
    status: 'neutral' as const,
    tip: 'Ideal: acima de 1,0',
  },
];

export default function SaudeNegocio() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Saúde do Negócio"
        subtitle="Indicadores e análise da situação do seu negócio"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Intro alert */}
        <Alert variant="info" title="Como funciona esta tela?">
          Os indicadores abaixo são calculados automaticamente com base nos dados que você cadastra na DRE e no Estoque.
          Quanto mais dados você registrar, mais precisas serão as análises.
        </Alert>

        {/* Indicators */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Indicadores Financeiros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {indicators.map(({ label, value, description, status, tip }) => (
              <Card key={label} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-neutral-700">{label}</p>
                  <Badge variant={status === 'neutral' ? 'neutral' : status === 'success' ? 'success' : 'error'}>
                    {status === 'neutral' ? 'Sem dados' : status === 'success' ? 'Bom' : 'Atenção'}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-ant-purple mb-2">{value}</p>
                <p className="text-xs text-neutral-400 mb-3">{description}</p>
                <div className="flex items-start gap-2 bg-neutral-50 rounded-lg p-2.5">
                  <Lightbulb size={12} className="text-warning-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-500">{tip}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Diagnosis */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Diagnóstico Geral
          </h2>
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                <Activity size={32} className="text-neutral-300" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-700">Diagnóstico indisponível</h3>
                <p className="text-sm text-neutral-400 mt-2 max-w-md">
                  O diagnóstico automático será gerado assim que você registrar suas receitas, despesas e produtos no sistema.
                  Comece pelos módulos de DRE e Estoque.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span className="text-xs text-neutral-500">Aguardando DRE</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span className="text-xs text-neutral-500">Aguardando Estoque</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Goals placeholder */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Metas e Objetivos
          </h2>
          <Card className="p-6">
            <div className="flex flex-col items-center gap-3 text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-ant-green-soft flex items-center justify-center">
                <Target size={20} className="text-ant-green" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-700">Metas serão desenvolvidas em breve</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Aqui você poderá definir metas financeiras e de crescimento para acompanhar sua evolução.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
