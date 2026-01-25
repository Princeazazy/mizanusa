import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare, Receipt, Presentation, TrendingUp, Scale, Banknote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToExcel } from "@/lib/exportToExcel";
import { exportToPowerPoint } from "@/lib/exportToPowerPoint";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import { FuturisticDashboardSheet } from "@/components/sheets/FuturisticDashboardSheet";
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
import mizanLogo from "@/assets/mizan-logo-brand.png";
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
  const [q4Open, setQ4Open] = useState(false);
  const q4Ref = useRef<HTMLDivElement | null>(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!q4Open) return;
    const onDocClick = (e: MouseEvent) => {
      const el = q4Ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setQ4Open(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [q4Open]);

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
      <div className="min-h-screen flex items-center justify-center futuristic-bg relative overflow-hidden">
        {/* Light beams */}
        <div className="light-beam light-beam-left" />
        <div className="light-beam light-beam-right" />
        
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
              className="h-32 w-32 object-contain relative z-10 mix-blend-lighten logo-glow-pulse"
            />
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-muted-foreground text-sm font-medium">Loading your workspace...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Light beams */}
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />
      
      {/* Sidebar */}
      <FuturisticSidebar onSignOut={handleSignOut} onTabChange={setActiveTab} />
      
      {/* Main content */}
      <div className="ml-40">
        <motion.div 
          className="max-w-[1600px] mx-auto px-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <FuturisticHeader
            title="Hi there!"
            subtitle="Here's Your Financial Workbook for"
            clientName="CVS Auto Sales Inc."
          />

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-8">
            <Button 
              variant="outline" 
              className="gap-2 glass-card border-border/50 hover:border-primary/50 hover:bg-accent/50"
              onClick={exportToPowerPoint}
            >
              <Presentation className="h-4 w-4" />
              Export to PowerPoint
            </Button>
            <Button 
              className="gap-2 btn-glow"
              onClick={exportToExcel}
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Sheet Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="glass-card p-1.5 mb-8">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
                <TabsTrigger 
                  value="dashboard" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                
                {/* Q4 2025 Dropdown */}
                <div className="relative" ref={q4Ref}>
                  <TabsTrigger 
                    value="q4-2025" 
                    className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    data-state={["october", "november", "december"].includes(activeTab) ? "active" : "inactive"}
                    onClick={(e) => {
                      e.preventDefault();
                      setQ4Open((v) => !v);
                      if (!["october", "november", "december"].includes(activeTab)) setActiveTab("october");
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Q4 2025
                    <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </TabsTrigger>
                  {q4Open && (
                    <div className="absolute top-full left-0 mt-1 glass-card z-50 min-w-[160px] p-1">
                      <button
                        onClick={() => {
                          setActiveTab("october");
                          setQ4Open(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === "october" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        October 2025
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("november");
                          setQ4Open(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === "november" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        November 2025
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("december");
                          setQ4Open(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === "december" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        December 2025
                      </button>
                    </div>
                  )}
                </div>
                
                <TabsTrigger 
                  value="transfers" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Transfers
                </TabsTrigger>
                <TabsTrigger 
                  value="esafety" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Car className="h-4 w-4" />
                  PA eSafety
                </TabsTrigger>
                <TabsTrigger 
                  value="titlerevenue" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Receipt className="h-4 w-4" />
                  Title Revenue
                </TabsTrigger>
                <TabsTrigger 
                  value="vitu" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <FileText className="h-4 w-4" />
                  Vitu Expenses
                </TabsTrigger>
                <TabsTrigger
                  value="coa" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <BookOpen className="h-4 w-4" />
                  Chart of Accounts
                </TabsTrigger>
                <TabsTrigger 
                  value="reconciliation" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <CheckSquare className="h-4 w-4" />
                  Reconciliation
                </TabsTrigger>
                <TabsTrigger 
                  value="profitloss" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <TrendingUp className="h-4 w-4" />
                  P&L
                </TabsTrigger>
                <TabsTrigger 
                  value="balancesheet" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Scale className="h-4 w-4" />
                  Balance Sheet
                </TabsTrigger>
                <TabsTrigger 
                  value="cashflow" 
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Banknote className="h-4 w-4" />
                  Cash Flow
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="dashboard" className="m-0">
                  <FuturisticDashboardSheet />
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
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-border/30 mt-16">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-foreground">CVS Auto Sales Inc.</p>
                <p className="text-xs text-muted-foreground mt-0.5">715 Huntingdon Pike, Rockledge, PA 19046</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="badge-status badge-on-track">
                  <CheckSquare className="h-3 w-3" />
                  CPA Review Ready
                </span>
                <span className="badge-status bg-accent text-muted-foreground border-border">
                  Q4 2025
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Chat Bubble */}
      <AIChatBubble clientId="cvs" clientName="CVS Auto Sales Inc." />
    </div>
  );
};

export default Index;
