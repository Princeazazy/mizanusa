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
import { CheckCircle2, TrendingUp, TrendingDown, Building } from "lucide-react";
import { Transaction } from "@/data/bankTransactions";

interface CheckingAccountSheetProps {
  month: string;
  year: string;
  deposits: Transaction[];
  withdrawals: Transaction[];
  beginningBalance: number;
  endingBalance: number;
  statementBalance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Credit Card Sales": "bg-income-muted text-income border-income/30",
    "Cash/Check Sales": "bg-info-muted text-info border-info/30",
    "Venmo Sales": "bg-info/15 text-info border-info/30",
    "Transfer In": "bg-muted text-muted-foreground border-border",
    "Inventory Purchases": "bg-expense-muted text-expense border-expense/30",
    "Title & Registration": "bg-warning-muted text-warning border-warning/30",
    "Title Lookup Services": "bg-warning/15 text-warning border-warning/30",
    "Utilities": "bg-info/15 text-info border-info/30",
    "Communications": "bg-info/15 text-info border-info/30",
    "Insurance": "bg-white/[0.03] text-foreground border-white/[0.08]",
    "Bank Fees": "bg-expense/15 text-expense border-expense/30",
    "Transfer Out": "bg-muted text-muted-foreground border-border",
  };
  return colors[category] || "bg-muted text-muted-foreground border-border";
};

export const CheckingAccountSheet = ({
  month,
  year,
  deposits,
  withdrawals,
  beginningBalance,
  endingBalance,
  statementBalance,
}: CheckingAccountSheetProps) => {
  const actualDeposits = deposits.filter(t => t.coaCode !== "9999");
  const actualWithdrawals = withdrawals.filter(t => t.coaCode !== "9999");
  
  const totalDeposits = actualDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = actualWithdrawals.reduce((sum, t) => sum + t.amount, 0);
  const difference = endingBalance - statementBalance;
  const isReconciled = Math.abs(difference) < 0.01;

  // Group deposits by category
  const depositsByCategory = actualDeposits.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group withdrawals by category
  const withdrawalsByCategory = actualWithdrawals.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{month} {year} — Checking Account</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <Building className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">TD Bank Business Checking • Member #0021348405</p>
          </div>
        </div>
        {isReconciled && (
          <Badge className="bg-income-muted text-income border-income/30 gap-1.5 px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Reconciled
          </Badge>
        )}
      </div>

      {/* Income Section */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="border-b border-white/[0.06] bg-white/[0.015]">
          <CardTitle className="flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            <TrendingUp className="h-5 w-5" />
            Income (Deposits)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="table-header-row">
                <TableHead className="w-20 sm:w-28 font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="w-20 font-semibold">COA</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Category</TableHead>
                <TableHead className="text-right w-28 sm:w-32 font-semibold">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualDeposits.map((transaction, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm text-muted-foreground">{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {transaction.coaCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={`${getCategoryColor(transaction.category)} text-xs font-medium`}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-income font-mono whitespace-nowrap">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-income-muted/40 font-bold border-t-2 border-income/20">
                <TableCell colSpan={3} className="text-income">Total Deposits</TableCell>
                <TableCell className="hidden md:table-cell" />
                <TableCell className="text-right text-income font-mono text-base">
                  {formatCurrency(totalDeposits)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Income by Category Summary */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Income by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(depositsByCategory).map(([category, amount]) => (
              <div key={category} className="bg-muted/40 rounded-xl p-4 border border-transparent hover:border-income/20 transition-colors">
                <p className="text-xs text-muted-foreground font-medium">{category}</p>
                <p className="text-lg font-bold text-income mt-1">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Section */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="border-b border-white/[0.06] bg-white/[0.015]">
          <CardTitle className="flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            <TrendingDown className="h-5 w-5" />
            Expenses (Withdrawals)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="table-header-row">
                <TableHead className="w-28 font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="w-20 font-semibold">Check #</TableHead>
                <TableHead className="w-20 font-semibold">COA</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="text-right w-32 font-semibold">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualWithdrawals.map((transaction, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm text-muted-foreground">{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {transaction.checkNumber || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {transaction.coaCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryColor(transaction.category)} text-xs font-medium`}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-expense font-mono">
                    ({formatCurrency(transaction.amount)})
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-expense-muted/40 font-bold border-t-2 border-expense/20">
                <TableCell colSpan={5} className="text-expense">Total Withdrawals</TableCell>
                <TableCell className="text-right text-expense font-mono text-base">
                  ({formatCurrency(totalWithdrawals)})
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense by Category Summary */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(withdrawalsByCategory).map(([category, amount]) => (
              <div key={category} className="bg-muted/40 rounded-xl p-4 border border-transparent hover:border-expense/20 transition-colors">
                <p className="text-xs text-muted-foreground font-medium">{category}</p>
                <p className="text-lg font-bold text-expense mt-1">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bank Reconciliation */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-lg">Bank Reconciliation — {month} {year}</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <Table>
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium py-3">Beginning Balance ({month.substring(0, 3)}/01)</TableCell>
                <TableCell className="text-right font-mono font-medium py-3">{formatCurrency(beginningBalance)}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium text-income py-3">Add: Total Deposits</TableCell>
                <TableCell className="text-right font-mono font-medium text-income py-3">{formatCurrency(totalDeposits)}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium text-expense py-3">Less: Total Withdrawals</TableCell>
                <TableCell className="text-right font-mono font-medium text-expense py-3">({formatCurrency(totalWithdrawals)})</TableCell>
              </TableRow>
              <TableRow className="border-t-2 bg-muted/30 hover:bg-muted/30">
                <TableCell className="font-bold py-4">Calculated Ending Balance</TableCell>
                <TableCell className="text-right font-mono font-bold text-lg py-4">{formatCurrency(endingBalance)}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium py-3">Per Bank Statement</TableCell>
                <TableCell className="text-right font-mono font-medium py-3">{formatCurrency(statementBalance)}</TableCell>
              </TableRow>
              <TableRow className={`${isReconciled ? "bg-income-muted/50" : "bg-expense-muted/50"} hover:bg-transparent`}>
                <TableCell className="font-bold py-4">Difference</TableCell>
                <TableCell className="text-right font-mono font-bold py-4">
                  {formatCurrency(difference)} {isReconciled && <CheckCircle2 className="inline h-4 w-4 text-income ml-2" />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};