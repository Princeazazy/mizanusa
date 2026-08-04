REVOKE ALL ON public.client_login_attempts FROM anon, authenticated;
REVOKE ALL ON public.quote_attempts FROM anon, authenticated;
GRANT ALL ON public.client_login_attempts TO service_role;
GRANT ALL ON public.quote_attempts TO service_role;

-- Stop new tables from silently inheriting anonymous privileges.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;