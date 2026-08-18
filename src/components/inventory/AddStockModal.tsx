import { useState } from 'react';
import { Package, Plus, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import { InventoryProduct } from '@/types/inventory';
import { formatCurrency } from '@/lib/format';
import { stockStatusOf } from '@/types/inventory';

interface AddStockModalProps {
  open: boolean;
  onClose: () => void;
  product: InventoryProduct | null;
  onAdd: (productId: string, amount: number) => Promise<void>;
}

export default function AddStockModal({ open, onClose, product, onAdd }: AddStockModalProps) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAmount(0);
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!product) return;
    if (amount <= 0) { setError('Informe uma quantidade maior que zero.'); return; }

    setLoading(true);
    try {
      await onAdd(product.id, amount);
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Não foi possível adicionar ao estoque.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;
  const status = stockStatusOf(product);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Produto encontrado"
      subtitle="Este código de barras já está cadastrado no seu estoque"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        {/* Product info card */}
        <div className="flex items-center gap-4 p-4 bg-ant-lilac rounded-xl border border-ant-purple/10">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Package size={20} className="text-ant-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-800 truncate">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="purple">{product.category}</Badge>
              <Badge variant={status === 'out' ? 'error' : status === 'low' ? 'warning' : 'success'}>
                {product.quantity} un.
              </Badge>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-neutral-400">Venda</p>
            <p className="text-sm font-bold text-ant-green">{formatCurrency(Number(product.sale_price))}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-success-50 rounded-xl border border-success-100">
          <CheckCircle size={16} className="text-success-600 flex-shrink-0" />
          <p className="text-xs text-success-700">
            Estoque atual: <strong>{product.quantity}</strong> unidades.
          </p>
        </div>

        <Input
          label="Quantas unidades deseja adicionar?"
          type="number"
          min="1"
          placeholder="Ex: 15"
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          autoFocus
          hint={`Novo estoque total: ${product.quantity + (amount > 0 ? amount : 0)} unidades`}
        />

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" icon={<Plus size={14} />} loading={loading}>
            Adicionar ao estoque
          </Button>
        </div>
      </form>
    </Modal>
  );
}
