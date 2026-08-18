import { useEffect, useState } from 'react';
import { Package, Barcode } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { InventoryProduct, ProductInput, DEFAULT_CATEGORIES } from '@/types/inventory';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<void>;
  mode: 'create' | 'edit';
  product?: InventoryProduct | null;
  initialBarcode?: string;
}

const emptyForm: ProductInput = {
  name: '',
  category: DEFAULT_CATEGORIES[0],
  barcode: '',
  quantity: 0,
  cost_price: 0,
  sale_price: 0,
  minimum_stock: 0,
};

export default function ProductModal({
  open, onClose, onSubmit, mode, product, initialBarcode,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (mode === 'edit' && product) {
      setForm({
        name: product.name,
        category: product.category,
        barcode: product.barcode ?? '',
        quantity: product.quantity,
        cost_price: Number(product.cost_price),
        sale_price: Number(product.sale_price),
        minimum_stock: product.minimum_stock,
      });
    } else {
      setForm({ ...emptyForm, barcode: initialBarcode ?? '' });
    }
  }, [open, mode, product, initialBarcode]);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Informe o nome do produto.'); return; }
    if (!form.category.trim()) { setError('Selecione uma categoria.'); return; }
    if (form.quantity < 0) { setError('A quantidade não pode ser negativa.'); return; }
    if (form.sale_price < 0 || form.cost_price < 0) { setError('Os preços não podem ser negativos.'); return; }
    if (form.minimum_stock < 0) { setError('O estoque mínimo não pode ser negativo.'); return; }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('duplicate') || msg.includes('unique')) {
        setError('Já existe um produto com esse código de barras.');
      } else {
        setError(msg || 'Não foi possível salvar o produto.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Produto' : 'Adicionar Produto'}
      subtitle={mode === 'edit' ? 'Atualize as informações do produto' : 'Cadastre um novo produto no estoque'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Nome do produto"
          placeholder="Ex: Camiseta Estampada"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          icon={<Package size={15} />}
          maxLength={120}
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 py-2.5 px-3.5 outline-none focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft"
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input
            label="Código de barras (opcional)"
            placeholder="Ex: 7891234567890"
            value={form.barcode ?? ''}
            onChange={(e) => set('barcode', e.target.value)}
            icon={<Barcode size={15} />}
            inputMode="numeric"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Input
            label="Quantidade"
            type="number"
            min="0"
            placeholder="0"
            value={form.quantity === 0 ? '' : form.quantity}
            onChange={(e) => set('quantity', parseInt(e.target.value) || 0)}
          />
          <Input
            label="Preço de custo (R$)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={form.cost_price === 0 ? '' : form.cost_price}
            onChange={(e) => set('cost_price', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Preço de venda (R$)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={form.sale_price === 0 ? '' : form.sale_price}
            onChange={(e) => set('sale_price', parseFloat(e.target.value) || 0)}
          />
        </div>

        <Input
          label="Estoque mínimo"
          type="number"
          min="0"
          placeholder="0"
          value={form.minimum_stock === 0 ? '' : form.minimum_stock}
          onChange={(e) => set('minimum_stock', parseInt(e.target.value) || 0)}
          hint="Quando a quantidade atingir esse valor, um alerta será exibido."
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" loading={loading}>
            {mode === 'edit' ? 'Salvar alterações' : 'Adicionar Produto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
