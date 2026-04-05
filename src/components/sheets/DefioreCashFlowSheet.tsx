import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownUp } from "lucide-react";
import {
  januaryDeposits, januaryWithdrawals, januarySummary,
  februaryDeposits, februaryWithdrawals,
  marchDeposits, marchWithdrawals, marchSummary,
} from "@/data/defioreBankTransactions";
import type { Transaction } from "@/data/bankTransactions";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const sumByCode = (txs: Transaction[], code: string) =>
  txs.filter((t) => t.coaCode === code).reduce((s, t) => s + t.amount, 0);

const sumByCategory = (txs: Transaction[], cat: string) =>
  txs.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0);

export const DefioreCashFlowSheet = () => {
  const allDep = [...januaryDeposits, ...februaryDeposits, ...marchDeposits];
  const allWd = [...januaryWithdrawals, ...februaryWithdrawals, ...marchWithdrawals];

  // Operating – Receipts
  const serviceReceipts = sumByCode(allDep, "4100");
  const otherReceipts = sumByCode(allDep, "4900");
  const totalReceipts = serviceReceipts + otherReceipts;

  // Operating – Payments
  const subcontractorPay = sumByCode(allWd, "5100");
  const materialsPay = sumByCode(allWd, "5200") + sumByCategory(allWd, "Materials & Supplies");
  const fuelPay = sumByCode(allWd, "5300");
  const mealsPay = sumByCode(allWd, "5400");
  const insurancePay = sumByCode(allWd, "5600");
  const vehiclePay = sumByCode(allWd, "5700");
  const bankFees = sumByCategory(allWd, "Bank Fee");
  const officePay = sumByCategory(allWd, "Office Supplies");
  const uncatChecks = sumByCode(allWd, "5000");
  const personalExpenses = sumByCategory(allWd, "Personal Expense");
  const totalOpPayments = subcontractorPay + materialsPay + fuelPay + mealsPay + insurancePay + vehiclePay + bankFees + officePay + uncatChecks + personalExpenses;

  const netOperating = totalReceipts - totalOpPayments;

  // Financing – CC payments, loan payments, owner draws
  const ccPayments = sumByCode(allWd, "5800");
  const loanPayments = sumByCategory(allWd, "Loan Payment");
  const ownerDraws = sumByCategory(allWd, "Owner's Draw");
  const personalInv = sumByCategory(allWd, "Personal Investment");
  const savingsTransfer = sumByCategory(allWd, "Savings Transfer");
  const totalFinancingOut = ccPayments + loanPayments + ownerDraws + personalInv + savingsTransfer;

  const netFinancing = -totalFinancingOut;

  const netChange = netOperating + netFinancing;
  const beginCash = januarySummary.beginningBalance;
  const endCash = marchSummary.endingBalance;

  return (
    <div className="space-y-6 print-compact-cf">
      <div className="print:mb-1">
        <h2 className="text-2xl font-bold text-foreground print:text-base">Statement of Cash Flows</h2>
        <p className="text-muted-foreground print:text-xs">Defiore Carpentry LLC — Q1 2026 (January – March)</p>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader className="bg-primary/5 border-b border-primary/10 print:py-2">
          <CardTitle className="flex items-center gap-2 text-primary print:text-sm">
            <ArrowDownUp className="h-5 w-5 print:h-4 print:w-4" />
            Cash Flow Statement — Direct Method
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-2/3 print:text-[10px] print:py-1">Description</TableHead>
                <TableHead className="text-right print:text-[10px] print:py-1">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-green-500/10 font-bold text-lg print:text-xs"><TableCell colSpan={2} className="print:py-1">CASH FLOWS FROM OPERATING ACTIVITIES</TableCell></TableRow>

              <TableRow className="font-semibold bg-green-500/5"><TableCell className="pl-4 print:py-0.5 print:text-[10px]">Cash Receipts:</TableCell><TableCell /></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Service Revenue Receipts</TableCell><TableCell className="text-right font-mono text-green-400 print:py-0.5 print:text-[10px]">{fmt(serviceReceipts)}</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Other Cash Receipts</TableCell><TableCell className="text-right font-mono text-green-400 print:py-0.5 print:text-[10px]">{fmt(otherReceipts)}</TableCell></TableRow>
              <TableRow className="font-semibold"><TableCell className="pl-4 print:py-0.5 print:text-[10px]">Total Cash Receipts</TableCell><TableCell className="text-right font-mono text-green-400 print:py-0.5 print:text-[10px]">{fmt(totalReceipts)}</TableCell></TableRow>

              <TableRow className="font-semibold bg-red-500/5"><TableCell className="pl-4 print:py-0.5 print:text-[10px]">Cash Payments:</TableCell><TableCell /></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Subcontractor Labor</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(subcontractorPay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Materials & Supplies</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(materialsPay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Fuel & Gas</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(fuelPay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Meals & Entertainment</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(mealsPay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Insurance</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(insurancePay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Vehicle Payment</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(vehiclePay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Bank Fees</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(bankFees)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Office Supplies</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(officePay)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Uncategorized Checks</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(uncatChecks)})</TableCell></TableRow>
              <TableRow className="font-semibold"><TableCell className="pl-4 print:py-0.5 print:text-[10px]">Total Cash Payments</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(totalOpPayments)})</TableCell></TableRow>

              <TableRow className="border-t-2 font-bold bg-primary/10">
                <TableCell className="print:py-0.5 print:text-[10px]">Net Cash from Operating Activities</TableCell>
                <TableCell className={`text-right font-mono print:py-0.5 print:text-[10px] ${netOperating >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(netOperating)}</TableCell>
              </TableRow>

              <TableRow className="bg-amber-500/10 font-bold text-lg print:text-xs"><TableCell colSpan={2} className="print:py-1">CASH FLOWS FROM FINANCING ACTIVITIES</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Credit Card Payments</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(ccPayments)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Line of Credit / Loan Payments</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(loanPayments)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Owner's Draws</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(ownerDraws)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Personal Investments (Acorns)</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(personalInv)})</TableCell></TableRow>
              <TableRow><TableCell className="pl-8 print:pl-6 print:py-0.5 print:text-[10px]">Savings Transfers</TableCell><TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">({fmt(savingsTransfer)})</TableCell></TableRow>
              <TableRow className="border-t-2 font-bold bg-amber-500/5">
                <TableCell className="print:py-0.5 print:text-[10px]">Net Cash from Financing Activities</TableCell>
                <TableCell className="text-right font-mono text-red-400 print:py-0.5 print:text-[10px]">{fmt(netFinancing)}</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-lg print:text-xs bg-primary/20">
                <TableCell className="print:py-1">NET CHANGE IN CASH</TableCell>
                <TableCell className={`text-right font-mono print:py-1 ${netChange >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(netChange)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold print:py-0.5 print:text-[10px]">Beginning Cash (01/01/2026)</TableCell>
                <TableCell className="text-right font-mono print:py-0.5 print:text-[10px]">{fmt(beginCash)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold text-lg print:text-xs bg-green-500/15">
                <TableCell className="print:py-1">ENDING CASH (03/31/2026)</TableCell>
                <TableCell className="text-right font-mono text-green-400 print:py-1">{fmt(endCash)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};
