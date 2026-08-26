DROP POLICY IF EXISTS "Accountants view their own financial sheets" ON public.financial_sheets;
DROP POLICY IF EXISTS "Accountants update their own financial sheets" ON public.financial_sheets;
DROP POLICY IF EXISTS "Accountants delete their own financial sheets" ON public.financial_sheets;

CREATE POLICY "Accountants view financial sheets"
ON public.financial_sheets FOR SELECT TO authenticated
USING (public.is_mizan_accountant());

CREATE POLICY "Accountants update financial sheets"
ON public.financial_sheets FOR UPDATE TO authenticated
USING (public.is_mizan_accountant())
WITH CHECK (public.is_mizan_accountant());

CREATE POLICY "Accountants delete financial sheets"
ON public.financial_sheets FOR DELETE TO authenticated
USING (public.is_mizan_accountant());