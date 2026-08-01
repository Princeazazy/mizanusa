// Mizan AI bookkeeping agent — ONE agent, run per client with that client's context loaded.
// Tier 1: deterministic rules + learned vendor mappings (no AI).
// Tier 2: Lovable AI batch categorization with strict JSON, never inventing accounts.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACCOUNTANT_EMAILS = ["elazazy.ameer@gmail.com", "oamroamr114@gmail.com"];
const MODEL = "openai/gpt-5.6-sol";
const AI_BATCH_SIZE = 60;
const AUTO_THRESHOLD = 0.92;

type Account = { id: string; code: string; name: string; type: string; description: string | null };
type Txn = {
  id: string;
  txn_date: string;
  description: string;
  payee: string | null;
  amount: number;
  direction: "in" | "out";
  source: string;
};

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b\d{3,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callAi(payload: unknown, apiKey: string) {
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true as const, data: await res.json() };
    const text = await res.text();
    lastErr = `${res.status} ${text.slice(0, 300)}`;
    // Only 429 / 5xx are retryable.
    if (res.status === 429 || res.status >= 500) {
      await sleep(800 * Math.pow(2, attempt));
      continue;
    }
    return { ok: false as const, status: res.status, error: lastErr };
  }
  return { ok: false as const, status: 429, error: lastErr };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  let runId: string | null = null;
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const token = authHeader.replace("Bearer ", "");
    const authClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    const claims = claimsData?.claims as { sub?: string; email?: string } | undefined;
    if (claimsError || !claims?.sub) return json({ error: "Unauthorized" }, 401);
    if (!ACCOUNTANT_EMAILS.includes((claims.email || "").toLowerCase().trim())) {
      return json({ error: "Forbidden" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const clientId = String(body.clientId || "").trim();
    const period = String(body.period || "").trim();
    if (!clientId || !period) return json({ error: "clientId and period are required" }, 400);

    const [{ data: accounts }, { data: context }, { data: pending }] = await Promise.all([
      admin.from("chart_accounts").select("id, code, name, type, description")
        .eq("client_id", clientId).eq("is_active", true).order("code"),
      admin.from("client_context").select("*").eq("client_id", clientId).maybeSingle(),
      admin.from("transactions").select("id, txn_date, description, payee, amount, direction, source")
        .eq("client_id", clientId).eq("period", period).eq("status", "pending")
        .order("txn_date").limit(1000),
    ]);

    const accountList = (accounts || []) as Account[];
    if (accountList.length === 0) return json({ error: "This client has no chart of accounts yet." }, 400);
    const byCode = new Map(accountList.map((a) => [a.code, a]));
    const txns = (pending || []) as Txn[];

    const { data: run, error: runError } = await admin.from("agent_runs").insert({
      client_id: clientId,
      period,
      status: "running",
      total_count: txns.length,
      model: MODEL,
      triggered_by: claims.sub,
    }).select("id").single();
    if (runError) throw runError;
    runId = run.id;

    if (txns.length === 0) {
      await admin.from("agent_runs").update({ status: "completed", finished_at: new Date().toISOString() }).eq("id", runId);
      return json({ runId, total: 0, auto: 0, review: 0, errors: 0, tier1: 0, ai: 0 });
    }

    const rules = (Array.isArray(context?.categorization_rules) ? context!.categorization_rules : []) as
      { match?: string; account_code?: string; note?: string }[];
    const vendorMappings = (context?.vendor_mappings || {}) as Record<string, { account_code?: string; count?: number }>;

    let auto = 0, review = 0, errors = 0, tier1 = 0, aiCount = 0;

    const apply = async (
      t: Txn,
      accountId: string | null,
      confidence: number,
      rationale: string,
      tier: "rule" | "vendor" | "ai",
    ) => {
      const ok = accountId !== null && confidence >= AUTO_THRESHOLD;
      if (ok) auto++; else review++;
      await admin.from("transactions").update({
        suggested_account_id: accountId,
        suggested_confidence: confidence,
        suggested_rationale: rationale.slice(0, 500),
        suggested_tier: tier,
        status: ok ? "auto_approved" : "needs_review",
        agent_run_id: runId,
      }).eq("id", t.id);
    };

    // ---------- Tier 1: deterministic ----------
    const remaining: Txn[] = [];
    for (const t of txns) {
      const key = norm(t.payee || t.description);
      const rule = rules.find((r) => r.match && key.includes(norm(r.match)));
      const ruleAccount = rule?.account_code ? byCode.get(rule.account_code) : undefined;
      if (rule && ruleAccount) {
        tier1++;
        await apply(t, ruleAccount.id, 0.99, `Accountant rule: "${rule.match}" → ${ruleAccount.code} ${ruleAccount.name}.`, "rule");
        continue;
      }
      const mapped = vendorMappings[key];
      const mappedAccount = mapped?.account_code ? byCode.get(mapped.account_code) : undefined;
      if (mappedAccount) {
        tier1++;
        await apply(t, mappedAccount.id, 0.99, `Learned mapping: this payee was posted to ${mappedAccount.code} ${mappedAccount.name} ${mapped?.count ?? 1}× before.`, "vendor");
        continue;
      }
      remaining.push(t);
    }

    // ---------- Tier 2: AI ----------
    if (remaining.length > 0) {
      if (!LOVABLE_API_KEY) {
        for (const t of remaining) {
          errors++;
          await apply(t, null, 0, "AI unavailable: LOVABLE_API_KEY is not configured.", "ai");
        }
      } else {
        const coaText = accountList
          .map((a) => `${a.code} | ${a.name} | ${a.type}${a.description ? ` | ${a.description}` : ""}`)
          .join("\n");
        const rulesText = rules.length
          ? rules.map((r) => `- if payee contains "${r.match}" → ${r.account_code}`).join("\n")
          : "(none)";
        const mappingsText = Object.entries(vendorMappings).slice(0, 200)
          .map(([k, v]) => `- ${k} → ${v.account_code}`).join("\n") || "(none)";

        for (let i = 0; i < remaining.length; i += AI_BATCH_SIZE) {
          const batch = remaining.slice(i, i + AI_BATCH_SIZE);
          const payload = {
            model: MODEL,
            reasoning_effort: "none",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  `You are a bookkeeping categorization engine for a CPA firm. Assign each transaction to exactly one account code from the client's chart of accounts.\n\n` +
                  `CLIENT: ${clientId}\nENTITY TYPE: ${context?.entity_type || "unknown"}\nINDUSTRY: ${context?.industry || "unknown"}\n` +
                  `NOTES: ${context?.notes || "(none)"}\n\nCHART OF ACCOUNTS (code | name | type | description):\n${coaText}\n\n` +
                  `ACCOUNTANT RULES:\n${rulesText}\n\nKNOWN PAYEE MAPPINGS:\n${mappingsText}\n\n` +
                  `HARD RULES:\n- NEVER invent an account code. Only codes listed above are valid.\n` +
                  `- If you are unsure or nothing fits, return account_code null and explain why.\n` +
                  `- Money in ("in") is normally revenue or a transfer; money out ("out") is normally COGS/expense or a transfer.\n` +
                  `- Inter-account transfers belong to the transfers account if one exists.\n` +
                  `- confidence is 0-1, your genuine certainty. rationale is ONE short sentence (max 140 chars).\n` +
                  `Return STRICT JSON: {"results":[{"id":"<txn id>","account_code":"6100"|null,"confidence":0.95,"rationale":"..."}]} ` +
                  `with exactly one entry per input transaction and no extra keys.`,
              },
              {
                role: "user",
                content: JSON.stringify(
                  batch.map((t) => ({
                    id: t.id,
                    date: t.txn_date,
                    payee: t.payee || t.description,
                    description: t.description,
                    amount: Number(t.amount),
                    direction: t.direction,
                    source: t.source,
                  })),
                ),
              },
            ],
          };

          const res = await callAi(payload, LOVABLE_API_KEY);
          if (!res.ok) {
            // Partial-batch resume: leave the rest pending so a re-run picks them up.
            const note = res.status === 402
              ? "AI credits exhausted — re-run once credits are topped up."
              : `AI request failed (${res.status}).`;
            for (const t of batch) {
              errors++;
              await apply(t, null, 0, note, "ai");
            }
            await admin.from("agent_runs").update({
              status: "completed",
              finished_at: new Date().toISOString(),
              auto_count: auto, review_count: review, error_count: errors,
              tier1_count: tier1, ai_count: aiCount,
              error_message: `${note} ${res.error}`.slice(0, 500),
            }).eq("id", runId);
            return json({ runId, total: txns.length, auto, review, errors, tier1, ai: aiCount, warning: note });
          }

          let parsed: { results?: { id?: string; account_code?: string | null; confidence?: number; rationale?: string }[] } = {};
          try {
            parsed = JSON.parse(res.data?.choices?.[0]?.message?.content ?? "{}");
          } catch {
            parsed = {};
          }
          const results = new Map(
            (Array.isArray(parsed.results) ? parsed.results : []).map((r) => [String(r.id), r]),
          );

          for (const t of batch) {
            aiCount++;
            const r = results.get(t.id);
            if (!r) {
              errors++;
              await apply(t, null, 0, "Agent returned no result for this line (malformed response).", "ai");
              continue;
            }
            const account = r.account_code ? byCode.get(String(r.account_code)) : undefined;
            if (!account) {
              errors++;
              await apply(
                t, null, 0,
                r.account_code
                  ? `Agent proposed unknown account "${r.account_code}" — flagged instead of guessing.`
                  : (r.rationale || "Agent could not confidently classify this line."),
                "ai",
              );
              continue;
            }
            const confidence = Math.max(0, Math.min(1, Number(r.confidence) || 0));
            await apply(t, account.id, confidence, r.rationale || "Categorized by the agent.", "ai");
          }
        }
      }
    }

    await admin.from("agent_runs").update({
      status: "completed",
      finished_at: new Date().toISOString(),
      auto_count: auto, review_count: review, error_count: errors,
      tier1_count: tier1, ai_count: aiCount,
    }).eq("id", runId);

    return json({ runId, total: txns.length, auto, review, errors, tier1, ai: aiCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("categorize-agent failed:", message);
    if (runId) {
      await admin.from("agent_runs").update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error_message: message.slice(0, 500),
      }).eq("id", runId);
    }
    return json({ error: "The agent run failed. Check the run history for details." }, 500);
  }
});
