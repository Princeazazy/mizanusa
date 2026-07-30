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
import { BookOpen } from "lucide-react";
import { chartOfAccounts, getAccountsByType } from "@/data/chartOfAccounts";

const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    "Revenue": "bg-income/10 text-income border border-income/25",
    "COGS": "bg-warning/10 text-warning border border-warning/25",
    "Expense": "bg-expense/10 text-expense border border-expense/25",
    "Asset": "bg-info/10 text-info border border-info/25",
    "Liability": "bg-primary/10 text-primary border border-primary/25",
    "Equity": "bg-accent text-accent-foreground border border-border",
  };
  return colors[type] || "bg-muted text-muted-foreground border border-border";
};

export const ChartOfAccountsSheet = () => {
  const revenueAccounts = getAccountsByType("Revenue");
  const cogsAccounts = getAccountsByType("COGS");
  const expenseAccounts = getAccountsByType("Expense");
  const otherAccounts = chartOfAccounts.filter(
    a => !["Revenue", "COGS", "Expense"].includes(a.type)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Chart of Accounts</h2>
        <p className="text-muted-foreground">
          Auto Dealership Standard COA - CVS Auto Sales Inc.
        </p>
      </div>

      {/* Revenue Accounts */}
      <Card>
        <CardHeader className="bg-income/15 border-b">
          <CardTitle className="text-income">
            4000 Series - Revenue Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-24">Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueAccounts.map((account) => (
                <TableRow key={account.code}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-bold">
                      {account.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(account.type)}>
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* COGS Accounts */}
      <Card>
        <CardHeader className="bg-warning/15 border-b">
          <CardTitle className="text-warning">
            5000 Series - Cost of Goods Sold
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-24">Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cogsAccounts.map((account) => (
                <TableRow key={account.code}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-bold">
                      {account.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(account.type)}>
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Operating Expense Accounts */}
      <Card>
        <CardHeader className="bg-expense/15 border-b">
          <CardTitle className="text-expense">
            6000 Series - Operating Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-24">Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseAccounts.map((account) => (
                <TableRow key={account.code}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-bold">
                      {account.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(account.type)}>
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Other Accounts */}
      {otherAccounts.length > 0 && (
        <Card>
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-foreground">
              Other Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-24">Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherAccounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono font-bold">
                        {account.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(account.type)}>
                        {account.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {account.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            COA Usage Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Income Recognition</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>4100</strong> - Merchant BankCard ACH deposits</li>
                <li>• <strong>4110</strong> - Physical check deposits</li>
                <li>• <strong>4120</strong> - Venmo and digital payments</li>
                <li>• <strong>4200</strong> - PA eSafety inspection fees</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Expense Recognition</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>5000</strong> - COPART and vehicle purchases</li>
                <li>• <strong>5100</strong> - PENNDOT and DMV fees</li>
                <li>• <strong>5120</strong> - VITU RTS title services</li>
                <li>• <strong>6xxx</strong> - All operating expenses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
