import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Receipt } from "lucide-react";
import { useState } from "react";
import { vituInvoices, vituSummary } from "@/data/vituStatements";
import { vituInvoices2026, vituSummary2026 } from "@/data/cvsVitu2026";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const PERIODS = [
  { key: "2026", label: "2026 YTD (Jan\u2013May)", invoices: vituInvoices2026, summary: vituSummary2026 },
  { key: "q4-2025", label: "Q4 2025 (Oct\u2013Dec)", invoices: vituInvoices, summary: vituSummary },
] as const;

export const VituSheet = () => {
  const [periodKey, setPeriodKey] = useState<string>("2026");
  const period = PERIODS.find((p) => p.key === periodKey) ?? PERIODS[0];
  const vituInvoicesActive = period.invoices;
  const vituSummaryActive = period.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vitu Title Services</h2>
          <p className="text-muted-foreground">
            Title lookup and NMVTIS inquiry invoices for {period.label} | COA Code: 5120 - Title Lookup Services
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-border/60 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriodKey(p.key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${periodKey === p.key ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:bg-accent/50"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total DLDV Lookups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vituSummaryActive.totalDLDVLookups}</div>
            <p className="text-sm text-muted-foreground">@ $2.00 each</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total NMVTIS Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vituSummaryActive.totalNMVTISInquiries}</div>
            <p className="text-sm text-muted-foreground">@ $2.00 each</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(vituSummaryActive.quarterTotal)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Details */}
      {vituInvoicesActive.map((invoice) => (
        <Card key={invoice.invoiceNumber}>
          <CardHeader className="bg-muted/50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice #{invoice.invoiceNumber}
              </CardTitle>
              <Badge variant="outline">{invoice.month}</Badge>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground mt-2">
              <span>Invoice Date: {invoice.invoiceDate}</span>
              <span>Due Date: {invoice.dueDate}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Service Description</TableHead>
                  <TableHead className="text-right w-24">Quantity</TableHead>
                  <TableHead className="text-right w-24">Rate</TableHead>
                  <TableHead className="text-right w-32">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.service}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-warning/15 font-bold">
                  <TableCell colSpan={3}>Invoice Total</TableCell>
                  <TableCell className="text-right text-warning">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Quarterly Summary */}
      <Card>
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {period.label} Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Month</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">DLDV Lookups</TableHead>
                <TableHead className="text-right">NMVTIS Inquiries</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vituInvoicesActive.map((invoice) => (
                <TableRow key={invoice.invoiceNumber}>
                  <TableCell className="font-medium">{invoice.month}</TableCell>
                  <TableCell className="font-mono">{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-right">
                    {invoice.lineItems.find(i => i.service === "DLDV Lookups")?.quantity || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.lineItems.find(i => i.service === "NMVTIS Inquiries")?.quantity || 0}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={2}>{period.label} Total</TableCell>
                <TableCell className="text-right">{vituSummaryActive.totalDLDVLookups}</TableCell>
                <TableCell className="text-right">{vituSummaryActive.totalNMVTISInquiries}</TableCell>
                <TableCell className="text-right text-warning">
                  {formatCurrency(vituSummaryActive.quarterTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* COA Reference */}
      <div className="bg-info/15 border border-info/30 rounded-lg p-4">
        <p className="text-sm text-info">
          <strong>Chart of Accounts Reference:</strong> All Vitu title service expenses are categorized 
          under COA Code <Badge variant="outline" className="font-mono mx-1">5120</Badge> - Title Lookup Services, 
          which falls under Cost of Goods Sold (COGS) for auto dealership operations.
        </p>
      </div>
    </div>
  );
};
