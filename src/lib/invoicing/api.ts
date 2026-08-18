import { supabase } from "@/integrations/supabase/client";

export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "void";

export interface BillingCustomer {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  account_code?: string | null;
  sort_order?: number;
}

export interface ClientInvoice {
  id: string;
  client_id: string;
  customer_id: string | null;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  notes: string | null;
  terms: string | null;
  bill_to_name: string | null;
  bill_to_email: string | null;
  bill_to_address: string | null;
  sent_at: string | null;
  paid_at: string | null;
  created_via: string;
  updated_at: string;
  items: InvoiceItem[];
}

/** A portal session token is passed for clients; accountants ride on their JWT. */
export interface InvoicingAuth {
  clientId: string;
  sessionToken?: string;
}

const call = async <T>(action: string, auth: InvoicingAuth, payload: Record<string, unknown> = {}) => {
  const { data, error } = await supabase.functions.invoke("invoicing", {
    body: { action, clientId: auth.clientId, sessionToken: auth.sessionToken, ...payload },
  });
  if (error) {
    // Edge errors carry the JSON body in the response, surface it when possible.
    let message = error.message;
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === "function") {
      try {
        const body = await context.json();
        if (body?.error) message = body.error as string;
      } catch {
        /* keep default */
      }
    }
    throw new Error(message);
  }
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as T;
};

export const fetchInvoicing = (auth: InvoicingAuth) =>
  call<{ invoices: ClientInvoice[]; customers: BillingCustomer[]; role: "accountant" | "client" }>(
    "list",
    auth,
  );

export const saveInvoice = (
  auth: InvoicingAuth,
  invoice: Partial<ClientInvoice>,
  items: InvoiceItem[],
) => call<{ invoice: ClientInvoice }>("save_invoice", auth, { invoice, items });

export const sendInvoice = (auth: InvoicingAuth, invoiceId: string) =>
  call<{ ok: boolean; invoice: ClientInvoice }>("send_invoice", auth, { invoiceId });

export const recordPayment = (auth: InvoicingAuth, invoiceId: string, amountPaid: number) =>
  call<{ invoice: ClientInvoice }>("record_payment", auth, { invoiceId, amountPaid });

export const voidInvoice = (auth: InvoicingAuth, invoiceId: string) =>
  call<{ ok: boolean }>("void_invoice", auth, { invoiceId });

export const deleteInvoice = (auth: InvoicingAuth, invoiceId: string) =>
  call<{ ok: boolean }>("delete_invoice", auth, { invoiceId });

export const saveCustomer = (auth: InvoicingAuth, customer: Partial<BillingCustomer>) =>
  call<{ customer: BillingCustomer }>("save_customer", auth, { customer });

export const deleteCustomer = (auth: InvoicingAuth, customerId: string) =>
  call<{ ok: boolean }>("delete_customer", auth, { customerId });

export const fmtMoney = (n: number) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
