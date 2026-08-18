import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { DreEntry, DreInput, EntryType, DRE_CATEGORIES } from '@/types/dre';
import { todayISO } from '@/lib/format';

interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: DreInput) => Promise<void>;
  mode: 'create' | 'edit';
  type: EntryType;
  entry?: DreEntry | null;
}

const emptyForm = (type: EntryType): DreInput => ({
  description: '',
  category: DRE_CATEGORIES[type][0],
  amount: 0,
  entry_date: todayISO(),
  type,
});

export default function EntryModal({ open, onClose, onSubmit, mode, type, entry }: EntryModalProps) {
  const [form, setForm] = useState<DreInput>(emptyForm(type));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setError('');
      if (mode === 'edit' && entry) {
        setForm({
          description: entry.description,
          category: entry.category,
          type: entry.type,
          amount: Number(entry.amount),
          entry_date: entry.entry_date,
        });
      } else {
        setForm(emptyForm(type));
      }
    }
  }, [open, mode, type, entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.description.trim()) {
      setError('Informe uma descrição.');
      return;
    }
    if (!form.category.trim()) {
      setError('Selecione uma categoria.');
      return;
    }
    if (!form.amount || form.amount <= 0) {
      setError('Informe um valor maior que zero.');
      return;
    }
    if (!form.entry_date) {
      setError('Selecione uma data.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Não foi possível salvar o lançamento.');
    } finally {
      setLoading(false);
    }
  };

  const isReceita = form.type === 'receita';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Lançamento' : isReceita ? 'Adicionar Receita' : 'Adicionar Despesa'}
      subtitle={isReceita ? 'Registre uma entrada de dinheiro no negócio.' : 'Registre uma saída de dinheiro do negócio.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Descrição"
          placeholder={isReceita ? 'Ex: Venda de produtos' : 'Ex: Conta de luz'}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          maxLength={120}
          icon={isReceita ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Categoria</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 py-2.5 px-3.5 outline-none focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft"
          >
            {DRE_CATEGORIES[form.type].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valor (R$)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={form.amount === 0 ? '' : form.amount}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Data"
            type="date"
            value={form.entry_date}
            onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={isReceita ? 'secondary' : 'primary'}
            loading={loading}
          >
            {mode === 'edit' ? 'Salvar alterações' : isReceita ? 'Adicionar Receita' : 'Adicionar Despesa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
