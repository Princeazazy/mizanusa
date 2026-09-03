import { useState } from "react";
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
import { Users, Landmark, Wallet, AlertTriangle } from "lucide-react";
import {
  cvsPayrollPeriods,
  defaultPayrollPeriod,
  payrollEmployerTaxes,
  payrollGrossWages,
  payrollNetPay,
  payrollTotalCost,
  payrollWithholdings,
} from "@/data/cvsPayroll";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const PayrollSheet = () => {
  const [periodKey, setPeriodKey] = useState(defaultPayrollPeriod.key);
  const period = cvsPayrollPeriods.find((p) => p.key === periodKey) ?? defaultPayrollPeriod;

  const gross = payrollGrossWages(period);
  const employerTaxes = payrollEmployerTaxes(period);
  const withholdings = payrollWithholdings(period);
  const net = payrollNetPay(period);
  const totalCost = payrollTotalCost(period);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payroll Register</h2>
          <p className="text-muted-foreground">
            CVS Auto Sales Inc. — {period.label} ({period.periodLabel})
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cvsPayrollPeriods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriodKey(p.key)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                p.key === periodKey
                  ? "border-primary/50 bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-income/30 bg-income/10">
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto mb-2 h-7 w-7 text-income" />
            <p className="text-sm font-medium text-income">Gross Wages · 6010</p>
            <p className="text-2xl font-bold text-income">{fmt(gross)}</p>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/10">
          <CardContent className="pt-6 text-center">
            <Landmark className="mx-auto mb-2 h-7 w-7 text-warning" />
            <p className="text-sm font-medium text-warning">Employer Taxes · 6020</p>
            <p className="text-2xl font-bold text-warning">{fmt(employerTaxes)}</p>
          </CardContent>
        </Card>
        <Card className="border-info/30 bg-info/10">
          <CardContent className="pt-6 text-center">
            <Wallet className="mx-auto mb-2 h-7 w-7 text-info" />
            <p className="text-sm font-medium text-info">Net Pay ({period.checkCount} checks)</p>
            <p className="text-2xl font-bold text-info">{fmt(net)}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/10">
          <CardContent className="pt-6 text-center">
            <Landmark className="mx-auto mb-2 h-7 w-7 text-primary" />
            <p className="text-sm font-medium text-primary">Total Payroll Cost</p>
            <p className="text-2xl font-bold text-primary">{fmt(totalCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee detail */}
      <Card className="shadow-card">
        <CardHeader className="border-b bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Detail — {period.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>#</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Annual Rate</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Federal</TableHead>
                <TableHead className="text-right">FICA</TableHead>
                <TableHead className="text-right">Medicare</TableHead>
                <TableHead className="text-right">PA State</TableHead>
                <TableHead className="text-right">SDI</TableHead>
                <TableHead className="text-right">Local</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {period.employees.map((e) => (
                <TableRow key={e.no}>
                  <TableCell className="text-muted-foreground">{e.no}</TableCell>
                  <TableCell>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">
                      SSN {e.ssnMasked} · {e.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.annualRate)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{fmt(e.gross)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.federal)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.fica)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.medicare)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.state)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.sdi)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(e.local)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{fmt(e.netPay)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 bg-muted/20 font-bold">
                <TableCell colSpan={3}>Totals</TableCell>
                <TableCell className="text-right font-mono">{fmt(gross)}</TableCell>
                <TableCell className="text-right font-mono">
                  {fmt(period.employees.reduce((s, e) => s + e.federal, 0))}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {fmt(period.employees.reduce((s, e) => s + e.fica, 0))}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {fmt(period.employees.reduce((s, e) => s + e.medicare, 0))}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {fmt(period.employees.reduce((s, e) => s + e.state, 0))}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {fmt(period.employees.reduce((s, e) => s + e.sdi, 0))}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {fmt(period.employees.reduce((s, e) => s + e.local, 0))}
                </TableCell>
                <TableCell className="text-right font-mono">{fmt(net)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tax summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base">Employee Withholdings (inside gross wages)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Tax</TableHead>
                  <TableHead className="text-right">Taxable</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...period.employeeTaxes, ...period.localTaxes].map((t) => (
                  <TableRow key={t.label}>
                    <TableCell>{t.label}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {t.taxable === null ? "—" : fmt(t.taxable)}
                    </TableCell>
                    <TableCell className="text-right font-mono">{fmt(t.tax)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-muted/20 font-bold">
                  <TableCell colSpan={2}>Total Withheld</TableCell>
                  <TableCell className="text-right font-mono">{fmt(withholdings)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    Gross Wages less Withholdings = Net Pay
                  </TableCell>
                  <TableCell className="text-right font-mono">{fmt(gross - withholdings)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base">
              Employer Payroll Taxes — Company Expense{" "}
              <Badge variant="outline" className="ml-1">COA 6020</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Tax</TableHead>
                  <TableHead className="text-right">Taxable</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {period.employerTaxes.map((t) => (
                  <TableRow key={t.label}>
                    <TableCell>{t.label}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {t.taxable === null ? "—" : fmt(t.taxable)}
                    </TableCell>
                    <TableCell className="text-right font-mono">{fmt(t.tax)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-muted/20 font-bold">
                  <TableCell colSpan={2}>Total Employer Taxes</TableCell>
                  <TableCell className="text-right font-mono">{fmt(employerTaxes)}</TableCell>
                </TableRow>
                <TableRow className="border-t-2 bg-primary/10 font-bold">
                  <TableCell colSpan={2}>Total Payroll Charged to the P&amp;L</TableCell>
                  <TableCell className="text-right font-mono text-primary">{fmt(totalCost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-warning">
            <AlertTriangle className="h-4 w-4" />
            Preparer Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {period.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
            <li>
              Source: {period.processor} · Client #{period.clientNumber} — {period.processorAddress}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
