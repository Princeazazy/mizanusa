import type { VituInvoice } from "./vituStatements";

// CVS Auto Sales Inc. — Vitu (Motor Vehicle Software Corp) invoices, Jan–May 2026.
// Source: original Vitu invoices. All invoices paid in full (balance due $0.00).
// COA 5120 — Title Lookup Services (COGS).
export const vituInvoices2026: VituInvoice[] = [
  {
    invoiceNumber: "28189006",
    invoiceDate: "01/31/2026",
    dueDate: "02/07/2026",
    month: "January 2026",
    lineItems: [
      { service: "DLDV Lookups", quantity: 129, rate: 2.0, total: 258.0 },
      { service: "NMVTIS Inquiries", quantity: 8, rate: 2.0, total: 16.0 },
    ],
    total: 274.0,
  },
  {
    invoiceNumber: "28368953",
    invoiceDate: "02/28/2026",
    dueDate: "03/07/2026",
    month: "February 2026",
    lineItems: [
      { service: "DLDV Lookups", quantity: 139, rate: 2.0, total: 278.0 },
      { service: "NMVTIS Inquiries", quantity: 9, rate: 2.0, total: 18.0 },
    ],
    total: 296.0,
  },
  {
    invoiceNumber: "28577986",
    invoiceDate: "03/31/2026",
    dueDate: "04/07/2026",
    month: "March 2026",
    lineItems: [
      { service: "DLDV Lookups", quantity: 108, rate: 2.0, total: 216.0 },
      { service: "NMVTIS Inquiries", quantity: 5, rate: 2.0, total: 10.0 },
    ],
    total: 226.0,
  },
  {
    invoiceNumber: "28777575",
    invoiceDate: "04/30/2026",
    dueDate: "05/07/2026",
    month: "April 2026",
    lineItems: [
      { service: "DLDV Lookups", quantity: 70, rate: 2.0, total: 140.0 },
      { service: "NMVTIS Inquiries", quantity: 6, rate: 2.0, total: 12.0 },
    ],
    total: 152.0,
  },
  {
    invoiceNumber: "28957922",
    invoiceDate: "05/31/2026",
    dueDate: "06/07/2026",
    month: "May 2026",
    lineItems: [
      { service: "DLDV Lookups", quantity: 72, rate: 2.0, total: 144.0 },
      { service: "NMVTIS Inquiries", quantity: 5, rate: 2.0, total: 10.0 },
    ],
    total: 154.0,
  },
];

export const vituSummary2026 = {
  totalDLDVLookups: vituInvoices2026.reduce(
    (s, i) => s + (i.lineItems.find((l) => l.service === "DLDV Lookups")?.quantity ?? 0),
    0,
  ),
  totalNMVTISInquiries: vituInvoices2026.reduce(
    (s, i) => s + (i.lineItems.find((l) => l.service === "NMVTIS Inquiries")?.quantity ?? 0),
    0,
  ),
  quarterTotal: vituInvoices2026.reduce((s, i) => s + i.total, 0),
};
