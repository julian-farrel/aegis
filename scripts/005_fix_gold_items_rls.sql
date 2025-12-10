-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own gold items" ON public.gold_items;
DROP POLICY IF EXISTS "Users can insert their own gold items" ON public.gold_items;
DROP POLICY IF EXISTS "Users can update their own gold items" ON public.gold_items;
DROP POLICY IF EXISTS "Users can delete their own gold items" ON public.gold_items;

-- Allow public read access (users need to see gold items for verification)
CREATE POLICY "Anyone can view gold items"
  ON public.gold_items
  FOR SELECT
  USING (true);

-- Allow inserts (application will verify wallet ownership)
CREATE POLICY "Anyone can insert gold items"
  ON public.gold_items
  FOR INSERT
  WITH CHECK (true);

-- Allow updates (application will verify wallet ownership)
CREATE POLICY "Anyone can update gold items"
  ON public.gold_items
  FOR UPDATE
  USING (true);

-- Allow deletes (application will verify wallet ownership)
CREATE POLICY "Anyone can delete gold items"
  ON public.gold_items
  FOR DELETE
  USING (true);
