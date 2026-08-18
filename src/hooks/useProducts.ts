import { useCallback, useEffect, useState } from 'react';
import { InventoryProduct } from '@/types/inventory';
import { fetchProducts } from '@/services/inventoryService';

export function useProducts() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível carregar seus produtos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, reload: load, setProducts };
}
