export interface BooksClient {
  id: string;
  name: string;
  demo?: boolean;
}

/** Clients the AI bookkeeping pipeline is enabled for. */
export const BOOKS_CLIENTS: BooksClient[] = [
  { id: "demo", name: "DEMO — Northgate Builders LLC", demo: true },
  { id: "cvs", name: "CVS Auto Sales Inc." },
  { id: "defiore", name: "Defiore Carpentry LLC" },
];

/** Fake statement lines used to seed the demo client. Clearly labelled DEMO. */
export const DEMO_CSV = `Date,Description,Payee,Debit,Credit
04/01/2026,DEPOSIT - PROGRESS BILLING #1042,Northgate Client A,,18450.00
04/02/2026,HOME DEPOT #4471 PURCHASE,Home Depot,1284.63,
04/03/2026,VERIZON WIRELESS AUTOPAY,Verizon,318.44,
04/04/2026,SYSCO FOOD SERVICE INVOICE 88213,Sysco,742.10,
04/06/2026,ACH CREDIT - CARD SETTLEMENT BATCH,Merchant Settlement,,6210.55
04/07/2026,SUNOCO FUEL 0392,Sunoco,142.87,
04/08/2026,STATE FARM BUSINESS POLICY,State Farm,689.00,
04/09/2026,LUMBER YARD OF PHILADELPHIA INV 5521,Lumber Yard of Philadelphia,3960.22,
04/10/2026,MONTHLY SERVICE CHARGE,First Demo Bank,35.00,
04/12/2026,CHECK 1188 - SUBCONTRACT FRAMING,Alvarez Framing LLC,5400.00,
04/13/2026,DEPOSIT - PROGRESS BILLING #1043,Northgate Client B,,22700.00
04/15/2026,PECO ENERGY UTILITY PAYMENT,PECO Energy,412.66,
04/16/2026,OFFICE RENT APRIL,Bridgeview Properties,2400.00,
04/17/2026,STAPLES STORE 0281,Staples,187.94,
04/20/2026,MERCHANT PROCESSING FEES,Stripe,214.08,
04/21/2026,VENMO TRANSFER FROM CUSTOMER,Venmo,,890.00
04/22/2026,ROTO ROOTER EMERGENCY REPAIR,Roto Rooter,725.00,
04/23/2026,PA DEPT OF REVENUE PERMIT FEE,PA Dept of Revenue,96.00,
04/24/2026,CPA MONTHLY BOOKKEEPING FEE,Mizan USA,650.00,
04/27/2026,DEPOSIT - RETAINER RECEIVED,Northgate Client C,,9800.00
04/28/2026,TRANSFER TO SAVINGS XXXX2210,Internal Transfer,5000.00,
04/29/2026,GRUBHUB CREW LUNCH,Grubhub,164.31,
04/30/2026,UNKNOWN VENDOR PAYMENT ZLQ-88,Unclear Vendor,432.19,
`;
