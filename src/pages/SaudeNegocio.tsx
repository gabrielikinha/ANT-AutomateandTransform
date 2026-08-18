import {
  CheckCircle, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, DollarSign,
  Package, Activity, Inbox, ShieldCheck, ShieldAlert, Heart,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { useDreEntries } from '@/hooks/useDreEntries';
import { useProducts } from '@/hooks/useProducts';
import { calculateHealth, HealthStatus } from '@/lib/healthCalc';
import { formatCurrency } from '@/lib/format';
import { stockStatusOf } from '@/types/inventory';

interface SaudeNegocioProps {
  onNavChange: (id: string) => void;
}

const STATUS_CONFIG: Record<HealthStatus, {
  label: string;
  icon: typeof ShieldCheck;
  color: string;
  bg: string;
  ring: string;
  text: string;
  badge: 'success' | 'warning' | 'error';
}> = {
  saudavel: {
    label: 'Saudável',
    icon: ShieldCheck,
    color: 'text-success-600',
    bg: 'bg-success-50',
    ring: 'ring-success-100',
    text: 'text-success-700',
    badge: 'success',
  },
  atencao: {
    label: 'Atenção',
    icon: ShieldAlert,
    color: 'text-warning-600',
    bg: 'bg-warning-50',
    ring: 'ring-warning-100',
    text: 'text-warning-700',
    badge: 'warning',
  },
  critico: {
    label: 'Crítico',
    icon: ShieldAlert,
    color: 'text-error-500',
    bg: 'bg-error-50',
    ring: 'ring-error-100',
    text: 'text-error-700',
    badge: 'error',
  },
};

export default function SaudeNegocio({ onNavChange }: SaudeNegocioProps) {
  const { entries, loading: loadingEntries } = useDreEntries();
  const { products, loading: loadingProducts } = useProducts();

  const loading = loadingEntries || loadingProducts;
  const report = calculateHealth(entries, products);
  const statusCfg = STATUS_CONFIG[report.status];

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Header title="Saúde do Negócio" subtitle="Análise automática baseada nos dados do seu negócio" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-neutral-400">Analisando seus dados...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!report.hasData) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Header title="Saúde do Negócio" subtitle="Análise automática baseada nos dados do seu negócio" />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center gap-5 py-16 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-ant-purple-soft flex items-center justify-center">
              <Heart size={32} className="text-ant-purple" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-800">Ainda não há dados para analisar</h2>
              <p className="text-sm text-neutral-400 mt-2">
                Cadastre suas receitas, despesas e produtos para começar a acompanhar a saúde do seu negócio.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" size="sm" onClick={() => onNavChange('dre')}>
                Cadastrar lançamentos
              </Button>
              <Button variant="outline" size="sm" onClick={() => onNavChange('estoque')}>
                Cadastrar produtos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Saúde do Negócio" subtitle="Análise automática baseada nos dados do seu negócio" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Status geral */}
        <Card className={`p-5 sm:p-6 ${statusCfg.bg} ring-1 ${statusCfg.ring} border-0`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <statusCfg.icon size={26} className={statusCfg.color} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-neutral-800">Situação geral</h2>
                <Badge variant={statusCfg.badge}>{statusCfg.label}</Badge>
              </div>
              <p className={`text-sm ${statusCfg.text}`}>
                {report.status === 'saudavel' && 'Seu negócio está em bom estado. Continue acompanhando os indicadores.'}
                {report.status === 'atencao' && 'Existem pontos que merecem atenção. Confira os detalhes abaixo.'}
                {report.status === 'critico' && 'Seu negócio precisa de atenção imediata. Veja os pontos de atenção.'}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <span className="text-xs text-neutral-400">Pontuação</span>
              <span className={`text-2xl font-bold ${statusCfg.color}`}>{report.score}</span>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-4 h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                report.status === 'saudavel' ? 'bg-success-500' : report.status === 'atencao' ? 'bg-warning-500' : 'bg-error-500'
              }`}
              style={{ width: `${report.score}%` }}
            />
          </div>
        </Card>

        {/* Indicators */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">Indicadores</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Resultado Financeiro"
              value={formatCurrency(report.lucro)}
              icon={<DollarSign size={18} className={report.lucro >= 0 ? 'text-ant-green' : 'text-error-500'} />}
              iconBg={report.lucro >= 0 ? 'bg-ant-green-soft' : 'bg-error-100'}
              subtitle={report.lucro >= 0 ? 'Lucro no período' : 'Prejuízo no período'}
            />
            <StatCard
              label="Margem de Lucro"
              value={`${report.margem.toFixed(1)}%`}
              icon={<Activity size={18} className={report.margem >= 15 ? 'text-success-600' : report.margem >= 0 ? 'text-warning-600' : 'text-error-500'} />}
              iconBg="bg-ant-purple-soft"
              subtitle={report.margem >= 15 ? 'Acima do ideal' : report.margem >= 0 ? 'Abaixo do ideal' : 'Negativa'}
            />
            <StatCard
              label="Produtos Cadastrados"
              value={String(report.totalProdutos)}
              icon={<Package size={18} className="text-ant-purple" />}
              iconBg="bg-ant-purple-soft"
              subtitle={`${report.produtosEstoqueNormal} com estoque normal`}
            />
            <StatCard
              label="Produtos com Estoque Baixo"
              value={String(report.produtosEstoqueBaixo + report.produtosSemEstoque)}
              icon={<AlertTriangle size={18} className="text-warning-600" />}
              iconBg="bg-warning-100"
              subtitle={`${report.produtosSemEstoque} sem estoque`}
            />
          </div>
        </section>

        {/* Receitas vs Despesas bar */}
        {entries.length > 0 && (
          <Card className="p-5 sm:p-6">
            <h3 className="text-base font-semibold text-neutral-800 mb-1">Receitas x Despesas</h3>
            <p className="text-xs text-neutral-400 mb-4">Comparativo financeiro do período</p>

            {(() => {
              const total = report.receita + report.despesa;
              const receitaPct = total > 0 ? (report.receita / total) * 100 : 0;
              const despesaPct = total > 0 ? (report.despesa / total) * 100 : 0;
              return (
                <>
                  <div className="flex h-3 rounded-full overflow-hidden bg-neutral-100">
                    <div className="bg-ant-green transition-all duration-500" style={{ width: `${receitaPct}%` }} />
                    <div className="bg-error-400 transition-all duration-500" style={{ width: `${despesaPct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-ant-green" />
                      <span className="text-neutral-600">Receitas</span>
                      <span className="font-semibold text-ant-green">{formatCurrency(report.receita)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-error-400" />
                      <span className="text-neutral-600">Despesas</span>
                      <span className="font-semibold text-error-500">{formatCurrency(report.despesa)}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </Card>
        )}

        {/* Acertos */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-success-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-success-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-800">Acertos</h2>
              <p className="text-xs text-neutral-400">Pontos positivos do seu negócio</p>
            </div>
          </div>
          {report.acertos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.acertos.map((a) => (
                <Card key={a.id} className="p-5 border-success-100 bg-success-50/40">
                  <div className="flex items-start gap-3">
                    <TrendingUp size={18} className="text-success-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-700">{a.message}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-sm text-neutral-400">Nenhum acerto identificado ainda. Continue cadastrando dados.</p>
            </Card>
          )}
        </section>

        {/* Pontos de atenção */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-error-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-error-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-800">Pontos de atenção</h2>
              <p className="text-xs text-neutral-400">Itens que precisam de acompanhamento</p>
            </div>
          </div>
          {report.pontosAtencao.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.pontosAtencao.map((p) => (
                <Card key={p.id} className="p-5 border-error-100 bg-error-50/40">
                  <div className="flex items-start gap-3">
                    <TrendingDown size={18} className="text-error-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-700">{p.message}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle size={24} className="text-success-500" />
                <p className="text-sm text-neutral-600 font-medium">Nenhum ponto de atenção no momento.</p>
              </div>
            </Card>
          )}
        </section>

        {/* Estoque breakdown */}
        {products.length > 0 && (
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-ant-purple-soft flex items-center justify-center">
                <Package size={18} className="text-ant-purple" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-800">Situação do Estoque</h3>
                <p className="text-xs text-neutral-400">Distribuição dos seus produtos</p>
              </div>
            </div>

            {(() => {
              const total = report.totalProdutos || 1;
              const normalPct = (report.produtosEstoqueNormal / total) * 100;
              const lowPct = (report.produtosEstoqueBaixo / total) * 100;
              const outPct = (report.produtosSemEstoque / total) * 100;
              return (
                <>
                  <div className="flex h-3 rounded-full overflow-hidden bg-neutral-100">
                    <div className="bg-success-500 transition-all duration-500" style={{ width: `${normalPct}%` }} />
                    <div className="bg-warning-500 transition-all duration-500" style={{ width: `${lowPct}%` }} />
                    <div className="bg-error-500 transition-all duration-500" style={{ width: `${outPct}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Normal</p>
                      <p className="text-lg font-bold text-success-600">{report.produtosEstoqueNormal}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Estoque baixo</p>
                      <p className="text-lg font-bold text-warning-600">{report.produtosEstoqueBaixo}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-neutral-400">Sem estoque</p>
                      <p className="text-lg font-bold text-error-500">{report.produtosSemEstoque}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </Card>
        )}

        {/* Dicas */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-ant-purple-soft flex items-center justify-center">
              <Lightbulb size={18} className="text-ant-purple" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-800">Dicas</h2>
              <p className="text-xs text-neutral-400">Sugestões para melhorar seu negócio</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.dicas.map((d) => (
              <Card key={d.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-ant-purple-soft flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={13} className="text-ant-purple" />
                  </div>
                  <p className="text-sm text-neutral-700">{d.message}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <Card className="p-4 bg-neutral-50/60">
          <div className="flex items-start gap-3">
            <Activity size={16} className="text-neutral-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-500">
              Esta análise é gerada automaticamente a partir das receitas, despesas e produtos cadastrados no ANT, usando regras e cálculos do sistema.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
