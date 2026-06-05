import { Transaction } from "@/data/bankTransactions";
import { Invoice } from "@/data/defioreInvoices";

export const TEST_BUSINESS_NAME = "Acme Demo Co LLC";

// ===== January 2026 =====
export const testJanDeposits: Transaction[] = [
  { date: "01/03/2026", description: "Customer Payment - Northwind Trading", amount: 5200, category: "Service Revenue" },
  { date: "01/08/2026", description: "Customer Payment - Globex Inc", amount: 3450, category: "Service Revenue" },
  { date: "01/15/2026", description: "Stripe Payout", amount: 2810.55, category: "Service Revenue" },
  { date: "01/22/2026", description: "Customer Payment - Initech LLC", amount: 4900, category: "Service Revenue" },
  { date: "01/29/2026", description: "Owner Contribution", amount: 1500, category: "Owner Contribution" },
];

export const testJanWithdrawals: Transaction[] = [
  { date: "01/02/2026", description: "Rent - January", amount: 1800, category: "Rent" },
  { date: "01/05/2026", description: "Verizon Business Internet", amount: 129.99, category: "Utilities" },
  { date: "01/09/2026", description: "Payroll - Bi-weekly", amount: 4200, category: "Payroll" },
  { date: "01/12/2026", description: "Office Supplies - Staples", amount: 87.45, category: "Office Supplies" },
  { date: "01/18/2026", description: "QuickBooks Subscription", amount: 75, category: "Software" },
  { date: "01/23/2026", description: "Payroll - Bi-weekly", amount: 4200, category: "Payroll" },
  { date: "01/27/2026", description: "Fuel - Shell", amount: 64.20, category: "Vehicle" },
];

// ===== February 2026 =====
export const testFebDeposits: Transaction[] = [
  { date: "02/02/2026", description: "Customer Payment - Northwind Trading", amount: 5400, category: "Service Revenue" },
  { date: "02/10/2026", description: "Stripe Payout", amount: 3120.40, category: "Service Revenue" },
  { date: "02/17/2026", description: "Customer Payment - Hooli Corp", amount: 6750, category: "Service Revenue" },
  { date: "02/25/2026", description: "Customer Payment - Pied Piper", amount: 2200, category: "Service Revenue" },
];

export const testFebWithdrawals: Transaction[] = [
  { date: "02/01/2026", description: "Rent - February", amount: 1800, category: "Rent" },
  { date: "02/04/2026", description: "Verizon Business Internet", amount: 129.99, category: "Utilities" },
  { date: "02/06/2026", description: "Payroll - Bi-weekly", amount: 4200, category: "Payroll" },
  { date: "02/14/2026", description: "Marketing - Meta Ads", amount: 450, category: "Marketing" },
  { date: "02/18/2026", description: "QuickBooks Subscription", amount: 75, category: "Software" },
  { date: "02/20/2026", description: "Payroll - Bi-weekly", amount: 4200, category: "Payroll" },
  { date: "02/26/2026", description: "Insurance - The Hartford", amount: 312, category: "Insurance" },
];

// ===== March 2026 =====
export const testMarDeposits: Transaction[] = [
  { date: "03/03/2026", description: "Customer Payment - Hooli Corp", amount: 6900, category: "Service Revenue" },
  { date: "03/11/2026", description: "Stripe Payout", amount: 3540.12, category: "Service Revenue" },
  { date: "03/19/2026", description: "Customer Payment - Globex Inc", amount: 4100, category: "Service Revenue" },
  { date: "03/26/2026", description: "Customer Payment - Wayne Enterprises", amount: 8200, category: "Service Revenue" },
];

export const testMarWithdrawals: Transaction[] = [
  { date: "03/01/2026", description: "Rent - March", amount: 1800, category: "Rent" },
  { date: "03/05/2026", description: "Verizon Business Internet", amount: 129.99, category: "Utilities" },
  { date: "03/06/2026", description: "Payroll - Bi-weekly", amount: 4200, category: "Payroll" },
  { date: "03/13/2026", description: "Travel - Delta Airlines", amount: 612.40, category: "Travel" },
  { date: "03/18/2026", description: "QuickBooks Subscription", amount: 75, category: "Software" },
  { date: "03/20/2026", description: "Payroll - Bi-weekly", amount: 4200, category: "Payroll" },
  { date: "03/24/2026", description: "Office Supplies - Amazon", amount: 142.88, category: "Office Supplies" },
  { date: "03/28/2026", description: "Meals & Entertainment", amount: 88.50, category: "Meals" },
];

const sum = (arr: Transaction[]) => arr.reduce((s, t) => s + t.amount, 0);

const janBegin = 10000;
const janEnd = janBegin + sum(testJanDeposits) - sum(testJanWithdrawals);
const febEnd = janEnd + sum(testFebDeposits) - sum(testFebWithdrawals);
const marEnd = febEnd + sum(testMarDeposits) - sum(testMarWithdrawals);

export const testJanSummary = { beginningBalance: janBegin, endingBalance: janEnd, statementEndingBalance: janEnd };
export const testFebSummary = { beginningBalance: janEnd, endingBalance: febEnd, statementEndingBalance: febEnd };
export const testMarSummary = { beginningBalance: febEnd, endingBalance: marEnd, statementEndingBalance: marEnd };

// ===== Invoices =====
export const testInvoices: Invoice[] = [
  {
    invoiceNumber: "D-001",
    date: "01/05/2026",
    billTo: "Northwind Trading – 123 Market St, Demo City, DC",
    description: "Consulting Services – January",
    lineItems: [{ description: "Strategy consulting (40 hrs @ $130)", rate: 130, quantity: 40, total: 5200 }],
    subtotal: 5200,
    total: 5200,
    payments: [{ date: "01/03/2026", method: "ACH", amount: 5200 }],
    paidTotal: 5200,
    remainingAmount: 0,
    status: "paid",
  },
  {
    invoiceNumber: "D-002",
    date: "02/15/2026",
    billTo: "Hooli Corp – 500 Innovation Way, Demo City, DC",
    description: "Software Implementation Phase 1",
    lineItems: [
      { description: "Implementation work", rate: 5000, quantity: 1, total: 5000 },
      { description: "Training session", rate: 1750, quantity: 1, total: 1750 },
    ],
    subtotal: 6750,
    total: 6750,
    payments: [{ date: "02/17/2026", method: "Wire", amount: 6750 }],
    paidTotal: 6750,
    remainingAmount: 0,
    status: "paid",
  },
  {
    invoiceNumber: "D-003",
    date: "03/20/2026",
    billTo: "Wayne Enterprises – 1007 Mountain Drive, Demo City, DC",
    description: "Quarterly Retainer",
    lineItems: [{ description: "Q1 advisory retainer", rate: 8200, quantity: 1, total: 8200 }],
    subtotal: 8200,
    total: 8200,
    payments: [{ date: "03/26/2026", method: "ACH", amount: 8200 }],
    paidTotal: 8200,
    remainingAmount: 0,
    status: "paid",
  },
  {
    invoiceNumber: "D-004",
    date: "03/28/2026",
    billTo: "Initech LLC – 200 Office Park, Demo City, DC",
    description: "Custom Reporting Build",
    lineItems: [{ description: "Custom report development", rate: 3500, quantity: 1, total: 3500 }],
    subtotal: 3500,
    total: 3500,
    payments: [],
    paidTotal: 0,
    remainingAmount: 3500,
    status: "unpaid",
  },
];
