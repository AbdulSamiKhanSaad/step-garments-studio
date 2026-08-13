ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Published products are viewable by everyone" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));