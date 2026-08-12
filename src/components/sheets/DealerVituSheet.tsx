import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Car, FileText } from "lucide-react";
import { dealerVituMonths, dealerVituMonthTotals, dealerVituYtd } from "@/data/cvsDealerVitu2026";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const DealerVituSheet = () => {
  const [monthKey, setMonthKey] = useState(dealerVituMonths[0].key);
  const month = dealerVituMonths.find((m) => m.key === monthKey) ?? dealerVituMonths[0];
  const totals = dealerVituMonthTotals(month);
  const tiesOut = Math.abs(totals.total - month.achPaid) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vitu Dealer Transactions — 2026 YTD</h2>
          <p className="text-muted-foreground">
            PennDOT title &amp; registration work processed through Vitu | Dealer ID 18000803 | COA 5100
            (PennDOT fees) &amp; 5120 (Vitu service charge + tax)
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl border border-border/60 p-1">
          {dealerVituMonths.map((m) => (
            <button
              key={m.key}
              onClick={() => setMonthKey(m.key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                monthKey === m.key
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Month summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.count}</div>
            <p className="text-sm text-muted-foreground">{month.label}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PennDOT Fees (5100)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency(totals.penndotFee)}</div>
            <p className="text-sm text-muted-foreground">Pass-through to the state</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vitu Charge + Tax (5120)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currency(totals.vituCharge + totals.processingTax)}
            </div>
            <p className="text-sm text-muted-foreground">
              {currency(totals.vituCharge)} service + {currency(totals.processingTax)} tax
            </p>
          </CardContent>
        </Card>
        <Card className="bg-warning/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ACH Debited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{currency(month.achPaid)}</div>
            <p className="text-sm text-muted-foreground">
              {tiesOut ? "Ties to detail ✓" : "Does not tie — review"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction type counts */}
      <Card>
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {month.label} — Transaction Types
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-6">
          {month.transactionCounts.map((c) => (
            <Badge key={c.type} variant="outline" className="text-sm">
              {c.type}: <span className="ml-1 font-bold">{c.count}</span>
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Line-by-line detail */}
      <Card>
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {month.label} — Line-by-Line Detail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-24">Date</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead className="text-right w-28">PennDOT Fee</TableHead>
                <TableHead className="text-right w-28">Vitu Charge</TableHead>
                <TableHead className="text-right w-24">Proc. Tax</TableHead>
                <TableHead className="text-right w-28">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {month.transactions.map((t, i) => (
                <TableRow key={`${t.vin ?? "na"}-${i}`}>
                  <TableCell className="font-mono">{t.date ?? "—"}</TableCell>
                  <TableCell className="font-medium">{t.type}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {t.vin ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">{currency(t.penndotFee)}</TableCell>
                  <TableCell className="text-right">{currency(t.vituCharge)}</TableCell>
                  <TableCell className="text-right">{currency(t.processingTax)}</TableCell>
                  <TableCell className="text-right font-medium">{currency(t.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={3}>{month.label} Totals ({totals.count} transactions)</TableCell>
                <TableCell className="text-right">{currency(totals.penndotFee)}</TableCell>
                <TableCell className="text-right">{currency(totals.vituCharge)}</TableCell>
                <TableCell className="text-right">{currency(totals.processingTax)}</TableCell>
                <TableCell className="text-right text-warning">{currency(totals.total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* YTD roll-forward */}
      <Card>
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            January – May 2026 Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">PennDOT Fees</TableHead>
                <TableHead className="text-right">Vitu Charge</TableHead>
                <TableHead className="text-right">Proc. Tax</TableHead>
                <TableHead className="text-right">ACH Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealerVituMonths.map((m) => {
                const t = dealerVituMonthTotals(m);
                return (
                  <TableRow key={m.key}>
                    <TableCell className="font-medium">{m.label}</TableCell>
                    <TableCell className="text-right">{t.count}</TableCell>
                    <TableCell className="text-right">{currency(t.penndotFee)}</TableCell>
                    <TableCell className="text-right">{currency(t.vituCharge)}</TableCell>
                    <TableCell className="text-right">{currency(t.processingTax)}</TableCell>
                    <TableCell className="text-right font-medium">{currency(m.achPaid)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>2026 YTD Total</TableCell>
                <TableCell className="text-right">{dealerVituYtd.count}</TableCell>
                <TableCell className="text-right">{currency(dealerVituYtd.penndotFee)}</TableCell>
                <TableCell className="text-right">{currency(dealerVituYtd.vituCharge)}</TableCell>
                <TableCell className="text-right">{currency(dealerVituYtd.processingTax)}</TableCell>
                <TableCell className="text-right text-warning">
                  {currency(dealerVituYtd.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-info/15 border border-info/30 rounded-lg p-4">
        <p className="text-sm text-info">
          <strong>Treatment:</strong> PennDOT fees are collected from the customer and remitted to the
          state, so they are recorded as pass-through cost against title-fee revenue (COA 5100). Vitu's
          service charge and the PA processing tax are the dealership's own cost of doing the title work
          (COA 5120). Each month's total agrees to the Vitu ACH debit on the checking account.
        </p>
      </div>
    </div>
  );
};
