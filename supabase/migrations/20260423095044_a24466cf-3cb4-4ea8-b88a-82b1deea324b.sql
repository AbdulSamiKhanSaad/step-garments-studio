CREATE TABLE public.maintenance_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL UNIQUE,
  is_enabled boolean NOT NULL DEFAULT false,
  message text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.maintenance_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view maintenance settings"
  ON public.maintenance_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert maintenance settings"
  ON public.maintenance_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update maintenance settings"
  ON public.maintenance_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete maintenance settings"
  ON public.maintenance_settings FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_maintenance_settings_updated_at
  BEFORE UPDATE ON public.maintenance_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed scopes
INSERT INTO public.maintenance_settings (scope, is_enabled, message) VALUES
  ('site', false, 'Our site is currently undergoing scheduled maintenance. We''ll be back shortly.'),
  ('home', false, 'This page is under maintenance.'),
  ('products', false, 'This page is under maintenance.'),
  ('services', false, 'This page is under maintenance.'),
  ('process', false, 'This page is under maintenance.'),
  ('contact', false, 'This page is under maintenance.'),
  ('faq', false, 'This page is under maintenance.'),
  ('lookbook', false, 'This page is under maintenance.')
ON CONFLICT (scope) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_settings;