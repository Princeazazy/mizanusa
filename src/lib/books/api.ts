import { supabase } from "@/integrations/supabase/client";
import type { AgentRun, BookTransaction, ChartAccount, ColumnMapping } from "./types";
import { normalizePayee } from "./types";
import { dedupeHash, type MappedRow } from "./csv";

export async function fetchAccounts(clientId: string) {
  const { data, error } = await supabase
    .from("chart_accounts")
    .select("id, client_id, code, name, type, description, is_active")
    .eq("client_id", clientId)
    .eq("is_active", true)
    .order("code");
  if (error) throw error;
  return (data ?? []) as ChartAccount[];
}

export async function fetchPeriods(clientId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("period")
    .eq("client_id", clientId);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r) => r.period as string))).sort().reverse();
}

export async function fetchTransactions(clientId: string, period: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, client_id, period, txn_date, description, payee, amount, direction, source, suggested_account_id, suggested_confidence, suggested_rationale, suggested_tier, status, approved_account_id, reviewed_at, is_demo",
    )
    .eq("client_id", clientId)
    .eq("period", period)
    .order("txn_date")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((t) => ({ ...t, amount: Number(t.amount) })) as BookTransaction[];
}

export async function fetchRuns(clientId: string, period?: string) {
  let query = supabase
    .from("agent_runs")
    .select("*")
    .eq("client_id", clientId)
    .order("started_at", { ascending: false })
    .limit(15);
  if (period) query = query.eq("period", period);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as AgentRun[];
}

export async function fetchImportProfile(clientId: string) {
  const { data, error } = await supabase
    .from("import_profiles")
    .select("mapping")
    .eq("client_id", clientId)
    .eq("name", "Default")
    .maybeSingle();
  if (error) throw error;
  return (data?.mapping ?? null) as unknown as ColumnMapping | null;
}

export async function saveImportProfile(clientId: string, mapping: ColumnMapping) {
  const { error } = await supabase
    .from("import_profiles")
    .upsert([{ client_id: clientId, name: "Default", mapping: mapping as unknown as never }], {
      onConflict: "client_id,name",
    });
  if (error) throw error;
}

export async function importTransactions(
  clientId: string,
  source: "bank" | "cc",
  rows: MappedRow[],
  isDemo = false,
) {
  const payload = rows.map((r) => ({
    client_id: clientId,
    period: r.txn_date.slice(0, 7),
    txn_date: r.txn_date,
    description: r.description,
    payee: r.payee,
    amount: r.amount,
    direction: r.direction,
    source,
    raw_row: r.raw_row,
    dedupe_hash: dedupeHash(r.txn_date, r.direction === "in" ? r.amount : -r.amount, r.description, source),
    status: "pending" as const,
    is_demo: isDemo,
  }));

  // Dedupe within the file itself, then let the DB unique index reject prior imports.
  const seen = new Set<string>();
  const unique = payload.filter((p) => {
    if (seen.has(p.dedupe_hash)) return false;
    seen.add(p.dedupe_hash);
    return true;
  });

  const { data, error } = await supabase
    .from("transactions")
    .upsert(unique, { onConflict: "client_id,dedupe_hash", ignoreDuplicates: true })
    .select("id");
  if (error) throw error;

  const inserted = data?.length ?? 0;
  return { inserted, duplicates: unique.length - inserted, skippedInFile: payload.length - unique.length };
}

export async function runAgent(clientId: string, period: string) {
  const { data, error } = await supabase.functions.invoke("categorize-agent", {
    body: { clientId, period },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as {
    runId: string;
    total: number;
    auto: number;
    review: number;
    errors: number;
    tier1: number;
    ai: number;
    warning?: string;
  };
}

/**
 * Learning loop: an approval or a correction writes the payee → account mapping
 * back into the client's agent memory so next month it is deterministic (Tier 1).
 * Corrections outweigh prior suggestions by resetting the count and overwriting.
 */
export async function learnMappings(
  clientId: string,
  entries: { payee: string; accountCode: string; corrected: boolean }[],
) {
  if (entries.length === 0) return;
  const { data, error } = await supabase
    .from("client_context")
    .select("vendor_mappings")
    .eq("client_id", clientId)
    .maybeSingle();
  if (error) throw error;

  const mappings = { ...((data?.vendor_mappings ?? {}) as Record<string, { account_code: string; count: number }>) };
  for (const entry of entries) {
    const key = normalizePayee(entry.payee);
    if (!key) continue;
    const existing = mappings[key];
    if (entry.corrected || !existing || existing.account_code !== entry.accountCode) {
      mappings[key] = {
        account_code: entry.accountCode,
        count: entry.corrected ? Math.max(2, (existing?.count ?? 0) + 1) : 1,
      };
    } else {
      mappings[key] = { account_code: existing.account_code, count: (existing.count ?? 0) + 1 };
    }
  }

  const { error: upsertError } = await supabase
    .from("client_context")
    .upsert({ client_id: clientId, vendor_mappings: mappings }, { onConflict: "client_id" });
  if (upsertError) throw upsertError;
}

export async function approveTransactions(
  clientId: string,
  txns: BookTransaction[],
  accounts: ChartAccount[],
  userId: string | undefined,
) {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const reviewed_at = new Date().toISOString();
  const learn: { payee: string; accountCode: string; corrected: boolean }[] = [];

  for (const t of txns) {
    const accountId = t.approved_account_id ?? t.suggested_account_id;
    if (!accountId) continue;
    const corrected = !!t.suggested_account_id && !!t.approved_account_id && t.approved_account_id !== t.suggested_account_id;
    const { error } = await supabase
      .from("transactions")
      .update({
        approved_account_id: accountId,
        status: corrected ? "corrected" : "approved",
        reviewed_by: userId ?? null,
        reviewed_at,
      })
      .eq("id", t.id);
    if (error) throw error;
    const code = byId.get(accountId)?.code;
    if (code) learn.push({ payee: t.payee || t.description, accountCode: code, corrected });
  }

  await learnMappings(clientId, learn);
}

export async function setAccount(txnId: string, accountId: string) {
  const { error } = await supabase
    .from("transactions")
    .update({ approved_account_id: accountId })
    .eq("id", txnId);
  if (error) throw error;
}

export async function deletePeriod(clientId: string, period: string) {
  const { error } = await supabase.from("transactions").delete().eq("client_id", clientId).eq("period", period);
  if (error) throw error;
}
