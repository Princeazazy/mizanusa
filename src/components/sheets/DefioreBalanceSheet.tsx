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
    <div className="space-y-6 print-compact-bs">
      <div className="print:mb-1">
        <h2 className="text-2xl font-bold text-foreground print:text-base">Balance Sheet</h2>
        <p className="text-muted-foreground print:text-xs">Defiore Carpentry LLC — As of March 31, 2026</p>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader className="bg-primary/5 border-b border-primary/10 print:py-2">
          <CardTitle className="flex items-center gap-2 text-primary print:text-sm">
            <Building2 className="h-5 w-5 print:h-4 print:w-4" />
            Statement of Financial Position
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-2/3 print:text-[10px] print:py-1">Account</TableHead>
                <TableHead className="text-right print:text-[10px] print:py-1">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Assets */}
              <TableRow className="bg-blue-500/10 font-bold text-lg print:text-xs"><TableCell colSpan={2} className="print:py-1">ASSETS</TableCell></TableRow>
              <TableRow className="bg-blue-500/5 font-semibold"><TableCell className="pl-4 print:py-0.5 print:text-[10px]">Current Assets</TableCell><TableCell /></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Wells Fargo Business Checking</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(checkingBalance)}</TableCell></TableRow>
              <TableRow className="font-semibold bg-blue-500/10">
                <TableCell className="pl-4 print:py-0.5 print:text-[10px]">Total Current Assets</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(totalCurrentAssets)}</TableCell>
              </TableRow>
              <TableRow className="border-t-4 font-bold text-lg print:text-xs bg-blue-500/15">
                <TableCell className="print:py-1">TOTAL ASSETS</TableCell><TableCell className="text-right font-mono text-blue-400 print:py-1">{fmt(totalAssets)}</TableCell>
              </TableRow>

              {/* Liabilities */}
              <TableRow className="bg-red-500/10 font-bold text-lg print:text-xs"><TableCell colSpan={2} className="print:py-1">LIABILITIES</TableCell></TableRow>
              <TableRow className="bg-red-500/5 font-semibold"><TableCell className="pl-4 print:py-0.5 print:text-[10px]">Current Liabilities</TableCell><TableCell /></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Capital One Spark Classic (5155)</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(capOneBalance)}</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Amex Business Platinum (51001)</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(amexPlatBalance)}</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Amex Blue Business Cash (72000)</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(amexBlueBalance)}</TableCell></TableRow>
              <TableRow className="font-semibold bg-red-500/10">
                <TableCell className="pl-4 print:py-0.5 print:text-[10px]">Total Current Liabilities</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(totalCCLiabilities)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-red-500/15">
                <TableCell className="print:py-1 print:text-xs">TOTAL LIABILITIES</TableCell><TableCell className="text-right font-mono text-red-400 print:py-1 print:text-xs">{fmt(totalLiabilities)}</TableCell>
              </TableRow>

              {/* Equity */}
              <TableRow className="bg-green-500/10 font-bold text-lg print:text-xs"><TableCell colSpan={2} className="print:py-1">EQUITY</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Retained Earnings / Owner's Equity</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(totalEquity)}</TableCell></TableRow>
              <TableRow className="font-semibold bg-green-500/10">
                <TableCell className="pl-4 print:py-0.5 print:text-[10px]">Total Equity</TableCell><TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(totalEquity)}</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-lg print:text-xs bg-primary/10">
                <TableCell className="print:py-1">TOTAL LIABILITIES & EQUITY</TableCell><TableCell className="text-right font-mono print:py-1">{fmt(totalLiabilities + totalEquity)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};
