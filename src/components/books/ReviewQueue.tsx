import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CircleAlert, Keyboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AccountPicker } from "./AccountPicker";
import { AUTO_THRESHOLD, type BookTransaction, type ChartAccount, type TxnStatus } from "@/lib/books/types";
import { cn } from "@/lib/utils";

interface ReviewQueueProps {
  transactions: BookTransaction[];
  accounts: ChartAccount[];
  busy?: boolean;
  onSetAccount: (txnId: string, accountId: string) => void;
  onApprove: (txns: BookTransaction[]) => void;
}

const STATUS_LABEL: Record<TxnStatus, string> = {
  pending: "Pending",
  auto_approved: "AI drafted",
  needs_review: "Needs review",
  approved: "Approved",
  corrected: "Corrected",
};

const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ConfidencePill = ({ value, tier }: { value: number | null; tier: string | null }) => {
  if (value === null) return <span className="text-[11px] text-muted-foreground">—</span>;
  const high = value >= AUTO_THRESHOLD;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] tabular",
        high
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-amber-400/30 bg-amber-400/10 text-amber-300",
      )}
    >
      {Math.round(value * 100)}%
      {tier && tier !== "ai" && <span className="opacity-70">rule</span>}
    </span>
  );
};

export const ReviewQueue = ({ transactions, accounts, busy, onSetAccount, onApprove }: ReviewQueueProps) => {
  const [statusFilter, setStatusFilter] = useState<"queue" | TxnStatus | "all">("queue");
  const [confidenceFilter, setConfidenceFilter] = useState<"all" | "high" | "low">("all");
  const [cursor, setCursor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter === "queue" && !["pending", "auto_approved", "needs_review"].includes(t.status)) return false;
      if (statusFilter !== "queue" && statusFilter !== "all" && t.status !== statusFilter) return false;
      const c = t.suggested_confidence ?? 0;
      if (confidenceFilter === "high" && c < AUTO_THRESHOLD) return false;
      if (confidenceFilter === "low" && c >= AUTO_THRESHOLD) return false;
      return true;
    });
  }, [transactions, statusFilter, confidenceFilter]);

  useEffect(() => {
    if (cursor > rows.length - 1) setCursor(Math.max(0, rows.length - 1));
  }, [rows.length, cursor]);

  const bulkEligible = rows.filter(
    (t) => (t.suggested_confidence ?? 0) >= AUTO_THRESHOLD && (t.approved_account_id ?? t.suggested_account_id) &&
      t.status !== "approved" && t.status !== "corrected",
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (rows.length === 0) return;
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.getAttribute("role") === "combobox") return;

    if (event.key === "ArrowDown" || event.key === "j") {
      event.preventDefault();
      setCursor((c) => Math.min(rows.length - 1, c + 1));
    } else if (event.key === "ArrowUp" || event.key === "k") {
      event.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const row = rows[cursor];
      if (row && (row.approved_account_id ?? row.suggested_account_id)) onApprove([row]);
    }
  };

  return (
    <div className="surface-panel p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-medium text-foreground">Review queue</h3>
          <span className="tabular text-[11.5px] text-muted-foreground">{rows.length} shown</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex text-muted-foreground/70">
                <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              ↑/↓ move · Enter approves the focused row · click a row to focus it
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="h-8 w-[150px] text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="queue">Needs action</SelectItem>
              <SelectItem value="auto_approved">AI drafted</SelectItem>
              <SelectItem value="needs_review">Needs review</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="corrected">Corrected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Select value={confidenceFilter} onValueChange={(v) => setConfidenceFilter(v as typeof confidenceFilter)}>
            <SelectTrigger className="h-8 w-[150px] text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any confidence</SelectItem>
              <SelectItem value="high">≥ {Math.round(AUTO_THRESHOLD * 100)}%</SelectItem>
              <SelectItem value="low">Below {Math.round(AUTO_THRESHOLD * 100)}%</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            disabled={bulkEligible.length === 0 || busy}
            onClick={() => onApprove(bulkEligible)}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            Approve {bulkEligible.length} ≥ {Math.round(AUTO_THRESHOLD * 100)}%
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Transaction review queue"
        className="max-h-[560px] overflow-y-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
      >
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[12.5px] text-muted-foreground">
            Nothing in this view. Import a statement or change the filters.
          </p>
        ) : (
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
              <tr className="border-b border-border/60 text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Payee / description</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Account</th>
                <th className="px-3 py-2 font-medium">Conf.</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const accountId = t.approved_account_id ?? t.suggested_account_id;
                const settled = t.status === "approved" || t.status === "corrected";
                return (
                  <tr
                    key={t.id}
                    onClick={() => setCursor(i)}
                    className={cn(
                      "border-b border-border/40 last:border-0 transition-colors",
                      i === cursor ? "bg-primary/[0.06]" : "hover:bg-white/[0.02]",
                    )}
                  >
                    <td className="tabular whitespace-nowrap px-4 py-2 text-muted-foreground">{t.txn_date}</td>
                    <td className="px-3 py-2">
                      <div className="max-w-[280px] truncate text-foreground">{t.payee || t.description}</div>
                      {t.payee && (
                        <div className="max-w-[280px] truncate text-[11px] text-muted-foreground/70">{t.description}</div>
                      )}
                    </td>
                    <td
                      className={cn(
                        "tabular whitespace-nowrap px-3 py-2 text-right",
                        t.direction === "in" ? "text-primary" : "text-foreground",
                      )}
                    >
                      {t.direction === "in" ? "" : "−"}
                      {money(Number(t.amount))}
                    </td>
                    <td className="px-3 py-2">
                      <AccountPicker
                        accounts={accounts}
                        value={accountId}
                        onChange={(id) => onSetAccount(t.id, id)}
                        label={`Account for ${t.payee || t.description}`}
                        className="w-[220px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      {t.suggested_rationale ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0} className="inline-flex">
                              <ConfidencePill value={t.suggested_confidence} tier={t.suggested_tier} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[280px]">
                            {t.suggested_rationale}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <ConfidencePill value={t.suggested_confidence} tier={t.suggested_tier} />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "text-[11px]",
                          settled ? "text-primary" : t.status === "needs_review" ? "text-amber-300" : "text-muted-foreground",
                        )}
                      >
                        {t.status === "needs_review" && (
                          <CircleAlert className="mr-1 inline h-3 w-3" aria-hidden="true" />
                        )}
                        {STATUS_LABEL[t.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {settled ? (
                        <span className="text-[11px] text-muted-foreground/70">Done</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 gap-1 px-2 text-[11.5px]"
                          disabled={!accountId || busy}
                          onClick={() => onApprove([t])}
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
