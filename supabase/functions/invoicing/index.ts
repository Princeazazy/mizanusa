// Client e-invoicing service.
//
// One endpoint serves two caller types:
//   * Mizan accountants  — Supabase JWT + practice email allowlist (any client_id)
//   * Portal clients     — opaque client_sessions token (locked to their own client_id)
//
// All writes run with the service role, so authorization is enforced here.
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders, jsonResponse } from "../_shared/cors.ts";

const ACCOUNTANT_EMAILS = ["elazazy.ameer@gmail.com", "oamroamr114@gmail.com"];

type Caller =
  | { role: "accountant"; userId: string; email: string }
  | { role: "client"; clientId: string; clientName: string };

const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
};

const str = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const money = (n: number) => Math.round(n * 100) / 100;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: buildCorsHeaders(req) });
  if (req.method !== "POST") return jsonResponse(req, { error: "Method not allowed" }, 405);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const ANON = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Missing Supabase configuration");

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return jsonResponse(req, { error: "Invalid request" }, 400);

    const action = str(body.action, 40);

    // ---------------------------------------------------------------- auth
    let caller: Caller | null = null;

    const sessionToken = str(body.sessionToken, 128);
    if (sessionToken) {
      const { data: session } = await admin
        .from("client_sessions")
        .select("client_id, expires_at")
        .eq("session_token", sessionToken)
        .maybeSingle();
      if (session && new Date(session.expires_at).getTime() > Date.now()) {
        const { data: cred } = await admin
          .from("client_credentials")
          .select("client_name")
          .eq("client_id", session.client_id)
          .maybeSingle();
        caller = {
          role: "client",
          clientId: session.client_id,
          clientName: cred?.client_name ?? session.client_id,
        };
      }
    } else {
      const authHeader = req.headers.get("Authorization") ?? "";
      const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      if (jwt && ANON) {
        const scoped = createClient(SUPABASE_URL, ANON, {
          global: { headers: { Authorization: `Bearer ${jwt}` } },
        });
        const { data } = await scoped.auth.getUser();
        const user = data?.user;
        const email = user?.email?.toLowerCase().trim() ?? "";
        const provider = (user?.app_metadata as { provider?: string } | undefined)?.provider;
        if (user && ACCOUNTANT_EMAILS.includes(email) && (!provider || provider === "email")) {
          caller = { role: "accountant", userId: user.id, email };
        }
      }
    }

    if (!caller) return jsonResponse(req, { error: "Not authorized" }, 401);

    const requestedClientId = str(body.clientId, 60);
    const clientId = caller.role === "client" ? caller.clientId : requestedClientId;
    if (!clientId) return jsonResponse(req, { error: "clientId is required" }, 400);
    if (caller.role === "client" && requestedClientId && requestedClientId !== caller.clientId) {
      return jsonResponse(req, { error: "Not authorized for this company" }, 403);
    }

    /** Every mutation re-checks that the row belongs to the caller's company. */
    const ownsInvoice = async (invoiceId: string) => {
      const { data } = await admin
        .from("client_invoices")
        .select("id, client_id")
        .eq("id", invoiceId)
        .maybeSingle();
      return data && data.client_id === clientId ? data : null;
    };

    // ------------------------------------------------------------- actions
    if (action === "list") {
      const [invoices, customers] = await Promise.all([
        admin
          .from("client_invoices")
          .select("*, items:client_invoice_items(*)")
          .eq("client_id", clientId)
          .order("issue_date", { ascending: false })
          .order("created_at", { ascending: false }),
        admin
          .from("billing_customers")
          .select("*")
          .eq("client_id", clientId)
          .order("name"),
      ]);
      if (invoices.error) throw invoices.error;
      if (customers.error) throw customers.error;
      return jsonResponse(req, {
        role: caller.role,
        clientId,
        invoices: invoices.data ?? [],
        customers: customers.data ?? [],
      });
    }

    if (action === "save_customer") {
      const c = (body.customer ?? {}) as Record<string, unknown>;
      const name = str(c.name, 160);
      const email = str(c.email, 160).toLowerCase();
      if (!name) return jsonResponse(req, { error: "Customer name is required" }, 400);
      if (!isEmail(email)) return jsonResponse(req, { error: "A valid customer email is required" }, 400);
      const row = {
        client_id: clientId,
        name,
        email,
        phone: str(c.phone, 40) || null,
        address: str(c.address, 400) || null,
      };
      const id = str(c.id, 40);
      const query = id
        ? admin.from("billing_customers").update(row).eq("id", id).eq("client_id", clientId).select("*").maybeSingle()
        : admin.from("billing_customers").insert(row).select("*").maybeSingle();
      const { data, error } = await query;
      if (error) throw error;
      return jsonResponse(req, { customer: data });
    }

    if (action === "delete_customer") {
      const id = str(body.customerId, 40);
      if (!id) return jsonResponse(req, { error: "customerId is required" }, 400);
      const { error } = await admin
        .from("billing_customers")
        .delete()
        .eq("id", id)
        .eq("client_id", clientId);
      if (error) throw error;
      return jsonResponse(req, { ok: true });
    }

    if (action === "save_invoice") {
      const inv = (body.invoice ?? {}) as Record<string, unknown>;
      const rawItems = Array.isArray(body.items) ? (body.items as Record<string, unknown>[]) : [];
      if (rawItems.length === 0) return jsonResponse(req, { error: "Add at least one line item" }, 400);
      if (rawItems.length > 100) return jsonResponse(req, { error: "Too many line items" }, 400);

      const items = rawItems.map((it, index) => {
        const quantity = num(it.quantity, 1);
        const rate = num(it.rate, 0);
        return {
          description: str(it.description, 400) || "Item",
          quantity,
          rate,
          amount: money(quantity * rate),
          account_code: str(it.account_code, 20) || null,
          sort_order: index,
        };
      });

      const subtotal = money(items.reduce((s, i) => s + i.amount, 0));
      const taxRate = Math.min(Math.max(num(inv.tax_rate, 0), 0), 100);
      const taxAmount = money((subtotal * taxRate) / 100);
      const total = money(subtotal + taxAmount);

      const customerId = str(inv.customer_id, 40) || null;
      let billTo = {
        bill_to_name: str(inv.bill_to_name, 160) || null,
        bill_to_email: (str(inv.bill_to_email, 160) || "").toLowerCase() || null,
        bill_to_address: str(inv.bill_to_address, 400) || null,
      };
      if (customerId) {
        const { data: customer } = await admin
          .from("billing_customers")
          .select("name, email, address, client_id")
          .eq("id", customerId)
          .maybeSingle();
        if (!customer || customer.client_id !== clientId) {
          return jsonResponse(req, { error: "Unknown customer" }, 400);
        }
        billTo = {
          bill_to_name: customer.name,
          bill_to_email: customer.email,
          bill_to_address: customer.address,
        };
      }
      if (!billTo.bill_to_name || !billTo.bill_to_email || !isEmail(billTo.bill_to_email)) {
        return jsonResponse(req, { error: "A customer name and valid email are required" }, 400);
      }

      const id = str(inv.id, 40);
      let invoiceNumber = str(inv.invoice_number, 40);
      if (!invoiceNumber) {
        const { data: last } = await admin
          .from("client_invoices")
          .select("invoice_number")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })
          .limit(50);
        const highest = (last ?? [])
          .map((r) => parseInt(String(r.invoice_number).replace(/\D/g, ""), 10))
          .filter((n) => Number.isFinite(n))
          .reduce((a, b) => Math.max(a, b), 1000);
        invoiceNumber = String(highest + 1);
      }

      const amountPaid = money(Math.max(num(inv.amount_paid, 0), 0));
      const existing = id ? await ownsInvoice(id) : null;
      if (id && !existing) return jsonResponse(req, { error: "Invoice not found" }, 404);

      const row: Record<string, unknown> = {
        client_id: clientId,
        customer_id: customerId,
        invoice_number: invoiceNumber,
        issue_date: str(inv.issue_date, 10) || new Date().toISOString().slice(0, 10),
        due_date: str(inv.due_date, 10) || null,
        currency: "USD",
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        amount_paid: Math.min(amountPaid, total),
        notes: str(inv.notes, 1000) || null,
        terms: str(inv.terms, 500) || null,
        ...billTo,
        created_via: caller.role,
      };
      if (!id) {
        row.status = "draft";
        row.created_by = caller.role === "accountant" ? caller.userId : null;
      } else {
        const paid = Math.min(amountPaid, total);
        const prior = existing!.status ?? "draft";
        row.status = paid >= total && total > 0
          ? "paid"
          : paid > 0
            ? "partial"
            : prior === "paid" || prior === "partial"
              ? "sent"
              : prior;
        row.paid_at = paid >= total && total > 0 ? new Date().toISOString() : null;
      }

      const saved = id
        ? await admin.from("client_invoices").update(row).eq("id", id).select("*").maybeSingle()
        : await admin.from("client_invoices").insert(row).select("*").maybeSingle();
      if (saved.error) {
        if (String(saved.error.message).includes("client_invoices_number_unique")) {
          return jsonResponse(req, { error: `Invoice #${invoiceNumber} already exists` }, 409);
        }
        throw saved.error;
      }
      const invoiceId = saved.data!.id as string;

      await admin.from("client_invoice_items").delete().eq("invoice_id", invoiceId);
      const { error: itemsError } = await admin
        .from("client_invoice_items")
        .insert(items.map((i) => ({ ...i, invoice_id: invoiceId })));
      if (itemsError) throw itemsError;

      return jsonResponse(req, { invoice: { ...saved.data, items } });
    }

    if (action === "delete_invoice" || action === "void_invoice") {
      const invoiceId = str(body.invoiceId, 40);
      if (!invoiceId || !(await ownsInvoice(invoiceId))) {
        return jsonResponse(req, { error: "Invoice not found" }, 404);
      }
      if (action === "void_invoice") {
        const { error } = await admin
          .from("client_invoices")
          .update({ status: "void" })
          .eq("id", invoiceId);
        if (error) throw error;
      } else {
        const { error } = await admin.from("client_invoices").delete().eq("id", invoiceId);
        if (error) throw error;
      }
      return jsonResponse(req, { ok: true });
    }

    if (action === "record_payment") {
      const invoiceId = str(body.invoiceId, 40);
      const existing = invoiceId ? await ownsInvoice(invoiceId) : null;
      if (!existing) return jsonResponse(req, { error: "Invoice not found" }, 404);
      const { data: full } = await admin
        .from("client_invoices")
        .select("total, amount_paid")
        .eq("id", invoiceId)
        .maybeSingle();
      const total = num(full?.total, 0);
      const requested = num(body.amountPaid, total);
      const paid = money(Math.min(Math.max(requested, 0), total));
      const { data, error } = await admin
        .from("client_invoices")
        .update({
          amount_paid: paid,
          status: paid >= total && total > 0 ? "paid" : paid > 0 ? "partial" : "sent",
          paid_at: paid >= total && total > 0 ? new Date().toISOString() : null,
        })
        .eq("id", invoiceId)
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return jsonResponse(req, { invoice: data });
    }

    if (action === "send_invoice") {
      const invoiceId = str(body.invoiceId, 40);
      if (!invoiceId || !(await ownsInvoice(invoiceId))) {
        return jsonResponse(req, { error: "Invoice not found" }, 404);
      }
      const { data: invoice, error } = await admin
        .from("client_invoices")
        .select("*, items:client_invoice_items(description, quantity, rate, amount, sort_order)")
        .eq("id", invoiceId)
        .maybeSingle();
      if (error) throw error;
      if (!invoice) return jsonResponse(req, { error: "Invoice not found" }, 404);

      const companyName = caller.role === "client"
        ? caller.clientName
        : (await admin
          .from("client_credentials")
          .select("client_name")
          .eq("client_id", clientId)
          .maybeSingle()).data?.client_name ?? clientId;

      const items = [...((invoice.items ?? []) as Record<string, unknown>[])].sort(
        (a, b) => num(a.sort_order) - num(b.sort_order),
      );

      const { data: sendResult, error: sendError } = await admin.functions.invoke(
        "send-transactional-email",
        {
          body: {
            templateName: "client-invoice",
            recipientEmail: invoice.bill_to_email,
            idempotencyKey: `client-invoice-${invoiceId}-${invoice.updated_at}`,
            templateData: {
              companyName,
              customerName: invoice.bill_to_name,
              invoiceNumber: invoice.invoice_number,
              issueDate: invoice.issue_date,
              dueDate: invoice.due_date,
              subtotal: num(invoice.subtotal),
              taxRate: num(invoice.tax_rate),
              taxAmount: num(invoice.tax_amount),
              total: num(invoice.total),
              amountPaid: num(invoice.amount_paid),
              notes: invoice.notes,
              terms: invoice.terms,
              items: items.map((i) => ({
                description: i.description,
                quantity: num(i.quantity),
                rate: num(i.rate),
                amount: num(i.amount),
              })),
            },
          },
        },
      );

      if (sendError) {
        console.error("invoicing: email send failed", sendError.message);
        return jsonResponse(
          req,
          {
            error:
              "Invoice email could not be sent yet — email sending is not finished being set up.",
            emailUnavailable: true,
          },
          503,
        );
      }

      const { data: updated } = await admin
        .from("client_invoices")
        .update({
          status: invoice.status === "draft" ? "sent" : invoice.status,
          sent_at: new Date().toISOString(),
        })
        .eq("id", invoiceId)
        .select("*")
        .maybeSingle();

      return jsonResponse(req, { ok: true, invoice: updated, send: sendResult ?? null });
    }

    return jsonResponse(req, { error: "Unknown action" }, 400);
  } catch (error) {
    console.error("invoicing error:", error instanceof Error ? error.message : error);
    return jsonResponse(req, { error: "Request failed" }, 500);
  }
});
