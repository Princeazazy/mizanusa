-- === Chart of accounts (per client) ===
CREATE TABLE public.chart_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Revenue','COGS','Expense','Asset','Liability','Equity')),
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chart_accounts TO authenticated;
GRANT ALL ON public.chart_accounts TO service_role;
ALTER TABLE public.chart_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accountants manage chart of accounts" ON public.chart_accounts
  FOR ALL TO authenticated USING (public.is_mizan_accountant()) WITH CHECK (public.is_mizan_accountant());

-- === Per-client agent memory ===
CREATE TABLE public.client_context (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL UNIQUE,
  entity_type text,
  industry text,
  categorization_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  vendor_mappings jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_context TO authenticated;
GRANT ALL ON public.client_context TO service_role;
ALTER TABLE public.client_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accountants manage client context" ON public.client_context
  FOR ALL TO authenticated USING (public.is_mizan_accountant()) WITH CHECK (public.is_mizan_accountant());

-- === Agent runs (audit trail) ===
CREATE TABLE public.agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  period text NOT NULL,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','completed','failed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  total_count integer NOT NULL DEFAULT 0,
  auto_count integer NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  tier1_count integer NOT NULL DEFAULT 0,
  ai_count integer NOT NULL DEFAULT 0,
  model text,
  error_message text,
  triggered_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_runs TO authenticated;
GRANT ALL ON public.agent_runs TO service_role;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accountants manage agent runs" ON public.agent_runs
  FOR ALL TO authenticated USING (public.is_mizan_accountant()) WITH CHECK (public.is_mizan_accountant());

-- === Transactions ===
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  period text NOT NULL,
  txn_date date NOT NULL,
  description text NOT NULL,
  payee text,
  amount numeric(14,2) NOT NULL,
  direction text NOT NULL CHECK (direction IN ('in','out')),
  source text NOT NULL DEFAULT 'bank' CHECK (source IN ('bank','cc')),
  raw_row jsonb NOT NULL DEFAULT '{}'::jsonb,
  dedupe_hash text NOT NULL,
  suggested_account_id uuid REFERENCES public.chart_accounts(id) ON DELETE SET NULL,
  suggested_confidence numeric(4,3),
  suggested_rationale text,
  suggested_tier text CHECK (suggested_tier IN ('rule','vendor','ai')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','auto_approved','needs_review','approved','corrected')),
  approved_account_id uuid REFERENCES public.chart_accounts(id) ON DELETE SET NULL,
  reviewed_by uuid,
  reviewed_at timestamptz,
  agent_run_id uuid REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, dedupe_hash)
);
CREATE INDEX transactions_client_period_idx ON public.transactions (client_id, period);
CREATE INDEX transactions_status_idx ON public.transactions (client_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accountants manage transactions" ON public.transactions
  FOR ALL TO authenticated USING (public.is_mizan_accountant()) WITH CHECK (public.is_mizan_accountant());

-- === Remembered CSV column layouts ===
CREATE TABLE public.import_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  name text NOT NULL DEFAULT 'Default',
  mapping jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_profiles TO authenticated;
GRANT ALL ON public.import_profiles TO service_role;
ALTER TABLE public.import_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accountants manage import profiles" ON public.import_profiles
  FOR ALL TO authenticated USING (public.is_mizan_accountant()) WITH CHECK (public.is_mizan_accountant());

-- === updated_at triggers ===
CREATE TRIGGER chart_accounts_updated_at BEFORE UPDATE ON public.chart_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER client_context_updated_at BEFORE UPDATE ON public.client_context
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER import_profiles_updated_at BEFORE UPDATE ON public.import_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();