import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals,
  octoberSummary,
  decemberSummary,
} from "@/data/bankTransactions";

import { FuturisticCashFlowChart } from "@/components/FuturisticCashFlowChart";
import { FuturisticDonutChart } from "@/components/FuturisticDonutChart";
import { FuturisticStatusPanel } from "@/components/FuturisticStatusPanel";

type Txn = { date: string; amount: number; category?: string };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const weekIndexForDate = (date: string, monthOffset: number) => {
  // date format assumed MM/DD/YYYY
  const parts = date.split("/");
  const day = Number(parts[1] || 1);
  const weekInMonth = Math.min(3, Math.floor((day - 1) / 7)); // 0..3 (4 weeks)
  return monthOffset * 4 + weekInMonth; // 0..11
};

const bucketWeekly = (txns: Txn[], monthOffset: number) => {
  const buckets = new Array(12).fill(0);
  for (const t of txns) {
    const idx = weekIndexForDate(t.date, monthOffset);
    buckets[idx] += t.amount;
  }
  return buckets;
};

export const FuturisticDashboardSheet = () => {
  const { toast } = useToast();

  const incoming = [
    ...bucketWeekly(octoberDeposits as unknown as Txn[], 0),
    ...[],
  ].slice(0, 12);

  const outgoing = [
    ...bucketWeekly(octoberWithdrawals as unknown as Txn[], 0),
    ...[],
  ].slice(0, 12);

  // Fill Nov/Dec (offsets 1 and 2)
  const incomingNov = bucketWeekly(novemberDeposits as unknown as Txn[], 1);
  const outgoingNov = bucketWeekly(novemberWithdrawals as unknown as Txn[], 1);
  const incomingDec = bucketWeekly(decemberDeposits as unknown as Txn[], 2);
  const outgoingDec = bucketWeekly(decemberWithdrawals as unknown as Txn[], 2);
  for (let i = 4; i < 8; i++) {
    incoming[i] = incomingNov[i] ?? 0;
    outgoing[i] = outgoingNov[i] ?? 0;
  }
  for (let i = 8; i < 12; i++) {
    incoming[i] = incomingDec[i] ?? 0;
    outgoing[i] = outgoingDec[i] ?? 0;
  }

  // Net balance (cumulative)
  const netBalance: number[] = [];
  let running = octoberSummary.beginningBalance;
  for (let i = 0; i < 12; i++) {
    running += incoming[i] - outgoing[i];
    netBalance.push(running);
  }

  const totalIncoming = incoming.reduce((s, v) => s + v, 0);
  const totalOutgoing = outgoing.reduce((s, v) => s + v, 0);
  const netCashFlow = totalIncoming - totalOutgoing;

  // Expense categories (Top 6)
  const allWithdrawals = [
    ...(octoberWithdrawals as unknown as Txn[]),
    ...(novemberWithdrawals as unknown as Txn[]),
    ...(decemberWithdrawals as unknown as Txn[]),
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-6"
    >
      <div className="xl:col-span-1">
        <FuturisticCashFlowChart
          data={{ incoming, outgoing, netBalance }}
          netCashFlow={formatCurrency(netCashFlow)}
          netCashFlowChange={22.4}
          currentBalance={formatCurrency(decemberSummary.endingBalance)}
          currentBalanceChange={-14.2}
          freeCashFlow={formatCurrency(netCashFlow)}
          freeCashFlowChange={-62.4}
          runway="12.5"
          runwayChange={3.1}
        />
      </div>

      <div className="xl:col-span-1">
        <FuturisticDonutChart
          title="Top Expense Categories"
          totalValue={formatCurrency(totalOutgoing)}
          totalLabel="Total Expenses"
          change={5.2}
          categories={topCats}
        />
      </div>

      <div className="xl:col-span-1">
        <FuturisticStatusPanel
          statusItems={[
            { label: "My Taxes", status: "on-track", statusLabel: "On Track" },
            { label: "Acct. Connections", status: "optimal", statusLabel: "Optimal" },
            { label: "Bookkeeping", status: "tasks", statusLabel: "Assigned Tasks", taskCount: 4 },
          ]}
          tasks={[
            {
              id: "t1",
              title: "Transaction in Need of Review",
              count: 4,
              dueDate: "Apr 2",
              dueDays: "2d",
              type: "review",
              description: "Review uncategorized / unusual bank activity.",
            },
            {
              id: "t2",
              title: "Documents Requested",
              count: 2,
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
            {
              id: "t4",
              title: "Upload Your Monthly Statements",
              count: 2,
              dueDate: "Apr 3",
              dueDays: "2d",
              type: "upload",
              description: "Upload latest statement PDFs for reconciliation.",
            },
          ]}
        />
      </div>
    </motion.div>
  );
};
