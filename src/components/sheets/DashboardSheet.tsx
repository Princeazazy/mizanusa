import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Car,
  CreditCard
} from "lucide-react";
import { 
  octoberDeposits, 
  octoberWithdrawals, 
  novemberDeposits, 
  novemberWithdrawals 
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
  const totalOctoberDeposits = octoberDeposits
    .filter(t => t.coaCode !== "9999")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOctoberWithdrawals = octoberWithdrawals
    .filter(t => t.coaCode !== "9999")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalNovemberDeposits = novemberDeposits
    .filter(t => t.coaCode !== "9999")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalNovemberWithdrawals = novemberWithdrawals
    .filter(t => t.coaCode !== "9999")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposits = totalOctoberDeposits + totalNovemberDeposits;
  const totalExpenses = totalOctoberWithdrawals + totalNovemberWithdrawals;
  const netChange = totalDeposits - totalExpenses;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Executive Summary</h2>
        <p className="text-muted-foreground">October - December 2025 Financial Overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bank Deposits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalDeposits)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Oct-Nov 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bank Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Oct-Nov 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PA eSafety Revenue
            </CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(inspectionsSummary.total.revenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {inspectionsSummary.total.count} inspections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vitu Title Services
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(vituSummary.quarterTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {vituSummary.totalDLDVLookups + vituSummary.totalNMVTISInquiries} lookups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              October 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Deposits</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(totalOctoberDeposits)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(totalOctoberWithdrawals)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Beginning Balance</span>
                <span className="font-medium">{formatCurrency(4311.94)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Ending Balance</span>
                <span className="font-bold">{formatCurrency(0.00)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              November 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Deposits</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(totalNovemberDeposits)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(totalNovemberWithdrawals)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Beginning Balance</span>
                <span className="font-medium">{formatCurrency(0.00)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Ending Balance</span>
                <span className="font-bold">{formatCurrency(10443.93)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PA eSafety Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            PA eSafety Salvage Inspections - Quarterly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">October</p>
              <p className="text-xl font-bold">{inspectionsSummary.october.count}</p>
              <p className="text-sm text-green-600">{formatCurrency(inspectionsSummary.october.revenue)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">November</p>
              <p className="text-xl font-bold">{inspectionsSummary.november.count}</p>
              <p className="text-sm text-green-600">{formatCurrency(inspectionsSummary.november.revenue)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">December</p>
              <p className="text-xl font-bold">{inspectionsSummary.december.count}</p>
              <p className="text-sm text-green-600">{formatCurrency(inspectionsSummary.december.revenue)}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Q4 Total</p>
              <p className="text-xl font-bold">{inspectionsSummary.total.count}</p>
              <p className="text-sm font-semibold text-green-600">{formatCurrency(inspectionsSummary.total.revenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vitu Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Vitu Title Services - Quarterly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">DLDV Lookups</p>
              <p className="text-xl font-bold">{vituSummary.totalDLDVLookups}</p>
              <p className="text-sm text-muted-foreground">@ $2.00 each</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">NMVTIS Inquiries</p>
              <p className="text-xl font-bold">{vituSummary.totalNMVTISInquiries}</p>
              <p className="text-sm text-muted-foreground">@ $2.00 each</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Q4 Total</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(vituSummary.quarterTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
