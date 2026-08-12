import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp } from "lucide-react";
import { useState } from "react";
import { cvsQuarters, defaultQuarter } from "@/data/cvsQuarters";
import { QuarterSelect } from "@/components/sheets/QuarterSelect";


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const sumByCoaCode = (transactions: any[], code: string) => {
  return transactions
    .filter(t => t.coaCode === code)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const CashFlowSheet = () => {
  const [periodKey, setPeriodKey] = useState(defaultQuarter.key);
  const period = cvsQuarters.find((q) => q.key === periodKey) ?? defaultQuarter;
  const allDeposits = period.deposits;
  const allWithdrawals = period.withdrawals;


  // Operating Activities
  const salesReceipts = sumByCoaCode(allDeposits, "4100") + sumByCoaCode(allDeposits, "4110") + sumByCoaCode(allDeposits, "4120");
  const inspectionReceipts = sumByCoaCode(allDeposits, "4200");
  const otherReceipts = sumByCoaCode(allDeposits, "4900");
  const totalCashReceipts = salesReceipts + inspectionReceipts + otherReceipts;

  // Operating Payments
  const inventoryPayments = sumByCoaCode(allWithdrawals, "5000");
  const titleRegPayments = sumByCoaCode(allWithdrawals, "5100") + sumByCoaCode(allWithdrawals, "5120");
  const rentPayments = sumByCoaCode(allWithdrawals, "6050") + sumByCoaCode(allWithdrawals, "6055");
  const utilityPayments = sumByCoaCode(allWithdrawals, "6100");
  const commPayments = sumByCoaCode(allWithdrawals, "6200");
  const suppliesPayments = sumByCoaCode(allWithdrawals, "6300");
  const vehicleOpPayments = sumByCoaCode(allWithdrawals, "6400");
  const feePayments = sumByCoaCode(allWithdrawals, "6500") + sumByCoaCode(allWithdrawals, "6600");
  const insurancePayments = sumByCoaCode(allWithdrawals, "6700");
  const otherOpPayments =
    sumByCoaCode(allWithdrawals, "6800") +
    sumByCoaCode(allWithdrawals, "6310") +
    sumByCoaCode(allWithdrawals, "6900") +
    sumByCoaCode(allWithdrawals, "6999");

  const totalCashPayments = inventoryPayments + titleRegPayments + rentPayments + utilityPayments + commPayments + 
    suppliesPayments + vehicleOpPayments + feePayments + insurancePayments + otherOpPayments;

  const netCashFromOperating = totalCashReceipts - totalCashPayments;

  // Investing Activities (none for this period)
  const equipmentPurchases = 0;
  const netCashFromInvesting = -equipmentPurchases;

  // Financing Activities
  const ownerContributions = 0;
  const ownerDistributions =
    sumByCoaCode(allWithdrawals, "3900") +
    sumByCoaCode(allWithdrawals, "5900") +
    sumByCoaCode(allWithdrawals, "2100");
  const netCashFromFinancing = ownerContributions - ownerDistributions;

  const netChangeInCash = netCashFromOperating + netCashFromInvesting + netCashFromFinancing;
  const beginningCash = period.beginningBalance;
  const endingCash = period.endingBalance;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Statement of Cash Flows</h2>
          <p className="text-muted-foreground">
            CVS Auto Sales Inc. — {period.label} ({period.monthsLabel})
          </p>
        </div>
        <QuarterSelect value={periodKey} onChange={setPeriodKey} />
      </div>


      <Card className="shadow-card">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <ArrowDownUp className="h-5 w-5" />
            Cash Flow Statement — Direct Method
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-2/3">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Operating Activities */}
              <TableRow className="bg-income/10 font-bold text-lg">
                <TableCell colSpan={2}>CASH FLOWS FROM OPERATING ACTIVITIES</TableCell>
              </TableRow>
              
              <TableRow className="font-semibold bg-income/5">
                <TableCell className="pl-4">Cash Receipts:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Receipts from Vehicle Sales</TableCell>
                <TableCell className="text-right font-mono text-income">{formatCurrency(salesReceipts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Receipts from Inspection Services</TableCell>
                <TableCell className="text-right font-mono text-income">{formatCurrency(inspectionReceipts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Cash Receipts</TableCell>
                <TableCell className="text-right font-mono text-income">{formatCurrency(otherReceipts)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell className="pl-4">Total Cash Receipts</TableCell>
                <TableCell className="text-right font-mono text-income">{formatCurrency(totalCashReceipts)}</TableCell>
              </TableRow>

              <TableRow className="font-semibold bg-expense/5">
                <TableCell className="pl-4">Cash Payments:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Vehicle Inventory Purchases</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(inventoryPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Title & Registration Fees</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(titleRegPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Rent</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(rentPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Utilities</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(utilityPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Communications</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(commPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Office & Supplies</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(suppliesPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Vehicle Operating Expenses</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(vehicleOpPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Processing & Bank Fees</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(feePayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Insurance Payments</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(insurancePayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Operating Payments</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(otherOpPayments)})</TableCell>
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell className="pl-4">Total Cash Payments</TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(totalCashPayments)})</TableCell>
              </TableRow>

              <TableRow className="border-t-2 font-bold bg-primary/10">
                <TableCell>Net Cash from Operating Activities</TableCell>
                <TableCell className={`text-right font-mono ${netCashFromOperating >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(netCashFromOperating)}
                </TableCell>
              </TableRow>

              {/* Investing Activities */}
              <TableRow className="bg-muted/50 font-bold text-lg">
                <TableCell colSpan={2}>CASH FLOWS FROM INVESTING ACTIVITIES</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Purchase of Equipment</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(equipmentPurchases)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-muted/30">
                <TableCell>Net Cash from Investing Activities</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(netCashFromInvesting)}</TableCell>
              </TableRow>

              {/* Financing Activities */}
              <TableRow className="bg-warning/10 font-bold text-lg">
                <TableCell colSpan={2}>CASH FLOWS FROM FINANCING ACTIVITIES</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Owner Contributions</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(ownerContributions)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Owner Distributions</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">({formatCurrency(ownerDistributions)})</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-warning/5">
                <TableCell>Net Cash from Financing Activities</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(netCashFromFinancing)}</TableCell>
              </TableRow>

              {/* Summary */}
              <TableRow className="border-t-4 font-bold text-lg bg-primary/20">
                <TableCell>NET CHANGE IN CASH</TableCell>
                <TableCell className={`text-right font-mono ${netChangeInCash >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(netChangeInCash)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Beginning Cash ({period.beginningLabel})</TableCell>
                <TableCell className="text-right font-mono text-foreground">{formatCurrency(beginningCash)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold text-lg bg-income/15">
                <TableCell>ENDING CASH ({period.asOfLabel})</TableCell>

                <TableCell className="text-right font-mono text-income">{formatCurrency(endingCash)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};
