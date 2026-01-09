export interface COAEntry {
  code: string;
  name: string;
  type: 'Revenue' | 'COGS' | 'Expense' | 'Asset' | 'Liability' | 'Equity';
  description?: string;
}

export const chartOfAccounts: COAEntry[] = [
  // Income Accounts (4000 series)
  { code: "4100", name: "Credit Card Sales", type: "Revenue", description: "Merchant BankCard deposits" },
  { code: "4110", name: "Cash/Check Sales", type: "Revenue", description: "Cash and check deposits" },
  { code: "4120", name: "Venmo/Digital Sales", type: "Revenue", description: "Venmo and digital payment sales" },
  { code: "4200", name: "Salvage Inspection Fees", type: "Revenue", description: "PA eSafety inspection revenue" },
  { code: "4900", name: "Other Income", type: "Revenue", description: "Miscellaneous income" },
  
  // Cost of Goods Sold (5000 series)
  { code: "5000", name: "Vehicle Inventory Purchases", type: "COGS", description: "COPART and vehicle acquisitions" },
  { code: "5100", name: "Title & Registration Fees", type: "COGS", description: "MOTOR VEHICLE SO, PENNDOT fees" },
  { code: "5110", name: "Floor Plan Interest", type: "COGS", description: "Floor plan financing costs" },
  { code: "5120", name: "Title Lookup Services", type: "COGS", description: "VITU RTS title services" },
  
  // Operating Expenses (6000 series)
  { code: "6100", name: "Utilities", type: "Expense", description: "PECO Energy, water, gas" },
  { code: "6200", name: "Communications", type: "Expense", description: "Verizon, internet, phone" },
  { code: "6300", name: "Office & Supplies", type: "Expense", description: "Costco, office supplies, retail" },
  { code: "6400", name: "Vehicle Operating", type: "Expense", description: "Fuel - Sunoco, maintenance" },
  { code: "6500", name: "Credit Card Processing Fees", type: "Expense", description: "Merchant processing fees" },
  { code: "6600", name: "Bank Fees", type: "Expense", description: "Service charges, overdraft fees" },
  { code: "6700", name: "Insurance", type: "Expense", description: "IPFS, United Financial insurance" },
  { code: "6800", name: "Other Operating Expenses", type: "Expense", description: "Miscellaneous operating costs" },
  
  // Transfer Account
  { code: "9999", name: "Inter-Account Transfers", type: "Asset", description: "Transfers between checking/savings" },
];

export const getAccountByCode = (code: string): COAEntry | undefined => {
  return chartOfAccounts.find(account => account.code === code);
};

export const getAccountsByType = (type: COAEntry['type']): COAEntry[] => {
  return chartOfAccounts.filter(account => account.type === type);
};
