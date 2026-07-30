import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Presentation, Printer, Receipt, CreditCard, TrendingUp, Scale, ArrowDownUp, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader, type SearchTarget } from "@/components/FuturisticHeader";

import { CheckingAccountSheet } from "@/components/sheets/CheckingAccountSheet";
import { InvoicesSheet } from "@/components/sheets/InvoicesSheet";
import { CreditCardStatementSheet } from "@/components/sheets/CreditCardStatementSheet";
import { DefioreProfitLossSheet } from "@/components/sheets/DefioreProfitLossSheet";
import { DefioreBalanceSheet } from "@/components/sheets/DefioreBalanceSheet";
import { DefioreCashFlowSheet } from "@/components/sheets/DefioreCashFlowSheet";
import { DefioreDashboardSheet } from "@/components/sheets/DefioreDashboardSheet";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import mizanLogo from "@/assets/mizan-logo-new.png";
import defioreLogo from "@/assets/defiore-logo.png";
import {
  januaryDeposits, januaryWithdrawals, januarySummary,
  februaryDeposits, februaryWithdrawals, februarySummary,
  marchDeposits, marchWithdrawals, marchSummary,
} from "@/data/defioreBankTransactions";
import { defioreInvoices } from "@/data/defioreInvoices";
import { januaryCreditCards, februaryCreditCards, marchCreditCards } from "@/data/defioreCreditCardTransactions";

const SEARCH_TARGETS: SearchTarget[] = [
  { label: "Dashboard", value: "dashboard", hint: "Overview & charts" },
  { label: "January 2026 — Bank", value: "january", hint: "Checking account" },
  { label: "February 2026 — Bank", value: "february", hint: "Checking account" },
  { label: "March 2026 — Bank", value: "march", hint: "Checking account" },
  { label: "Invoices", value: "invoices", hint: "Receivables" },
  { label: "Profit & Loss", value: "profitloss", hint: "Q1 2026" },
  { label: "Balance Sheet", value: "balancesheet", hint: "Q1 2026" },
  { label: "Cash Flow", value: "cashflow", hint: "Q1 2026" },
];


const DefioreIndex = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bankOpen, setBankOpen] = useState(false);
  const [ccOpen, setCcOpen] = useState(false);
  const bankRef = useRef<HTMLDivElement | null>(null);
  const ccRef = useRef<HTMLDivElement | null>(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!bankOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (bankRef.current && e.target instanceof Node && !bankRef.current.contains(e.target)) setBankOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [bankOpen]);

  useEffect(() => {
    if (!ccOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (ccRef.current && e.target instanceof Node && !ccRef.current.contains(e.target)) setCcOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ccOpen]);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been successfully logged out." });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen futuristic-bg">
        <div className="light-beam light-beam-left" />
        <div className="light-beam light-beam-right" />
        <div className="mx-auto max-w-[1600px] px-6 py-8 sm:px-8" aria-busy="true" aria-label="Loading workbook">
          <BrandLockup clientLogo={defioreLogo} clientName="Defiore Carpentry LLC" size="md" />
          <div className="mt-8 h-9 w-64 animate-pulse rounded-lg bg-white/[0.05]" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
            <div className="h-[360px] animate-pulse rounded-2xl bg-white/[0.04]" />
            <div className="h-[360px] animate-pulse rounded-2xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />
      <FuturisticSidebar onSignOut={handleSignOut} onTabChange={setActiveTab} />
      <div className="ml-16">
        <motion.div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <FuturisticHeader
            title="Financial Workbook"
            subtitle="Reconciled Q1 2026 records for"
            clientName="Defiore Carpentry LLC"
            clientLogo={defioreLogo}
            searchTargets={SEARCH_TARGETS}
            onTabChange={setActiveTab}
            onSignOut={handleSignOut}
            accountEmail={user?.email ?? undefined}
          />

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex rounded-lg">
                  <Button variant="outline" className="gap-2" disabled aria-disabled="true">
                    <Presentation className="h-4 w-4" aria-hidden="true" />Export to PowerPoint
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Branded deck export isn’t wired to the Defiore dataset yet.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex rounded-lg">
                  <Button className="gap-2" disabled aria-disabled="true">
                    <Download className="h-4 w-4" aria-hidden="true" />Export to Excel
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Workbook export isn’t wired to the Defiore dataset yet.</TooltipContent>
            </Tooltip>
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" aria-hidden="true" />Print workbook
            </Button>
          </div>


          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="glass-card p-1.5 mb-8">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
                <TabsTrigger value="dashboard" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </TabsTrigger>
                {/* Bank Statements Dropdown */}
                <div className="relative" ref={bankRef}>
                  <TabsTrigger
                    value="bank-q1"
                    className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    data-state={["january", "february", "march"].includes(activeTab) ? "active" : "inactive"}
                    onClick={(e) => {
                      e.preventDefault();
                      setBankOpen((v) => !v);
                      if (!["january", "february", "march"].includes(activeTab)) setActiveTab("january");
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Bank Q1 2026
                    <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </TabsTrigger>
                  {bankOpen && (
                    <div className="absolute top-full left-0 mt-1 glass-card z-50 min-w-[160px] p-1">
                      {[
                        { value: "january", label: "January 2026" },
                        { value: "february", label: "February 2026" },
                        { value: "march", label: "March 2026" },
                      ].map((m) => (
                        <button
                          key={m.value}
                          onClick={() => { setActiveTab(m.value); setBankOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === m.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          {m.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Credit Card Statements Dropdown */}
                <div className="relative" ref={ccRef}>
                  <TabsTrigger
                    value="cc-q1"
                    className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    data-state={["cc-january", "cc-february", "cc-march"].includes(activeTab) ? "active" : "inactive"}
                    onClick={(e) => {
                      e.preventDefault();
                      setCcOpen((v) => !v);
                      if (!["cc-january", "cc-february", "cc-march"].includes(activeTab)) setActiveTab("cc-january");
                    }}
                  >
                    <CreditCard className="h-4 w-4" />
                    CC Q1 2026
                    <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </TabsTrigger>
                  {ccOpen && (
                    <div className="absolute top-full left-0 mt-1 glass-card z-50 min-w-[160px] p-1">
                      {[
                        { value: "cc-january", label: "CC – Jan 2026" },
                        { value: "cc-february", label: "CC – Feb 2026" },
                        { value: "cc-march", label: "CC – Mar 2026" },
                      ].map((m) => (
                        <button
                          key={m.value}
                          onClick={() => { setActiveTab(m.value); setCcOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent/50 rounded-lg transition-colors ${activeTab === m.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          <CreditCard className="h-4 w-4" />
                          {m.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <TabsTrigger value="invoices" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Receipt className="h-4 w-4" />Invoices
                </TabsTrigger>
                <TabsTrigger value="pnl" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <TrendingUp className="h-4 w-4" />P&L Q1
                </TabsTrigger>
                <TabsTrigger value="balance-sheet" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Scale className="h-4 w-4" />Balance Sheet
                </TabsTrigger>
                <TabsTrigger value="cash-flow" className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <ArrowDownUp className="h-4 w-4" />Cash Flow
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <TabsContent value="dashboard" className="m-0">
                  <DefioreDashboardSheet />
                </TabsContent>
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
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        <footer className="border-t border-border/30 mt-16">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-foreground">Defiore Carpentry LLC</p>
                <p className="text-xs text-muted-foreground mt-0.5">1162 S 12th St, Philadelphia, PA 19147</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DefioreIndex;
