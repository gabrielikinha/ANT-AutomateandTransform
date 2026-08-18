import { useMemo, useState } from 'react';
import {
  Package, Plus, Search, AlertTriangle, Pencil, Trash2, Camera, Barcode as BarcodeIcon, Inbox,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import Alert from '@/components/ui/Alert';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useProducts } from '@/hooks/useProducts';
import {
  createProduct, updateProduct, deleteProduct, findProductByBarcode, addStock,
} from '@/services/inventoryService';
import { InventoryProduct, ProductInput, stockStatusOf } from '@/types/inventory';
import { formatCurrency } from '@/lib/format';
import ProductModal from '@/components/inventory/ProductModal';
import AddStockModal from '@/components/inventory/AddStockModal';
import BarcodeScanner from '@/components/inventory/BarcodeScanner';

type StatusFilter = 'all' | 'normal' | 'low' | 'out';

export default function Estoque() {
  const { products, loading, error, reload } = useProducts();
  const { toasts, close, success, error: showError } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [initialBarcode, setInitialBarcode] = useState<string>('');

  const [scannerOpen, setScannerOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [foundProduct, setFoundProduct] = useState<InventoryProduct | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<InventoryProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      const st = stockStatusOf(p);
      if (statusFilter !== 'all' && st !== statusFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((p) => stockStatusOf(p) === 'low').length;
    const outStock = products.filter((p) => stockStatusOf(p) === 'out').length;
    const normal = products.filter((p) => stockStatusOf(p) === 'normal').length;
    const totalUnits = products.reduce((s, p) => s + p.quantity, 0);
    const stockValue = products.reduce((s, p) => s + p.quantity * Number(p.sale_price), 0);
    return { total, lowStock, outStock, normal, totalUnits, stockValue };
  }, [products]);

  const lowStockProducts = useMemo(
    () => products.filter((p) => stockStatusOf(p) === 'low' || stockStatusOf(p) === 'out'),
    [products],
  );

  const openCreate = () => {
    setEditingProduct(null);
    setInitialBarcode('');
    setProductModalOpen(true);
  };

  const openEdit = (p: InventoryProduct) => {
    setEditingProduct(p);
    setInitialBarcode('');
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (input: ProductInput) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, input);
      success('Produto atualizado com sucesso!');
    } else {
      await createProduct(input);
      success('Produto cadastrado com sucesso!');
    }
    await reload();
  };

  const handleBarcodeDetected = async (code: string) => {
    setScannerOpen(false);
    try {
      const existing = await findProductByBarcode(code);
      if (existing) {
        setFoundProduct(existing);
        setAddStockOpen(true);
      } else {
        setEditingProduct(null);
        setInitialBarcode(code);
        setProductModalOpen(true);
      }
    } catch {
      showError('Não foi possível verificar o código. Tente novamente.');
    }
  };

  const handleAddStock = async (productId: string, amount: number) => {
    await addStock(productId, amount);
    success('Estoque atualizado com sucesso!');
    await reload();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      success('Produto excluído com sucesso!');
      setDeleteTarget(null);
      await reload();
    } catch (err: any) {
      showError('Não foi possível excluir o produto.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusBadge = (p: InventoryProduct) => {
    const st = stockStatusOf(p);
    if (st === 'out') return <Badge variant="error">Sem estoque</Badge>;
    if (st === 'low') return <Badge variant="warning">Estoque baixo</Badge>;
    return <Badge variant="success">Em estoque</Badge>;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Meu Estoque"
        subtitle="Controle de produtos e quantidades do seu negócio"
        actions={
          <div className="hidden sm:flex gap-2">
            <Button size="sm" variant="outline" icon={<Camera size={14} />} onClick={() => setScannerOpen(true)}>
              Ler código
            </Button>
            <Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={openCreate}>
              Adicionar Produto
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Mobile actions */}
        <div className="sm:hidden flex gap-2">
          <Button size="sm" variant="outline" fullWidth icon={<Camera size={14} />} onClick={() => setScannerOpen(true)}>
            Ler código
          </Button>
          <Button size="sm" variant="secondary" fullWidth icon={<Plus size={14} />} onClick={openCreate}>
            Adicionar
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total de Produtos"
            value={loading ? '...' : String(stats.total)}
            icon={<Package size={18} className="text-ant-purple" />}
            iconBg="bg-ant-purple-soft"
            subtitle={`${stats.totalUnits} unidades`}
          />
          <StatCard
            label="Em Estoque"
            value={loading ? '...' : String(stats.normal)}
            icon={<Package size={18} className="text-success-600" />}
            iconBg="bg-success-100"
          />
          <StatCard
            label="Estoque Baixo"
            value={loading ? '...' : String(stats.lowStock)}
            icon={<AlertTriangle size={18} className="text-warning-600" />}
            iconBg="bg-warning-100"
          />
          <StatCard
            label="Sem Estoque"
            value={loading ? '...' : String(stats.outStock)}
            icon={<AlertTriangle size={18} className="text-error-500" />}
            iconBg="bg-error-100"
          />
        </div>

        {/* Low stock alert */}
        {lowStockProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-warning-50 border border-warning-100 rounded-2xl animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-warning-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-warning-700">
                Atenção: {lowStockProducts.length} produto(s) precisam de reposição
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {lowStockProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openEdit(p)}
                    className="transition-transform hover:scale-105"
                  >
                    <Badge variant={stockStatusOf(p) === 'out' ? 'error' : 'warning'}>
                      {p.name} ({p.quantity})
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar produto por nome..."
                icon={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex bg-neutral-100 rounded-xl p-1">
                {([
                  { id: 'all', label: 'Todos' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'low', label: 'Baixo' },
                  { id: 'out', label: 'Sem' },
                ] as { id: StatusFilter; label: string }[]).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      statusFilter === f.id ? 'bg-white text-ant-purple shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-700 outline-none focus:border-ant-purple"
              >
                <option value="all">Todas categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Products table */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">Produtos</h3>
            <Badge variant="neutral">{filtered.length} item(s)</Badge>
          </div>

          {/* Table header (desktop) */}
          <div className="hidden lg:grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1fr_0.7fr] gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100">
            {['Produto', 'Categoria', 'Quantidade', 'Preço Custo', 'Preço Venda', 'Status', 'Ações'].map((h) => (
              <span key={h} className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-400">Carregando produtos...</p>
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
                  {products.length === 0 ? 'Seu estoque está vazio' : 'Nenhum produto encontrado'}
                </h3>
                <p className="text-sm text-neutral-400 mt-1 max-w-xs">
                  {products.length === 0
                    ? 'Cadastre seu primeiro produto para começar a acompanhar seu estoque.'
                    : 'Tente ajustar os filtros de busca.'}
                </p>
              </div>
              {products.length === 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button icon={<Camera size={14} />} variant="outline" size="sm" onClick={() => setScannerOpen(true)}>
                    Ler código de barras
                  </Button>
                  <Button icon={<Plus size={14} />} variant="secondary" size="sm" onClick={openCreate}>
                    Adicionar Produto
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1fr_0.7fr] gap-2 lg:gap-4 px-5 py-3.5 hover:bg-neutral-50/60 transition-colors items-center"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-ant-purple-soft flex items-center justify-center flex-shrink-0">
                      {p.barcode ? <BarcodeIcon size={14} className="text-ant-purple" /> : <Package size={14} className="text-ant-purple" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-700 truncate">{p.name}</p>
                      {p.barcode && <p className="text-[10px] text-neutral-400 truncate">{p.barcode}</p>}
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <Badge variant="purple">{p.category}</Badge>
                  </div>
                  <span className={`text-sm font-semibold ${p.quantity === 0 ? 'text-error-500' : p.quantity <= p.minimum_stock ? 'text-warning-600' : 'text-neutral-700'}`}>
                    {p.quantity} un
                  </span>
                  <span className="hidden lg:block text-sm text-neutral-500">{formatCurrency(Number(p.cost_price))}</span>
                  <span className="text-sm font-medium text-ant-green">{formatCurrency(Number(p.sale_price))}</span>
                  <div>{statusBadge(p)}</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-ant-purple transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:bg-error-50 hover:text-error-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stock value footer */}
        {products.length > 0 && (
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-xs text-neutral-400">Valor total em estoque (preço de venda)</span>
            <span className="text-sm font-bold text-ant-green">{formatCurrency(stats.stockValue)}</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        mode={editingProduct ? 'edit' : 'create'}
        product={editingProduct}
        initialBarcode={initialBarcode}
      />

      <AddStockModal
        open={addStockOpen}
        onClose={() => setAddStockOpen(false)}
        product={foundProduct}
        onAdd={handleAddStock}
      />

      {scannerOpen && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setScannerOpen(false)}
          onManualEntry={handleBarcodeDetected}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-error-100 flex items-center justify-center">
                <Trash2 size={18} className="text-error-500" />
              </div>
              <h3 className="text-base font-semibold text-neutral-800">Excluir produto?</h3>
            </div>
            <p className="text-sm text-neutral-500 mb-1">
              Tem certeza que deseja excluir <strong className="text-neutral-700">{deleteTarget.name}</strong>?
            </p>
            <p className="text-xs text-neutral-400 mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete} loading={deleteLoading}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={close} />
    </div>
  );
}
