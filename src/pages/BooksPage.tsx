import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, BrainCircuit, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CsvImportDialog } from "@/components/books/CsvImportDialog";
import { ReviewQueue } from "@/components/books/ReviewQueue";
import { BOOKS_CLIENTS } from "@/lib/books/clients";
import {
  approveTransactions,
  deletePeriod,
  fetchAccounts,
  fetchPeriods,
  fetchRuns,
  fetchTransactions,
  runAgent,
  setAccount,
} from "@/lib/books/api";
import {
  formatPeriod,
  toStatementTransactions,
  type AgentRun,
  type BookTransaction,
  type ChartAccount,
} from "@/lib/books/types";
import { useNavigate } from "react-router-dom";

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BooksPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientId, setClientId] = useState(BOOKS_CLIENTS[0].id);
  const [periods, setPeriods] = useState<string[]>([]);
  const [period, setPeriod] = useState<string>("");
  const [accounts, setAccounts] = useState<ChartAccount[]>([]);
  const [transactions, setTransactions] = useState<BookTransaction[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const [statementsOpen, setStatementsOpen] = useState(false);

  const client = BOOKS_CLIENTS.find((c) => c.id === clientId)!;

  const loadClient = useCallback(async () => {
    setLoading(true);
    try {
      const [nextAccounts, nextPeriods, nextRuns] = await Promise.all([
        fetchAccounts(clientId),
        fetchPeriods(clientId),
        fetchRuns(clientId),
      ]);
      setAccounts(nextAccounts);
      setPeriods(nextPeriods);
      setRuns(nextRuns);
      setPeriod((current) => (current && nextPeriods.includes(current) ? current : nextPeriods[0] ?? ""));
      if (nextPeriods.length === 0) setTransactions([]);
    } catch (error) {
      toast({
        title: "Could not load books",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, toast]);

  const loadPeriod = useCallback(async () => {
    if (!period) return;
    try {
      const [nextTxns, nextRuns] = await Promise.all([fetchTransactions(clientId, period), fetchRuns(clientId)]);
      setTransactions(nextTxns);
      setRuns(nextRuns);
    } catch (error) {
      toast({
        title: "Could not load transactions",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  }, [clientId, period, toast]);

  useEffect(() => {
    void loadClient();
  }, [loadClient]);

  useEffect(() => {
    void loadPeriod();
  }, [loadPeriod]);

  const stats = useMemo(() => {
    const total = transactions.length;
    const count = (...s: string[]) => transactions.filter((t) => s.includes(t.status)).length;
    const approved = count("approved", "corrected");
    return {
      total,
      pending: count("pending"),
      auto: count("auto_approved"),
      review: count("needs_review"),
      approved,
      complete: total > 0 && approved === total,
    };
  }, [transactions]);

  const statementLines = useMemo(() => toStatementTransactions(transactions, accounts), [transactions, accounts]);

  const statementTotals = useMemo(() => {
    const byId = new Map(accounts.map((a) => [a.code, a]));
    let revenue = 0;
    let cogs = 0;
    let expense = 0;
    for (const line of statementLines) {
      const type = byId.get(line.coaCode)?.type;
      if (type === "Revenue") revenue += line.amount;
      else if (type === "COGS") cogs += line.amount;
      else if (type === "Expense") expense += line.amount;
    }
    return { revenue, cogs, expense, net: revenue - cogs - expense };
  }, [statementLines, accounts]);

  const handleRun = async () => {
    if (!period) return;
    setRunning(true);
    try {
      const result = await runAgent(clientId, period);
      toast({
        title: result.total === 0 ? "Nothing pending" : "Agent run complete",
        description:
          result.total === 0
            ? "Every transaction in this period has already been processed."
            : `${result.total} processed · ${result.auto} auto-categorized · ${result.review} need review · ${result.tier1} matched by rules${result.errors ? ` · ${result.errors} flagged` : ""}`,
        variant: result.warning ? "destructive" : undefined,
      });
      await loadPeriod();
    } catch (error) {
      toast({
        title: "Agent run failed",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const handleApprove = async (txns: BookTransaction[]) => {
    if (txns.length === 0) return;
    setBusy(true);
    try {
      await approveTransactions(clientId, txns, accounts, user?.id);
      toast({
        title: `Approved ${txns.length} transaction${txns.length === 1 ? "" : "s"}`,
        description: "Payee mappings were written back to this client's agent memory.",
      });
      await loadPeriod();
    } catch (error) {
      toast({
        title: "Approval failed",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSetAccount = async (txnId: string, accountId: string) => {
    setTransactions((prev) => prev.map((t) => (t.id === txnId ? { ...t, approved_account_id: accountId } : t)));
    try {
      await setAccount(txnId, accountId);
    } catch (error) {
      toast({
        title: "Could not save that account",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
      await loadPeriod();
    }
  };

  const handleClearPeriod = async () => {
    if (!period) return;
    setBusy(true);
    try {
      await deletePeriod(clientId, period);
      toast({ title: "Period cleared", description: `${formatPeriod(period)} transactions were removed.` });
      await loadClient();
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?role=bookkeeper");
  };

  const statCards = [
    { label: "Total lines", value: stats.total },
    { label: "AI drafted", value: stats.auto },
    { label: "Needs review", value: stats.review },
    { label: "Approved", value: stats.approved },
  ];

  return (
    <div className="futuristic-bg relative min-h-screen overflow-hidden">
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />

      <FuturisticSidebar onSignOut={handleSignOut} />

      <div className="ml-16">
        <div className="mx-auto max-w-[1600px] px-6 py-8 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <FuturisticHeader
              title="Books"
              subtitle="AI-drafted bookkeeping, reviewed and approved by you before anything reaches a statement."
              onSignOut={handleSignOut}
            />

            {/* Controls */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="h-9 w-[240px] text-[12.5px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKS_CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={period} onValueChange={setPeriod} disabled={periods.length === 0}>
                <SelectTrigger className="h-9 w-[180px] text-[12.5px]">
                  <SelectValue placeholder={periods.length ? "Select period" : "No periods yet"} />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {formatPeriod(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CsvImportDialog clientId={clientId} isDemo={client.demo} onImported={loadClient} />

              <Button
                size="sm"
                className="gap-2"
                disabled={!period || running || stats.pending === 0}
                onClick={handleRun}
              >
                {running ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {running ? "Agent running…" : `Run agent${stats.pending ? ` (${stats.pending})` : ""}`}
              </Button>

              <Button size="sm" variant="ghost" className="gap-2" onClick={() => void loadPeriod()} disabled={!period}>
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh
              </Button>

              {client.demo && period && (
                <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground" onClick={handleClearPeriod} disabled={busy}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear demo period
                </Button>
              )}
            </div>

            {/* Summary */}
            <div className="halo-card mb-6 p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {client.name}
                    {client.demo ? " · fabricated demo data" : ""}
                  </p>
                  <h2 className="headline-editorial mt-2 text-[24px] text-foreground sm:text-[28px]">
                    {period ? formatPeriod(period) : "No period imported"}
                  </h2>
                </div>
                {stats.complete ? (
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="badge-status badge-on-track">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      AI-drafted, accountant-approved
                    </span>
                    <Button size="sm" variant="outline" onClick={() => setStatementsOpen(true)}>
                      Send to statements
                    </Button>
                  </div>
                ) : (
                  <p className="max-w-[38ch] text-[12px] text-muted-foreground">
                    Draft until approved — {stats.review + stats.auto + stats.pending} line(s) still need your sign-off
                    before this period can feed statements.
                  </p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {statCards.map((card) => (
                  <div key={card.label}>
                    <p className="stat-display text-[26px] text-foreground">{card.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{card.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="h-[320px] animate-pulse rounded-2xl bg-white/[0.04]" />
            ) : (
              <ReviewQueue
                transactions={transactions}
                accounts={accounts}
                busy={busy}
                onSetAccount={handleSetAccount}
                onApprove={handleApprove}
              />
            )}

            {/* Run history */}
            <div className="surface-panel mt-6 p-0">
              <div className="border-b border-border/60 px-5 py-3.5">
                <h3 className="text-[13px] font-medium text-foreground">Agent run history</h3>
              </div>
              {runs.length === 0 ? (
                <p className="px-5 py-8 text-center text-[12.5px] text-muted-foreground">
                  No runs yet for this client.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-2 font-medium">Started</th>
                        <th className="px-3 py-2 font-medium">Period</th>
                        <th className="px-3 py-2 text-right font-medium">Total</th>
                        <th className="px-3 py-2 text-right font-medium">Auto</th>
                        <th className="px-3 py-2 text-right font-medium">Review</th>
                        <th className="px-3 py-2 text-right font-medium">Rules</th>
                        <th className="px-3 py-2 text-right font-medium">AI</th>
                        <th className="px-3 py-2 font-medium">Model</th>
                        <th className="px-5 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map((run) => (
                        <tr key={run.id} className="border-b border-border/40 last:border-0">
                          <td className="tabular whitespace-nowrap px-5 py-2 text-muted-foreground">
                            {new Date(run.started_at).toLocaleString()}
                          </td>
                          <td className="px-3 py-2">{formatPeriod(run.period)}</td>
                          <td className="tabular px-3 py-2 text-right">{run.total_count}</td>
                          <td className="tabular px-3 py-2 text-right">{run.auto_count}</td>
                          <td className="tabular px-3 py-2 text-right">{run.review_count}</td>
                          <td className="tabular px-3 py-2 text-right">{run.tier1_count}</td>
                          <td className="tabular px-3 py-2 text-right">{run.ai_count}</td>
                          <td className="max-w-[160px] truncate px-3 py-2 text-muted-foreground">{run.model ?? "—"}</td>
                          <td className="px-5 py-2">
                            <span className={run.status === "failed" ? "text-destructive" : "text-muted-foreground"}>
                              {run.status}
                              {run.error_count ? ` · ${run.error_count} flagged` : ""}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <SiteFooter className="mt-16" />
      </div>

      {/* Statements handoff */}
      <Dialog open={statementsOpen} onOpenChange={setStatementsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ready for statements</DialogTitle>
            <DialogDescription>
              {statementLines.length} approved line(s) for {period ? formatPeriod(period) : ""} mapped into the statement
              engine's transaction format. Provenance: AI-drafted, accountant-approved (internal only).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-[13px]">
            {[
              ["Revenue", statementTotals.revenue],
              ["Cost of goods sold", statementTotals.cogs],
              ["Operating expenses", statementTotals.expense],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between border-b border-border/40 py-1.5">
                <span className="text-muted-foreground">{label}</span>
                <span className="tabular">{money(value as number)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-medium">Net income</span>
              <span className="tabular font-medium text-primary">{money(statementTotals.net)}</span>
            </div>
          </div>
          <p className="text-[11.5px] text-muted-foreground">
            These figures are computed from approved transactions only, using each line's approved chart-of-accounts code.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksPage;
