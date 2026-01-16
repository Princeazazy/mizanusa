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
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { transfers } from "@/data/bankTransactions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const TransfersSheet = () => {
  const octoberTransfers = transfers.filter(t => t.date.startsWith("10/"));
  const novemberTransfers = transfers.filter(t => t.date.startsWith("11/"));
  const decemberTransfers = transfers.filter(t => t.date.startsWith("12/"));

  const totalToSavings = transfers
    .filter(t => t.to === "Savings")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalFromSavings = transfers
    .filter(t => t.from === "Savings")
    .reduce((sum, t) => sum + t.amount, 0);
  const netTransfer = totalFromSavings - totalToSavings;

  const renderTransferTable = (monthTransfers: typeof transfers, monthLabel: string) => (
    <Card>
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          {monthLabel} 2025 Transfers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-24">Date</TableHead>
              <TableHead>From Account</TableHead>
              <TableHead className="w-12 text-center"></TableHead>
              <TableHead>To Account</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right w-32">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthTransfers.map((transfer, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{transfer.date}</TableCell>
                <TableCell>
                  <Badge variant="outline">{transfer.from}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transfer.to}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{transfer.reference}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(transfer.amount)}
                </TableCell>
              </TableRow>
            ))}
            {monthTransfers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No transfers in {monthLabel} 2025
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const calcMonthToSavings = (monthTransfers: typeof transfers) => 
    monthTransfers.filter(t => t.to === "Savings").reduce((s, t) => s + t.amount, 0);
  const calcMonthFromSavings = (monthTransfers: typeof transfers) => 
    monthTransfers.filter(t => t.from === "Savings").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Inter-Account Transfers</h2>
        <p className="text-muted-foreground">
          Transfers between Checking and Savings accounts (excluded from income/expense totals)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transferred to Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalToSavings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transferred from Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalFromSavings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Transfer to Checking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netTransfer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netTransfer)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Transfer Tables */}
      {renderTransferTable(octoberTransfers, "October")}
      {renderTransferTable(novemberTransfers, "November")}
      {renderTransferTable(decemberTransfers, "December")}

      {/* All Transfers Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Month</TableHead>
                <TableHead className="text-right">To Savings</TableHead>
                <TableHead className="text-right">From Savings</TableHead>
                <TableHead className="text-right">Net to Checking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">October 2025</TableCell>
                <TableCell className="text-right text-red-600">
                  ({formatCurrency(calcMonthToSavings(octoberTransfers))})
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(calcMonthFromSavings(octoberTransfers))}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(calcMonthFromSavings(octoberTransfers) - calcMonthToSavings(octoberTransfers))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">November 2025</TableCell>
                <TableCell className="text-right text-red-600">
                  ({formatCurrency(calcMonthToSavings(novemberTransfers))})
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(calcMonthFromSavings(novemberTransfers))}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(calcMonthFromSavings(novemberTransfers) - calcMonthToSavings(novemberTransfers))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">December 2025</TableCell>
                <TableCell className="text-right text-red-600">
                  ({formatCurrency(calcMonthToSavings(decemberTransfers))})
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(calcMonthFromSavings(decemberTransfers))}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(calcMonthFromSavings(decemberTransfers) - calcMonthToSavings(decemberTransfers))}
                </TableCell>
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Total Q4 2025</TableCell>
                <TableCell className="text-right text-red-600">({formatCurrency(totalToSavings)})</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(totalFromSavings)}</TableCell>
                <TableCell className="text-right">{formatCurrency(netTransfer)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Inter-account transfers are tracked separately and are not included in 
          the income or expense totals on the monthly checking account sheets. These transfers represent 
          movement of funds between accounts rather than actual income or expenses.
        </p>
      </div>
    </div>
  );
};
