export interface Invoice {
  invoiceNumber: string;
  date: string;
  billTo: string;
  serviceAddress?: string;
  description: string;
  lineItems: { description: string; rate: number; quantity: number; total: number }[];
  subtotal: number;
  total: number;
  payments: { date: string; method: string; amount: number }[];
  paidTotal: number;
  remainingAmount: number;
  notes?: string;
  status: "paid" | "unpaid" | "partial";
}

export const defioreInvoices: Invoice[] = [
  {
    invoiceNumber: "1087",
    date: "12/20/2025",
    billTo: "Sweat Fitness – 1509 E Passyunk Ave, Philadelphia, PA 19147",
    description: "Floor repairs – Bathroom / gym area",
    lineItems: [
      { description: "Floor repairs – Remove existing flooring, replace damaged subflooring, add 2x12 blocking, reinstall flooring", rate: 1400, quantity: 1, total: 1400 },
    ],
    subtotal: 1400,
    total: 1400,
    payments: [{ date: "03/04/2026", method: "Cheque", amount: 1400 }],
    paidTotal: 1400,
    remainingAmount: 0,
    notes: "Includes 2 one-year gym memberships to Sweat Fitness (Aaron & Nelia DeFiore)",
    status: "paid",
  },
  {
    invoiceNumber: "1088",
    date: "01/02/2026",
    billTo: "Mike Ferrise – 3029 Redner, Philadelphia, PA 19121",
    description: "Fireblocking",
    lineItems: [
      { description: "Fireblocking", rate: 500, quantity: 1, total: 500 },
    ],
    subtotal: 500,
    total: 500,
    payments: [],
    paidTotal: 0,
    remainingAmount: 500,
    status: "unpaid",
  },
  {
    invoiceNumber: "1091",
    date: "01/21/2026",
    billTo: "ASM General Contracting – 615 Chestnut St, Philadelphia, PA 19006",
    serviceAddress: "2035 Darien St, Philadelphia, PA 19148",
    description: "Framing, Stairs & Rear Extension Rebuild",
    lineItems: [
      { description: "Framing – 3rd floor addition, 2nd & 1st floor interior partitions (252 ft approx, no materials/masonry/demo/windows/doors)", rate: 14000, quantity: 1, total: 14000 },
      { description: "Stairs – Frame 3 sets to be finished by finish carpenter", rate: 1000, quantity: 1, total: 1000 },
      { description: "Rear extension re-build – Replace insufficient footings, rebuild 2 story rear extension", rate: 4000, quantity: 1, total: 4000 },
    ],
    subtotal: 19000,
    total: 19000,
    payments: [
      { date: "02/06/2026", method: "Credit Card", amount: 6000 },
      { date: "02/06/2026", method: "Credit Card / PayPal", amount: 6000 },
      { date: "02/26/2026", method: "Credit Card / PayPal", amount: 7000 },
    ],
    paidTotal: 19000,
    remainingAmount: 0,
    status: "paid",
  },
  {
    invoiceNumber: "1093",
    date: "01/29/2026",
    billTo: "Ryan Miller – Beta Rho Property Co, 3819 Walnut St, Philadelphia, PA 19035",
    description: "Snow removal",
    lineItems: [
      { description: "Snow removal – Salted the lot twice, snow removal once", rate: 1200, quantity: 1, total: 1200 },
    ],
    subtotal: 1200,
    total: 1200,
    payments: [{ date: "03/04/2026", method: "Cash", amount: 1200 }],
    paidTotal: 1200,
    remainingAmount: 0,
    status: "paid",
  },
  {
    invoiceNumber: "1094",
    date: "01/29/2026",
    billTo: "Ryan Miller – Beta Rho Property Co, 3819 Walnut St, Philadelphia, PA 19035",
    description: "Salting",
    lineItems: [
      { description: "Salting – Salted the lot twice, snow removal once", rate: 600, quantity: 1, total: 600 },
    ],
    subtotal: 600,
    total: 600,
    payments: [{ date: "03/04/2026", method: "Cash", amount: 600 }],
    paidTotal: 600,
    remainingAmount: 0,
    notes: "Salting and ice removal Monday Jan 19th",
    status: "paid",
  },
  {
    invoiceNumber: "1095",
    date: "01/29/2026",
    billTo: "Ryan Miller – Beta Rho Property Co, 3819 Walnut St, Philadelphia, PA 19035",
    description: "Heavy snow removal",
    lineItems: [
      { description: "Heavy snow removal – Salted the lot twice, heavy snow removal once", rate: 2600, quantity: 1, total: 2600 },
    ],
    subtotal: 2600,
    total: 2600,
    payments: [{ date: "03/04/2026", method: "Cash", amount: 2600 }],
    paidTotal: 2600,
    remainingAmount: 0,
    notes: "Salting and ice removal Monday Jan 19th",
    status: "paid",
  },
  {
    invoiceNumber: "1097",
    date: "02/11/2026",
    billTo: "Mark – 2033 Darien St, Philadelphia, PA 19148",
    description: "Concrete footing",
    lineItems: [
      { description: "Concrete footing", rate: 1119.06, quantity: 1, total: 1119.06 },
    ],
    subtotal: 1119.06,
    total: 1119.06,
    payments: [{ date: "03/04/2026", method: "Check", amount: 1119.06 }],
    paidTotal: 1119.06,
    remainingAmount: 0,
    status: "paid",
  },
];
