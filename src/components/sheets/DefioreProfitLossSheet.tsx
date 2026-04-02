import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  januaryDeposits, januaryWithdrawals,
  februaryDeposits, februaryWithdrawals,
  marchDeposits, marchWithdrawals,
} from "@/data/defioreBankTransactions";
import {
  januaryCreditCards, februaryCreditCards, marchCreditCards,
} from "@/data/defioreCreditCardTransactions";
import type { CreditCardStatement } from "@/data/defioreCreditCardTransactions";
import type { Transaction } from "@/data/bankTransactions";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const sumByCode = (txs: Transaction[], code: string) =>
  txs.filter((t) => t.coaCode === code).reduce((s, t) => s + t.amount, 0);

const sumByCategory = (txs: Transaction[], cat: string) =>
  txs.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0);

const sumCCByCode = (stmts: CreditCardStatement[], code: string) =>
  stmts.flatMap((s) => s.transactions).filter((t) => t.coaCode === code).reduce((s, t) => s + Math.max(0, t.amount), 0);

const sumCCByCategory = (stmts: CreditCardStatement[], cat: string) =>
  stmts.flatMap((s) => s.transactions).filter((t) => t.category === cat).reduce((s, t) => s + Math.max(0, t.amount), 0);

export const DefioreProfitLossSheet = () => {
  const allDeposits = [...januaryDeposits, ...februaryDeposits, ...marchDeposits];
  const allWithdrawals = [...januaryWithdrawals, ...februaryWithdrawals, ...marchWithdrawals];
  const allCC = [...januaryCreditCards, ...februaryCreditCards, ...marchCreditCards];

  // REVENUE (from bank deposits only)
  const serviceRevenue = sumByCode(allDeposits, "4100");
  const otherIncome = sumByCode(allDeposits, "4900");
  const totalRevenue = serviceRevenue + otherIncome;

  // ─── COST OF REVENUE / DIRECT COSTS ───
  const subcontractorLabor = sumByCode(allWithdrawals, "5100");
  const bankMaterials = sumByCode(allWithdrawals, "5200") + sumByCategory(allWithdrawals, "Materials & Supplies");
  const ccMaterials = sumCCByCode(allCC, "5200");
  const totalMaterials = bankMaterials + ccMaterials;
  const ccWaste = sumCCByCategory(allCC, "Waste Disposal");
  const ccTools = sumCCByCategory(allCC, "Tools & Equipment");
  const uncategorizedChecks = sumByCode(allWithdrawals, "5000");

  const totalCostOfRevenue = subcontractorLabor + totalMaterials + ccWaste + ccTools + uncategorizedChecks;
  const grossProfit = totalRevenue - totalCostOfRevenue;

  // ─── OPERATING EXPENSES ───
  // Fuel & Gas (bank + CC, only actual fuel category)
  const bankFuel = sumByCode(allWithdrawals, "5300");
  const ccFuelOnly = sumCCByCategory(allCC, "Fuel & Gas");
  const totalFuel = bankFuel + ccFuelOnly;

  // Vehicle Maintenance (CC)
  const ccVehicleMaint = sumCCByCategory(allCC, "Vehicle Maintenance");

  // Parking & Tolls (CC)
  const ccParking = sumCCByCategory(allCC, "Parking");
  const ccTolls = sumCCByCategory(allCC, "Tolls");
  const ccTransportation = sumCCByCategory(allCC, "Transportation");
  const totalParkingTolls = ccParking + ccTolls + ccTransportation;

  // Parking Fines (CC - Philadelphia Parking Authority)
  const ccParkingFines = sumCCByCategory(allCC, "Parking / Fines");

  // Fines & Penalties (CC)
  const ccFines = sumCCByCategory(allCC, "Fines & Penalties");

  // Meals & Entertainment (bank + CC)
  const bankMeals = sumByCode(allWithdrawals, "5400");
  const ccMeals = sumCCByCode(allCC, "5400");
  const totalMeals = bankMeals + ccMeals;

  // Software & Subscriptions (CC)
  const ccSoftware = sumCCByCode(allCC, "5500");

  // Insurance (bank + CC)
  const bankInsurance = sumByCode(allWithdrawals, "5600");
  const ccInsurance = sumCCByCode(allCC, "5600");
  const totalInsurance = bankInsurance + ccInsurance;

  // Vehicle Payment (bank)
  const vehiclePayment = sumByCode(allWithdrawals, "5700");

  // CC Interest & Fees (includes annual fees)
  const ccInterest = allCC.reduce((s, c) => s + c.interest + c.fees, 0);

  // Bank Fees
  const bankFees = sumByCategory(allWithdrawals, "Bank Fee");

  // Office Supplies (bank)
  const bankOffice = sumByCategory(allWithdrawals, "Office Supplies");


  // Government/Permits from CC
  const ccGovt = sumCCByCategory(allCC, "Government / Permits");

  // CC Reward Fees from CC
  const ccCardFees = sumCCByCategory(allCC, "Credit Card Fees");

  // Professional Development (CC)
  const ccProfDev = sumCCByCategory(allCC, "Professional Development");

  const totalOperatingExpenses = totalFuel + ccVehicleMaint + totalParkingTolls + ccParkingFines + ccFines + totalMeals + ccSoftware + totalInsurance + vehiclePayment + ccInterest + bankFees + bankOffice + totalPersonal + ccGovt + ccCardFees + ccProfDev;

  // Owner's Draw (not an expense on P&L but tracked)
  const ownersDrawBank = sumByCategory(allWithdrawals, "Owner's Draw");
  const personalInvestment = sumByCategory(allWithdrawals, "Personal Investment");
  const totalOwnerDraws = ownersDrawBank + personalInvestment;

  const netIncome = grossProfit - totalOperatingExpenses;

  const Row = ({ label, amount, indent = false, code = "" }: { label: string; amount: number; indent?: boolean; code?: string }) => (
    <TableRow>
      <TableCell className={indent ? "pl-8" : ""}>{label}</TableCell>
      {code && <TableCell className="text-right text-muted-foreground text-xs">{code}</TableCell>}
      {!code && <TableCell />}
      <TableCell className="text-right font-mono">{fmt(amount)}</TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profit & Loss Statement</h2>
        <p className="text-muted-foreground">Defiore Carpentry LLC — Q1 2026 (January – March)</p>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <DollarSign className="h-5 w-5" />
            Income Statement — Q1 2026
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
              <TableRow className="bg-green-500/10 font-semibold"><TableCell colSpan={3}>REVENUE</TableCell></TableRow>
              <Row label="Service Revenue" amount={serviceRevenue} indent code="4100" />
              <Row label="Other Income (Transfers, etc.)" amount={otherIncome} indent code="4900" />
              <TableRow className="border-t-2 font-bold bg-green-500/10">
                <TableCell>Total Revenue</TableCell><TableCell /><TableCell className="text-right font-mono text-green-400">{fmt(totalRevenue)}</TableCell>
              </TableRow>

              <TableRow className="bg-orange-500/10 font-semibold"><TableCell colSpan={3}>COST OF REVENUE</TableCell></TableRow>
              <Row label="Subcontractor Labor" amount={subcontractorLabor} indent code="5100" />
              <Row label="Materials & Supplies" amount={totalMaterials} indent code="5200" />
              <Row label="Waste Disposal" amount={ccWaste} indent />
              <Row label="Tools & Equipment" amount={ccTools} indent />
              <Row label="Uncategorized Checks" amount={uncategorizedChecks} indent code="5000" />
              <TableRow className="border-t-2 font-bold bg-orange-500/10">
                <TableCell>Total Cost of Revenue</TableCell><TableCell /><TableCell className="text-right font-mono text-orange-400">({fmt(totalCostOfRevenue)})</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-lg bg-blue-500/10">
                <TableCell>GROSS PROFIT</TableCell><TableCell />
                <TableCell className={`text-right font-mono ${grossProfit >= 0 ? "text-blue-400" : "text-red-400"}`}>{fmt(grossProfit)}</TableCell>
              </TableRow>

              <TableRow className="bg-red-500/10 font-semibold"><TableCell colSpan={3}>OPERATING EXPENSES</TableCell></TableRow>
              <Row label="Fuel & Gas" amount={totalFuel} indent code="5300" />
              <Row label="Vehicle Maintenance" amount={ccVehicleMaint} indent />
              <Row label="Parking & Tolls" amount={totalParkingTolls} indent />
              <Row label="Parking Fines" amount={ccParkingFines} indent />
              <Row label="Meals & Entertainment" amount={totalMeals} indent code="5400" />
              <Row label="Software & Subscriptions" amount={ccSoftware} indent code="5500" />
              <Row label="Insurance" amount={totalInsurance} indent code="5600" />
              <Row label="Vehicle Payment" amount={vehiclePayment} indent code="5700" />
              <Row label="Credit Card Interest & Fees" amount={ccInterest} indent />
              <Row label="Bank Fees" amount={bankFees} indent />
              <Row label="Office Supplies" amount={bankOffice} indent />
              <Row label="Personal Expenses" amount={totalPersonal} indent code="5900" />
              <Row label="Government / Permits" amount={ccGovt} indent />
              <Row label="Credit Card Reward Fees" amount={ccCardFees} indent />
              <Row label="Professional Development" amount={ccProfDev} indent />
              <Row label="Fines & Penalties" amount={ccFines} indent />
              <TableRow className="border-t-2 font-bold bg-red-500/10">
                <TableCell>Total Operating Expenses</TableCell><TableCell /><TableCell className="text-right font-mono text-red-400">({fmt(totalOperatingExpenses)})</TableCell>
              </TableRow>

              <TableRow className="border-t-4 font-bold text-xl bg-primary/10">
                <TableCell className="py-4">NET INCOME</TableCell><TableCell />
                <TableCell className={`text-right font-mono py-4 ${netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(netIncome)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Owner's Draw note */}
      <div className="glass-card p-4 border-primary/20">
        <h4 className="font-semibold text-primary mb-2">Owner's Draws & Personal (not on P&L)</h4>
        <p className="text-sm text-muted-foreground">
          Total Owner's Draws: <span className="font-mono font-semibold text-foreground">{fmt(totalOwnerDraws)}</span> — 
          These reduce equity, not income.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-green-500/30">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-green-400 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">{fmt(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-orange-500/30">
          <CardContent className="pt-6 text-center">
            <TrendingDown className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-orange-400 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-foreground">{fmt(totalCostOfRevenue + totalOperatingExpenses)}</p>
          </CardContent>
        </Card>
        <Card className={`glass-card ${netIncome >= 0 ? "border-green-500/30" : "border-red-500/30"}`}>
          <CardContent className="pt-6 text-center">
            <DollarSign className={`h-8 w-8 mx-auto mb-2 ${netIncome >= 0 ? "text-green-400" : "text-red-400"}`} />
            <p className={`text-sm font-medium ${netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>Net Income</p>
            <p className="text-2xl font-bold text-foreground">{fmt(netIncome)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
