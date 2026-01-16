import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals,
} from "@/data/bankTransactions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper to sum by COA code prefix
const sumByCoaPrefix = (transactions: any[], prefix: string) => {
  return transactions
    .filter(t => t.coaCode.startsWith(prefix) && t.coaCode !== "9999")
    .reduce((sum, t) => sum + t.amount, 0);
};

const sumByCoaCode = (transactions: any[], code: string) => {
  return transactions
    .filter(t => t.coaCode === code)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const ProfitLossSheet = () => {
  const allDeposits = [...octoberDeposits, ...novemberDeposits, ...decemberDeposits];
  const allWithdrawals = [...octoberWithdrawals, ...novemberWithdrawals, ...decemberWithdrawals];

  // Revenue (4000 series)
  const creditCardSales = sumByCoaCode(allDeposits, "4100");
  const cashCheckSales = sumByCoaCode(allDeposits, "4110");
  const venmoSales = sumByCoaCode(allDeposits, "4120");
  const inspectionFees = sumByCoaCode(allDeposits, "4200");
  const otherIncome = sumByCoaCode(allDeposits, "4900");
  const totalRevenue = creditCardSales + cashCheckSales + venmoSales + inspectionFees + otherIncome;

  // Cost of Goods Sold (5000 series)
  const inventoryPurchases = sumByCoaCode(allWithdrawals, "5000");
  const titleRegistration = sumByCoaCode(allWithdrawals, "5100");
  const floorPlanInterest = sumByCoaCode(allWithdrawals, "5110");
  const titleLookup = sumByCoaCode(allWithdrawals, "5120");
  const totalCOGS = inventoryPurchases + titleRegistration + floorPlanInterest + titleLookup;

  const grossProfit = totalRevenue - totalCOGS;

  // Operating Expenses (6000 series)
  const rentFrontOffice = sumByCoaCode(allWithdrawals, "6050");
  const rentMainOffice = sumByCoaCode(allWithdrawals, "6055");
  const totalRent = rentFrontOffice + rentMainOffice;
  const utilities = sumByCoaCode(allWithdrawals, "6100");
  const communications = sumByCoaCode(allWithdrawals, "6200");
  const officeSupplies = sumByCoaCode(allWithdrawals, "6300");
  const vehicleOperating = sumByCoaCode(allWithdrawals, "6400");
  const processingFees = sumByCoaCode(allWithdrawals, "6500");
  const bankFees = sumByCoaCode(allWithdrawals, "6600");
  const insurance = sumByCoaCode(allWithdrawals, "6700");
  const otherExpenses = sumByCoaCode(allWithdrawals, "6800");
  const totalOperatingExpenses = totalRent + utilities + communications + officeSupplies + vehicleOperating + processingFees + bankFees + insurance + otherExpenses;

  const netIncome = grossProfit - totalOperatingExpenses;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profit & Loss Statement</h2>
        <p className="text-muted-foreground">CVS Auto Sales Inc. — Q4 2025 (October - December)</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Statement — Q4 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-1/2">Account</TableHead>
                <TableHead className="text-right">COA</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Revenue Section */}
              <TableRow className="bg-green-50/50 font-semibold">
                <TableCell colSpan={3}>REVENUE</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Credit Card Sales</TableCell>
                <TableCell className="text-right text-muted-foreground">4100</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(creditCardSales)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Cash/Check Sales</TableCell>
                <TableCell className="text-right text-muted-foreground">4110</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(cashCheckSales)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Venmo/Digital Sales</TableCell>
                <TableCell className="text-right text-muted-foreground">4120</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(venmoSales)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Salvage Inspection Fees</TableCell>
                <TableCell className="text-right text-muted-foreground">4200</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(inspectionFees)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Income</TableCell>
                <TableCell className="text-right text-muted-foreground">4900</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(otherIncome)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-green-50">
                <TableCell>Total Revenue</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-mono text-green-700">{formatCurrency(totalRevenue)}</TableCell>
              </TableRow>

              {/* COGS Section */}
              <TableRow className="bg-orange-50/50 font-semibold">
                <TableCell colSpan={3}>COST OF GOODS SOLD</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Vehicle Inventory Purchases</TableCell>
                <TableCell className="text-right text-muted-foreground">5000</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(inventoryPurchases)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Title & Registration Fees</TableCell>
                <TableCell className="text-right text-muted-foreground">5100</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(titleRegistration)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Title Lookup Services (Vitu)</TableCell>
                <TableCell className="text-right text-muted-foreground">5120</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(titleLookup)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-orange-50">
                <TableCell>Total Cost of Goods Sold</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-mono text-orange-700">({formatCurrency(totalCOGS)})</TableCell>
              </TableRow>

              {/* Gross Profit */}
              <TableRow className="border-t-4 font-bold text-lg bg-blue-50">
                <TableCell>GROSS PROFIT</TableCell>
                <TableCell></TableCell>
                <TableCell className={`text-right font-mono ${grossProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {formatCurrency(grossProfit)}
                </TableCell>
              </TableRow>

              {/* Operating Expenses */}
              <TableRow className="bg-red-50/50 font-semibold">
                <TableCell colSpan={3}>OPERATING EXPENSES</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Rent - Front Office</TableCell>
                <TableCell className="text-right text-muted-foreground">6050</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(rentFrontOffice)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Rent - Main Office</TableCell>
                <TableCell className="text-right text-muted-foreground">6055</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(rentMainOffice)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Utilities</TableCell>
                <TableCell className="text-right text-muted-foreground">6100</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(utilities)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Communications</TableCell>
                <TableCell className="text-right text-muted-foreground">6200</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(communications)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Office & Supplies</TableCell>
                <TableCell className="text-right text-muted-foreground">6300</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(officeSupplies)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Vehicle Operating</TableCell>
                <TableCell className="text-right text-muted-foreground">6400</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(vehicleOperating)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Processing Fees</TableCell>
                <TableCell className="text-right text-muted-foreground">6500</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(processingFees)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Bank Fees</TableCell>
                <TableCell className="text-right text-muted-foreground">6600</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(bankFees)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Insurance</TableCell>
                <TableCell className="text-right text-muted-foreground">6700</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(insurance)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Operating Expenses</TableCell>
                <TableCell className="text-right text-muted-foreground">6800</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(otherExpenses)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 font-bold bg-red-50">
                <TableCell>Total Operating Expenses</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-mono text-red-700">({formatCurrency(totalOperatingExpenses)})</TableCell>
              </TableRow>

              {/* Net Income */}
              <TableRow className="border-t-4 font-bold text-xl bg-primary/10">
                <TableCell className="py-4">NET INCOME</TableCell>
                <TableCell></TableCell>
                <TableCell className={`text-right font-mono py-4 ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(netIncome)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6 text-center">
            <TrendingDown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-700 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-orange-800">{formatCurrency(totalCOGS + totalOperatingExpenses)}</p>
          </CardContent>
        </Card>
        <Card className={netIncome >= 0 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}>
          <CardContent className="pt-6 text-center">
            <DollarSign className={`h-8 w-8 mx-auto mb-2 ${netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            <p className={`text-sm font-medium ${netIncome >= 0 ? 'text-blue-700' : 'text-red-700'}`}>Net Income</p>
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{formatCurrency(netIncome)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
