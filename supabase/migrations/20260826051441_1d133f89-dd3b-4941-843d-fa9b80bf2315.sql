CREATE TABLE public.workspace_threads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id text NOT NULL,
  period text,
  title text NOT NULL DEFAULT 'New conversation',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_threads TO authenticated;
GRANT ALL ON public.workspace_threads TO service_role;
ALTER TABLE public.workspace_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accountants manage workspace threads" ON public.workspace_threads
  FOR ALL TO authenticated
  USING (public.is_mizan_accountant())
  WITH CHECK (public.is_mizan_accountant());

CREATE TRIGGER workspace_threads_updated_at
BEFORE UPDATE ON public.workspace_threads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.workspace_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id uuid NOT NULL REFERENCES public.workspace_threads(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL DEFAULT '',
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_messages TO authenticated;
GRANT ALL ON public.workspace_messages TO service_role;
ALTER TABLE public.workspace_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accountants manage workspace messages" ON public.workspace_messages
  FOR ALL TO authenticated
  USING (public.is_mizan_accountant())
  WITH CHECK (public.is_mizan_accountant());

CREATE INDEX workspace_messages_thread_idx ON public.workspace_messages (thread_id, created_at);

ALTER TABLE public.financial_sheets
  ADD COLUMN IF NOT EXISTS period text,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS thread_id uuid REFERENCES public.workspace_threads(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS financial_sheets_client_idx ON public.financial_sheets (client_id, is_published);