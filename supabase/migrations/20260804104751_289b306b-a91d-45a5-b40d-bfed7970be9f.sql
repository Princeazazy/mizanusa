-- ============================================================
-- 1. REVOKE all anonymous access, everywhere (defense in depth)
-- ============================================================
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
           WHERE n.nspname = 'public' AND c.relkind = 'r'
  LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- ============================================================
-- 2. Re-grant to `authenticated` ONLY what policies actually allow
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chart_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_context TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_sheets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uploaded_documents TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.conversations TO authenticated;
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
-- read-only surfaces
GRANT SELECT ON public.client_identity_links TO authenticated;
GRANT SELECT ON public.client_link_attempts TO authenticated;
-- quote_requests: accountants read/update only; inserts now go through the edge function
GRANT SELECT, UPDATE ON public.quote_requests TO authenticated;

-- client_credentials / client_sessions stay service_role-only (no re-grant)

-- ============================================================
-- 3. Replace PUBLIC-role policies with authenticated-only equivalents
-- ============================================================
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;

CREATE POLICY "Accountants view their own conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND public.is_mizan_accountant());
CREATE POLICY "Accountants create their own conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_mizan_accountant());
CREATE POLICY "Accountants delete their own conversations" ON public.conversations
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND public.is_mizan_accountant());

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.chat_messages;

CREATE POLICY "Accountants view messages in their conversations" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
  ) AND public.is_mizan_accountant());
CREATE POLICY "Accountants create messages in their conversations" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
  ) AND public.is_mizan_accountant());

DROP POLICY IF EXISTS "Users can view their own documents" ON public.uploaded_documents;
DROP POLICY IF EXISTS "Users can upload documents" ON public.uploaded_documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.uploaded_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.uploaded_documents;

CREATE POLICY "Accountants view their own documents" ON public.uploaded_documents
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND public.is_mizan_accountant());
CREATE POLICY "Accountants upload their own documents" ON public.uploaded_documents
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_mizan_accountant());
CREATE POLICY "Accountants update their own documents" ON public.uploaded_documents
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND public.is_mizan_accountant())
  WITH CHECK (auth.uid() = user_id AND public.is_mizan_accountant());
CREATE POLICY "Accountants delete their own documents" ON public.uploaded_documents
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND public.is_mizan_accountant());

-- financial_sheets: add the accountant check alongside the owner check,
-- and give UPDATE an explicit WITH CHECK so ownership cannot be reassigned.
DROP POLICY IF EXISTS "Users can view their own financial sheets" ON public.financial_sheets;
DROP POLICY IF EXISTS "Authenticated users can create financial sheets" ON public.financial_sheets;
DROP POLICY IF EXISTS "Authenticated users can update financial sheets" ON public.financial_sheets;
DROP POLICY IF EXISTS "Authenticated users can delete financial sheets" ON public.financial_sheets;

CREATE POLICY "Accountants view their own financial sheets" ON public.financial_sheets
  FOR SELECT TO authenticated
  USING (auth.uid() = created_by AND public.is_mizan_accountant());
CREATE POLICY "Accountants create financial sheets" ON public.financial_sheets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND public.is_mizan_accountant());
CREATE POLICY "Accountants update their own financial sheets" ON public.financial_sheets
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by AND public.is_mizan_accountant())
  WITH CHECK (auth.uid() = created_by AND public.is_mizan_accountant());
CREATE POLICY "Accountants delete their own financial sheets" ON public.financial_sheets
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by AND public.is_mizan_accountant());

-- quote_requests: browser inserts move to the edge function (honeypot + IP throttle)
DROP POLICY IF EXISTS "Website visitors can submit a quote request" ON public.quote_requests;

-- ============================================================
-- 4. Throttle ledgers (service_role only — never reachable from a browser)
-- ============================================================
CREATE TABLE public.client_login_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username text,
  ip_hash text,
  success boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT ALL ON public.client_login_attempts TO service_role;
ALTER TABLE public.client_login_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct access to client login attempts" ON public.client_login_attempts
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE INDEX idx_client_login_attempts_lookup
  ON public.client_login_attempts (username, created_at DESC);
CREATE INDEX idx_client_login_attempts_ip
  ON public.client_login_attempts (ip_hash, created_at DESC);

CREATE TABLE public.quote_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash text NOT NULL,
  accepted boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT ALL ON public.quote_attempts TO service_role;
ALTER TABLE public.quote_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct access to quote attempts" ON public.quote_attempts
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE INDEX idx_quote_attempts_ip ON public.quote_attempts (ip_hash, created_at DESC);

-- ============================================================
-- 5. Storage: the documents bucket was missing an UPDATE rule
-- ============================================================
CREATE POLICY "Users can update their own documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'documents' AND (auth.uid())::text = (storage.foldername(name))[1]);