
-- Fix overly permissive INSERT policies by adding basic checks
-- Quotes: require at least product_type to be non-empty
DROP POLICY "Anyone can create quotes" ON public.quotes;
CREATE POLICY "Anyone can create quotes" ON public.quotes FOR INSERT WITH CHECK (
  product_type IS NOT NULL AND product_type != ''
);

-- Contact submissions: require name and email to be non-empty
DROP POLICY "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (
  name IS NOT NULL AND name != '' AND email IS NOT NULL AND email != ''
);
