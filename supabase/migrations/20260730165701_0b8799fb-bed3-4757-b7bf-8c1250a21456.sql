CREATE OR REPLACE FUNCTION public.is_mizan_accountant()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) IN ('elazazy.ameer@gmail.com', 'oamroamr114@gmail.com');
$$;

REVOKE ALL ON FUNCTION public.is_mizan_accountant() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_mizan_accountant() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_mizan_accountant() TO authenticated, service_role;