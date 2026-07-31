-- 1. EIN on client company records (nullable, filled in manually per client)
ALTER TABLE public.client_credentials ADD COLUMN IF NOT EXISTS ein TEXT;

-- 2. Link table: one OAuth identity -> one client company
CREATE TABLE public.client_identity_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT ON public.client_identity_links TO authenticated;
GRANT ALL ON public.client_identity_links TO service_role;

ALTER TABLE public.client_identity_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own company link"
  ON public.client_identity_links FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Mizan accountants can view all company links"
  ON public.client_identity_links FOR SELECT TO authenticated
  USING (public.is_mizan_accountant());

CREATE TRIGGER update_client_identity_links_updated_at
  BEFORE UPDATE ON public.client_identity_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Audit + rate-limit log of EIN link attempts
CREATE TABLE public.client_link_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  matched_client_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_link_attempts TO authenticated;
GRANT ALL ON public.client_link_attempts TO service_role;

ALTER TABLE public.client_link_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mizan accountants can review link attempts"
  ON public.client_link_attempts FOR SELECT TO authenticated
  USING (public.is_mizan_accountant());

CREATE INDEX idx_client_link_attempts_user_time
  ON public.client_link_attempts (user_id, created_at DESC);