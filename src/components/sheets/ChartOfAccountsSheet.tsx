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
    "Revenue": "bg-green-100 text-green-800",
    "COGS": "bg-orange-100 text-orange-800",
    "Expense": "bg-red-100 text-red-800",
    "Asset": "bg-blue-100 text-blue-800",
    "Liability": "bg-purple-100 text-purple-800",
    "Equity": "bg-cyan-100 text-cyan-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
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
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="text-green-800">
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
        <CardHeader className="bg-orange-50 border-b">
          <CardTitle className="text-orange-800">
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
        <CardHeader className="bg-red-50 border-b">
          <CardTitle className="text-red-800">
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
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-800">
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
