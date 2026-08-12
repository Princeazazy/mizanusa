import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { cvsQuarters, defaultQuarter } from "@/data/cvsQuarters";
import { QuarterSelect } from "@/components/sheets/QuarterSelect";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const BalanceSheetSheet = () => {
  const [periodKey, setPeriodKey] = useState(defaultQuarter.key);
  const period = cvsQuarters.find((q) => q.key === periodKey) ?? defaultQuarter;

  // Only verified data from bank statements
  const checkingBalance = period.endingBalance;

  // Total Assets = only what we have verified
  const totalAssets = checkingBalance;

  // Liabilities - none verified
  const totalLiabilities = 0;

  // Equity = Assets - Liabilities (accounting equation)
  const totalEquity = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Balance Sheet</h2>
          <p className="text-muted-foreground">
            CVS Auto Sales Inc. — As of {period.asOfLabel}
          </p>
        </div>
        <QuarterSelect value={periodKey} onChange={setPeriodKey} />
      </div>


      <Card className="shadow-card">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Statement of Financial Position
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-2/3">Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Assets */}
              <TableRow className="bg-info/50 font-bold text-lg">
                <TableCell colSpan={2}>ASSETS</TableCell>
              </TableRow>
              
              <TableRow className="bg-info/30 font-semibold">
                <TableCell className="pl-4">Current Assets</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">TruMark Business Checking</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(checkingBalance)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold bg-info/50">
                <TableCell className="pl-4">Total Current Assets</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(checkingBalance)}</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-lg bg-info/15">
                <TableCell>TOTAL ASSETS</TableCell>
                <TableCell className="text-right font-mono text-info">{formatCurrency(totalAssets)}</TableCell>
              </TableRow>

              {/* Liabilities */}
              <TableRow className="bg-expense/50 font-bold text-lg">
                <TableCell colSpan={2}>LIABILITIES</TableCell>
              </TableRow>
              <TableRow className="bg-expense/30 font-semibold">
                <TableCell className="pl-4">Current Liabilities</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8 text-muted-foreground italic">No liabilities recorded</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(0)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold bg-expense/50">
                <TableCell className="pl-4">Total Liabilities</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totalLiabilities)}</TableCell>
              </TableRow>

              {/* Equity */}
              <TableRow className="bg-income/50 font-bold text-lg">
                <TableCell colSpan={2}>EQUITY</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Retained Earnings</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totalEquity)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold bg-income/50">
                <TableCell className="pl-4">Total Equity</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totalEquity)}</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-lg bg-primary/10">
                <TableCell>TOTAL LIABILITIES & EQUITY</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totalLiabilities + totalEquity)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};
