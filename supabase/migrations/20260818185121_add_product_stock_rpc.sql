/*
# Add add_product_stock RPC

1. New Functions
- `add_product_stock(p_product_id uuid, p_amount integer)`: atomically increases a product's quantity by p_amount and returns the updated row. Only the product owner can call it (RLS-protected SELECT/UPDATE on inventory_products).

2. Important Notes
- Uses UPDATE ... RETURNING so the increment is atomic and safe against concurrent edits.
- Rejects negative amounts to prevent misuse.
- No existing data is modified.
*/

CREATE OR REPLACE FUNCTION public.add_product_stock(p_product_id uuid, p_amount integer)
RETURNS public.inventory_products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.inventory_products;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'A quantidade a adicionar deve ser maior que zero.';
  END IF;

  UPDATE public.inventory_products
     SET quantity = quantity + p_amount
   WHERE id = p_product_id
     AND user_id = auth.uid()
  RETURNING * INTO result;

  IF result IS NULL THEN
    RAISE EXCEPTION 'Produto não encontrado ou sem permissão.';
  END IF;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_product_stock TO authenticated;