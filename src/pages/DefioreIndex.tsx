import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, Presentation, Sparkles, Receipt, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import { CheckingAccountSheet } from "@/components/sheets/CheckingAccountSheet";
import { InvoicesSheet } from "@/components/sheets/InvoicesSheet";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import mizanLogo from "@/assets/mizan-logo-new.png";
import defioreLogo from "@/assets/defiore-logo.png";
import {
  januaryDeposits,
  januaryWithdrawals,
  januarySummary,
  februaryDeposits,
  februaryWithdrawals,
  februarySummary,
} from "@/data/defioreBankTransactions";
import { defioreInvoices } from "@/data/defioreInvoices";

const DefioreIndex = () => {
  const [activeTab, setActiveTab] = useState("january");
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

  if (!user) return null;

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />

      <FuturisticSidebar onSignOut={handleSignOut} onTabChange={setActiveTab} />

      <div className="ml-16">
        <motion.div
          className="max-w-[1600px] mx-auto px-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FuturisticHeader
            title="Hi there!"
            subtitle="Here's Your Financial Workbook for"
            clientName="Defiore Carpentry LLC"
            clientLogo={defioreLogo}
          />

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="outline"
              className="gap-2 glass-card border-border/50 hover:border-primary/50 hover:bg-accent/50"
              onClick={() => toast({ title: "Coming Soon", description: "PowerPoint export for Defiore is under development." })}
            >
              <Presentation className="h-4 w-4" />
              Export to PowerPoint
            </Button>
            <Button
              className="gap-2 btn-glow"
              onClick={() => toast({ title: "Coming Soon", description: "Excel export for Defiore is under development." })}
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
                  value="invoices"
                  className="gap-2 futuristic-tab data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Receipt className="h-4 w-4" />
                  Invoices
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
                <TabsContent value="january" className="m-0">
                  <CheckingAccountSheet
                    month="January"
                    year="2026"
                    deposits={januaryDeposits}
                    withdrawals={januaryWithdrawals}
                    beginningBalance={januarySummary.beginningBalance}
                    endingBalance={januarySummary.endingBalance}
                    statementBalance={januarySummary.statementEndingBalance}
                  />
                </TabsContent>
                <TabsContent value="february" className="m-0">
                  <CheckingAccountSheet
                    month="February"
                    year="2026"
                    deposits={februaryDeposits}
                    withdrawals={februaryWithdrawals}
                    beginningBalance={februarySummary.beginningBalance}
                    endingBalance={februarySummary.endingBalance}
                    statementBalance={februarySummary.statementEndingBalance}
                  />
                </TabsContent>
                <TabsContent value="invoices" className="m-0">
                  <InvoicesSheet invoices={defioreInvoices} title="Defiore Carpentry LLC – Invoices" />
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
