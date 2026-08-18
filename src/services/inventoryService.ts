import { supabase } from '@/lib/supabase';
import { InventoryProduct, ProductInput } from '@/types/inventory';

export async function fetchProducts(): Promise<InventoryProduct[]> {
  const { data, error } = await supabase
    .from('inventory_products')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as InventoryProduct[];
}

export async function createProduct(input: ProductInput): Promise<InventoryProduct> {
  const { data, error } = await supabase
    .from('inventory_products')
    .insert({
      name: input.name.trim(),
      category: input.category.trim(),
      barcode: input.barcode?.trim() || null,
      quantity: input.quantity,
      cost_price: input.cost_price,
      sale_price: input.sale_price,
      minimum_stock: input.minimum_stock,
    })
    .select()
    .single();

  if (error) throw error;
  return data as InventoryProduct;
}

export async function updateProduct(id: string, input: ProductInput): Promise<InventoryProduct> {
  const { data, error } = await supabase
    .from('inventory_products')
    .update({
      name: input.name.trim(),
      category: input.category.trim(),
      barcode: input.barcode?.trim() || null,
      quantity: input.quantity,
      cost_price: input.cost_price,
      sale_price: input.sale_price,
      minimum_stock: input.minimum_stock,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('inventory_products').delete().eq('id', id);
  if (error) throw error;
}

export async function findProductByBarcode(barcode: string): Promise<InventoryProduct | null> {
  const { data, error } = await supabase
    .from('inventory_products')
    .select('*')
    .eq('barcode', barcode.trim())
    .maybeSingle();

  if (error) throw error;
  return (data as InventoryProduct) ?? null;
}

export async function addStock(id: string, amount: number): Promise<InventoryProduct> {
  const { data, error } = await supabase
    .rpc('add_product_stock', { p_product_id: id, p_amount: amount });
  if (error) throw error;
  return data as InventoryProduct;
}
