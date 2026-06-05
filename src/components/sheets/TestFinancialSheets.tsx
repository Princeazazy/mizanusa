import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  TEST_BUSINESS_NAME,
  testJanDeposits, testJanWithdrawals, testJanSummary,
  testFebDeposits, testFebWithdrawals,
  testMarDeposits, testMarWithdrawals,
  testInvoices,
} from "@/data/testMockData";
import type { Transaction } from "@/data/bankTransactions";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const sumByCategory = (txs: Transaction[], cat: string) =>
  txs.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0);

const allDeposits = [...testJanDeposits, ...testFebDeposits, ...testMarDeposits];
const allWithdrawals = [...testJanWithdrawals, ...testFebWithdrawals, ...testMarWithdrawals];

// Revenue
const serviceRevenue = sumByCategory(allDeposits, "Service Revenue");
const ownerContributions = sumByCategory(allDeposits, "Owner Contribution");

// Expenses by category
const rent = sumByCategory(allWithdrawals, "Rent");
const utilities = sumByCategory(allWithdrawals, "Utilities");
const payroll = sumByCategory(allWithdrawals, "Payroll");
const officeSupplies = sumByCategory(allWithdrawals, "Office Supplies");
const software = sumByCategory(allWithdrawals, "Software");
const vehicle = sumByCategory(allWithdrawals, "Vehicle");
const marketing = sumByCategory(allWithdrawals, "Marketing");
const insurance = sumByCategory(allWithdrawals, "Insurance");
const travel = sumByCategory(allWithdrawals, "Travel");
const meals = sumByCategory(allWithdrawals, "Meals");

const totalRevenue = serviceRevenue;
const totalOpex = rent + utilities + payroll + officeSupplies + software + vehicle + marketing + insurance + travel + meals;
const netIncome = totalRevenue - totalOpex;

// Cash flow
const totalDeposits = allDeposits.reduce((s, t) => s + t.amount, 0);
const totalWithdrawals = allWithdrawals.reduce((s, t) => s + t.amount, 0);
const beginningCash = testJanSummary.beginningBalance;
const endingCash = beginningCash + totalDeposits - totalWithdrawals;
const netCashFromOps = netIncome;
const netCashFromFinancing = ownerContributions;

// Balance sheet
const accountsReceivable = testInvoices
  .filter((i) => i.status !== "paid")
  .reduce((s, i) => s + i.remainingAmount, 0);
const openingEquity = beginningCash; // assume prior equity = opening cash
const totalAssets = endingCash; // cash basis: A/R not booked
const totalEquity = openingEquity + ownerContributions + netIncome;

const SectionHeader = ({ children }: { children: string }) => (
  <TableRow className="border-b border-border">
    <TableCell colSpan={2} className="font-bold text-sm text-foreground pt-4 pb-1 uppercase tracking-wide print:text-[10px] print:pt-1 print:pb-0">
      {children}
    </TableCell>
  </TableRow>
);

const LineItem = ({ label, amount, indent = true, bold = false }: { label: string; amount: number; indent?: boolean; bold?: boolean }) => (
  <TableRow className="border-0">
    <TableCell className={`py-1 print:py-0 print:text-[10px] ${indent ? "pl-10 print:pl-6" : "pl-6 print:pl-4"} ${bold ? "font-semibold" : ""}`}>
      {label}
    </TableCell>
    <TableCell className={`py-1 print:py-0 print:text-[10px] text-right font-mono ${bold ? "font-semibold" : ""}`}>
      {fmt(amount)}
    </TableCell>
  </TableRow>
);

const TotalLine = ({ label, amount, isGrand = false, borderStyle = "single" }: { label: string; amount: number; isGrand?: boolean; borderStyle?: "single" | "double" }) => (
  <TableRow className={`${borderStyle === "double" ? "border-t-4 border-double" : "border-t-2"} border-border`}>
    <TableCell className={`py-2 print:py-0.5 print:text-[10px] pl-6 print:pl-4 ${isGrand ? "font-bold text-base print:text-xs" : "font-semibold"}`}>
      {label}
    </TableCell>
    <TableCell className={`py-2 print:py-0.5 print:text-[10px] text-right font-mono ${isGrand ? "font-bold text-base print:text-xs" : "font-semibold"} ${amount < 0 ? "text-destructive" : ""}`}>
      {amount < 0 ? `(${fmt(Math.abs(amount))})` : fmt(amount)}
    </TableCell>
  </TableRow>
);

const StatementShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="space-y-6 print-compact-pnl">
    <Card className="glass-card border-primary/20">
      <CardHeader className="border-b border-border pb-4 print:pb-1">
        <div className="text-center space-y-1 print:space-y-0">
          <CardTitle className="text-lg font-bold text-foreground print:text-sm">
            {TEST_BUSINESS_NAME}
          </CardTitle>
          <p className="text-sm font-semibold text-foreground print:text-xs">{title}</p>
          <p className="text-sm text-muted-foreground print:text-xs">{subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-border">
              <TableHead className="w-3/4 text-xs uppercase tracking-wider text-muted-foreground">Account</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export const TestProfitLossSheet = () => (
  <StatementShell
    title="Profit & Loss Statement"
    subtitle="Quarter 1, 2026 — January 1, 2026 – March 31, 2026"
  >
    <SectionHeader>Revenue</SectionHeader>
    <LineItem label="Service Revenue" amount={serviceRevenue} />
    <TotalLine label="Total Revenue" amount={totalRevenue} />

    <SectionHeader>Operating Expenses</SectionHeader>
    <LineItem label="Payroll" amount={payroll} />
    <LineItem label="Rent" amount={rent} />
    <LineItem label="Travel" amount={travel} />
    <LineItem label="Marketing" amount={marketing} />
    <LineItem label="Utilities & Internet" amount={utilities} />
    <LineItem label="Insurance" amount={insurance} />
    <LineItem label="Office Supplies" amount={officeSupplies} />
    <LineItem label="Software & Subscriptions" amount={software} />
    <LineItem label="Meals & Entertainment" amount={meals} />
    <LineItem label="Vehicle & Fuel" amount={vehicle} />
    <TotalLine label="Total Operating Expenses" amount={totalOpex} />

    <TotalLine label="Net Income (Loss)" amount={netIncome} isGrand borderStyle="double" />
  </StatementShell>
);

export const TestBalanceSheet = () => (
  <StatementShell
    title="Balance Sheet"
    subtitle="As of March 31, 2026"
  >
    <SectionHeader>Assets</SectionHeader>
    <LineItem label="Cash – Business Checking" amount={endingCash} />
    <TotalLine label="Total Current Assets" amount={endingCash} />
    <TotalLine label="Total Assets" amount={totalAssets} isGrand />

    <SectionHeader>Liabilities</SectionHeader>
    <LineItem label="Accounts Payable" amount={0} />
    <LineItem label="Notes Payable" amount={0} />
    <TotalLine label="Total Liabilities" amount={0} />

    <SectionHeader>Equity</SectionHeader>
    <LineItem label="Opening Owner's Equity" amount={openingEquity} />
    <LineItem label="Owner Contributions – Q1 2026" amount={ownerContributions} />
    <LineItem label="Retained Earnings – Q1 2026" amount={netIncome} />
    <TotalLine label="Total Equity" amount={totalEquity} />

    <TotalLine label="Total Liabilities & Equity" amount={totalEquity} isGrand borderStyle="double" />

    {accountsReceivable > 0 && (
      <TableRow className="border-0">
        <TableCell colSpan={2} className="pt-4 pl-6 text-xs text-muted-foreground italic">
          Memo: Cash-basis presentation. Outstanding accounts receivable of {fmt(accountsReceivable)} not recognized as an asset.
        </TableCell>
      </TableRow>
    )}
  </StatementShell>
);

export const TestCashFlowSheet = () => (
  <StatementShell
    title="Statement of Cash Flows"
    subtitle="Quarter 1, 2026 — January 1, 2026 – March 31, 2026"
  >
    <SectionHeader>Operating Activities</SectionHeader>
    <LineItem label="Net Income" amount={netIncome} />
    <TotalLine label="Net Cash from Operating Activities" amount={netCashFromOps} />

    <SectionHeader>Investing Activities</SectionHeader>
    <LineItem label="Capital Expenditures" amount={0} />
    <TotalLine label="Net Cash from Investing Activities" amount={0} />

    <SectionHeader>Financing Activities</SectionHeader>
    <LineItem label="Owner Contributions" amount={ownerContributions} />
    <LineItem label="Owner Distributions" amount={0} />
    <TotalLine label="Net Cash from Financing Activities" amount={netCashFromFinancing} />

    <TotalLine label="Net Change in Cash" amount={netCashFromOps + netCashFromFinancing} isGrand />

    <SectionHeader>Reconciliation</SectionHeader>
    <LineItem label="Beginning Cash Balance (Jan 1, 2026)" amount={beginningCash} />
    <LineItem label="Net Change in Cash" amount={netCashFromOps + netCashFromFinancing} />
    <TotalLine label="Ending Cash Balance (Mar 31, 2026)" amount={endingCash} isGrand borderStyle="double" />
  </StatementShell>
);
