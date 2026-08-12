import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeftRight } from "lucide-react";
import { cvs2026Months } from "@/data/cvs2026Transactions";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const Cvs2026TransfersSheet = () => {
  const all = cvs2026Months.flatMap((m) => m.transfers.map((t) => ({ ...t, month: m.label })));
  const total = all.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Inter-Account Transfers — 2026 YTD</h2>
        <p className="text-muted-foreground">
          Movements between Business Basic Checking and Business Savings. COA 9999 — excluded from revenue
          and expenses so the P&amp;L is not overstated.
        </p>
      </div>

      <Card>
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            January – May 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-24">Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right w-32">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {all.map((t, i) => (
                <TableRow key={`${t.date}-${t.amount}-${i}`}>
                  <TableCell className="font-mono">{t.date}</TableCell>
                  <TableCell className="text-muted-foreground">{t.month}</TableCell>
                  <TableCell>{t.from}</TableCell>
                  <TableCell>{t.to}</TableCell>
                  <TableCell className="text-muted-foreground">{t.reference}</TableCell>
                  <TableCell className="text-right font-medium">{currency(t.amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={5}>Total transferred (both directions)</TableCell>
                <TableCell className="text-right">{currency(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
