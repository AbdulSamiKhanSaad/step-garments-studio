
-- Ticker messages table for scrolling announcements
CREATE TABLE public.ticker_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ticker_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read active messages
CREATE POLICY "Anyone can view active ticker messages"
ON public.ticker_messages
FOR SELECT
TO public
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage ticker messages"
ON public.ticker_messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_ticker_messages_updated_at
  BEFORE UPDATE ON public.ticker_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
