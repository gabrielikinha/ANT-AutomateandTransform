/*
# Create owner-scoped DRE entries

1. New Tables
- `dre_entries`: financial entries recorded by an authenticated ANT user.
- `id` (uuid): unique entry identifier.
- `user_id` (uuid): owner from `auth.users`, automatically filled from the signed-in session.
- `description` (text): short description of the transaction.
- `category` (text): user-defined financial category.
- `type` (text): either `receita` or `despesa`.
- `amount` (numeric): positive monetary amount in Brazilian reais.
- `entry_date` (date): date used in DRE filters and reports.
- `created_at` (timestamptz): creation timestamp.

2. Security
- Row Level Security is enabled on `dre_entries`.
- Authenticated users can select, insert, update, and delete only their own entries.
- `user_id` defaults to `auth.uid()` so the browser cannot accidentally omit ownership.

3. Important Notes
- No existing tables or data are modified.
- The type and amount constraints reject malformed financial entries at the database boundary.
- An index supports the most common owner/date listing query.
*/

CREATE TABLE IF NOT EXISTS public.dre_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL CHECK (char_length(trim(description)) BETWEEN 1 AND 120),
  category text NOT NULL CHECK (char_length(trim(category)) BETWEEN 1 AND 80),
  type text NOT NULL CHECK (type IN ('receita', 'despesa')),
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dre_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS dre_entries_user_date_idx
  ON public.dre_entries (user_id, entry_date DESC, created_at DESC);

DROP POLICY IF EXISTS "Users can view own DRE entries" ON public.dre_entries;
CREATE POLICY "Users can view own DRE entries"
  ON public.dre_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own DRE entries" ON public.dre_entries;
CREATE POLICY "Users can insert own DRE entries"
  ON public.dre_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own DRE entries" ON public.dre_entries;
CREATE POLICY "Users can update own DRE entries"
  ON public.dre_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own DRE entries" ON public.dre_entries;
CREATE POLICY "Users can delete own DRE entries"
  ON public.dre_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);