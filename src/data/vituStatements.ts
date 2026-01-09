export interface VituLineItem {
  service: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface VituInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  month: string;
  lineItems: VituLineItem[];
  total: number;
}

export const vituInvoices: VituInvoice[] = [
  {
    invoiceNumber: "27652658",
    invoiceDate: "11/01/2025",
    dueDate: "11/15/2025",
    month: "October 2025",
    lineItems: [
      { service: "DLDV Lookups", quantity: 61, rate: 2.00, total: 122.00 },
      { service: "NMVTIS Inquiries", quantity: 5, rate: 2.00, total: 10.00 },
    ],
    total: 132.00,
  },
  {
    invoiceNumber: "27822934",
    invoiceDate: "12/01/2025",
    dueDate: "12/15/2025",
    month: "November 2025",
    lineItems: [
      { service: "DLDV Lookups", quantity: 49, rate: 2.00, total: 98.00 },
      { service: "NMVTIS Inquiries", quantity: 6, rate: 2.00, total: 12.00 },
    ],
    total: 110.00,
  },
  {
    invoiceNumber: "28007799",
    invoiceDate: "01/01/2026",
    dueDate: "01/15/2026",
    month: "December 2025",
    lineItems: [
      { service: "DLDV Lookups", quantity: 62, rate: 2.00, total: 124.00 },
      { service: "NMVTIS Inquiries", quantity: 8, rate: 2.00, total: 16.00 },
    ],
    total: 140.00,
  },
];

export const vituSummary = {
  totalDLDVLookups: 172,
  totalNMVTISInquiries: 19,
  quarterTotal: 382.00,
};
