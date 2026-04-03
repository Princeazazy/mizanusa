import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { marchSummary } from "@/data/defioreBankTransactions";
import {
  capitalOneMarch, amexPlatinumMarch, amexBlueCashMarch,
} from "@/data/defioreCreditCardTransactions";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const DefioreBalanceSheet = () => {
  const checkingBalance = marchSummary.endingBalance; // 14,480.28

  const totalCurrentAssets = checkingBalance;
  const totalAssets = totalCurrentAssets;

  // Liabilities – credit card balances at end of March
  const capOneBalance = capitalOneMarch.newBalance;
  const amexPlatBalance = amexPlatinumMarch.newBalance;
  const amexBlueBalance = amexBlueCashMarch.newBalance;
  const totalCCLiabilities = capOneBalance + amexPlatBalance + amexBlueBalance;
  const totalLiabilities = totalCCLiabilities;

  const totalEquity = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Balance Sheet</h2>
        <p className="text-muted-foreground">Defiore Carpentry LLC — As of March 31, 2026</p>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
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
              <TableRow className="bg-blue-500/10 font-bold text-lg"><TableCell colSpan={2}>ASSETS</TableCell></TableRow>
              <TableRow className="bg-blue-500/5 font-semibold"><TableCell className="pl-4">Current Assets</TableCell><TableCell /></TableRow>
              <TableRow><TableCell className="pl-8">Wells Fargo Business Checking</TableCell><TableCell className="text-right font-mono">{fmt(checkingBalance)}</TableCell></TableRow>
              <TableRow className="font-semibold bg-blue-500/10">
                <TableCell className="pl-4">Total Current Assets</TableCell><TableCell className="text-right font-mono">{fmt(totalCurrentAssets)}</TableCell>
              </TableRow>
              <TableRow className="border-t-4 font-bold text-lg bg-blue-500/15">
                <TableCell>TOTAL ASSETS</TableCell><TableCell className="text-right font-mono text-blue-400">{fmt(totalAssets)}</TableCell>
              </TableRow>

              {/* Liabilities */}
              <TableRow className="bg-red-500/10 font-bold text-lg"><TableCell colSpan={2}>LIABILITIES</TableCell></TableRow>
              <TableRow className="bg-red-500/5 font-semibold"><TableCell className="pl-4">Current Liabilities</TableCell><TableCell /></TableRow>
              <TableRow><TableCell className="pl-8">Capital One Spark Classic (5155)</TableCell><TableCell className="text-right font-mono">{fmt(capOneBalance)}</TableCell></TableRow>
              <TableRow><TableCell className="pl-8">Amex Business Platinum (51001)</TableCell><TableCell className="text-right font-mono">{fmt(amexPlatBalance)}</TableCell></TableRow>
              <TableRow><TableCell className="pl-8">Amex Blue Business Cash (72000)</TableCell><TableCell className="text-right font-mono">{fmt(amexBlueBalance)}</TableCell></TableRow>
              <TableRow className="font-semibold bg-red-500/10">
                <TableCell className="pl-4">Total Current Liabilities</TableCell><TableCell className="text-right font-mono">{fmt(totalCCLiabilities)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-red-500/15">
                <TableCell>TOTAL LIABILITIES</TableCell><TableCell className="text-right font-mono text-red-400">{fmt(totalLiabilities)}</TableCell>
              </TableRow>

              {/* Equity */}
              <TableRow className="bg-green-500/10 font-bold text-lg"><TableCell colSpan={2}>EQUITY</TableCell></TableRow>
              <TableRow><TableCell className="pl-8">Retained Earnings / Owner's Equity</TableCell><TableCell className="text-right font-mono">{fmt(totalEquity)}</TableCell></TableRow>
              <TableRow className="font-semibold bg-green-500/10">
                <TableCell className="pl-4">Total Equity</TableCell><TableCell className="text-right font-mono">{fmt(totalEquity)}</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-lg bg-primary/10">
                <TableCell>TOTAL LIABILITIES & EQUITY</TableCell><TableCell className="text-right font-mono">{fmt(totalLiabilities + totalEquity)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};
