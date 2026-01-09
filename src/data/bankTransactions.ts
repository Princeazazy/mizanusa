export interface Transaction {
  date: string;
  description: string;
  checkNumber?: string;
  coaCode: string;
  category: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

export interface TransferTransaction {
  date: string;
  from: string;
  to: string;
  amount: number;
  reference: string;
}

export const octoberDeposits: Transaction[] = [
  { date: "10/02", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 2793.00, type: "deposit" },
  { date: "10/02", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 7500.00, type: "deposit" },
  { date: "10/06", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 688.00, type: "deposit" },
  { date: "10/07", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 4614.00, type: "deposit" },
  { date: "10/08", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 9000.00, type: "deposit" },
  { date: "10/09", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 3150.00, type: "deposit" },
  { date: "10/10", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 6500.00, type: "deposit" },
  { date: "10/15", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 5200.00, type: "deposit" },
  { date: "10/16", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 8500.00, type: "deposit" },
  { date: "10/17", description: "ACH VENMO", coaCode: "4120", category: "Venmo Sales", amount: 2500.00, type: "deposit" },
  { date: "10/21", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 4800.00, type: "deposit" },
  { date: "10/22", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 7200.00, type: "deposit" },
  { date: "10/23", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 3500.00, type: "deposit" },
  { date: "10/28", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 6800.00, type: "deposit" },
  { date: "10/29", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 4250.00, type: "deposit" },
  { date: "10/31", description: "Transfer from Savings", coaCode: "9999", category: "Transfer In", amount: 1075.60, type: "deposit" },
  { date: "10/31", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 2500.06, type: "deposit" },
];

export const octoberWithdrawals: Transaction[] = [
  { date: "10/01", description: "ACH MOTOR VEHICLE SO", coaCode: "5100", category: "Title & Registration", amount: 2628.00, type: "withdrawal" },
  { date: "10/02", description: "ACH VITU RTS", coaCode: "5120", category: "Title Lookup Services", amount: 809.16, type: "withdrawal" },
  { date: "10/03", description: "ACH PECO ENERGY", coaCode: "6100", category: "Utilities", amount: 245.87, type: "withdrawal" },
  { date: "10/04", description: "Debit Card SUNOCO", coaCode: "6400", category: "Vehicle Operating", amount: 67.50, type: "withdrawal" },
  { date: "10/07", description: "ACH VERIZON WIRELESS", coaCode: "6200", category: "Communications", amount: 189.99, type: "withdrawal" },
  { date: "10/08", description: "Transfer to Savings", coaCode: "9999", category: "Transfer Out", amount: 500.00, type: "withdrawal" },
  { date: "10/09", description: "ACH IPFS CORPORATION", coaCode: "6700", category: "Insurance", amount: 1250.00, type: "withdrawal" },
  { date: "10/10", description: "Check #1205", checkNumber: "1205", coaCode: "6300", category: "Office & Supplies", amount: 425.00, type: "withdrawal" },
  { date: "10/14", description: "ACH MOTOR VEHICLE SO", coaCode: "5100", category: "Title & Registration", amount: 3156.00, type: "withdrawal" },
  { date: "10/15", description: "Debit Card COSTCO", coaCode: "6300", category: "Office & Supplies", amount: 287.45, type: "withdrawal" },
  { date: "10/17", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 2223.00, type: "withdrawal" },
  { date: "10/18", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 4500.00, type: "withdrawal" },
  { date: "10/21", description: "ACH MERCHANT FEES", coaCode: "6500", category: "Processing Fees", amount: 156.78, type: "withdrawal" },
  { date: "10/22", description: "ACH VITU RTS", coaCode: "5120", category: "Title Lookup Services", amount: 654.32, type: "withdrawal" },
  { date: "10/23", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 3750.00, type: "withdrawal" },
  { date: "10/24", description: "Check #1206", checkNumber: "1206", coaCode: "5000", category: "Inventory Purchases", amount: 15000.00, type: "withdrawal" },
  { date: "10/25", description: "ACH MOTOR VEHICLE SO", coaCode: "5100", category: "Title & Registration", amount: 2890.00, type: "withdrawal" },
  { date: "10/28", description: "ACH UNITED FINANCIAL", coaCode: "6700", category: "Insurance", amount: 875.00, type: "withdrawal" },
  { date: "10/29", description: "Debit Card SUNOCO", coaCode: "6400", category: "Vehicle Operating", amount: 82.35, type: "withdrawal" },
  { date: "10/30", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 5600.00, type: "withdrawal" },
  { date: "10/31", description: "Bank Service Charge", coaCode: "6600", category: "Bank Fees", amount: 35.00, type: "withdrawal" },
  { date: "10/31", description: "Overdraft Fee", coaCode: "6600", category: "Bank Fees", amount: 36.00, type: "withdrawal" },
  { date: "10/31", description: "ACH PENNDOT", coaCode: "5100", category: "Title & Registration", amount: 1522.18, type: "withdrawal" },
  { date: "10/31", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 38000.00, type: "withdrawal" },
];

export const novemberDeposits: Transaction[] = [
  { date: "11/01", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 3250.00, type: "deposit" },
  { date: "11/03", description: "Transfer from Savings", coaCode: "9999", category: "Transfer In", amount: 2500.00, type: "deposit" },
  { date: "11/04", description: "Transfer from Savings", coaCode: "9999", category: "Transfer In", amount: 1800.00, type: "deposit" },
  { date: "11/04", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 8500.00, type: "deposit" },
  { date: "11/05", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 5600.00, type: "deposit" },
  { date: "11/06", description: "ACH VENMO", coaCode: "4120", category: "Venmo Sales", amount: 3200.00, type: "deposit" },
  { date: "11/08", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 7800.00, type: "deposit" },
  { date: "11/11", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 4100.00, type: "deposit" },
  { date: "11/12", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 9500.00, type: "deposit" },
  { date: "11/14", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 2890.00, type: "deposit" },
  { date: "11/18", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 6700.00, type: "deposit" },
  { date: "11/19", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 4500.00, type: "deposit" },
  { date: "11/20", description: "ACH VENMO", coaCode: "4120", category: "Venmo Sales", amount: 1850.00, type: "deposit" },
  { date: "11/22", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 5200.00, type: "deposit" },
  { date: "11/25", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 3800.00, type: "deposit" },
  { date: "11/26", description: "Check Deposit", coaCode: "4110", category: "Cash/Check Sales", amount: 4200.00, type: "deposit" },
  { date: "11/29", description: "ACH MERCHANT BANKCD", coaCode: "4100", category: "Credit Card Sales", amount: 1971.19, type: "deposit" },
];

export const novemberWithdrawals: Transaction[] = [
  { date: "11/01", description: "ACH MOTOR VEHICLE SO", coaCode: "5100", category: "Title & Registration", amount: 2456.00, type: "withdrawal" },
  { date: "11/04", description: "ACH VITU RTS", coaCode: "5120", category: "Title Lookup Services", amount: 756.45, type: "withdrawal" },
  { date: "11/05", description: "ACH PECO ENERGY", coaCode: "6100", category: "Utilities", amount: 312.56, type: "withdrawal" },
  { date: "11/06", description: "Debit Card SUNOCO", coaCode: "6400", category: "Vehicle Operating", amount: 75.80, type: "withdrawal" },
  { date: "11/07", description: "ACH VERIZON WIRELESS", coaCode: "6200", category: "Communications", amount: 189.99, type: "withdrawal" },
  { date: "11/08", description: "ACH IPFS CORPORATION", coaCode: "6700", category: "Insurance", amount: 1250.00, type: "withdrawal" },
  { date: "11/11", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 4800.00, type: "withdrawal" },
  { date: "11/12", description: "ACH MOTOR VEHICLE SO", coaCode: "5100", category: "Title & Registration", amount: 3245.00, type: "withdrawal" },
  { date: "11/13", description: "Check #1207", checkNumber: "1207", coaCode: "5000", category: "Inventory Purchases", amount: 12500.00, type: "withdrawal" },
  { date: "11/14", description: "Debit Card COSTCO", coaCode: "6300", category: "Office & Supplies", amount: 345.67, type: "withdrawal" },
  { date: "11/15", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 5600.00, type: "withdrawal" },
  { date: "11/18", description: "ACH MERCHANT FEES", coaCode: "6500", category: "Processing Fees", amount: 178.90, type: "withdrawal" },
  { date: "11/19", description: "ACH VITU RTS", coaCode: "5120", category: "Title Lookup Services", amount: 589.34, type: "withdrawal" },
  { date: "11/20", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 6200.00, type: "withdrawal" },
  { date: "11/21", description: "ACH MOTOR VEHICLE SO", coaCode: "5100", category: "Title & Registration", amount: 2890.00, type: "withdrawal" },
  { date: "11/22", description: "Debit Card SUNOCO", coaCode: "6400", category: "Vehicle Operating", amount: 68.45, type: "withdrawal" },
  { date: "11/25", description: "ACH UNITED FINANCIAL", coaCode: "6700", category: "Insurance", amount: 875.00, type: "withdrawal" },
  { date: "11/26", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 8500.00, type: "withdrawal" },
  { date: "11/27", description: "ACH PENNDOT", coaCode: "5100", category: "Title & Registration", amount: 1678.00, type: "withdrawal" },
  { date: "11/29", description: "Bank Service Charge", coaCode: "6600", category: "Bank Fees", amount: 35.00, type: "withdrawal" },
  { date: "11/29", description: "ACH COPART INC", coaCode: "5000", category: "Inventory Purchases", amount: 14571.10, type: "withdrawal" },
];

export const transfers: TransferTransaction[] = [
  { date: "10/08", from: "Checking", to: "Savings", amount: 500.00, reference: "Online Transfer" },
  { date: "10/31", from: "Savings", to: "Checking", amount: 1075.60, reference: "Online Transfer" },
  { date: "11/03", from: "Savings", to: "Checking", amount: 2500.00, reference: "Online Transfer" },
  { date: "11/04", from: "Savings", to: "Checking", amount: 1800.00, reference: "Online Transfer" },
];

export const octoberSummary = {
  beginningBalance: 4311.94,
  endingBalance: 0.00,
  statementEndingBalance: 0.00,
};

export const novemberSummary = {
  beginningBalance: 0.00,
  endingBalance: 10443.93,
  statementEndingBalance: 10443.93,
};
