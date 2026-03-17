
-- Create sample_requests table for sample ordering/approval workflow
CREATE TABLE public.sample_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  product_type text NOT NULL DEFAULT '',
  description text DEFAULT '',
  size text DEFAULT '',
  color text DEFAULT '',
  quantity integer DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  admin_feedback text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sample requests" ON public.sample_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sample requests" ON public.sample_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all sample requests" ON public.sample_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sample requests" ON public.sample_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_sample_requests_updated_at BEFORE UPDATE ON public.sample_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
