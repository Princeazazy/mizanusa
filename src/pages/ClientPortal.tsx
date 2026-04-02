import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare, Receipt, Presentation, TrendingUp, Scale, Banknote, Sparkles, LogOut, Eye, Printer, CreditCard, ArrowDownUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToExcel } from "@/lib/exportToExcel";
import { exportToPowerPoint } from "@/lib/exportToPowerPoint";
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
import { InvoicesSheet } from "@/components/sheets/InvoicesSheet";
import { CreditCardStatementSheet } from "@/components/sheets/CreditCardStatementSheet";
import { useClientAuth } from "@/hooks/useClientAuth";
import { useToast } from "@/hooks/use-toast";
import mizanLogo from "@/assets/mizan-logo-new.png";
import cvsLogo from "@/assets/cvs-logo.png";
import defioreLogo from "@/assets/defiore-logo.png";
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
import {
  januaryDeposits,
  januaryWithdrawals,
  januarySummary,
  februaryDeposits,
  februaryWithdrawals,
  februarySummary,
} from "@/data/defioreBankTransactions";
import { defioreInvoices } from "@/data/defioreInvoices";
import { januaryCreditCards, februaryCreditCards, marchCreditCards } from "@/data/defioreCreditCardTransactions";

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [q4Open, setQ4Open] = useState(false);
  const q4Ref = useRef<HTMLDivElement | null>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const { session, loading, logout, clientName, clientId } = useClientAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const normalizedClientId = (clientId || "").toLowerCase().trim();
  const normalizedClientName = (clientName || "").toLowerCase().trim();

  const isDefiore =
    normalizedClientId === "defiore" ||
    normalizedClientName.includes("defiore");

  const isCVS =
    normalizedClientId === "cvs-auto-sales" ||
    normalizedClientName.includes("cvs auto sales");

  // Set default tab based on client
  useEffect(() => {
    if (!loading && session) {
      if (isDefiore) {
        setActiveTab("january");
      } else {
        setActiveTab("dashboard");
      }
    }
  }, [loading, session, isDefiore]);

  const getTabLabel = (tab: string) => {
    const labels: Record<string, string> = {
      dashboard: "Dashboard",
      october: "October 2025 - Checking Account",
      november: "November 2025 - Checking Account",
      december: "December 2025 - Checking Account",
      january: "January 2026 - Checking Account",
      february: "February 2026 - Checking Account",
      "cc-january": "Credit Cards – January 2026",
      "cc-february": "Credit Cards – February 2026",
      "cc-march": "Credit Cards – March 2026",
      invoices: "Invoices",
      transfers: "Transfers",
      esafety: "PA eSafety",
      titlerevenue: "Title Revenue",
      vitu: "Vitu Expenses",
      coa: "Chart of Accounts",
      reconciliation: "Reconciliation",
      profitloss: "Profit & Loss",
      balancesheet: "Balance Sheet",
      cashflow: "Cash Flow Statement",
    };
    return labels[tab] || tab;
  };

  // Guardrail: never allow cross-client tab leakage
  useEffect(() => {
    if (loading || !session) return;

    const allowedTabs = isDefiore
      ? new Set(["january", "february", "cc-january", "cc-february", "cc-march", "invoices"])
      : isCVS
        ? new Set([
            "dashboard",
            "october",
            "november",
            "december",
            "transfers",
            "esafety",
            "titlerevenue",
            "vitu",
            "coa",
            "reconciliation",
            "profitloss",
            "balancesheet",
            "cashflow",
          ])
        : new Set<string>();

    if (!allowedTabs.has(activeTab)) {
      setActiveTab(isDefiore ? "january" : isCVS ? "dashboard" : "");
    }
  }, [activeTab, loading, session, isDefiore, isCVS]);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print blocked",
        description: "Please allow popups to print.",
        variant: "destructive",
      });
      return;
    }

    const activeClientLogo = isDefiore ? defioreLogo : cvsLogo;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${getTabLabel(activeTab)} - ${clientName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #1a1a1a; }
            .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #0891b2; }
            .header h1 { font-size: 24px; color: #0891b2; margin-bottom: 4px; }
            .header p { font-size: 14px; color: #666; }
            .header-logos { display: flex; justify-content: center; align-items: center; gap: 24px; margin-bottom: 16px; }
            .header-logos img { height: 60px; object-fit: contain; }
            .header-logos .mizan-logo { height: 60px; object-fit: contain; }
            .header-logos .divider { font-size: 20px; color: #ccc; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 12px; }
            th { background: #f5f5f5; font-weight: 600; }
            tr:nth-child(even) { background: #fafafa; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 12px 0; }
            h2, h3, h4 { margin: 16px 0 8px; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-logos">
              <img src="${window.location.origin}/mizan-logo-brand.png" alt="Mizan USA" class="mizan-logo" />
              <span class="divider">×</span>
              <img src="${activeClientLogo}" alt="${clientName}" />
            </div>
            <h1>${getTabLabel(activeTab)}</h1>
            <p>${clientName}</p>
            <p style="margin-top: 4px; font-size: 12px; color: #888;">Printed on ${new Date().toLocaleDateString()}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    const images = Array.from(printWindow.document.images);
    Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
      )
    ).finally(() => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 150);
    });
  };

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
    if (!loading && !session) {
      navigate("/auth");
    }
  }, [session, loading, navigate]);

  const handleSignOut = async () => {
    await logout();
    toast({
      title: "Signed out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center futuristic-bg relative overflow-hidden">
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
            <p className="text-muted-foreground text-sm font-medium">Loading your portal...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Light beams */}
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />
      
      {/* Main content - no sidebar for client portal */}
      <div className="px-4 md:px-8">
        <motion.div 
          className="max-w-[1600px] mx-auto py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img
                src={isDefiore ? defioreLogo : cvsLogo}
                alt={clientName || "Client"}
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome, <span className="text-primary glow-text-cyan">{clientName}</span>
                </h1>
                <p className="text-sm text-muted-foreground">Client Portal - View Only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30">
                <Eye className="h-4 w-4 text-warning" />
                <span className="text-xs font-medium text-warning">View Only Mode</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="gap-2 glass-card border-border/50 hover:border-destructive/50 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Action buttons - only exports */}
          <div className="flex items-center gap-3 mb-8">
            <Button 
              variant="outline" 
              className="gap-2 glass-card border-border/50 hover:border-primary/50 hover:bg-accent/50"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print {getTabLabel(isDefiore && activeTab === "reconciliation" ? "january" : activeTab)}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 glass-card border-border/50 hover:border-primary/50 hover:bg-accent/50"
              onClick={() => exportToPowerPoint({ clientName: clientName || 'Client', clientLogoPath: isDefiore ? '/defiore-logo.png' : '/cvs-logo.png', fileName: `${clientName}_Financial_Report.pptx` })}
            >
              <Presentation className="h-4 w-4" />
              Export to PowerPoint
            </Button>
            <Button 
              className="gap-2 btn-glow"
              onClick={() => exportToExcel({ clientName: clientName || 'Client', fileName: `${clientName}_Bookkeeping.xlsx` })}
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Sheet Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="glass-card p-1.5 mb-8">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
                {isCVS && (
                  <TabsTrigger 
                    value="dashboard" 
                    className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                )}
                
                {/* Q4 2025 Dropdown - CVS only */}
                {isCVS && (
                  <div className="relative" ref={q4Ref}>
                    <TabsTrigger 
                      value="q4-2025" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                      data-state={["october", "november", "december"].includes(activeTab) ? "active" : "inactive"}
                      onClick={(e) => {
                        e.preventDefault();
                        setQ4Open((prev) => !prev);
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
                          onClick={() => { setActiveTab("october"); setQ4Open(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === "october" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          October 2025
                        </button>
                        <button
                          onClick={() => { setActiveTab("november"); setQ4Open(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === "november" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          November 2025
                        </button>
                        <button
                          onClick={() => { setActiveTab("december"); setQ4Open(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === "december" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          December 2025
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Defiore: January & February 2026 tabs */}
                {isDefiore && (
                  <>
                    <TabsTrigger 
                      value="january" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      January 2026
                    </TabsTrigger>
                    <TabsTrigger 
                      value="february" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      February 2026
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cc-january" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <CreditCard className="h-4 w-4" />
                      CC Jan 2026
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cc-february" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <CreditCard className="h-4 w-4" />
                      CC Feb 2026
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cc-march" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <CreditCard className="h-4 w-4" />
                      CC Mar 2026
                    </TabsTrigger>
                    <TabsTrigger 
                      value="invoices" 
                      className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <Receipt className="h-4 w-4" />
                      Invoices
                    </TabsTrigger>
                  </>
                )}
                
                {isCVS && (
                  <>
                    <TabsTrigger value="transfers" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <ArrowLeftRight className="h-4 w-4" />
                      Transfers
                    </TabsTrigger>
                    <TabsTrigger value="esafety" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Car className="h-4 w-4" />
                      PA eSafety
                    </TabsTrigger>
                    <TabsTrigger value="titlerevenue" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Receipt className="h-4 w-4" />
                      Title Revenue
                    </TabsTrigger>
                    <TabsTrigger value="vitu" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileText className="h-4 w-4" />
                      Vitu Expenses
                    </TabsTrigger>
                    <TabsTrigger value="coa" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <BookOpen className="h-4 w-4" />
                      Chart of Accounts
                    </TabsTrigger>
                  </>
                )}

                {isCVS && (
                  <TabsTrigger value="reconciliation" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <CheckSquare className="h-4 w-4" />
                    Reconciliation
                  </TabsTrigger>
                )}

                {isCVS && (
                  <>
                    <TabsTrigger value="profitloss" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <TrendingUp className="h-4 w-4" />
                      P&L
                    </TabsTrigger>
                    <TabsTrigger value="balancesheet" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Scale className="h-4 w-4" />
                      Balance Sheet
                    </TabsTrigger>
                    <TabsTrigger value="cashflow" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Banknote className="h-4 w-4" />
                      Cash Flow
                    </TabsTrigger>
                  </>
                )}
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
                <div ref={printRef}>
                  {isCVS && (
                    <>
                      <TabsContent value="dashboard" className="m-0">
                        <FuturisticDashboardSheet viewOnly={true} />
                      </TabsContent>
                      <TabsContent value="october" className="m-0">
                        <CheckingAccountSheet month="October" year="2025" deposits={octoberDeposits} withdrawals={octoberWithdrawals} beginningBalance={octoberSummary.beginningBalance} endingBalance={octoberSummary.endingBalance} statementBalance={octoberSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="november" className="m-0">
                        <CheckingAccountSheet month="November" year="2025" deposits={novemberDeposits} withdrawals={novemberWithdrawals} beginningBalance={novemberSummary.beginningBalance} endingBalance={novemberSummary.endingBalance} statementBalance={novemberSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="december" className="m-0">
                        <CheckingAccountSheet month="December" year="2025" deposits={decemberDeposits} withdrawals={decemberWithdrawals} beginningBalance={decemberSummary.beginningBalance} endingBalance={decemberSummary.endingBalance} statementBalance={decemberSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="transfers" className="m-0"><TransfersSheet /></TabsContent>
                      <TabsContent value="esafety" className="m-0"><ESafetySheet /></TabsContent>
                      <TabsContent value="titlerevenue" className="m-0"><TitleRevenueSheet /></TabsContent>
                      <TabsContent value="vitu" className="m-0"><VituSheet /></TabsContent>
                      <TabsContent value="coa" className="m-0"><ChartOfAccountsSheet /></TabsContent>
                      <TabsContent value="profitloss" className="m-0"><ProfitLossSheet /></TabsContent>
                      <TabsContent value="balancesheet" className="m-0"><BalanceSheetSheet /></TabsContent>
                      <TabsContent value="cashflow" className="m-0"><CashFlowSheet /></TabsContent>
                    </>
                  )}

                  {isDefiore && (
                    <>
                      <TabsContent value="january" className="m-0">
                        <CheckingAccountSheet month="January" year="2026" deposits={januaryDeposits} withdrawals={januaryWithdrawals} beginningBalance={januarySummary.beginningBalance} endingBalance={januarySummary.endingBalance} statementBalance={januarySummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="february" className="m-0">
                        <CheckingAccountSheet month="February" year="2026" deposits={februaryDeposits} withdrawals={februaryWithdrawals} beginningBalance={februarySummary.beginningBalance} endingBalance={februarySummary.endingBalance} statementBalance={februarySummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="cc-january" className="m-0">
                        <CreditCardStatementSheet statements={januaryCreditCards} month="January" year="2026" />
                      </TabsContent>
                      <TabsContent value="cc-february" className="m-0">
                        <CreditCardStatementSheet statements={februaryCreditCards} month="February" year="2026" />
                      </TabsContent>
                      <TabsContent value="cc-march" className="m-0">
                        <CreditCardStatementSheet statements={marchCreditCards} month="March" year="2026" />
                      </TabsContent>
                      <TabsContent value="invoices" className="m-0">
                        <InvoicesSheet invoices={defioreInvoices} title="Defiore Carpentry LLC – Invoices" />
                      </TabsContent>
                    </>
                  )}

                  {isCVS && (
                    <TabsContent value="reconciliation" className="m-0">
                      <ReconciliationSheet />
                    </TabsContent>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-border/30 mt-16">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-foreground">{clientName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isCVS ? "715 Huntingdon Pike, Rockledge, PA 19046" : "Client Portal"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="badge-status badge-on-track">
                  <CheckSquare className="h-3 w-3" />
                  Accountant Ready
                </span>
                <span className="badge-status bg-accent text-muted-foreground border-border">
                  {isDefiore ? "Jan 2026" : "Q4 2025"}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* NO AI Chat Bubble for client portal */}
    </div>
  );
};

export default ClientPortal;
