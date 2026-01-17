import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare, Receipt, Presentation, TrendingUp, Scale, Banknote, LogOut, Sparkles, ArrowLeft } from "lucide-react";
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
import { AIChatBubble } from "@/components/AIChatBubble";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import mizanLogo from "@/assets/mizan-logo-transparent.png";
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"
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
            <img
              src={mizanLogo}
              alt="Mizan"
              className="h-24 w-24 object-contain relative z-10 mix-blend-lighten logo-glow-pulse"
            />
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <p className="text-slate-400 text-sm font-medium">Loading your workspace...</p>
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/clients")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Financial Workbook</h2>
              <p className="text-sm text-muted-foreground mt-0.5">12 sheets • Q4 2025 • CPA-Ready Format</p>
            </div>
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
              
              {/* Q4 2025 Dropdown */}
              <div className="relative group">
                <TabsTrigger 
                  value="q4-2025" 
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
                  data-state={["october", "november", "december"].includes(activeTab) ? "active" : "inactive"}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!["october", "november", "december"].includes(activeTab)) {
                      setActiveTab("october");
                    }
                  }}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Q4 2025
                  <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </TabsTrigger>
                <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                  <button
                    onClick={() => setActiveTab("october")}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted rounded-t-lg transition-colors ${activeTab === "october" ? "bg-primary/10 text-primary font-medium" : ""}`}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    October 2025
                  </button>
                  <button
                    onClick={() => setActiveTab("november")}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${activeTab === "november" ? "bg-primary/10 text-primary font-medium" : ""}`}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    November 2025
                  </button>
                  <button
                    onClick={() => setActiveTab("december")}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted rounded-b-lg transition-colors ${activeTab === "december" ? "bg-primary/10 text-primary font-medium" : ""}`}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    December 2025
                  </button>
                </div>
              </div>
              
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

      {/* AI Chat Bubble */}
      <AIChatBubble clientId="cvs" clientName="CVS Auto Sales Inc." />
    </div>
  );
};

export default Index;