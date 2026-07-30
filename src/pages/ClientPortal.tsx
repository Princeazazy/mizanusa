import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare, Receipt, Presentation, TrendingUp, Scale, Banknote, Sparkles, LogOut, Eye, Printer, CreditCard, ArrowDownUp, FileDown } from "lucide-react";
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
import { DefioreProfitLossSheet } from "@/components/sheets/DefioreProfitLossSheet";
import { DefioreBalanceSheet } from "@/components/sheets/DefioreBalanceSheet";
import { DefioreCashFlowSheet } from "@/components/sheets/DefioreCashFlowSheet";
import { TestProfitLossSheet, TestBalanceSheet, TestCashFlowSheet } from "@/components/sheets/TestFinancialSheets";
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
  marchDeposits,
  marchWithdrawals,
  marchSummary,
} from "@/data/defioreBankTransactions";
import { defioreInvoices } from "@/data/defioreInvoices";
import { januaryCreditCards, februaryCreditCards, marchCreditCards } from "@/data/defioreCreditCardTransactions";
import {
  TEST_BUSINESS_NAME,
  testJanDeposits, testJanWithdrawals, testJanSummary,
  testFebDeposits, testFebWithdrawals, testFebSummary,
  testMarDeposits, testMarWithdrawals, testMarSummary,
  testInvoices,
} from "@/data/testMockData";

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

  const isTest =
    normalizedClientId === "test" ||
    normalizedClientName.includes("acme demo");

  // Set default tab based on client
  useEffect(() => {
    if (!loading && session) {
      if (isDefiore || isTest) {
        setActiveTab("january");
      } else {
        setActiveTab("dashboard");
      }
    }
  }, [loading, session, isDefiore, isTest]);

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
      march: "March 2026 - Checking Account",
      invoices: "Invoices",
      pnl: "Profit & Loss – Q1 2026",
      "balance-sheet": "Balance Sheet – Q1 2026",
      "cash-flow": "Cash Flow – Q1 2026",
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
      ? new Set(["january", "february", "march", "cc-january", "cc-february", "cc-march", "invoices", "pnl", "balance-sheet", "cash-flow"])
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
        : isTest
          ? new Set(["january", "february", "march", "invoices", "pnl", "balance-sheet", "cash-flow"])
          : new Set<string>();

    if (!allowedTabs.has(activeTab)) {
      setActiveTab(isDefiore || isTest ? "january" : isCVS ? "dashboard" : "");
    }
  }, [activeTab, loading, session, isDefiore, isCVS, isTest]);

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
    const printMizanLogo = `${window.location.origin}/mizan-logo-brand-cropped.png`;
    const rootStyles = getComputedStyle(document.documentElement);
    const printTheme = {
      background: rootStyles.getPropertyValue("--background").trim() || "0 0% 100%",
      foreground: rootStyles.getPropertyValue("--foreground").trim() || "222.2 84% 4.9%",
      muted: rootStyles.getPropertyValue("--muted").trim() || "210 40% 96.1%",
      mutedForeground: rootStyles.getPropertyValue("--muted-foreground").trim() || "215.4 16.3% 46.9%",
      border: rootStyles.getPropertyValue("--border").trim() || "214.3 31.8% 91.4%",
      primary: rootStyles.getPropertyValue("--primary").trim() || "187 92% 38%",
      card: rootStyles.getPropertyValue("--card").trim() || "0 0% 100%",
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${getTabLabel(activeTab)} - ${clientName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 32px 36px; color: #1a1a2e; background: #ffffff; }
            .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #0d9488; }
            .header h1 { font-size: 22px; color: #0d9488; margin-bottom: 4px; font-weight: 700; letter-spacing: 0.5px; }
            .header p { font-size: 13px; color: #475569; }
            .header-logos {
              display: grid;
              grid-template-columns: minmax(0, 1fr) 72px minmax(0, 1fr);
              align-items: center;
              width: min(100%, 760px);
              margin: 0 auto 24px;
            }
            .logo-slot {
              display: flex;
              align-items: center;
              min-width: 0;
            }
            .logo-slot--left {
              justify-content: flex-end;
              padding-right: 10px;
            }
            .logo-slot--right {
              justify-content: flex-start;
              padding-left: 10px;
            }
            .logo-slot img {
              display: block;
              width: auto;
              max-width: min(100%, 300px);
              object-fit: contain;
              object-position: center;
            }
            .logo-slot .mizan-logo {
              max-width: 320px;
              height: 136px;
            }
            .logo-slot .client-logo {
              max-width: 240px;
              height: 112px;
            }
            .divider {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 72px;
              height: 136px;
              font-size: 38px;
              font-weight: 300;
              line-height: 1;
              color: #0d9488;
              transform: translateY(-2px);
            }
            table { width: 100%; border-collapse: collapse; margin: 12px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 12px; color: #1e293b; }
            th { background: linear-gradient(135deg, #0d9488, #14b8a6); color: #ffffff; font-weight: 600; letter-spacing: 0.3px; }
            tr:nth-child(even) { background: #f0fdfa; }
            tr:hover { background: #ccfbf1; }
            .card { border: 1px solid #99f6e4; background: #f0fdfa; border-radius: 10px; padding: 16px; margin: 12px 0; }
            h2, h3, h4 { margin: 16px 0 8px; color: #0d9488; }
            .font-semibold { font-weight: 600; }
            .font-bold { font-weight: 700; }
            .font-mono { font-family: 'SF Mono', 'Consolas', monospace; }
            .text-destructive, [style*="color: red"], .text-expense { color: #dc2626 !important; }
            .border-t-2 { border-top: 2px solid #0d9488 !important; }
            .border-t-4, .border-double { border-top: 4px double #0d9488 !important; }
            .uppercase { text-transform: uppercase; }
            .tracking-wide { letter-spacing: 0.05em; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              th { background: linear-gradient(135deg, #0d9488, #14b8a6) !important; color: #ffffff !important; }
              tr:nth-child(even) { background: #f0fdfa !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-logos">
              <div class="logo-slot logo-slot--left">
                <img src="${printMizanLogo}" alt="Mizan USA" class="mizan-logo" />
              </div>
              <span class="divider">×</span>
              <div class="logo-slot logo-slot--right">
                <img src="${activeClientLogo}" alt="${clientName}" class="client-logo" />
              </div>
            </div>
            <h1>${getTabLabel(activeTab)}</h1>
            <p>${clientName}</p>
            <p style="margin-top: 4px; font-size: 12px; color: hsl(${printTheme.mutedForeground});">Printed on ${new Date().toLocaleDateString()}</p>
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

  const handleDownloadPDF = async () => {
    const printContent = printRef.current;
    if (!printContent) return;

    toast({ title: "Generating PDF…", description: "Please wait a moment." });

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const activeClientLogo = isDefiore ? defioreLogo : cvsLogo;
      const mizanLogo = `${window.location.origin}/mizan-logo-brand-cropped.png`;

      // Create a temporary container with branded header + content
      const container = document.createElement("div");
      container.style.cssText = "position:absolute;left:-9999px;top:0;width:900px;background:#fff;padding:32px 36px;font-family:'Segoe UI',system-ui,sans-serif;color:#1a1a2e;";
      container.innerHTML = `
        <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #0d9488;">
          <div style="display:grid;grid-template-columns:minmax(0,1fr) 72px minmax(0,1fr);align-items:center;width:min(100%,760px);margin:0 auto 24px;">
            <div style="display:flex;align-items:center;justify-content:flex-end;padding-right:10px;">
              <img src="${mizanLogo}" alt="Mizan USA" style="height:136px;max-width:320px;width:auto;object-fit:contain;" crossorigin="anonymous" />
            </div>
            <span style="display:flex;align-items:center;justify-content:center;width:72px;height:136px;font-size:38px;font-weight:300;color:#0d9488;">×</span>
            <div style="display:flex;align-items:center;justify-content:flex-start;padding-left:10px;">
              <img src="${activeClientLogo}" alt="${clientName}" style="height:112px;max-width:240px;width:auto;object-fit:contain;" crossorigin="anonymous" />
            </div>
          </div>
          <h1 style="font-size:22px;color:#0d9488;margin-bottom:4px;font-weight:700;letter-spacing:0.5px;">${getTabLabel(isDefiore && activeTab === "reconciliation" ? "january" : activeTab)}</h1>
          <p style="font-size:13px;color:#475569;">${clientName}</p>
          <p style="margin-top:4px;font-size:12px;color:#94a3b8;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      // Clone the tab content into the container
      const contentClone = printContent.cloneNode(true) as HTMLElement;
      container.appendChild(contentClone);
      document.body.appendChild(container);

      // Wait for logos to load
      const imgs = Array.from(container.querySelectorAll("img"));
      await Promise.all(imgs.map(img =>
        img.complete ? Promise.resolve() : new Promise<void>(r => { img.onload = () => r(); img.onerror = () => r(); })
      ));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const tabLabel = getTabLabel(isDefiore && activeTab === "reconciliation" ? "january" : activeTab);
      const fileName = `${clientName}_${tabLabel.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast({ title: "PDF Failed", description: "Could not generate PDF. Try using Print instead.", variant: "destructive" });
    }
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
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <BrandLockup
                clientLogo={isTest ? undefined : isDefiore ? defioreLogo : cvsLogo}
                clientName={clientName || "Client"}
                eyebrow="Prepared for"
                size="md"
              />
              <h1 className="headline-editorial mt-5 text-[24px] text-foreground sm:text-[28px]">
                Welcome, <span className="text-primary">{clientName}</span>
              </h1>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Client portal — your reconciled records, view only.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5">
                <Eye className="h-4 w-4 text-warning" aria-hidden="true" />
                <span className="text-xs font-medium text-warning">View only</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 hover:border-destructive/50 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </div>

          {/* Action buttons - only exports */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print {getTabLabel(isDefiore && activeTab === "reconciliation" ? "january" : activeTab)}
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </Button>
            {isCVS ? (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => exportToPowerPoint({ clientName: clientName || 'Client', clientLogoPath: '/cvs-logo.png', fileName: `${clientName}_Financial_Report.pptx` })}
                >
                  <Presentation className="h-4 w-4" aria-hidden="true" />
                  Export to PowerPoint
                </Button>
                <Button
                  className="gap-2 btn-glow"
                  onClick={() => exportToExcel({ clientName: clientName || 'Client', fileName: `${clientName}_Bookkeeping.xlsx` })}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export to Excel
                </Button>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex rounded-lg">
                      <Button variant="outline" className="gap-2" disabled aria-disabled="true">
                        <Presentation className="h-4 w-4" aria-hidden="true" />
                        Export to PowerPoint
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Deck export isn’t available for this engagement yet — use Print or Download PDF.</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex rounded-lg">
                      <Button className="gap-2" disabled aria-disabled="true">
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Export to Excel
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Workbook export isn’t available for this engagement yet — use Print or Download PDF.</TooltipContent>
                </Tooltip>
              </>
            )}
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
                    <TabsTrigger value="march" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileSpreadsheet className="h-4 w-4" />
                      March 2026
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
                    <TabsTrigger value="pnl" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <TrendingUp className="h-4 w-4" />
                      P&L Q1
                    </TabsTrigger>
                    <TabsTrigger value="balance-sheet" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Scale className="h-4 w-4" />
                      Balance Sheet
                    </TabsTrigger>
                    <TabsTrigger value="cash-flow" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <ArrowDownUp className="h-4 w-4" />
                      Cash Flow
                    </TabsTrigger>
                  </>
                )}

                {isTest && (
                  <>
                    <TabsTrigger value="january" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileSpreadsheet className="h-4 w-4" />
                      January 2026
                    </TabsTrigger>
                    <TabsTrigger value="february" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileSpreadsheet className="h-4 w-4" />
                      February 2026
                    </TabsTrigger>
                    <TabsTrigger value="march" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileSpreadsheet className="h-4 w-4" />
                      March 2026
                    </TabsTrigger>
                    <TabsTrigger value="invoices" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Receipt className="h-4 w-4" />
                      Invoices
                    </TabsTrigger>
                    <TabsTrigger value="pnl" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <TrendingUp className="h-4 w-4" />
                      P&L Q1
                    </TabsTrigger>
                    <TabsTrigger value="balance-sheet" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Scale className="h-4 w-4" />
                      Balance Sheet
                    </TabsTrigger>
                    <TabsTrigger value="cash-flow" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <ArrowDownUp className="h-4 w-4" />
                      Cash Flow
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
                      <TabsContent value="march" className="m-0">
                        <CheckingAccountSheet month="March" year="2026" deposits={marchDeposits} withdrawals={marchWithdrawals} beginningBalance={marchSummary.beginningBalance} endingBalance={marchSummary.endingBalance} statementBalance={marchSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="pnl" className="m-0">
                        <DefioreProfitLossSheet />
                      </TabsContent>
                      <TabsContent value="balance-sheet" className="m-0">
                        <DefioreBalanceSheet />
                      </TabsContent>
                      <TabsContent value="cash-flow" className="m-0">
                        <DefioreCashFlowSheet />
                      </TabsContent>
                    </>
                  )}

                  {isCVS && (
                    <TabsContent value="reconciliation" className="m-0">
                      <ReconciliationSheet />
                    </TabsContent>
                  )}

                  {isTest && (
                    <>
                      <TabsContent value="january" className="m-0">
                        <CheckingAccountSheet month="January" year="2026" deposits={testJanDeposits} withdrawals={testJanWithdrawals} beginningBalance={testJanSummary.beginningBalance} endingBalance={testJanSummary.endingBalance} statementBalance={testJanSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="february" className="m-0">
                        <CheckingAccountSheet month="February" year="2026" deposits={testFebDeposits} withdrawals={testFebWithdrawals} beginningBalance={testFebSummary.beginningBalance} endingBalance={testFebSummary.endingBalance} statementBalance={testFebSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="march" className="m-0">
                        <CheckingAccountSheet month="March" year="2026" deposits={testMarDeposits} withdrawals={testMarWithdrawals} beginningBalance={testMarSummary.beginningBalance} endingBalance={testMarSummary.endingBalance} statementBalance={testMarSummary.statementEndingBalance} />
                      </TabsContent>
                      <TabsContent value="invoices" className="m-0">
                        <InvoicesSheet invoices={testInvoices} title={`${TEST_BUSINESS_NAME} – Invoices`} />
                      </TabsContent>
                      <TabsContent value="pnl" className="m-0"><TestProfitLossSheet /></TabsContent>
                      <TabsContent value="balance-sheet" className="m-0"><TestBalanceSheet /></TabsContent>
                      <TabsContent value="cash-flow" className="m-0"><TestCashFlowSheet /></TabsContent>
                    </>
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
