// Bookkeeper AI workspace.
//
// Practice-only endpoint: the two Mizan accountants chat with the AI, attach
// statements, and the model builds real financial sheets through tool calls.
// Everything it creates starts as an internal DRAFT — nothing reaches a client
// portal until a bookkeeper publishes it.
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders, jsonResponse } from "../_shared/cors.ts";

const ACCOUNTANT_EMAILS = ["elazazy.ameer@gmail.com", "oamroamr114@gmail.com"];
const MODEL = "openai/gpt-5.6-sol";
const MAX_STEPS = 6;

const str = (v: unknown, max = 4000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const SHEET_TYPES = ["profit_loss", "balance_sheet", "cash_flow", "transactions", "reconciliation", "custom"];

const SYSTEM_PROMPT = `You are Mizan Workspace, the internal AI bookkeeper for Mizan USA (a professional bookkeeping firm). You work only with the firm's two bookkeepers — never with clients.

Your job:
1. Read attached bank statements, credit-card statements, Vitu/merchant summaries, invoices and receipts.
2. Extract EVERY transaction line by line. Never invent, estimate or round numbers, and never fabricate a line that is not in the source document. If the document is unreadable or partially cut off, say exactly which part.
3. Use the tools to create real sheets in the workspace: a Transaction Register, then Profit & Loss, Balance Sheet and Cash Flow as requested. Sheets you create are DRAFTS visible only to the bookkeepers until they publish them.
4. Apply the firm's rules: exclude savings accounts, keep internal account-to-account transfers on a separate transfer sheet (code 9999) and NEVER include transfers in income or expense totals. Rent and recurring fixed charges stay consistent month to month. No placeholder data.
5. Tag every transaction with a Chart of Accounts code.
6. Say "Accountant", never "CPA".

Chart of Accounts:
4100 Credit Card Sales (Revenue) · 4110 Cash/Check Sales (Revenue) · 4120 Venmo/Digital Sales (Revenue) · 4200 Salvage Inspection Fees (Revenue) · 4900 Other Income
5000 Vehicle/Job Inventory Purchases (COGS) · 5100 Title & Registration Fees (COGS) · 5110 Floor Plan Interest · 5120 Title Lookup Services
6050 Rent - Front Office · 6055 Rent - Main Office · 6100 Utilities · 6200 Communications · 6300 Office & Supplies · 6400 Vehicle Operating · 6500 Card Processing Fees · 6600 Bank Fees · 6700 Insurance · 6800 Other Operating Expenses · 6999 Unclassified — Verify Payee
9999 Internal Transfer (excluded from all totals)

When asked to build something, actually call the tools — do not merely describe the output. After the tool calls, reply with a short, precise summary of what you created, the totals, and anything you need the bookkeeper to verify.`;

const tools = [
  {
    type: "function",
    function: {
      name: "create_sheet",
      description:
        "Create a new draft sheet (tab) in the client's workbook. Drafts are internal until a bookkeeper publishes them.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Tab name, e.g. 'April 2026 Transaction Register'" },
          sheet_type: { type: "string", enum: SHEET_TYPES },
          period: { type: "string", description: "Period label, e.g. '2026-04' or 'Q1 2026'" },
          columns: { type: "array", items: { type: "string" }, description: "Column headers" },
          rows: {
            type: "array",
            description: "Data rows as objects keyed by the column headers.",
            items: { type: "object", additionalProperties: true },
          },
          notes: { type: "string", description: "Optional footnote for the bookkeeper" },
        },
        required: ["name", "sheet_type", "columns", "rows"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "append_rows",
      description: "Append rows to an existing sheet you created for this client.",
      parameters: {
        type: "object",
        properties: {
          sheet_name: { type: "string" },
          rows: { type: "array", items: { type: "object", additionalProperties: true } },
        },
        required: ["sheet_name", "rows"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_sheets",
      description: "List the sheets that already exist for this client, with their draft/published state.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
];

type Attachment = { name: string; mimeType: string; dataUrl?: string; text?: string };

/** Turn an attachment into the multimodal content block the gateway expects. */
const attachmentBlock = (a: Attachment) => {
  if (a.text) {
    return { type: "text", text: `Attached file "${a.name}" (${a.mimeType}) contents:\n${a.text.slice(0, 200_000)}` };
  }
  if (!a.dataUrl) return null;
  const mime = (a.dataUrl.match(/^data:([^;,]+)/)?.[1] ?? a.mimeType).toLowerCase();
  if (mime.startsWith("image/")) {
    return { type: "image_url", image_url: { url: a.dataUrl } };
  }
  if (mime === "application/pdf") {
    return { type: "file", file: { filename: a.name, file_data: a.dataUrl } };
  }
  // Unknown binary: hand it over as a PDF-style file block only when the name says PDF.
  if (/\.pdf$/i.test(a.name)) {
    const base64 = a.dataUrl.split(",")[1] ?? "";
    return { type: "file", file: { filename: a.name, file_data: `data:application/pdf;base64,${base64}` } };
  }
  return null;
};


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: buildCorsHeaders(req) });
  if (req.method !== "POST") return jsonResponse(req, { error: "Method not allowed" }, 405);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const ANON = Deno.env.get("SUPABASE_ANON_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE || !ANON) throw new Error("Missing Supabase configuration");
    if (!LOVABLE_API_KEY) return jsonResponse(req, { error: "AI is not configured." }, 500);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // ---------------------------------------------------------------- auth
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!jwt) return jsonResponse(req, { error: "Not authorized" }, 401);
    const scoped = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData } = await scoped.auth.getUser();
    const user = userData?.user;
    const email = user?.email?.toLowerCase().trim() ?? "";
    const provider = (user?.app_metadata as { provider?: string } | undefined)?.provider;
    if (!user || !ACCOUNTANT_EMAILS.includes(email) || (provider && provider !== "email")) {
      return jsonResponse(req, { error: "Not authorized" }, 403);
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return jsonResponse(req, { error: "Invalid request" }, 400);

    const threadId = str(body.threadId, 40);
    const clientId = str(body.clientId, 60);
    const clientName = str(body.clientName, 120) || clientId;
    const period = str(body.period, 40);
    const message = str(body.message, 20_000);
    const attachments = Array.isArray(body.attachments) ? (body.attachments as Attachment[]).slice(0, 6) : [];
    if (!threadId || !clientId) return jsonResponse(req, { error: "threadId and clientId are required" }, 400);
    if (!message && attachments.length === 0) return jsonResponse(req, { error: "Nothing to send" }, 400);

    const { data: thread } = await admin
      .from("workspace_threads")
      .select("id, client_id")
      .eq("id", threadId)
      .maybeSingle();
    if (!thread || thread.client_id !== clientId) {
      return jsonResponse(req, { error: "Conversation not found" }, 404);
    }

    // ------------------------------------------------------- conversation
    const { data: history } = await admin
      .from("workspace_messages")
      .select("role, content")
      .eq("thread_id", threadId)
      .order("created_at")
      .limit(40);

    const attachmentMeta = attachments.map((a) => ({ name: a.name, mimeType: a.mimeType }));
    const unsupported = attachments.filter((a) => !attachmentBlock(a)).map((a) => a.name);

    await admin.from("workspace_messages").insert({
      thread_id: threadId,
      role: "user",
      content: message,
      attachments: attachmentMeta,
    });

    const userContent: unknown[] = [];
    if (message) userContent.push({ type: "text", text: message });
    for (const a of attachments) {
      const block = attachmentBlock(a);
      if (block) userContent.push(block);
    }

    const messages: Record<string, unknown>[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content: `Active client: ${clientName} (client_id "${clientId}")${period ? `. Working period: ${period}` : ""}.`,
      },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent.length === 1 && message ? message : userContent },
    ];

    const performed: { tool: string; summary: string }[] = [];

    const runTool = async (name: string, args: Record<string, unknown>) => {
      if (name === "create_sheet") {
        const sheetName = str(args.name, 120) || "Untitled sheet";
        const sheetType = SHEET_TYPES.includes(String(args.sheet_type)) ? String(args.sheet_type) : "custom";
        const columns = Array.isArray(args.columns) ? args.columns.map((c) => String(c)).slice(0, 40) : [];
        const rows = Array.isArray(args.rows) ? args.rows.slice(0, 2000) : [];
        const { data, error } = await admin
          .from("financial_sheets")
          .insert({
            client_id: clientId,
            name: sheetName,
            sheet_type: sheetType,
            period: str(args.period, 40) || period || null,
            thread_id: threadId,
            created_by: user.id,
            is_published: false,
            data: { columns, rows, notes: str(args.notes, 2000) || null },
          })
          .select("id, name")
          .single();
        if (error) return { error: error.message };
        performed.push({ tool: "create_sheet", summary: `Draft sheet "${sheetName}" (${rows.length} rows)` });
        return { ok: true, sheet_id: data.id, name: data.name, rows: rows.length, state: "draft" };
      }

      if (name === "append_rows") {
        const sheetName = str(args.sheet_name, 120);
        const newRows = Array.isArray(args.rows) ? args.rows.slice(0, 2000) : [];
        const { data: sheet } = await admin
          .from("financial_sheets")
          .select("id, data")
          .eq("client_id", clientId)
          .eq("name", sheetName)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!sheet) return { error: `No sheet named "${sheetName}" for this client.` };
        const current = (sheet.data ?? {}) as { columns?: unknown[]; rows?: unknown[]; notes?: unknown };
        const merged = [...(current.rows ?? []), ...newRows];
        const { error } = await admin
          .from("financial_sheets")
          .update({ data: { ...current, rows: merged } })
          .eq("id", sheet.id);
        if (error) return { error: error.message };
        performed.push({ tool: "append_rows", summary: `${newRows.length} rows added to "${sheetName}"` });
        return { ok: true, sheet_id: sheet.id, total_rows: merged.length };
      }

      if (name === "list_sheets") {
        const { data } = await admin
          .from("financial_sheets")
          .select("id, name, sheet_type, period, is_published")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })
          .limit(60);
        return { sheets: data ?? [] };
      }

      return { error: `Unknown tool ${name}` };
    };

    // --------------------------------------------------------- model loop
    let reply = "";
    for (let step = 0; step < MAX_STEPS; step++) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Lovable-API-Key": LOVABLE_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages, tools, tool_choice: "auto", reasoning_effort: "none" }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("workspace-chat gateway error", response.status, detail.slice(0, 500));
        if (response.status === 429) {
          return jsonResponse(req, { error: "Rate limited. Try again in a moment." }, 429);
        }
        if (response.status === 402) {
          return jsonResponse(req, { error: "AI credits exhausted. Add credits to continue." }, 402);
        }
        if (response.status === 400) {
          return jsonResponse(
            req,
            { error: "The AI rejected this request — an attachment may be an unsupported format." },
            400,
          );
        }
        return jsonResponse(req, { error: "AI service error. Please try again." }, 502);
      }

      const payload = await response.json();
      const choice = payload?.choices?.[0];
      const msg = choice?.message;
      if (!msg) return jsonResponse(req, { error: "Empty AI response." }, 502);

      const calls = Array.isArray(msg.tool_calls) ? msg.tool_calls : [];
      if (calls.length === 0) {
        reply = typeof msg.content === "string" ? msg.content : "";
        break;
      }

      messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: calls });
      for (const call of calls) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function?.arguments ?? "{}");
        } catch {
          args = {};
        }
        const result = await runTool(String(call.function?.name ?? ""), args);
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
      }
    }

    if (!reply) {
      reply = performed.length
        ? `Done: ${performed.map((p) => p.summary).join("; ")}.`
        : "I could not complete that — try rephrasing or re-attaching the statement.";
    }
    if (unsupported.length) {
      reply += `\n\nNote: I could not read ${unsupported.join(", ")} directly. Send it as a PDF, image, or CSV/text export.`;
    }

    const { data: saved } = await admin
      .from("workspace_messages")
      .insert({ thread_id: threadId, role: "assistant", content: reply, actions: performed })
      .select("id, created_at")
      .single();

    await admin.from("workspace_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);

    return jsonResponse(req, { reply, actions: performed, messageId: saved?.id ?? null });
  } catch (error) {
    console.error("workspace-chat error", error instanceof Error ? error.message : String(error));
    return jsonResponse(req, { error: "An unexpected error occurred. Please try again." }, 500);
  }
});
