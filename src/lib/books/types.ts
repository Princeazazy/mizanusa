import type { Transaction } from "@/data/bankTransactions";

export type TxnStatus = "pending" | "auto_approved" | "needs_review" | "approved" | "corrected";

export interface ChartAccount {
  id: string;
  client_id: string;
  code: string;
  name: string;
  type: string;
  description: string | null;
  is_active: boolean;
}

export interface BookTransaction {
  id: string;
  client_id: string;
  period: string;
  txn_date: string;
  description: string;
  payee: string | null;
  amount: number;
  direction: "in" | "out";
  source: "bank" | "cc";
  suggested_account_id: string | null;
  suggested_confidence: number | null;
  suggested_rationale: string | null;
  suggested_tier: "rule" | "vendor" | "ai" | null;
  status: TxnStatus;
  approved_account_id: string | null;
  reviewed_at: string | null;
  is_demo: boolean;
}

export interface AgentRun {
  id: string;
  client_id: string;
  period: string;
  status: "running" | "completed" | "failed";
  started_at: string;
  finished_at: string | null;
  total_count: number;
  auto_count: number;
  review_count: number;
  error_count: number;
  tier1_count: number;
  ai_count: number;
  model: string | null;
  error_message: string | null;
}

export interface ColumnMapping {
  date: string;
  description: string;
  amount: string;
  /** Optional separate debit/credit columns. */
  debit?: string;
  credit?: string;
  payee?: string;
  /** When a single amount column is used, whether positive means money in. */
  positiveIsIn?: boolean;
}

export const AUTO_THRESHOLD = 0.92;

/** "2026-04" → "April 2026" */
export const formatPeriod = (period: string) => {
  const [y, m] = period.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  if (Number.isNaN(date.getTime())) return period;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const periodFromDate = (iso: string) => iso.slice(0, 7);

/** Account a row will post to once approved (falls back to the suggestion). */
export const effectiveAccountId = (t: BookTransaction) => t.approved_account_id ?? t.suggested_account_id;

export const normalizePayee = (value: string) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b\d{3,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Adapter: approved book transactions → the shape the existing statement
 * engine (P&L / balance sheet / cash flow sheets) already reads.
 */
export const toStatementTransactions = (
  txns: BookTransaction[],
  accounts: ChartAccount[],
): Transaction[] => {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  return txns
    .filter((t) => t.status === "approved" || t.status === "corrected")
    .map((t) => {
      const account = byId.get(effectiveAccountId(t) || "");
      const [, month, day] = t.txn_date.split("-");
      return {
        date: `${Number(month)}/${Number(day)}`,
        description: t.description,
        coaCode: account?.code ?? "6800",
        category: account?.name ?? "Uncategorized",
        amount: Math.abs(Number(t.amount)),
        type: t.direction === "in" ? ("deposit" as const) : ("withdrawal" as const),
      };
    });
};
