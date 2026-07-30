import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";
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

  // ═══════════════════════════════════════
  // REVENUE
  // ═══════════════════════════════════════
  const serviceRevenue = sumByCode(allDeposits, "4100");
  const otherIncome = sumByCode(allDeposits, "4900");
  const totalRevenue = serviceRevenue + otherIncome;

  // ═══════════════════════════════════════
  // COST OF GOODS SOLD (COGS)
  // ═══════════════════════════════════════
  const subcontractorLabor = sumByCode(allWithdrawals, "5100");
  const bankMaterials = sumByCode(allWithdrawals, "5200") + sumByCategory(allWithdrawals, "Materials & Supplies");
  const ccMaterials = sumCCByCode(allCC, "5200");
  const totalMaterials = bankMaterials + ccMaterials;
  const ccWaste = sumCCByCategory(allCC, "Waste Disposal");
  const ccTools = sumCCByCategory(allCC, "Tools & Equipment");
  const uncategorizedChecks = sumByCode(allWithdrawals, "5000");

  const totalCOGS = subcontractorLabor + totalMaterials + ccWaste + ccTools + uncategorizedChecks;
  const grossProfit = totalRevenue - totalCOGS;

  // ═══════════════════════════════════════
  // OPERATING EXPENSES
  // ═══════════════════════════════════════
  // Rent ($1,000/month × 3 months)
  const rent = 3000;

  const bankFuel = sumByCode(allWithdrawals, "5300");
  const ccFuelOnly = sumCCByCategory(allCC, "Fuel & Gas");
  const totalFuel = bankFuel + ccFuelOnly;

  const ccVehicleMaint = sumCCByCategory(allCC, "Vehicle Maintenance");

  const ccParking = sumCCByCategory(allCC, "Parking");
  const ccTolls = sumCCByCategory(allCC, "Tolls");
  const ccTransportation = sumCCByCategory(allCC, "Transportation");
  const totalParkingTolls = ccParking + ccTolls + ccTransportation;

  const ccParkingFines = sumCCByCategory(allCC, "Parking / Fines");
  const ccFines = sumCCByCategory(allCC, "Fines & Penalties");

  const bankMeals = sumByCode(allWithdrawals, "5400");
  const ccMeals = sumCCByCode(allCC, "5400");
  const totalMeals = bankMeals + ccMeals;

  const ccSoftware = sumCCByCode(allCC, "5500");

  const bankInsurance = sumByCode(allWithdrawals, "5600");
  const ccInsurance = sumCCByCode(allCC, "5600");
  const totalInsurance = bankInsurance + ccInsurance;

  const vehiclePayment = sumByCode(allWithdrawals, "5700");

  const ccInterest = allCC.reduce((s, c) => s + c.interest + c.fees, 0);
  const bankFees = sumByCategory(allWithdrawals, "Bank Fee");
  const bankOffice = sumByCategory(allWithdrawals, "Office Supplies");
  const ccGovt = sumCCByCategory(allCC, "Government / Permits");
  const ccCardFees = sumCCByCategory(allCC, "Credit Card Fees");
  const ccProfDev = sumCCByCategory(allCC, "Professional Development");

  const totalOperatingExpenses = rent + totalFuel + ccVehicleMaint + totalParkingTolls + ccParkingFines + ccFines + totalMeals + ccSoftware + totalInsurance + vehiclePayment + ccInterest + bankFees + bankOffice + ccGovt + ccCardFees + ccProfDev;

  const netIncome = grossProfit - totalOperatingExpenses;

  // Owner's Draw (equity, not P&L)
  const ownersDrawBank = sumByCategory(allWithdrawals, "Owner's Draw");
  const personalInvestment = sumByCategory(allWithdrawals, "Personal Investment");
  const totalOwnerDraws = ownersDrawBank + personalInvestment;

  // ═══════════════════════════════════════
  // ROW COMPONENTS
  // ═══════════════════════════════════════
  const SectionHeader = ({ children }: { children: string }) => (
    <TableRow className="border-b border-white/[0.08] hover:bg-transparent">
      <TableCell colSpan={2} className="bg-white/[0.02] font-medium text-[11px] text-primary/90 pt-4 pb-1.5 uppercase tracking-[0.16em] print:text-[10px] print:pt-1 print:pb-0 print:text-black">
        {children}
      </TableCell>
    </TableRow>
  );

  const LineItem = ({ label, amount, indent = false, bold = false }: { label: string; amount: number; indent?: boolean; bold?: boolean }) => (
    <TableRow className="border-0 transition-colors duration-150 hover:bg-primary/[0.04]">
      <TableCell className={`py-1.5 text-[13px] text-foreground/85 print:py-0 print:text-[10px] ${indent ? "pl-10 print:pl-6" : "pl-6 print:pl-4"} ${bold ? "font-semibold text-foreground" : ""}`}>
        {label}
      </TableCell>
      <TableCell className={`py-1.5 pr-6 text-[13px] tabular text-right text-foreground/85 print:py-0 print:pr-4 print:text-[10px] ${bold ? "font-semibold text-foreground" : ""}`}>
        {fmt(amount)}
      </TableCell>
    </TableRow>
  );

  const TotalLine = ({ label, amount, isGrand = false, borderStyle = "single" }: { label: string; amount: number; isGrand?: boolean; borderStyle?: "single" | "double" }) => (
    <TableRow className={`${borderStyle === "double" ? "border-t-[3px] border-double border-primary/40" : "border-t border-white/[0.14]"} ${isGrand ? "bg-primary/[0.05]" : ""} hover:bg-transparent`}>
      <TableCell className={`py-2.5 pl-6 uppercase tracking-[0.08em] print:py-0.5 print:text-[10px] print:pl-4 print:normal-case ${isGrand ? "text-[13px] font-semibold text-foreground print:text-xs" : "text-[12px] font-medium text-foreground/90"}`}>
        {label}
      </TableCell>
      <TableCell className={`py-2.5 pr-6 tabular text-right print:py-0.5 print:pr-4 print:text-[10px] ${isGrand ? "text-base font-semibold text-primary print:text-xs print:text-black" : "text-[13px] font-semibold text-foreground"} ${amount < 0 ? "!text-expense" : ""}`}>
        {amount < 0 ? `(${fmt(Math.abs(amount))})` : fmt(amount)}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6 print-compact-pnl">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-white/[0.08] bg-white/[0.02] pb-4 print:pb-1">
          <div className="text-center space-y-1 print:space-y-0">
            <CardTitle className="text-lg font-bold text-foreground print:text-sm">
              Defiore Carpentry LLC
            </CardTitle>
            <p className="text-sm font-semibold text-foreground print:text-xs">Profit & Loss Statement</p>
            <p className="text-sm text-muted-foreground print:text-xs">Quarter 1, 2026 — January 1, 2026 – March 31, 2026</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="table-header-row hover:bg-transparent">
                <TableHead className="w-3/4 text-xs uppercase tracking-wider text-muted-foreground">Account</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* REVENUE */}
              <SectionHeader>Revenue</SectionHeader>
              <LineItem label="Service Revenue" amount={serviceRevenue} indent />
              <LineItem label="Other Income" amount={otherIncome} indent />
              <TotalLine label="Total Revenue" amount={totalRevenue} />

              {/* COST OF GOODS SOLD */}
              <SectionHeader>Cost of Goods Sold</SectionHeader>
              <LineItem label="Subcontractor Labor" amount={subcontractorLabor} indent />
              <LineItem label="Materials & Supplies" amount={totalMaterials} indent />
              <LineItem label="Waste Disposal" amount={ccWaste} indent />
              <LineItem label="Tools & Equipment" amount={ccTools} indent />
              <LineItem label="Other Direct Costs" amount={uncategorizedChecks} indent />
              <TotalLine label="Total Cost of Goods Sold" amount={totalCOGS} />

              {/* GROSS PROFIT */}
              <TotalLine label="Gross Profit" amount={grossProfit} isGrand />

              {/* OPERATING EXPENSES */}
              <SectionHeader>Operating Expenses</SectionHeader>
              <LineItem label="Rent" amount={rent} indent />
              <LineItem label="Fuel & Gas" amount={totalFuel} indent />
              <LineItem label="Vehicle Maintenance" amount={ccVehicleMaint} indent />
              <LineItem label="Vehicle Payment" amount={vehiclePayment} indent />
              <LineItem label="Parking & Tolls" amount={totalParkingTolls} indent />
              <LineItem label="Parking Fines" amount={ccParkingFines} indent />
              <LineItem label="Insurance" amount={totalInsurance} indent />
              <LineItem label="Meals & Entertainment" amount={totalMeals} indent />
              <LineItem label="Software & Subscriptions" amount={ccSoftware} indent />
              <LineItem label="Office Supplies" amount={bankOffice} indent />
              <LineItem label="Government / Permits" amount={ccGovt} indent />
              <LineItem label="Professional Development" amount={ccProfDev} indent />
              <LineItem label="Credit Card Interest & Fees" amount={ccInterest} indent />
              <LineItem label="Credit Card Reward Fees" amount={ccCardFees} indent />
              <LineItem label="Bank Fees" amount={bankFees} indent />
              <LineItem label="Fines & Penalties" amount={ccFines} indent />
              <TotalLine label="Total Operating Expenses" amount={totalOperatingExpenses} />

              {/* NET INCOME */}
              <TotalLine label="Net Income (Loss)" amount={netIncome} isGrand borderStyle="double" />
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};
