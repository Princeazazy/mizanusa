import { motion } from "framer-motion";
import { FuturisticCashFlowChart } from "@/components/FuturisticCashFlowChart";
import { FuturisticDonutChart } from "@/components/FuturisticDonutChart";
import { FuturisticStatusPanel } from "@/components/FuturisticStatusPanel";
import {
  januaryDeposits, januaryWithdrawals, januarySummary,
  februaryDeposits, februaryWithdrawals,
  marchDeposits, marchWithdrawals, marchSummary,
} from "@/data/defioreBankTransactions";

type Txn = { date: string; amount: number; category?: string };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const weekIndexForDate = (date: string, monthOffset: number) => {
  const parts = date.split("/");
  const day = Number(parts[1] || 1);
  const weekInMonth = Math.min(3, Math.floor((day - 1) / 7));
  return monthOffset * 4 + weekInMonth;
};

const bucketWeekly = (txns: Txn[], monthOffset: number) => {
  const buckets = new Array(12).fill(0);
  for (const t of txns) {
    const idx = weekIndexForDate(t.date, monthOffset);
    buckets[idx] += t.amount;
  }
  return buckets;
};

interface DefioreDashboardSheetProps {
  viewOnly?: boolean;
}

export const DefioreDashboardSheet = ({ viewOnly = false }: DefioreDashboardSheetProps) => {
  const incoming = bucketWeekly(januaryDeposits as unknown as Txn[], 0);
  const incomingFeb = bucketWeekly(februaryDeposits as unknown as Txn[], 1);
  const incomingMar = bucketWeekly(marchDeposits as unknown as Txn[], 2);
  for (let i = 4; i < 8; i++) incoming[i] = incomingFeb[i] ?? 0;
  for (let i = 8; i < 12; i++) incoming[i] = incomingMar[i] ?? 0;

  const outgoing = bucketWeekly(januaryWithdrawals as unknown as Txn[], 0);
  const outgoingFeb = bucketWeekly(februaryWithdrawals as unknown as Txn[], 1);
  const outgoingMar = bucketWeekly(marchWithdrawals as unknown as Txn[], 2);
  for (let i = 4; i < 8; i++) outgoing[i] = outgoingFeb[i] ?? 0;
  for (let i = 8; i < 12; i++) outgoing[i] = outgoingMar[i] ?? 0;

  const netBalance: number[] = [];
  let running = januarySummary.beginningBalance;
  for (let i = 0; i < 12; i++) {
    running += incoming[i] - outgoing[i];
    netBalance.push(running);
  }

  const totalIncoming = incoming.reduce((s, v) => s + v, 0);
  const totalOutgoing = outgoing.reduce((s, v) => s + v, 0);
  const netCashFlow = totalIncoming - totalOutgoing;

  const allWithdrawals = [
    ...(januaryWithdrawals as unknown as Txn[]),
    ...(februaryWithdrawals as unknown as Txn[]),
    ...(marchWithdrawals as unknown as Txn[]),
  ];

  const byCat = new Map<string, number>();
  for (const w of allWithdrawals) {
    const key = w.category || "Other";
    byCat.set(key, (byCat.get(key) || 0) + w.amount);
  }

  const topCats = [...byCat.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, amount], idx) => ({
      name,
      amount,
      change: 0,
      color: `hsl(var(--chart-${idx + 1}))`,
    }));

  const sum = (txns: Txn[]) => txns.reduce((s, t) => s + t.amount, 0);

  const monthly = [
    { month: "Jan", revenue: sum(januaryDeposits as unknown as Txn[]), expenses: sum(januaryWithdrawals as unknown as Txn[]) },
    { month: "Feb", revenue: sum(februaryDeposits as unknown as Txn[]), expenses: sum(februaryWithdrawals as unknown as Txn[]) },
    { month: "Mar", revenue: sum(marchDeposits as unknown as Txn[]), expenses: sum(marchWithdrawals as unknown as Txn[]) },
  ];

  const netTrend = monthly.map((m) => ({ month: m.month, net: m.revenue - m.expenses }));
  const categorySlices = topCats.map((c) => ({ name: c.name, value: c.amount }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Editorial stat band — oversized figures, quiet labels */}
      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.06] sm:grid-cols-3">
        {[
          { k: "Cash In", v: formatCurrency(totalIncoming) },
          { k: "Cash Out", v: formatCurrency(totalOutgoing) },
          { k: "Net Movement", v: formatCurrency(netCashFlow), accent: true },
        ].map((s) => (
          <div key={s.k} className="bg-background/80 px-7 py-7">
            <span className="eyebrow-label">{s.k}</span>
            <div
              className={`stat-display mt-3 text-[30px] leading-none ${s.accent ? "text-primary" : ""}`}
            >
              {s.v}
            </div>
          </div>
        ))}
      </section>

      {/* Asymmetric chart grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <RevenueExpenseChart data={monthly} />
        <NetIncomeTrendChart data={netTrend} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.35fr]">
        <ExpenseBreakdownChart data={categorySlices} />
        <div className="grid grid-cols-1 gap-6">
          <FuturisticCashFlowChart
            data={{ incoming, outgoing, netBalance }}
            netCashFlow={formatCurrency(netCashFlow)}
            netCashFlowChange={0}
            currentBalance={formatCurrency(marchSummary.endingBalance)}
            currentBalanceChange={0}
            freeCashFlow={formatCurrency(netCashFlow)}
            freeCashFlowChange={0}
            runway="—"
            runwayChange={0}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6">


      <div className="xl:col-span-1">
        <FuturisticStatusPanel
          statusItems={[
            { label: "My Taxes", status: "on-track", statusLabel: "On Track" },
            { label: "Acct. Connections", status: "optimal", statusLabel: "Optimal" },
            { label: "Bookkeeping", status: "tasks", statusLabel: "Assigned Tasks", taskCount: viewOnly ? 2 : 3 },
          ]}
          tasks={viewOnly ? [
            {
              id: "t1",
              title: "Transaction in Need of Review",
              count: 6,
              dueDate: "Apr 5",
              dueDays: "2d",
              type: "review",
              description: "Review uncategorized / unusual bank activity.",
            },
            {
              id: "t3",
              title: "Taxes Ready for Signature",
              dueDate: "Apr 15",
              dueDays: "1w 3d",
              type: "signature",
              description: "Sign off before we can submit.",
            },
          ] : [
            {
              id: "t1",
              title: "Transaction in Need of Review",
              count: 6,
              dueDate: "Apr 5",
              dueDays: "2d",
              type: "review",
              description: "Review uncategorized / unusual bank activity.",
            },
            {
              id: "t2",
              title: "Documents Requested",
              count: 3,
              dueDate: "Apr 10",
              dueDays: "5d",
              type: "documents",
              description: "Upload missing monthly statements.",
            },
            {
              id: "t3",
              title: "Taxes Ready for Signature",
              dueDate: "Apr 15",
              dueDays: "1w 3d",
              type: "signature",
              description: "Sign off before we can submit.",
            },
          ]}
        />
      </div>
    </motion.div>
  );
};
