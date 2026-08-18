export interface InventoryProduct {
  id: string;
  user_id: string;
  name: string;
  category: string;
  barcode: string | null;
  quantity: number;
  cost_price: number;
  sale_price: number;
  minimum_stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  category: string;
  barcode?: string | null;
  quantity: number;
  cost_price: number;
  sale_price: number;
  minimum_stock: number;
}

export type StockStatus = 'normal' | 'low' | 'out';

export function stockStatusOf(p: Pick<InventoryProduct, 'quantity' | 'minimum_stock'>): StockStatus {
  if (p.quantity === 0) return 'out';
  if (p.quantity <= p.minimum_stock) return 'low';
  return 'normal';
}

export const DEFAULT_CATEGORIES = [
  'Vestuário',
  'Alimentação',
  'Utilidades',
  'Papelaria',
  'Eletrônicos',
  'Saúde',
  'Outros',
];
