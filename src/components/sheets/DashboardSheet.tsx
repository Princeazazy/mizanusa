import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Car,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  octoberDeposits, 
  octoberWithdrawals, 
  novemberDeposits, 
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals 
} from "@/data/bankTransactions";
import { inspectionsSummary } from "@/data/esafetyInspections";
import { vituSummary } from "@/data/vituStatements";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const DashboardSheet = () => {
  // Include ALL deposits/withdrawals (including transfers) for accurate bank reconciliation
  const totalOctoberDeposits = octoberDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalOctoberWithdrawals = octoberWithdrawals.reduce((sum, t) => sum + t.amount, 0);
  
  const totalNovemberDeposits = novemberDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalNovemberWithdrawals = novemberWithdrawals.reduce((sum, t) => sum + t.amount, 0);

  const totalDecemberDeposits = decemberDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalDecemberWithdrawals = decemberWithdrawals.reduce((sum, t) => sum + t.amount, 0);

  const totalDeposits = totalOctoberDeposits + totalNovemberDeposits + totalDecemberDeposits;
  const totalExpenses = totalOctoberWithdrawals + totalNovemberWithdrawals + totalDecemberWithdrawals;
  const netChange = totalDeposits - totalExpenses;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Executive Summary</h2>
        <p className="text-muted-foreground mt-1">October - December 2025 Financial Overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="stat-card stat-card-income shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Total Deposits</span>
            <div className="p-2 bg-income-muted rounded-lg">
              <ArrowUpRight className="h-4 w-4 text-income" />
            </div>
          </div>
          <div className="text-2xl font-bold text-income tracking-tight">
            {formatCurrency(totalDeposits)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Q4 2025</p>
        </div>

        <div className="stat-card stat-card-expense shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
            <div className="p-2 bg-expense-muted rounded-lg">
              <ArrowDownRight className="h-4 w-4 text-expense" />
            </div>
          </div>
          <div className="text-2xl font-bold text-expense tracking-tight">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Q4 2025</p>
        </div>

        <div className="stat-card stat-card-info shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">PA eSafety Revenue</span>
            <div className="p-2 bg-info-muted rounded-lg">
              <Car className="h-4 w-4 text-info" />
            </div>
          </div>
          <div className="text-2xl font-bold text-info tracking-tight">
            {formatCurrency(inspectionsSummary.total.revenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {inspectionsSummary.total.count} inspections
          </p>
        </div>

        <div className="stat-card stat-card-warning shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Vitu Services</span>
            <div className="p-2 bg-warning-muted rounded-lg">
              <FileText className="h-4 w-4 text-warning" />
            </div>
          </div>
          <div className="text-2xl font-bold text-warning tracking-tight">
            {formatCurrency(vituSummary.quarterTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {vituSummary.totalDLDVLookups + vituSummary.totalNMVTISInquiries} lookups
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="bg-muted/40 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              October 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Total Deposits</span>
                <span className="font-semibold text-income">
                  {formatCurrency(totalOctoberDeposits)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-expense">
                  {formatCurrency(totalOctoberWithdrawals)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Beginning Balance</span>
                <span className="font-medium">{formatCurrency(4311.94)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-muted/30 -mx-6 px-6 rounded-lg">
                <span className="font-semibold">Ending Balance</span>
                <span className="font-bold text-lg">{formatCurrency(0.00)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="bg-muted/40 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              November 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Total Deposits</span>
                <span className="font-semibold text-income">
                  {formatCurrency(totalNovemberDeposits)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-expense">
                  {formatCurrency(totalNovemberWithdrawals)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Beginning Balance</span>
                <span className="font-medium">{formatCurrency(0.00)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-muted/30 -mx-6 px-6 rounded-lg">
                <span className="font-semibold">Ending Balance</span>
                <span className="font-bold text-lg">{formatCurrency(10443.93)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="bg-muted/40 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              December 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Total Deposits</span>
                <span className="font-semibold text-income">
                  {formatCurrency(totalDecemberDeposits)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-expense">
                  {formatCurrency(totalDecemberWithdrawals)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-muted-foreground">Beginning Balance</span>
                <span className="font-medium">{formatCurrency(10443.93)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-muted/30 -mx-6 px-6 rounded-lg">
                <span className="font-semibold">Ending Balance</span>
                <span className="font-bold text-lg">{formatCurrency(6434.50)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PA eSafety Breakdown */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 bg-info/10 rounded-lg">
              <Car className="h-4 w-4 text-info" />
            </div>
            PA eSafety Salvage Inspections — Quarterly Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">October</p>
              <p className="text-2xl font-bold mt-2">{inspectionsSummary.october.count}</p>
              <p className="text-sm text-income font-medium mt-1">{formatCurrency(inspectionsSummary.october.revenue)}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">November</p>
              <p className="text-2xl font-bold mt-2">{inspectionsSummary.november.count}</p>
              <p className="text-sm text-income font-medium mt-1">{formatCurrency(inspectionsSummary.november.revenue)}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">December</p>
              <p className="text-2xl font-bold mt-2">{inspectionsSummary.december.count}</p>
              <p className="text-sm text-income font-medium mt-1">{formatCurrency(inspectionsSummary.december.revenue)}</p>
            </div>
            <div className="bg-primary/5 rounded-xl p-5 text-center border-2 border-primary/20">
              <p className="text-sm text-muted-foreground font-medium">Q4 Total</p>
              <p className="text-2xl font-bold mt-2">{inspectionsSummary.total.count}</p>
              <p className="text-sm font-semibold text-income mt-1">{formatCurrency(inspectionsSummary.total.revenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vitu Summary */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 bg-warning/10 rounded-lg">
              <CreditCard className="h-4 w-4 text-warning" />
            </div>
            Vitu Title Services — Quarterly Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">DLDV Lookups</p>
              <p className="text-2xl font-bold mt-2">{vituSummary.totalDLDVLookups}</p>
              <p className="text-xs text-muted-foreground mt-1">@ $2.00 each</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">NMVTIS Inquiries</p>
              <p className="text-2xl font-bold mt-2">{vituSummary.totalNMVTISInquiries}</p>
              <p className="text-xs text-muted-foreground mt-1">@ $2.00 each</p>
            </div>
            <div className="bg-primary/5 rounded-xl p-5 text-center border-2 border-primary/20">
              <p className="text-sm text-muted-foreground font-medium">Q4 Total</p>
              <p className="text-2xl font-bold text-warning mt-2">{formatCurrency(vituSummary.quarterTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};