CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT,
  industry TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  situation TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  handled_at TIMESTAMP WITH TIME ZONE,
  handled_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Accountants can view quote requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Accountants can update quote requests"
  ON public.quote_requests FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE INDEX quote_requests_created_at_idx ON public.quote_requests (created_at DESC);

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();