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
import { CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
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
    "Credit Card Sales": "bg-green-100 text-green-800",
    "Cash/Check Sales": "bg-blue-100 text-blue-800",
    "Venmo Sales": "bg-purple-100 text-purple-800",
    "Transfer In": "bg-gray-100 text-gray-800",
    "Inventory Purchases": "bg-red-100 text-red-800",
    "Title & Registration": "bg-orange-100 text-orange-800",
    "Title Lookup Services": "bg-yellow-100 text-yellow-800",
    "Utilities": "bg-cyan-100 text-cyan-800",
    "Communications": "bg-indigo-100 text-indigo-800",
    "Insurance": "bg-pink-100 text-pink-800",
    "Bank Fees": "bg-rose-100 text-rose-800",
    "Transfer Out": "bg-gray-100 text-gray-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{month} {year} - Checking Account</h2>
          <p className="text-muted-foreground">TD Bank Business Checking | Member #0021348405</p>
        </div>
        {isReconciled && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Reconciled
          </Badge>
        )}
      </div>

      {/* Income Section */}
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            Income (Deposits)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-24">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">COA</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right w-32">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualDeposits.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {transaction.coaCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-green-50 font-bold">
                <TableCell colSpan={4}>Total Deposits</TableCell>
                <TableCell className="text-right text-green-700">
                  {formatCurrency(totalDeposits)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Income by Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Income by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(depositsByCategory).map(([category, amount]) => (
              <div key={category} className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{category}</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Section */}
      <Card>
        <CardHeader className="bg-red-50 border-b">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <TrendingDown className="h-5 w-5" />
            Expenses (Withdrawals)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-24">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Check #</TableHead>
                <TableHead className="w-20">COA</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right w-32">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualWithdrawals.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {transaction.checkNumber || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {transaction.coaCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    ({formatCurrency(transaction.amount)})
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-red-50 font-bold">
                <TableCell colSpan={5}>Total Withdrawals</TableCell>
                <TableCell className="text-right text-red-700">
                  ({formatCurrency(totalWithdrawals)})
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense by Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(withdrawalsByCategory).map(([category, amount]) => (
              <div key={category} className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{category}</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bank Reconciliation */}
      <Card>
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle>Bank Reconciliation - {month} {year}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Beginning Balance ({month.substring(0, 3)}/01)</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(beginningBalance)}</TableCell>
              </TableRow>
              <TableRow className="text-green-600">
                <TableCell className="font-medium">Add: Total Deposits</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totalDeposits)}</TableCell>
              </TableRow>
              <TableRow className="text-red-600">
                <TableCell className="font-medium">Less: Total Withdrawals</TableCell>
                <TableCell className="text-right font-mono">({formatCurrency(totalWithdrawals)})</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold">
                <TableCell>Calculated Ending Balance</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(endingBalance)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Per Bank Statement</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(statementBalance)}</TableCell>
              </TableRow>
              <TableRow className={isReconciled ? "bg-green-50" : "bg-red-50"}>
                <TableCell className="font-bold">Difference</TableCell>
                <TableCell className="text-right font-mono font-bold">
                  {formatCurrency(difference)} {isReconciled && "✓"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
