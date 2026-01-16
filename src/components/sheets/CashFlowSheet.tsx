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
import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals,
  octoberSummary,
  decemberSummary,
} from "@/data/bankTransactions";

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
  const allDeposits = [...octoberDeposits, ...novemberDeposits, ...decemberDeposits];
  const allWithdrawals = [...octoberWithdrawals, ...novemberWithdrawals, ...decemberWithdrawals];

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
  const otherOpPayments = sumByCoaCode(allWithdrawals, "6800");
  
  const totalCashPayments = inventoryPayments + titleRegPayments + rentPayments + utilityPayments + commPayments + 
    suppliesPayments + vehicleOpPayments + feePayments + insurancePayments + otherOpPayments;

  const netCashFromOperating = totalCashReceipts - totalCashPayments;

  // Investing Activities (none for this period)
  const equipmentPurchases = 0;
  const netCashFromInvesting = -equipmentPurchases;

  // Financing Activities (none for this period)  
  const ownerContributions = 0;
  const ownerDistributions = 0;
  const netCashFromFinancing = ownerContributions - ownerDistributions;

  const netChangeInCash = netCashFromOperating + netCashFromInvesting + netCashFromFinancing;
  const beginningCash = octoberSummary.beginningBalance;
  const endingCash = decemberSummary.endingBalance;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Statement of Cash Flows</h2>
        <p className="text-muted-foreground">CVS Auto Sales Inc. — Q4 2025 (October - December)</p>
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
              <TableRow className="bg-green-50/50 font-bold text-lg">
                <TableCell colSpan={2}>CASH FLOWS FROM OPERATING ACTIVITIES</TableCell>
              </TableRow>
              
              <TableRow className="font-semibold bg-green-50/30">
                <TableCell className="pl-4">Cash Receipts:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Receipts from Vehicle Sales</TableCell>
                <TableCell className="text-right font-mono text-green-600">{formatCurrency(salesReceipts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Receipts from Inspection Services</TableCell>
                <TableCell className="text-right font-mono text-green-600">{formatCurrency(inspectionReceipts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Cash Receipts</TableCell>
                <TableCell className="text-right font-mono text-green-600">{formatCurrency(otherReceipts)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell className="pl-4">Total Cash Receipts</TableCell>
                <TableCell className="text-right font-mono text-green-700">{formatCurrency(totalCashReceipts)}</TableCell>
              </TableRow>

              <TableRow className="font-semibold bg-red-50/30">
                <TableCell className="pl-4">Cash Payments:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Vehicle Inventory Purchases</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(inventoryPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Title & Registration Fees</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(titleRegPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Rent</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(rentPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Utilities</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(utilityPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Communications</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(commPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Office & Supplies</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(suppliesPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Vehicle Operating Expenses</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(vehicleOpPayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Processing & Bank Fees</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(feePayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Insurance Payments</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(insurancePayments)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Operating Payments</TableCell>
                <TableCell className="text-right font-mono text-red-600">({formatCurrency(otherOpPayments)})</TableCell>
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell className="pl-4">Total Cash Payments</TableCell>
                <TableCell className="text-right font-mono text-red-700">({formatCurrency(totalCashPayments)})</TableCell>
              </TableRow>

              <TableRow className="border-t-2 font-bold bg-blue-50">
                <TableCell>Net Cash from Operating Activities</TableCell>
                <TableCell className={`text-right font-mono ${netCashFromOperating >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(netCashFromOperating)}
                </TableCell>
              </TableRow>

              {/* Investing Activities */}
              <TableRow className="bg-purple-50/50 font-bold text-lg">
                <TableCell colSpan={2}>CASH FLOWS FROM INVESTING ACTIVITIES</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Purchase of Equipment</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(equipmentPurchases)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-purple-50">
                <TableCell>Net Cash from Investing Activities</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(netCashFromInvesting)}</TableCell>
              </TableRow>

              {/* Financing Activities */}
              <TableRow className="bg-orange-50/50 font-bold text-lg">
                <TableCell colSpan={2}>CASH FLOWS FROM FINANCING ACTIVITIES</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Owner Contributions</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(ownerContributions)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Owner Distributions</TableCell>
                <TableCell className="text-right font-mono">({formatCurrency(ownerDistributions)})</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-orange-50">
                <TableCell>Net Cash from Financing Activities</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(netCashFromFinancing)}</TableCell>
              </TableRow>

              {/* Summary */}
              <TableRow className="border-t-4 font-bold text-lg bg-primary/10">
                <TableCell>NET CHANGE IN CASH</TableCell>
                <TableCell className={`text-right font-mono ${netChangeInCash >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(netChangeInCash)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Beginning Cash (10/01/2025)</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(beginningCash)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold text-lg bg-green-100">
                <TableCell>ENDING CASH (12/31/2025)</TableCell>
                <TableCell className="text-right font-mono text-green-800">{formatCurrency(endingCash)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Cash Flow Notes</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• This statement uses the direct method of reporting operating cash flows</li>
          <li>• Inter-account transfers between checking and savings are excluded as they don't affect total cash</li>
          <li>• No significant investing or financing activities during Q4 2025</li>
          <li>• Ending cash balance represents TruMark checking account only (savings shown separately on Balance Sheet)</li>
        </ul>
      </div>
    </div>
  );
};
