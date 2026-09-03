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
import { useState } from "react";
import { cvsQuarters, defaultQuarter } from "@/data/cvsQuarters";
import { QuarterSelect } from "@/components/sheets/QuarterSelect";
import { getPayrollForQuarter, payrollEmployerTaxes, payrollGrossWages } from "@/data/cvsPayroll";



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
  const [periodKey, setPeriodKey] = useState(defaultQuarter.key);
  const period = cvsQuarters.find((q) => q.key === periodKey) ?? defaultQuarter;
  const allDeposits = period.deposits;
  const allWithdrawals = period.withdrawals;


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
  // Payroll (from the payroll processor register — not on the bank statement)
  const payroll = getPayrollForQuarter(period.key);
  const wages = payroll ? payrollGrossWages(payroll) : 0;
  const employerPayrollTaxes = payroll ? payrollEmployerTaxes(payroll) : 0;

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
  const meals = sumByCoaCode(allWithdrawals, "6310");
  const licenses = sumByCoaCode(allWithdrawals, "6900");
  const unclassified = sumByCoaCode(allWithdrawals, "6999");
  const totalOperatingExpenses = wages + employerPayrollTaxes + totalRent + utilities + communications + officeSupplies + vehicleOperating + processingFees + bankFees + insurance + otherExpenses + meals + licenses + unclassified;

  const netIncome = grossProfit - totalOperatingExpenses;


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profit &amp; Loss Statement</h2>
          <p className="text-muted-foreground">
            CVS Auto Sales Inc. — {period.label} ({period.monthsLabel})
          </p>
        </div>
        <QuarterSelect value={periodKey} onChange={setPeriodKey} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Statement — {period.label}
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
              <TableRow className="bg-income/50 font-semibold">
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
              <TableRow className="border-t-2 font-bold bg-income/15">
                <TableCell>Total Revenue</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-mono text-income">{formatCurrency(totalRevenue)}</TableCell>
              </TableRow>

              {/* COGS Section */}
              <TableRow className="bg-warning/50 font-semibold">
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
              <TableRow className="border-t-2 font-bold bg-warning/15">
                <TableCell>Total Cost of Goods Sold</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-mono text-warning">({formatCurrency(totalCOGS)})</TableCell>
              </TableRow>

              {/* Gross Profit */}
              <TableRow className="border-t-4 font-bold text-lg bg-info/15">
                <TableCell>GROSS PROFIT</TableCell>
                <TableCell></TableCell>
                <TableCell className={`text-right font-mono ${grossProfit >= 0 ? 'text-info' : 'text-expense'}`}>
                  {formatCurrency(grossProfit)}
                </TableCell>
              </TableRow>

              {/* Operating Expenses */}
              <TableRow className="bg-expense/50 font-semibold">
                <TableCell colSpan={3}>OPERATING EXPENSES</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Salaries &amp; Wages</TableCell>
                <TableCell className="text-right text-muted-foreground">6010</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(wages)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Employer Payroll Taxes</TableCell>
                <TableCell className="text-right text-muted-foreground">6020</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(employerPayrollTaxes)}</TableCell>
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
              <TableRow>
                <TableCell className="pl-8">Meals &amp; Entertainment</TableCell>
                <TableCell className="text-right text-muted-foreground">6310</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(meals)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Licenses, Bonds &amp; Notary</TableCell>
                <TableCell className="text-right text-muted-foreground">6900</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(licenses)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Unclassified Checks — Verify Payee</TableCell>
                <TableCell className="text-right text-muted-foreground">6999</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(unclassified)}</TableCell>
              </TableRow>

              <TableRow className="border-t-2 font-bold bg-expense/15">
                <TableCell>Total Operating Expenses</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-mono text-expense">({formatCurrency(totalOperatingExpenses)})</TableCell>
              </TableRow>

              {/* Net Income */}
              <TableRow className="border-t-4 font-bold text-xl bg-primary/10">
                <TableCell className="py-4">NET INCOME</TableCell>
                <TableCell></TableCell>
                <TableCell className={`text-right font-mono py-4 ${netIncome >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(netIncome)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-income/15 border-income/30">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-income mx-auto mb-2" />
            <p className="text-sm text-income font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-income">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/15 border-warning/30">
          <CardContent className="pt-6 text-center">
            <TrendingDown className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-sm text-warning font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalCOGS + totalOperatingExpenses)}</p>
          </CardContent>
        </Card>
        <Card className={netIncome >= 0 ? "bg-info/15 border-info/30" : "bg-expense/15 border-expense/30"}>
          <CardContent className="pt-6 text-center">
            <DollarSign className={`h-8 w-8 mx-auto mb-2 ${netIncome >= 0 ? 'text-info' : 'text-expense'}`} />
            <p className={`text-sm font-medium ${netIncome >= 0 ? 'text-info' : 'text-expense'}`}>Net Income</p>
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-info' : 'text-expense'}`}>{formatCurrency(netIncome)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
