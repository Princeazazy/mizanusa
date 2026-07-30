DROP POLICY IF EXISTS "Authenticated users can view financial sheets" ON public.financial_sheets;
CREATE POLICY "Users can view their own financial sheets"
ON public.financial_sheets
FOR SELECT
TO authenticated
USING (auth.uid() = created_by);

REVOKE ALL ON public.client_credentials FROM anon, authenticated;
REVOKE ALL ON public.client_sessions FROM anon, authenticated;
GRANT ALL ON public.client_credentials TO service_role;
GRANT ALL ON public.client_sessions TO service_role;

CREATE POLICY "No direct access to client credentials"
ON public.client_credentials
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No direct access to client sessions"
ON public.client_sessions
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);