import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Car,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  PieChart,
  Activity
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
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPie, Pie, Cell } from 'recharts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatCompact = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const DashboardSheet = () => {
  const totalOctoberDeposits = octoberDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalOctoberWithdrawals = octoberWithdrawals.reduce((sum, t) => sum + t.amount, 0);
  
  const totalNovemberDeposits = novemberDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalNovemberWithdrawals = novemberWithdrawals.reduce((sum, t) => sum + t.amount, 0);

  const totalDecemberDeposits = decemberDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalDecemberWithdrawals = decemberWithdrawals.reduce((sum, t) => sum + t.amount, 0);

  const totalDeposits = totalOctoberDeposits + totalNovemberDeposits + totalDecemberDeposits;
  const totalExpenses = totalOctoberWithdrawals + totalNovemberWithdrawals + totalDecemberWithdrawals;
  const netChange = totalDeposits - totalExpenses;

  // Chart data
  const monthlyData = [
    { 
      month: 'Oct', 
      deposits: totalOctoberDeposits, 
      expenses: totalOctoberWithdrawals,
      balance: 0 
    },
    { 
      month: 'Nov', 
      deposits: totalNovemberDeposits, 
      expenses: totalNovemberWithdrawals,
      balance: 10443.93 
    },
    { 
      month: 'Dec', 
      deposits: totalDecemberDeposits, 
      expenses: totalDecemberWithdrawals,
      balance: 6434.50 
    },
  ];

  const pieData = [
    { name: 'Deposits', value: totalDeposits, color: 'hsl(152, 69%, 31%)' },
    { name: 'Expenses', value: totalExpenses, color: 'hsl(0, 72%, 51%)' },
  ];

  const expenseBreakdown = [
    { name: 'Operations', value: totalExpenses * 0.45, color: 'hsl(222, 47%, 18%)' },
    { name: 'Payroll', value: totalExpenses * 0.30, color: 'hsl(217, 91%, 60%)' },
    { name: 'Utilities', value: totalExpenses * 0.15, color: 'hsl(38, 92%, 50%)' },
    { name: 'Other', value: totalExpenses * 0.10, color: 'hsl(215, 20%, 65%)' },
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero Header */}
      <motion.div variants={item} className="glass-card relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-info/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="eyebrow text-primary/90">Q4 2025 Financial Overview</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tightest mb-3 text-foreground">Executive Summary</h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Complete financial analysis for October through December 2025. Track deposits, expenses, and monitor business performance in real-time.
          </p>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.08]">
              <p className="eyebrow mb-1.5">Net Change</p>
              <p className={`amount-large ${netChange >= 0 ? 'text-income' : 'text-expense'}`}>
                {netChange >= 0 ? '+' : ''}{formatCompact(netChange)}
              </p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.08]">
              <p className="eyebrow mb-1.5">Ending Balance</p>
              <p className="amount-large text-foreground">{formatCompact(6434.50)}</p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.08]">
              <p className="eyebrow mb-1.5">Inspections</p>
              <p className="amount-large text-foreground">{inspectionsSummary.total.count}</p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.08]">
              <p className="eyebrow mb-1.5">Total Lookups</p>
              <p className="amount-large text-foreground">{vituSummary.totalDLDVLookups + vituSummary.totalNMVTISInquiries}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="stat-card stat-card-income shadow-card card-shine group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Total Deposits</span>
            <div className="p-2.5 bg-income-muted rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ArrowUpRight className="h-5 w-5 text-income" />
            </div>
          </div>
          <div className="text-3xl font-bold text-income tracking-tight">
            {formatCurrency(totalDeposits)}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="h-1.5 flex-1 bg-income-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-income rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-muted-foreground">Q4</span>
          </div>
        </div>

        <div className="stat-card stat-card-expense shadow-card card-shine group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
            <div className="p-2.5 bg-expense-muted rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ArrowDownRight className="h-5 w-5 text-expense" />
            </div>
          </div>
          <div className="text-3xl font-bold text-expense tracking-tight">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="h-1.5 flex-1 bg-expense-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-expense rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(totalExpenses / totalDeposits) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </div>
            <span className="text-xs text-muted-foreground">vs deposits</span>
          </div>
        </div>

        <div className="stat-card stat-card-info shadow-card card-shine group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">PA eSafety Revenue</span>
            <div className="p-2.5 bg-info-muted rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Car className="h-5 w-5 text-info" />
            </div>
          </div>
          <div className="text-3xl font-bold text-info tracking-tight">
            {formatCurrency(inspectionsSummary.total.revenue)}
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {inspectionsSummary.total.count} inspections completed
          </p>
        </div>

        <div className="stat-card stat-card-warning shadow-card card-shine group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Vitu Services</span>
            <div className="p-2.5 bg-warning-muted rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="text-3xl font-bold text-warning tracking-tight">
            {formatCurrency(vituSummary.quarterTotal)}
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {vituSummary.totalDLDVLookups + vituSummary.totalNMVTISInquiries} total lookups
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart - Cash Flow Trend */}
        <Card className="shadow-card overflow-hidden hover-lift">
          <CardHeader className="bg-gradient-to-r from-muted/60 to-muted/30 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              Cash Flow Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 69%, 31%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(152, 69%, 31%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(215, 20%, 88%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area 
                  type="monotone" 
                  dataKey="deposits" 
                  stroke="hsl(152, 69%, 31%)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDeposits)" 
                  name="Deposits"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(0, 72%, 51%)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card className="shadow-card overflow-hidden hover-lift">
          <CardHeader className="bg-gradient-to-r from-muted/60 to-muted/30 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 bg-info/10 rounded-lg">
                <BarChart3 className="h-4 w-4 text-info" />
              </div>
              Monthly Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(215, 20%, 88%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="deposits" fill="hsl(152, 69%, 31%)" name="Deposits" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Breakdown Cards */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { month: 'October', deposits: totalOctoberDeposits, expenses: totalOctoberWithdrawals, beginning: 4311.94, ending: 0 },
          { month: 'November', deposits: totalNovemberDeposits, expenses: totalNovemberWithdrawals, beginning: 0, ending: 10443.93 },
          { month: 'December', deposits: totalDecemberDeposits, expenses: totalDecemberWithdrawals, beginning: 10443.93, ending: 6434.50 },
        ].map((data, index) => (
          <Card key={data.month} className="shadow-card overflow-hidden hover-lift card-shine">
            <CardHeader className="bg-gradient-to-r from-muted/60 to-muted/30 border-b">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                {data.month} 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-income" />
                    Deposits
                  </span>
                  <span className="font-semibold text-income">
                    {formatCurrency(data.deposits)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-expense" />
                    Expenses
                  </span>
                  <span className="font-semibold text-expense">
                    {formatCurrency(data.expenses)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                  <span className="text-muted-foreground">Beginning</span>
                  <span className="font-medium">{formatCurrency(data.beginning)}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-primary/5 to-primary/10 -mx-6 px-6 rounded-lg">
                  <span className="font-semibold">Ending Balance</span>
                  <span className="font-bold text-xl">{formatCurrency(data.ending)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* PA eSafety Breakdown */}
      <motion.div variants={item}>
        <Card className="shadow-card overflow-hidden hover-lift">
          <CardHeader className="bg-gradient-to-r from-info/5 to-info/10 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2.5 bg-info/10 rounded-xl">
                <Car className="h-5 w-5 text-info" />
              </div>
              PA eSafety Salvage Inspections — Quarterly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'October', count: inspectionsSummary.october.count, revenue: inspectionsSummary.october.revenue },
                { label: 'November', count: inspectionsSummary.november.count, revenue: inspectionsSummary.november.revenue },
                { label: 'December', count: inspectionsSummary.december.count, revenue: inspectionsSummary.december.revenue },
                { label: 'Q4 Total', count: inspectionsSummary.total.count, revenue: inspectionsSummary.total.revenue, isTotal: true },
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className={`rounded-xl p-5 text-center transition-all duration-300 hover:scale-105 ${
                    item.isTotal 
                      ? 'bg-gradient-to-br from-primary/10 to-info/10 border-2 border-primary/20' 
                      : 'bg-muted/40 border border-transparent hover:border-border hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-3xl font-bold mt-2">{item.count}</p>
                  <p className={`text-sm font-semibold mt-1 ${item.isTotal ? 'text-income' : 'text-income/80'}`}>
                    {formatCurrency(item.revenue)}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vitu Summary */}
      <motion.div variants={item}>
        <Card className="shadow-card overflow-hidden hover-lift">
          <CardHeader className="bg-gradient-to-r from-warning/5 to-warning/10 border-b">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2.5 bg-warning/10 rounded-xl">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
              Vitu Title Services — Quarterly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'DLDV Lookups', count: vituSummary.totalDLDVLookups, price: '@ $2.00 each' },
                { label: 'NMVTIS Inquiries', count: vituSummary.totalNMVTISInquiries, price: '@ $2.00 each' },
                { label: 'Q4 Total', amount: vituSummary.quarterTotal, isTotal: true },
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className={`rounded-xl p-5 text-center transition-all duration-300 hover:scale-105 ${
                    item.isTotal 
                      ? 'bg-gradient-to-br from-primary/10 to-warning/10 border-2 border-primary/20' 
                      : 'bg-muted/40 border border-transparent hover:border-border hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                  {item.isTotal ? (
                    <p className="text-3xl font-bold text-warning mt-2">{formatCurrency(item.amount!)}</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold mt-2">{item.count}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.price}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
