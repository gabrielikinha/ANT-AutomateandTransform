import { useMemo, useState } from 'react';
import {
  TrendingUp, TrendingDown, Plus, Pencil, Trash2, Search, FileText, Inbox,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import StatCard from '@/components/ui/StatCard';
import EntryModal from '@/components/dre/EntryModal';
import { useDreEntries } from '@/hooks/useDreEntries';
import { createEntry, updateEntry, deleteEntry } from '@/services/dreService';
import { summarize } from '@/lib/dreCalc';
import { formatCurrency, formatDate } from '@/lib/format';
import { DreEntry, DreInput, EntryType } from '@/types/dre';

type FilterType = 'all' | EntryType;

const periodOptions = [
  { id: 'all', label: 'Todo o período' },
  { id: 'month', label: 'Este mês' },
  { id: 'year', label: 'Este ano' },
];

function inThisMonth(iso: string): boolean {
  const now = new Date();
  const d = new Date(iso + 'T00:00:00');
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}
function inThisYear(iso: string): boolean {
  return new Date(iso + 'T00:00:00').getFullYear() === new Date().getFullYear();
}

export default function DRE() {
  const { entries, loading, error, reload } = useDreEntries();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<EntryType>('receita');
  const [editing, setEditing] = useState<DreEntry | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterType !== 'all' && e.type !== filterType) return false;
      if (filterPeriod === 'month' && !inThisMonth(e.entry_date)) return false;
      if (filterPeriod === 'year' && !inThisYear(e.entry_date)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!e.description.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [entries, filterType, filterPeriod, search]);

  const summary = useMemo(() => summarize(filtered), [filtered]);

  const openCreate = (type: EntryType) => {
    setEditing(null);
    setModalType(type);
    setModalOpen(true);
  };

  const openEdit = (entry: DreEntry) => {
    setEditing(entry);
    setModalType(entry.type);
    setModalOpen(true);
  };

  const handleSubmit = async (input: DreInput) => {
    if (editing) {
      await updateEntry(editing.id, input);
    } else {
      await createEntry(input);
    }
    await reload();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteEntry(deleteId);
      await reload();
      setDeleteId(null);
    } catch (err: any) {
      // keep modal open with message
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Minha DRE"
        subtitle="Demonstrativo de Resultado do Exercício simplificado"
        actions={
          <div className="hidden sm:flex gap-2">
            <Button size="sm" variant="secondary" icon={<TrendingUp size={14} />} onClick={() => openCreate('receita')}>
              Adicionar Receita
            </Button>
            <Button size="sm" variant="primary" icon={<TrendingDown size={14} />} onClick={() => openCreate('despesa')}>
              Adicionar Despesa
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Mobile actions */}
        <div className="sm:hidden flex gap-2">
          <Button size="sm" variant="secondary" fullWidth icon={<TrendingUp size={14} />} onClick={() => openCreate('receita')}>
            Receita
          </Button>
          <Button size="sm" variant="primary" fullWidth icon={<TrendingDown size={14} />} onClick={() => openCreate('despesa')}>
            Despesa
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Receita Total"
            value={formatCurrency(summary.receita)}
            icon={<TrendingUp size={18} className="text-ant-green" />}
            iconBg="bg-ant-green-soft"
            subtitle={filtered.filter((e) => e.type === 'receita').length + ' lançamento(s)'}
          />
          <StatCard
            label="Despesas"
            value={formatCurrency(summary.despesa)}
            icon={<TrendingDown size={18} className="text-error-500" />}
            iconBg="bg-error-100"
            subtitle={filtered.filter((e) => e.type === 'despesa').length + ' lançamento(s)'}
          />
          <StatCard
            label="Lucro Líquido"
            value={formatCurrency(summary.lucro)}
            icon={<FileText size={18} className="text-ant-purple" />}
            iconBg="bg-ant-purple-soft"
            subtitle={summary.margem !== 0 ? `Margem: ${summary.margem.toFixed(1)}%` : undefined}
          />
        </div>

        {/* DRE structured summary */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-ant-purple-soft flex items-center justify-center">
              <FileText size={16} className="text-ant-purple" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">DRE Simplificada</h3>
              <p className="text-xs text-neutral-400">Resultado do período selecionado</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-50">
              <span className="text-sm text-neutral-600">(+) Receita Bruta</span>
              <span className="text-sm font-bold text-ant-green">{formatCurrency(summary.receita)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-50">
              <span className="text-sm text-neutral-600">(−) Despesas Totais</span>
              <span className="text-sm font-bold text-error-500">{formatCurrency(summary.despesa)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 mt-1 bg-gradient-to-r from-ant-purple-soft to-white rounded-xl border border-ant-purple/10">
              <span className="text-sm font-bold text-neutral-800">(=) Resultado Líquido</span>
              <span className={`text-base font-bold ${summary.lucro >= 0 ? 'text-ant-purple' : 'text-error-600'}`}>
                {formatCurrency(summary.lucro)}
              </span>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por descrição ou categoria..."
                icon={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex bg-neutral-100 rounded-xl p-1">
                {(['all', 'receita', 'despesa'] as FilterType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      filterType === t ? 'bg-white text-ant-purple shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    {t === 'all' ? 'Todos' : t === 'receita' ? 'Receitas' : 'Despesas'}
                  </button>
                ))}
              </div>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="text-sm border border-neutral-200 rounded-xl px-3 py-2 bg-white text-neutral-700 outline-none focus:border-ant-purple"
              >
                {periodOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Entries table */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">Lançamentos</h3>
            <Badge variant="neutral">{filtered.length} registro(s)</Badge>
          </div>

          {/* Table header (desktop) */}
          <div className="hidden sm:grid grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100">
            {['Descrição', 'Categoria', 'Tipo', 'Data', 'Valor', 'Ações'].map((h) => (
              <span key={h} className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-400">Carregando lançamentos...</p>
            </div>
          ) : error ? (
            <div className="p-5">
              <Alert variant="error">{error}</Alert>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-ant-purple-soft flex items-center justify-center">
                <Inbox size={28} className="text-ant-purple" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-700">
                  {entries.length === 0 ? 'Você ainda não possui lançamentos.' : 'Nenhum lançamento encontrado'}
                </h3>
                <p className="text-sm text-neutral-400 mt-1 max-w-xs">
                  {entries.length === 0
                    ? 'Comece adicionando suas receitas e despesas para acompanhar a saúde do seu negócio.'
                    : 'Tente ajustar os filtros de busca.'}
                </p>
              </div>
              {entries.length === 0 && (
                <div className="flex gap-3">
                  <Button icon={<TrendingUp size={14} />} variant="secondary" size="sm" onClick={() => openCreate('receita')}>
                    Adicionar Receita
                  </Button>
                  <Button icon={<TrendingDown size={14} />} variant="primary" size="sm" onClick={() => openCreate('despesa')}>
                    Adicionar Despesa
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {filtered.map((entry) => {
                const isReceita = entry.type === 'receita';
                return (
                  <div key={entry.id} className="grid grid-cols-1 sm:grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-2 sm:gap-4 px-5 py-3.5 hover:bg-neutral-50/60 transition-colors items-center">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isReceita ? 'bg-ant-green' : 'bg-error-500'}`} />
                      <span className="text-sm text-neutral-700 truncate">{entry.description}</span>
                    </div>
                    <div className="hidden sm:block">
                      <Badge variant={isReceita ? 'green' : 'error'}>{entry.category}</Badge>
                    </div>
                    <div className="hidden sm:block">
                      <Badge variant={isReceita ? 'success' : 'error'}>
                        {isReceita ? 'Receita' : 'Despesa'}
                      </Badge>
                    </div>
                    <span className="hidden sm:block text-sm text-neutral-500">{formatDate(entry.entry_date)}</span>
                    <span className={`text-sm font-semibold ${isReceita ? 'text-ant-green' : 'text-error-500'}`}>
                      {isReceita ? '+' : '−'} {formatCurrency(Number(entry.amount))}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(entry)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-ant-purple transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(entry.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:bg-error-50 hover:text-error-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <EntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        mode={editing ? 'edit' : 'create'}
        type={modalType}
        entry={editing}
      />

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-error-100 flex items-center justify-center">
                <Trash2 size={18} className="text-error-500" />
              </div>
              <h3 className="text-base font-semibold text-neutral-800">Excluir lançamento?</h3>
            </div>
            <p className="text-sm text-neutral-500 mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeleteId(null)} disabled={deleteLoading}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete} loading={deleteLoading}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
