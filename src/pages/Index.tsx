import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare, Receipt, Presentation, TrendingUp, Scale, Banknote, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToExcel } from "@/lib/exportToExcel";
import { exportToPowerPoint } from "@/lib/exportToPowerPoint";
import { CompanyHeader } from "@/components/CompanyHeader";
import { DashboardSheet } from "@/components/sheets/DashboardSheet";
import { CheckingAccountSheet } from "@/components/sheets/CheckingAccountSheet";
import { TransfersSheet } from "@/components/sheets/TransfersSheet";
import { ESafetySheet } from "@/components/sheets/ESafetySheet";
import { VituSheet } from "@/components/sheets/VituSheet";
import { ChartOfAccountsSheet } from "@/components/sheets/ChartOfAccountsSheet";
import { ReconciliationSheet } from "@/components/sheets/ReconciliationSheet";
import { TitleRevenueSheet } from "@/components/sheets/TitleRevenueSheet";
import { ProfitLossSheet } from "@/components/sheets/ProfitLossSheet";
import { BalanceSheetSheet } from "@/components/sheets/BalanceSheetSheet";
import { CashFlowSheet } from "@/components/sheets/CashFlowSheet";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import mizanLogo from "@/assets/mizan-logo.png";
import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals,
  octoberSummary,
  novemberSummary,
  decemberSummary,
} from "@/data/bankTransactions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-info/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </div>
        <motion.div 
          className="flex flex-col items-center gap-4 z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
            <img src={mizanLogo} alt="Mizan" className="h-20 w-20 object-contain relative z-10" />
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-warning" />
            <p className="text-white/70 text-sm font-medium">Loading your workspace...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader />
      
      <motion.div 
        className="max-w-7xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Financial Workbook</h2>
            <p className="text-sm text-muted-foreground mt-0.5">12 sheets • Q4 2025 • CPA-Ready Format</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2.5 shadow-sm hover:shadow-md transition-shadow font-medium"
              onClick={exportToPowerPoint}
            >
              <Presentation className="h-4 w-4" />
              Export to PowerPoint
            </Button>
            <Button 
              variant="default" 
              className="gap-2.5 shadow-sm hover:shadow-md transition-shadow font-medium"
              onClick={exportToExcel}
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sheet Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-card rounded-xl border shadow-card p-1.5 mb-8">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
              <TabsTrigger 
                value="dashboard" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="october" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Oct 2025
              </TabsTrigger>
              <TabsTrigger 
                value="november" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Nov 2025
              </TabsTrigger>
              <TabsTrigger 
                value="december" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Dec 2025
              </TabsTrigger>
              <TabsTrigger 
                value="transfers" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Transfers
              </TabsTrigger>
              <TabsTrigger 
                value="esafety" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <Car className="h-4 w-4" />
                PA eSafety
              </TabsTrigger>
              <TabsTrigger 
                value="titlerevenue" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <Receipt className="h-4 w-4" />
                Title Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="vitu" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <FileText className="h-4 w-4" />
                Vitu Expenses
              </TabsTrigger>
              <TabsTrigger
                value="coa" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Chart of Accounts
              </TabsTrigger>
              <TabsTrigger 
                value="reconciliation" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <CheckSquare className="h-4 w-4" />
                Reconciliation
              </TabsTrigger>
              <TabsTrigger 
                value="profitloss" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <TrendingUp className="h-4 w-4" />
                P&L
              </TabsTrigger>
              <TabsTrigger 
                value="balancesheet" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <Scale className="h-4 w-4" />
                Balance Sheet
              </TabsTrigger>
              <TabsTrigger 
                value="cashflow" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <Banknote className="h-4 w-4" />
                Cash Flow
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="animate-fade-in">
            <TabsContent value="dashboard" className="m-0">
              <DashboardSheet />
            </TabsContent>
            
            <TabsContent value="october" className="m-0">
              <CheckingAccountSheet
                month="October"
                year="2025"
                deposits={octoberDeposits}
                withdrawals={octoberWithdrawals}
                beginningBalance={octoberSummary.beginningBalance}
                endingBalance={octoberSummary.endingBalance}
                statementBalance={octoberSummary.statementEndingBalance}
              />
            </TabsContent>
            
            <TabsContent value="november" className="m-0">
              <CheckingAccountSheet
                month="November"
                year="2025"
                deposits={novemberDeposits}
                withdrawals={novemberWithdrawals}
                beginningBalance={novemberSummary.beginningBalance}
                endingBalance={novemberSummary.endingBalance}
                statementBalance={novemberSummary.statementEndingBalance}
              />
            </TabsContent>
            
            <TabsContent value="december" className="m-0">
              <CheckingAccountSheet
                month="December"
                year="2025"
                deposits={decemberDeposits}
                withdrawals={decemberWithdrawals}
                beginningBalance={decemberSummary.beginningBalance}
                endingBalance={decemberSummary.endingBalance}
                statementBalance={decemberSummary.statementEndingBalance}
              />
            </TabsContent>
            
            <TabsContent value="transfers" className="m-0">
              <TransfersSheet />
            </TabsContent>
            
            <TabsContent value="esafety" className="m-0">
              <ESafetySheet />
            </TabsContent>
            
            <TabsContent value="titlerevenue" className="m-0">
              <TitleRevenueSheet />
            </TabsContent>
            
            <TabsContent value="vitu" className="m-0">
              <VituSheet />
            </TabsContent>
            
            <TabsContent value="coa" className="m-0">
              <ChartOfAccountsSheet />
            </TabsContent>
            
            <TabsContent value="reconciliation" className="m-0">
              <ReconciliationSheet />
            </TabsContent>
            
            <TabsContent value="profitloss" className="m-0">
              <ProfitLossSheet />
            </TabsContent>
            
            <TabsContent value="balancesheet" className="m-0">
              <BalanceSheetSheet />
            </TabsContent>
            
            <TabsContent value="cashflow" className="m-0">
              <CashFlowSheet />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Footer */}
      <footer className="border-t mt-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-foreground">CVS Auto Sales Inc.</p>
              <p className="text-xs text-muted-foreground mt-0.5">715 Huntingdon Pike, Rockledge, PA 19046</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                <CheckSquare className="h-3 w-3" />
                CPA Review Ready
              </span>
              <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                Q4 2025
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;