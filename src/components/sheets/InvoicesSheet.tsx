import { Invoice } from "@/data/defioreInvoices";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface InvoicesSheetProps {
  invoices: Invoice[];
  title?: string;
}

export const InvoicesSheet = ({ invoices, title = "Invoices" }: InvoicesSheetProps) => {
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidTotal, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Invoices</p>
          <p className="text-2xl font-bold text-foreground mt-1">{invoices.length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Invoiced</p>
          <p className="text-2xl font-bold text-foreground mt-1">{fmt(totalInvoiced)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{fmt(totalPaid)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding</p>
          <p className={`text-2xl font-bold mt-1 ${totalOutstanding > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {fmt(totalOutstanding)}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead className="text-muted-foreground">Invoice #</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Bill To</TableHead>
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground text-right">Total</TableHead>
              <TableHead className="text-muted-foreground text-right">Paid</TableHead>
              <TableHead className="text-muted-foreground text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.invoiceNumber} className="border-border/20 hover:bg-accent/30">
                <TableCell className="font-mono font-medium text-foreground">#{inv.invoiceNumber}</TableCell>
                <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                <TableCell className="text-foreground max-w-[200px] truncate">{inv.billTo.split("–")[0].trim()}</TableCell>
                <TableCell className="text-foreground max-w-[200px] truncate">{inv.description}</TableCell>
                <TableCell className="text-right font-medium text-foreground">{fmt(inv.total)}</TableCell>
                <TableCell className="text-right font-medium text-emerald-400">{fmt(inv.paidTotal)}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={inv.status === "paid" ? "default" : inv.status === "partial" ? "secondary" : "destructive"}
                    className={
                      inv.status === "paid"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : inv.status === "unpaid"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : ""
                    }
                  >
                    {inv.status === "paid" ? "Paid" : inv.status === "partial" ? "Partial" : "Unpaid"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Details Accordion */}
      <div className="glass-card p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Details</h3>
        <Accordion type="multiple" className="space-y-2">
          {invoices.map((inv) => (
            <AccordionItem key={inv.invoiceNumber} value={inv.invoiceNumber} className="border border-border/30 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className="font-mono font-medium text-foreground">#{inv.invoiceNumber}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-foreground">{inv.description}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="font-medium text-foreground">{fmt(inv.total)}</span>
                  <Badge
                    variant="outline"
                    className={
                      inv.status === "paid"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }
                  >
                    {inv.status === "paid" ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Bill To</p>
                    <p className="text-foreground">{inv.billTo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Invoice Date</p>
                    <p className="text-foreground">{inv.date}</p>
                  </div>
                  {inv.serviceAddress && (
                    <div>
                      <p className="text-muted-foreground">Service Address</p>
                      <p className="text-foreground">{inv.serviceAddress}</p>
                    </div>
                  )}
                </div>

                {/* Line Items */}
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30">
                      <TableHead className="text-muted-foreground">Description</TableHead>
                      <TableHead className="text-muted-foreground text-right">Rate</TableHead>
                      <TableHead className="text-muted-foreground text-right">Qty</TableHead>
                      <TableHead className="text-muted-foreground text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inv.lineItems.map((item, i) => (
                      <TableRow key={i} className="border-border/20">
                        <TableCell className="text-foreground text-xs">{item.description}</TableCell>
                        <TableCell className="text-right text-foreground">{fmt(item.rate)}</TableCell>
                        <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium text-foreground">{fmt(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-border/30 font-semibold">
                      <TableCell colSpan={3} className="text-right text-foreground">Total</TableCell>
                      <TableCell className="text-right text-foreground">{fmt(inv.total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* Payment History */}
                {inv.payments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Payment History</p>
                    <div className="space-y-1">
                      {inv.payments.map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{p.date} – {p.method}</span>
                          <span className="text-emerald-400">{fmt(p.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inv.notes && (
                  <p className="text-xs text-muted-foreground italic">Note: {inv.notes}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
