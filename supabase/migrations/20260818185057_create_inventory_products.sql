/*
# Create owner-scoped inventory products

1. New Tables
- `inventory_products`: products maintained by an authenticated ANT user.
- `id` (uuid): unique product identifier.
- `user_id` (uuid): product owner from `auth.users`, filled from the signed-in session.
- `name` (text): product name.
- `category` (text): product category.
- `barcode` (text): optional barcode stored as text so leading zeroes are preserved.
- `quantity` (integer): current stock quantity, never negative.
- `cost_price` (numeric): purchase/cost price in Brazilian reais.
- `sale_price` (numeric): selling price in Brazilian reais.
- `minimum_stock` (integer): threshold used for automatic stock alerts.
- `created_at` (timestamptz): creation timestamp.
- `updated_at` (timestamptz): last update timestamp.

2. Security
- Row Level Security is enabled on `inventory_products`.
- Authenticated users can select, insert, update, and delete only products they own.
- Barcode uniqueness is scoped to each user, so two accounts may use the same barcode without seeing each other’s data.

3. Important Notes
- No existing tables or data are modified.
- Quantity and minimum stock cannot be negative.
- Prices cannot be negative.
- A trigger keeps `updated_at` current after edits.
*/

CREATE TABLE IF NOT EXISTS public.inventory_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  category text NOT NULL CHECK (char_length(trim(category)) BETWEEN 1 AND 80),
  barcode text CHECK (barcode IS NULL OR char_length(trim(barcode)) BETWEEN 1 AND 64),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  cost_price numeric(12, 2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  sale_price numeric(12, 2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  minimum_stock integer NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS inventory_products_user_barcode_idx
  ON public.inventory_products (user_id, barcode)
  WHERE barcode IS NOT NULL;

CREATE INDEX IF NOT EXISTS inventory_products_user_updated_idx
  ON public.inventory_products (user_id, updated_at DESC);

CREATE OR REPLACE FUNCTION public.set_inventory_products_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inventory_products_updated_at ON public.inventory_products;
CREATE TRIGGER inventory_products_updated_at
  BEFORE UPDATE ON public.inventory_products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_inventory_products_updated_at();

DROP POLICY IF EXISTS "Users can view own inventory products" ON public.inventory_products;
CREATE POLICY "Users can view own inventory products"
  ON public.inventory_products FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own inventory products" ON public.inventory_products;
CREATE POLICY "Users can insert own inventory products"
  ON public.inventory_products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own inventory products" ON public.inventory_products;
CREATE POLICY "Users can update own inventory products"
  ON public.inventory_products FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own inventory products" ON public.inventory_products;
CREATE POLICY "Users can delete own inventory products"
  ON public.inventory_products FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);