import React from 'react';
import { TrendingUp, TrendingDown, Plus, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function DRE() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Minha DRE"
        subtitle="Demonstrativo de Resultado do Exercício simplificado"
        actions={
          <Button size="sm" icon={<Plus size={14} />}>
            Novo Lançamento
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Period selector placeholder */}
        <div className="flex items-center gap-3">
          <select className="text-sm border border-neutral-200 rounded-xl px-3 py-2 bg-white text-neutral-700 outline-none focus:border-ant-purple">
            <option>Este mês</option>
            <option>Mês anterior</option>
            <option>Este trimestre</option>
            <option>Este ano</option>
          </select>
          <Badge variant="neutral">Agosto 2026</Badge>
        </div>

        {/* DRE Table */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-ant-purple-soft flex items-center justify-center">
              <FileText size={16} className="text-ant-purple" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">DRE Simplificada</h3>
              <p className="text-xs text-neutral-400">Resultados do período selecionado</p>
            </div>
          </div>

          <div className="space-y-1">
            {/* Revenues */}
            <div className="bg-ant-green-soft/40 rounded-xl px-4 py-3 mb-2">
              <p className="text-xs font-semibold text-ant-green uppercase tracking-wide">Receitas</p>
            </div>
            {[
              { label: 'Receita de Vendas', value: '—' },
              { label: 'Outras Receitas', value: '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors">
                <span className="text-sm text-neutral-600">{label}</span>
                <span className="text-sm font-semibold text-neutral-700">R$ {value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-100 mt-1">
              <span className="text-sm font-semibold text-neutral-700">= Receita Bruta</span>
              <span className="text-sm font-bold text-ant-green">R$ —</span>
            </div>

            <div className="h-4" />

            {/* CMV */}
            <div className="bg-neutral-100/60 rounded-xl px-4 py-3 mb-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Custos</p>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors">
              <span className="text-sm text-neutral-600">Custo das Mercadorias Vendidas (CMV)</span>
              <span className="text-sm font-semibold text-neutral-700">R$ —</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-100 mt-1">
              <span className="text-sm font-semibold text-neutral-700">= Lucro Bruto</span>
              <span className="text-sm font-bold text-ant-green">R$ —</span>
            </div>

            <div className="h-4" />

            {/* Expenses */}
            <div className="bg-error-100/50 rounded-xl px-4 py-3 mb-2">
              <p className="text-xs font-semibold text-error-500 uppercase tracking-wide">Despesas Operacionais</p>
            </div>
            {[
              { label: 'Despesas Fixas', value: '—' },
              { label: 'Despesas Variáveis', value: '—' },
              { label: 'Folha de Pagamento', value: '—' },
              { label: 'Marketing', value: '—' },
              { label: 'Outras Despesas', value: '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors">
                <span className="text-sm text-neutral-600">{label}</span>
                <span className="text-sm font-semibold text-neutral-700">R$ {value}</span>
              </div>
            ))}

            <div className="h-4" />

            {/* Result */}
            <div className="bg-gradient-to-r from-ant-purple-soft to-white rounded-xl px-4 py-4 border border-ant-purple/10">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-neutral-800">Resultado Líquido</span>
                <span className="text-xl font-bold text-ant-purple">R$ —</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">Receita bruta menos todas as despesas</p>
            </div>
          </div>
        </Card>

        {/* Empty state CTA */}
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-ant-purple-soft flex items-center justify-center">
              <TrendingUp size={28} className="text-ant-purple" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Comece registrando seus lançamentos</h3>
              <p className="text-sm text-neutral-400 mt-2">
                Adicione receitas e despesas para visualizar seu DRE completo e acompanhar a saúde financeira do seu negócio.
              </p>
            </div>
            <div className="flex gap-3">
              <Button icon={<TrendingUp size={14} />} variant="secondary" size="sm">
                Adicionar Receita
              </Button>
              <Button icon={<TrendingDown size={14} />} variant="outline" size="sm">
                Adicionar Despesa
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
