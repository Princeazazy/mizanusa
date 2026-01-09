import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare } from "lucide-react";
import { exportToExcel } from "@/lib/exportToExcel";
import { CompanyHeader } from "@/components/CompanyHeader";
import { DashboardSheet } from "@/components/sheets/DashboardSheet";
import { CheckingAccountSheet } from "@/components/sheets/CheckingAccountSheet";
import { TransfersSheet } from "@/components/sheets/TransfersSheet";
import { ESafetySheet } from "@/components/sheets/ESafetySheet";
import { VituSheet } from "@/components/sheets/VituSheet";
import { ChartOfAccountsSheet } from "@/components/sheets/ChartOfAccountsSheet";
import { ReconciliationSheet } from "@/components/sheets/ReconciliationSheet";
import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  octoberSummary,
  novemberSummary,
} from "@/data/bankTransactions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Financial Workbook</h2>
            <p className="text-sm text-muted-foreground mt-0.5">8 sheets • Q4 2025 • CPA-Ready Format</p>
          </div>
          <Button 
            variant="default" 
            className="gap-2.5 shadow-sm hover:shadow-md transition-shadow font-medium"
            onClick={exportToExcel}
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
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
                value="vitu" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 transition-all"
              >
                <FileText className="h-4 w-4" />
                Vitu
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
            
            <TabsContent value="transfers" className="m-0">
              <TransfersSheet />
            </TabsContent>
            
            <TabsContent value="esafety" className="m-0">
              <ESafetySheet />
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
          </div>
        </Tabs>
      </div>

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