import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, FileSpreadsheet, ArrowLeftRight, Car, FileText, BookOpen, CheckSquare } from "lucide-react";
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
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Financial Workbook</h2>
            <p className="text-sm text-muted-foreground">8 sheets • Q4 2025</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        {/* Sheet Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="october" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Oct 2025
            </TabsTrigger>
            <TabsTrigger value="november" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Nov 2025
            </TabsTrigger>
            <TabsTrigger value="transfers" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Transfers
            </TabsTrigger>
            <TabsTrigger value="esafety" className="gap-2">
              <Car className="h-4 w-4" />
              PA eSafety
            </TabsTrigger>
            <TabsTrigger value="vitu" className="gap-2">
              <FileText className="h-4 w-4" />
              Vitu
            </TabsTrigger>
            <TabsTrigger value="coa" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Chart of Accounts
            </TabsTrigger>
            <TabsTrigger value="reconciliation" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Reconciliation
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
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
      <footer className="border-t mt-12 py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CVS Auto Sales Inc. • 715 Huntingdon Pike, Rockledge, PA 19046</p>
          <p className="mt-1">Financial Records Prepared for CPA Review • Q4 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
