CREATE OR REPLACE FUNCTION public.is_mizan_lead_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'elazazy.ameer@gmail.com';
$$;

DROP POLICY IF EXISTS "Mizan accountants can view quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Mizan accountants can update quote requests" ON public.quote_requests;

CREATE POLICY "Lead owner can view quote requests"
ON public.quote_requests FOR SELECT TO authenticated
USING (public.is_mizan_lead_owner());

CREATE POLICY "Lead owner can update quote requests"
ON public.quote_requests FOR UPDATE TO authenticated
USING (public.is_mizan_lead_owner())
WITH CHECK (public.is_mizan_lead_owner());