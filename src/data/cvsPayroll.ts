// CVS Auto Sales Inc — payroll data.
// Source: Payroll Service Solutions, L.L.C. Period Summary, Client #2685,
// period 01/05/2026 – 03/30/2026 (printed 09/03/2026).
// Figures are transcribed exactly from the payroll register — nothing estimated.

export interface PayrollEmployee {
  no: number;
  name: string;
  address: string;
  ssnMasked: string;
  annualRate: number;
  hours: number;
  gross: number;
  federal: number;
  fica: number;
  medicare: number;
  state: number;
  sdi: number;
  local: number;
  netPay: number;
}

export interface PayrollTaxLine {
  label: string;
  taxable: number | null;
  tax: number;
  count?: number;
}

export interface PayrollPeriod {
  key: string;
  /** Matches the quarter key used in cvsQuarters. */
  quarterKey: string;
  label: string;
  periodLabel: string;
  clientNumber: string;
  processor: string;
  processorAddress: string;
  checkCount: number;
  employees: PayrollEmployee[];
  /** Employer-side taxes — a company expense, not withheld from employees. */
  employerTaxes: PayrollTaxLine[];
  employeeTaxes: PayrollTaxLine[];
  localTaxes: PayrollTaxLine[];
  notes: string[];
}

export const cvsPayrollPeriods: PayrollPeriod[] = [
  {
    key: "q1-2026",
    quarterKey: "q1-2026",
    label: "Q1 2026",
    periodLabel: "01/05/2026 – 03/30/2026",
    clientNumber: "2685",
    processor: "Payroll Service Solutions, L.L.C.",
    processorAddress: "900 Jaymor Rd, Southampton, PA 18966 · 215-624-0922",
    checkCount: 14,
    employees: [
      {
        no: 1,
        name: "Larisa Ignatkova",
        address: "505 Orchard Ave, Warminster, PA 18974",
        ssnMasked: "183-80-XXXX",
        annualRate: 26000,
        hours: 7,
        gross: 7000,
        federal: 21.56,
        fica: 434,
        medicare: 101.5,
        state: 214.9,
        sdi: 4.9,
        local: 70,
        netPay: 6153.14,
      },
      {
        no: 2,
        name: "Abdel Fattah",
        address: "505 Orchard Ave, Warminster, PA 18974",
        ssnMasked: "185-78-XXXX",
        annualRate: 26000,
        hours: 7,
        gross: 7000,
        federal: 21.56,
        fica: 434,
        medicare: 101.5,
        state: 214.9,
        sdi: 4.9,
        local: 70,
        netPay: 6153.14,
      },
    ],
    employeeTaxes: [
      { label: "Federal Income Tax Withheld", taxable: 14000, tax: 43.12 },
      { label: "Social Security (FICA) — Employee", taxable: 14000, tax: 868 },
      { label: "Medicare — Employee", taxable: 14000, tax: 203 },
      { label: "Pennsylvania State Income Tax", taxable: 14000, tax: 429.8, count: 2 },
      { label: "Pennsylvania SDI / Unemployment (EE)", taxable: 14000, tax: 9.8, count: 2 },
    ],
    localTaxes: [{ label: "Warminster Twp Resident EIT", taxable: 14000, tax: 140, count: 2 }],
    employerTaxes: [
      { label: "Company FICA / Medicare (Employer Match)", taxable: 14000, tax: 1071 },
      { label: "Federal Unemployment (FUTA) — Pennsylvania", taxable: 14000, tax: 84 },
      { label: "State Unemployment (SUTA) — Pennsylvania", taxable: 14000, tax: 290.39 },
    ],
    notes: [
      "Payroll register received from Payroll Service Solutions, L.L.C. (Client #2685) for the period 01/05/2026 – 03/30/2026.",
      "No payroll disbursements appear on the CVS Business Basic Checking statements for January – March 2026. Confirm which account funds payroll so the tie-out can be completed.",
      "Gross wages are charged to 6010 and employer taxes to 6020 in the Q1 2026 Profit & Loss. Employee withholdings are not an expense — they are part of gross wages.",
    ],
  },
];

/** Gross wages — COA 6010. */
export const payrollGrossWages = (p: PayrollPeriod) =>
  p.employees.reduce((s, e) => s + e.gross, 0);

/** Employer payroll taxes — COA 6020. */
export const payrollEmployerTaxes = (p: PayrollPeriod) =>
  p.employerTaxes.reduce((s, t) => s + t.tax, 0);

/** Total withheld from employees (already inside gross wages). */
export const payrollWithholdings = (p: PayrollPeriod) =>
  [...p.employeeTaxes, ...p.localTaxes].reduce((s, t) => s + t.tax, 0);

export const payrollNetPay = (p: PayrollPeriod) =>
  p.employees.reduce((s, e) => s + e.netPay, 0);

/** Total cost to the company. */
export const payrollTotalCost = (p: PayrollPeriod) =>
  payrollGrossWages(p) + payrollEmployerTaxes(p);

export const getPayrollForQuarter = (quarterKey: string) =>
  cvsPayrollPeriods.find((p) => p.quarterKey === quarterKey);

export const defaultPayrollPeriod = cvsPayrollPeriods[cvsPayrollPeriods.length - 1];
