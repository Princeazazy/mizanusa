CREATE TABLE public.billing_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  customer_id uuid REFERENCES public.billing_customers(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  issue_date date NOT NULL DEFAULT current_date,
  due_date date,
  status text NOT NULL DEFAULT 'draft',
  currency text NOT NULL DEFAULT 'USD',
  subtotal numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  notes text,
  terms text,
  bill_to_name text,
  bill_to_email text,
  bill_to_address text,
  created_by uuid,
  created_via text NOT NULL DEFAULT 'accountant',
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT client_invoices_status_check CHECK (status IN ('draft','sent','partial','paid','void')),
  CONSTRAINT client_invoices_number_unique UNIQUE (client_id, invoice_number)
);

CREATE TABLE public.client_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.client_invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  rate numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  account_code text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_billing_customers_client ON public.billing_customers(client_id);
CREATE INDEX idx_client_invoices_client ON public.client_invoices(client_id, issue_date DESC);
CREATE INDEX idx_client_invoice_items_invoice ON public.client_invoice_items(invoice_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_customers TO authenticated;
GRANT ALL ON public.billing_customers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_invoices TO authenticated;
GRANT ALL ON public.client_invoices TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_invoice_items TO authenticated;
GRANT ALL ON public.client_invoice_items TO service_role;

ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accountants manage billing customers" ON public.billing_customers
  FOR ALL TO authenticated USING (is_mizan_accountant()) WITH CHECK (is_mizan_accountant());
CREATE POLICY "Accountants manage client invoices" ON public.client_invoices
  FOR ALL TO authenticated USING (is_mizan_accountant()) WITH CHECK (is_mizan_accountant());
CREATE POLICY "Accountants manage client invoice items" ON public.client_invoice_items
  FOR ALL TO authenticated USING (is_mizan_accountant()) WITH CHECK (is_mizan_accountant());

CREATE TRIGGER update_billing_customers_updated_at BEFORE UPDATE ON public.billing_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_invoices_updated_at BEFORE UPDATE ON public.client_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();