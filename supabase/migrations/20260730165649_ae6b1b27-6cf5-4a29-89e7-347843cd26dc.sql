CREATE OR REPLACE FUNCTION public.is_mizan_accountant()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) IN ('elazazy.ameer@gmail.com', 'oamroamr114@gmail.com');
$$;

DROP POLICY "Anyone can submit a quote request" ON public.quote_requests;
DROP POLICY "Accountants can view quote requests" ON public.quote_requests;
DROP POLICY "Accountants can update quote requests" ON public.quote_requests;

CREATE POLICY "Website visitors can submit a quote request"
  ON public.quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND handled_at IS NULL
    AND handled_by IS NULL
    AND length(name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(industry) BETWEEN 1 AND 80
    AND (business_name IS NULL OR length(business_name) <= 160)
    AND (phone IS NULL OR length(phone) <= 40)
    AND (situation IS NULL OR length(situation) <= 120)
    AND (message IS NULL OR length(message) <= 4000)
  );

CREATE POLICY "Mizan accountants can view quote requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (public.is_mizan_accountant());

CREATE POLICY "Mizan accountants can update quote requests"
  ON public.quote_requests FOR UPDATE TO authenticated
  USING (public.is_mizan_accountant())
  WITH CHECK (public.is_mizan_accountant());