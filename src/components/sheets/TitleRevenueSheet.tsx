import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Building2, 
  User, 
  Search,
  TrendingUp,
  DollarSign
} from "lucide-react";
import {
  titleTransactions,
  getTitleTransactionsByMonth,
  getTitleTransactionSummary,
  getDealerSummary,
  getTopCustomers,
  TitleTransaction,
} from "@/data/titleRevenueTransactions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

interface TransactionTableProps {
  transactions: TitleTransaction[];
  title: string;
}

const TransactionTable = ({ transactions, title }: TransactionTableProps) => {
  const [search, setSearch] = useState("");
  
  const filtered = transactions.filter(t =>
    t.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    t.wid.includes(search) ||
    t.record.includes(search)
  );
  
  const total = filtered.reduce((sum, t) => sum + t.amount + t.adjusts, 0);
  const dealerCount = filtered.filter(t => t.isDealer).length;
  const retailCount = filtered.filter(t => !t.isDealer).length;

  return (
    <Card className="shadow-card overflow-hidden">
      <CardHeader className="bg-muted/40 border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            {title}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, WID, or record..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="gap-1">
                <Building2 className="h-3 w-3" />
                {dealerCount} Dealers
              </Badge>
              <Badge variant="outline" className="gap-1">
                <User className="h-3 w-3" />
                {retailCount} Retail
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="table-header-row">
                <TableHead className="w-28 font-semibold">Deposit Date</TableHead>
                <TableHead className="w-28 font-semibold">Process Date</TableHead>
                <TableHead className="w-20 font-semibold">Record</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="w-20 font-semibold">Type</TableHead>
                <TableHead className="text-right w-28 font-semibold">Amount</TableHead>
                <TableHead className="text-right w-24 font-semibold">Adjusts</TableHead>
                <TableHead className="text-right w-24 font-semibold">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm text-muted-foreground">{t.depositDate}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{t.processDate}</TableCell>
                  <TableCell className="font-mono text-sm">{t.record}</TableCell>
                  <TableCell className="font-medium">{t.ownerName}</TableCell>
                  <TableCell>
                    <Badge 
                      className={t.isDealer 
                        ? "bg-info-muted text-info border-info/30 text-xs" 
                        : "bg-muted text-muted-foreground border-border text-xs"
                      }
                    >
                      {t.isDealer ? "Dealer" : "Retail"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${t.adjusts < 0 ? "text-expense" : ""}`}>
                    {t.adjusts !== 0 ? formatCurrency(t.adjusts) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-income">
                    {formatCurrency(t.amount + t.adjusts)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-income-muted/40 font-bold border-t-2 border-income/20 sticky bottom-0">
                <TableCell colSpan={5} className="text-income">
                  Total ({filtered.length} transactions)
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(filtered.reduce((s, t) => s + t.amount, 0))}
                </TableCell>
                <TableCell className="text-right font-mono text-expense">
                  {formatCurrency(filtered.reduce((s, t) => s + t.adjusts, 0))}
                </TableCell>
                <TableCell className="text-right font-mono text-income text-base">
                  {formatCurrency(total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const TitleRevenueSheet = () => {
  const summary = getTitleTransactionSummary();
  const dealerSummary = getDealerSummary();
  const topCustomers = getTopCustomers(15);
  
  const octoberTxns = getTitleTransactionsByMonth('october');
  const novemberTxns = getTitleTransactionsByMonth('november');
  const decemberTxns = getTitleTransactionsByMonth('december');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Title Services Revenue</h2>
        <p className="text-muted-foreground mt-1">Q4 2025 — Vitu Title & Registration Processing</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="stat-card stat-card-income shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Q4 Total Revenue</span>
            <div className="p-2 bg-income-muted rounded-lg">
              <TrendingUp className="h-4 w-4 text-income" />
            </div>
          </div>
          <div className="text-2xl font-bold text-income tracking-tight">
            {formatCurrency(summary.total.total)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {summary.total.count} transactions
          </p>
        </div>

        <div className="stat-card stat-card-info shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Dealer Services</span>
            <div className="p-2 bg-info-muted rounded-lg">
              <Building2 className="h-4 w-4 text-info" />
            </div>
          </div>
          <div className="text-2xl font-bold text-info tracking-tight">
            {formatCurrency(summary.total.dealerTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {summary.total.dealerCount} dealer transactions
          </p>
        </div>

        <div className="stat-card stat-card-warning shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Retail Customers</span>
            <div className="p-2 bg-warning-muted rounded-lg">
              <User className="h-4 w-4 text-warning" />
            </div>
          </div>
          <div className="text-2xl font-bold text-warning tracking-tight">
            {formatCurrency(summary.total.retailTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {summary.total.retailCount} retail transactions
          </p>
        </div>

        <div className="stat-card stat-card-expense shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Adjustments</span>
            <div className="p-2 bg-expense-muted rounded-lg">
              <DollarSign className="h-4 w-4 text-expense" />
            </div>
          </div>
          <div className="text-2xl font-bold text-expense tracking-tight">
            {formatCurrency(summary.total.adjustments)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Refunds & corrections
          </p>
        </div>
      </div>

      {/* Monthly Summary */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 bg-income/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-income" />
            </div>
            Quarterly Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">October</p>
              <p className="text-2xl font-bold mt-2">{summary.october.count}</p>
              <p className="text-sm text-income font-medium mt-1">{formatCurrency(summary.october.total)}</p>
              <div className="flex justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{summary.october.dealerCount} dealers</span>
                <span>•</span>
                <span>{summary.october.retailCount} retail</span>
              </div>
            </div>
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">November</p>
              <p className="text-2xl font-bold mt-2">{summary.november.count}</p>
              <p className="text-sm text-income font-medium mt-1">{formatCurrency(summary.november.total)}</p>
              <div className="flex justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{summary.november.dealerCount} dealers</span>
                <span>•</span>
                <span>{summary.november.retailCount} retail</span>
              </div>
            </div>
            <div className="bg-muted/40 rounded-xl p-5 text-center border border-transparent hover:border-border transition-colors">
              <p className="text-sm text-muted-foreground font-medium">December</p>
              <p className="text-2xl font-bold mt-2">{summary.december.count}</p>
              <p className="text-sm text-income font-medium mt-1">{formatCurrency(summary.december.total)}</p>
              <div className="flex justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{summary.december.dealerCount} dealers</span>
                <span>•</span>
                <span>{summary.december.retailCount} retail</span>
              </div>
            </div>
            <div className="bg-primary/5 rounded-xl p-5 text-center border-2 border-primary/20">
              <p className="text-sm text-muted-foreground font-medium">Q4 Total</p>
              <p className="text-2xl font-bold mt-2">{summary.total.count}</p>
              <p className="text-sm font-semibold text-income mt-1">{formatCurrency(summary.total.total)}</p>
              <div className="flex justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{summary.total.dealerCount} dealers</span>
                <span>•</span>
                <span>{summary.total.retailCount} retail</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dealer Summary */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 bg-info/10 rounded-lg">
              <Building2 className="h-4 w-4 text-info" />
            </div>
            Dealer Customer Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="table-header-row">
                <TableHead className="font-semibold">Dealer Name</TableHead>
                <TableHead className="text-center font-semibold">Transactions</TableHead>
                <TableHead className="text-right font-semibold">Total Revenue</TableHead>
                <TableHead className="text-right font-semibold">Avg per Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealerSummary.map((dealer, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{dealer.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{dealer.count}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-income">
                    {formatCurrency(dealer.total)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(dealer.total / dealer.count)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 bg-warning/10 rounded-lg">
              <User className="h-4 w-4 text-warning" />
            </div>
            Top 15 Customers by Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="table-header-row">
                <TableHead className="w-12 font-semibold">#</TableHead>
                <TableHead className="font-semibold">Customer Name</TableHead>
                <TableHead className="text-center font-semibold">Type</TableHead>
                <TableHead className="text-center font-semibold">Transactions</TableHead>
                <TableHead className="text-right font-semibold">Total Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={customer.isDealer 
                        ? "bg-info-muted text-info border-info/30 text-xs" 
                        : "bg-muted text-muted-foreground border-border text-xs"
                      }
                    >
                      {customer.isDealer ? "Dealer" : "Retail"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{customer.count}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-income">
                    {formatCurrency(customer.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Transaction Details */}
      <Tabs defaultValue="october" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="october">October ({octoberTxns.length})</TabsTrigger>
          <TabsTrigger value="november">November ({novemberTxns.length})</TabsTrigger>
          <TabsTrigger value="december">December ({decemberTxns.length})</TabsTrigger>
          <TabsTrigger value="all">All Q4 ({titleTransactions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="october">
          <TransactionTable transactions={octoberTxns} title="October 2025 Transactions" />
        </TabsContent>
        
        <TabsContent value="november">
          <TransactionTable transactions={novemberTxns} title="November 2025 Transactions" />
        </TabsContent>
        
        <TabsContent value="december">
          <TransactionTable transactions={decemberTxns} title="December 2025 Transactions" />
        </TabsContent>
        
        <TabsContent value="all">
          <TransactionTable transactions={titleTransactions} title="All Q4 2025 Transactions" />
        </TabsContent>
      </Tabs>

      {/* COA Reference */}
      <Card className="shadow-card border-l-4 border-l-info">
        <CardContent className="py-4">
          <p className="text-sm">
            <span className="font-semibold">Chart of Accounts Reference:</span>{" "}
            Title Services Revenue recorded under COA <Badge variant="outline" className="font-mono mx-1">4300</Badge> — Title & Registration Services Revenue
          </p>
        </CardContent>
      </Card>
    </div>
  );
};