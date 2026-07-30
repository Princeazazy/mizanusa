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
import { CreditCard, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { CreditCardStatement } from "@/data/defioreCreditCardTransactions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Props {
  statements: CreditCardStatement[];
  month: string;
  year: string;
}

export const CreditCardStatementSheet = ({ statements, month, year }: Props) => {
  const totalNewCharges = statements.reduce((s, st) => s + st.newCharges, 0);
  const totalFees = statements.reduce((s, st) => s + st.fees, 0);
  const totalInterest = statements.reduce((s, st) => s + st.interest, 0);
  const totalBalance = statements.reduce((s, st) => s + st.newBalance, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total New Charges</p>
              <p className="text-lg font-bold text-foreground">{fmt(totalNewCharges)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fees & Interest</p>
              <p className="text-lg font-bold text-foreground">{fmt(totalFees + totalInterest)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p className="text-lg font-bold text-foreground">{fmt(totalBalance)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-income/10">
              <TrendingUp className="h-5 w-5 text-income" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cards Active</p>
              <p className="text-lg font-bold text-foreground">{statements.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Card Accordion */}
      <Accordion type="multiple" defaultValue={statements.map((_, i) => `card-${i}`)}>
        {statements.map((st, i) => (
          <AccordionItem key={i} value={`card-${i}`} className="glass-card border-border/30 mb-4 rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 w-full">
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">{st.cardName} (...{st.cardEnding})</p>
                  <p className="text-xs text-muted-foreground">{st.statementPeriod}</p>
                </div>
                <div className="flex items-center gap-4 mr-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">New Charges</p>
                    <p className="text-sm font-medium text-foreground">{fmt(st.newCharges)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="text-sm font-bold text-foreground">{fmt(st.newBalance)}</p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* Account Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Previous Balance</p>
                  <p className="font-medium">{fmt(st.previousBalance)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Payments</p>
                  <p className="font-medium text-income">{fmt(st.payments)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Fees</p>
                  <p className="font-medium">{fmt(st.fees)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Interest</p>
                  <p className="font-medium">{fmt(st.interest)}</p>
                </div>
              </div>

              {/* Transactions Table */}
              {st.transactions.length > 0 ? (
                <div className="rounded-lg border border-border/30 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Description</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs">COA</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {st.transactions.map((tx, j) => (
                        <TableRow key={j} className="hover:bg-muted/10">
                          <TableCell className="text-xs">{tx.date}</TableCell>
                          <TableCell className="text-xs max-w-[300px] truncate">{tx.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">{tx.category}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">{tx.coaCode}</TableCell>
                          <TableCell className={`text-xs text-right font-medium ${tx.amount < 0 ? "text-income" : ""}`}>
                            {fmt(tx.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No transactions this period.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
