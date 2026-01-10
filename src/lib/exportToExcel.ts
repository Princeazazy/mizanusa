import * as XLSX from 'xlsx-js-style';
import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  transfers,
  octoberSummary,
  novemberSummary,
} from '@/data/bankTransactions';
import {
  octoberInspections,
  novemberInspections,
  decemberInspections,
  inspectionsSummary,
} from '@/data/esafetyInspections';
import { vituInvoices, vituSummary } from '@/data/vituStatements';
import { chartOfAccounts } from '@/data/chartOfAccounts';

// Professional color palette
const colors = {
  navyBlue: '1e3a5f',
  darkBlue: '0f2744',
  gold: 'd4a574',
  white: 'FFFFFF',
  lightGray: 'f8f9fa',
  mediumGray: 'e9ecef',
  darkGray: '6c757d',
  black: '000000',
  green: '198754',
  red: 'dc3545',
};

// Style definitions
const styles = {
  companyHeader: {
    font: { bold: true, sz: 18, color: { rgb: colors.white } },
    fill: { fgColor: { rgb: colors.navyBlue } },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  subHeader: {
    font: { bold: true, sz: 14, color: { rgb: colors.white } },
    fill: { fgColor: { rgb: colors.darkBlue } },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  sectionTitle: {
    font: { bold: true, sz: 12, color: { rgb: colors.navyBlue } },
    fill: { fgColor: { rgb: colors.mediumGray } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: colors.navyBlue } },
      bottom: { style: 'thin', color: { rgb: colors.navyBlue } },
    },
  },
  tableHeader: {
    font: { bold: true, sz: 10, color: { rgb: colors.white } },
    fill: { fgColor: { rgb: colors.navyBlue } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: colors.darkBlue } },
      bottom: { style: 'thin', color: { rgb: colors.darkBlue } },
      left: { style: 'thin', color: { rgb: colors.darkBlue } },
      right: { style: 'thin', color: { rgb: colors.darkBlue } },
    },
  },
  tableCell: {
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: colors.mediumGray } },
      bottom: { style: 'thin', color: { rgb: colors.mediumGray } },
      left: { style: 'thin', color: { rgb: colors.mediumGray } },
      right: { style: 'thin', color: { rgb: colors.mediumGray } },
    },
  },
  tableCellAlt: {
    font: { sz: 10 },
    fill: { fgColor: { rgb: colors.lightGray } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: colors.mediumGray } },
      bottom: { style: 'thin', color: { rgb: colors.mediumGray } },
      left: { style: 'thin', color: { rgb: colors.mediumGray } },
      right: { style: 'thin', color: { rgb: colors.mediumGray } },
    },
  },
  currencyCell: {
    font: { sz: 10 },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '"$"#,##0.00',
    border: {
      top: { style: 'thin', color: { rgb: colors.mediumGray } },
      bottom: { style: 'thin', color: { rgb: colors.mediumGray } },
      left: { style: 'thin', color: { rgb: colors.mediumGray } },
      right: { style: 'thin', color: { rgb: colors.mediumGray } },
    },
  },
  currencyCellAlt: {
    font: { sz: 10 },
    fill: { fgColor: { rgb: colors.lightGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '"$"#,##0.00',
    border: {
      top: { style: 'thin', color: { rgb: colors.mediumGray } },
      bottom: { style: 'thin', color: { rgb: colors.mediumGray } },
      left: { style: 'thin', color: { rgb: colors.mediumGray } },
      right: { style: 'thin', color: { rgb: colors.mediumGray } },
    },
  },
  totalRow: {
    font: { bold: true, sz: 10, color: { rgb: colors.navyBlue } },
    fill: { fgColor: { rgb: colors.gold } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
      top: { style: 'medium', color: { rgb: colors.navyBlue } },
      bottom: { style: 'medium', color: { rgb: colors.navyBlue } },
      left: { style: 'thin', color: { rgb: colors.navyBlue } },
      right: { style: 'thin', color: { rgb: colors.navyBlue } },
    },
  },
  totalCurrency: {
    font: { bold: true, sz: 10, color: { rgb: colors.navyBlue } },
    fill: { fgColor: { rgb: colors.gold } },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '"$"#,##0.00',
    border: {
      top: { style: 'medium', color: { rgb: colors.navyBlue } },
      bottom: { style: 'medium', color: { rgb: colors.navyBlue } },
      left: { style: 'thin', color: { rgb: colors.navyBlue } },
      right: { style: 'thin', color: { rgb: colors.navyBlue } },
    },
  },
  balanceLabel: {
    font: { bold: true, sz: 11, color: { rgb: colors.navyBlue } },
    alignment: { horizontal: 'right', vertical: 'center' },
  },
  balanceValue: {
    font: { bold: true, sz: 11, color: { rgb: colors.navyBlue } },
    alignment: { horizontal: 'left', vertical: 'center' },
    numFmt: '"$"#,##0.00',
  },
  reconciledBadge: {
    font: { bold: true, sz: 10, color: { rgb: colors.white } },
    fill: { fgColor: { rgb: colors.green } },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  varianceBadge: {
    font: { bold: true, sz: 10, color: { rgb: colors.white } },
    fill: { fgColor: { rgb: colors.red } },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
};

// Helper to apply style to a cell
const setCell = (sheet: XLSX.WorkSheet, cell: string, value: string | number, style: object) => {
  sheet[cell] = { v: value, t: typeof value === 'number' ? 'n' : 's', s: style };
};

// Helper to create a professionally formatted sheet
const createProfessionalSheet = (
  title: string,
  subtitle: string,
  colWidths: number[]
): { sheet: XLSX.WorkSheet; startRow: number } => {
  const sheet: XLSX.WorkSheet = {};
  
  // Set column widths
  sheet['!cols'] = colWidths.map(w => ({ wch: w }));
  
  // Row 1: Logo + Company Name (merged across all columns)
  const lastCol = String.fromCharCode(64 + colWidths.length);
  sheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colWidths.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colWidths.length - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: colWidths.length - 1 } },
  ];
  
  // Company header with logo text
  setCell(sheet, 'A1', '★  APEX ACCOUNTING  ★', styles.companyHeader);
  for (let i = 1; i < colWidths.length; i++) {
    setCell(sheet, String.fromCharCode(65 + i) + '1', '', styles.companyHeader);
  }
  
  // Title row
  setCell(sheet, 'A2', title, styles.subHeader);
  for (let i = 1; i < colWidths.length; i++) {
    setCell(sheet, String.fromCharCode(65 + i) + '2', '', styles.subHeader);
  }
  
  // Subtitle row
  setCell(sheet, 'A3', subtitle, {
    font: { sz: 10, color: { rgb: colors.darkGray } },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: colors.lightGray } },
  });
  for (let i = 1; i < colWidths.length; i++) {
    setCell(sheet, String.fromCharCode(65 + i) + '3', '', {
      fill: { fgColor: { rgb: colors.lightGray } },
    });
  }
  
  // Set row heights
  sheet['!rows'] = [{ hpt: 30 }, { hpt: 24 }, { hpt: 20 }];
  
  return { sheet, startRow: 5 }; // Start data at row 5 (0-indexed: 4)
};

// Helper to add a table header
const addTableHeader = (
  sheet: XLSX.WorkSheet,
  row: number,
  headers: string[],
  startCol: number = 0
) => {
  headers.forEach((header, idx) => {
    const col = String.fromCharCode(65 + startCol + idx);
    setCell(sheet, `${col}${row}`, header, styles.tableHeader);
  });
};

// Helper to add a data row
const addDataRow = (
  sheet: XLSX.WorkSheet,
  row: number,
  data: (string | number)[],
  currencyColumns: number[] = [],
  isAlt: boolean = false,
  startCol: number = 0
) => {
  data.forEach((value, idx) => {
    const col = String.fromCharCode(65 + startCol + idx);
    const isCurrency = currencyColumns.includes(idx);
    let style;
    
    if (isCurrency) {
      style = isAlt ? styles.currencyCellAlt : styles.currencyCell;
    } else {
      style = isAlt ? styles.tableCellAlt : styles.tableCell;
    }
    
    setCell(sheet, `${col}${row}`, value, style);
  });
};

// Helper to add a total row
const addTotalRow = (
  sheet: XLSX.WorkSheet,
  row: number,
  data: (string | number)[],
  currencyColumns: number[] = [],
  startCol: number = 0
) => {
  data.forEach((value, idx) => {
    const col = String.fromCharCode(65 + startCol + idx);
    const isCurrency = currencyColumns.includes(idx);
    const style = isCurrency ? styles.totalCurrency : styles.totalRow;
    setCell(sheet, `${col}${row}`, value, style);
  });
};

export const exportToExcel = () => {
  const workbook = XLSX.utils.book_new();

  // ==========================================
  // Sheet 1: Dashboard Summary
  // ==========================================
  const { sheet: dashSheet, startRow: dashStart } = createProfessionalSheet(
    'CVS Auto Sales Inc. - Financial Dashboard',
    '715 Huntingdon Pike, Rockledge, PA 19046 | Q4 2025',
    [25, 20, 20, 20, 20]
  );
  
  // Executive Summary section
  let row = dashStart;
  setCell(dashSheet, `A${row}`, 'EXECUTIVE SUMMARY', styles.sectionTitle);
  for (let i = 1; i < 5; i++) {
    setCell(dashSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(dashSheet, row, ['Metric', 'Amount']);
  row++;
  
  const totalDeposits = octoberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0) +
    novemberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0);
  const totalWithdrawals = octoberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0) +
    novemberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0);
  
  const summaryData = [
    ['Total Bank Deposits (Oct-Nov)', totalDeposits],
    ['Total Bank Expenses (Oct-Nov)', totalWithdrawals],
    ['PA eSafety Revenue (423 inspections)', inspectionsSummary.total.revenue],
    ['Vitu Expenses (Q4)', vituSummary.quarterTotal],
  ];
  
  summaryData.forEach((d, idx) => {
    addDataRow(dashSheet, row, d, [1], idx % 2 === 1);
    row++;
  });
  
  // Period Breakdown section
  row += 2;
  setCell(dashSheet, `A${row}`, 'PERIOD BREAKDOWN', styles.sectionTitle);
  for (let i = 1; i < 5; i++) {
    setCell(dashSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(dashSheet, row, ['Month', 'Beginning Balance', 'Deposits', 'Withdrawals', 'Ending Balance']);
  row++;
  
  const periodData = [
    ['October 2025', octoberSummary.beginningBalance, 
      octoberDeposits.reduce((sum, d) => sum + d.amount, 0),
      octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      octoberSummary.endingBalance],
    ['November 2025', novemberSummary.beginningBalance, 
      novemberDeposits.reduce((sum, d) => sum + d.amount, 0),
      novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      novemberSummary.endingBalance],
  ];
  
  periodData.forEach((d, idx) => {
    addDataRow(dashSheet, row, d, [1, 2, 3, 4], idx % 2 === 1);
    row++;
  });
  
  dashSheet['!ref'] = `A1:E${row}`;
  XLSX.utils.book_append_sheet(workbook, dashSheet, 'Dashboard');

  // ==========================================
  // Sheet 2: October 2025 Checking Account
  // ==========================================
  const { sheet: octSheet, startRow: octStart } = createProfessionalSheet(
    'Checking Account - October 2025',
    'CVS Auto Sales Inc.',
    [12, 35, 12, 10, 22, 15]
  );
  
  row = octStart;
  setCell(octSheet, `A${row}`, 'Beginning Balance:', styles.balanceLabel);
  setCell(octSheet, `B${row}`, octoberSummary.beginningBalance, styles.balanceValue);
  
  // Deposits section
  row += 2;
  setCell(octSheet, `A${row}`, 'DEPOSITS', styles.sectionTitle);
  for (let i = 1; i < 6; i++) {
    setCell(octSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(octSheet, row, ['Date', 'Description', 'COA Code', 'Category', 'Amount']);
  row++;
  
  octoberDeposits.forEach((d, idx) => {
    addDataRow(octSheet, row, [d.date, d.description, d.coaCode, d.category, d.amount], [4], idx % 2 === 1);
    row++;
  });
  
  addTotalRow(octSheet, row, ['', '', '', 'TOTAL DEPOSITS', octoberDeposits.reduce((sum, d) => sum + d.amount, 0)], [4]);
  row++;
  
  // Withdrawals section
  row += 2;
  setCell(octSheet, `A${row}`, 'WITHDRAWALS', styles.sectionTitle);
  for (let i = 1; i < 6; i++) {
    setCell(octSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(octSheet, row, ['Date', 'Description', 'Check #', 'COA Code', 'Category', 'Amount']);
  row++;
  
  octoberWithdrawals.forEach((w, idx) => {
    addDataRow(octSheet, row, [w.date, w.description, w.checkNumber || '', w.coaCode, w.category, w.amount], [5], idx % 2 === 1);
    row++;
  });
  
  addTotalRow(octSheet, row, ['', '', '', '', 'TOTAL WITHDRAWALS', octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0)], [5]);
  row++;
  
  // Ending balance
  row += 2;
  setCell(octSheet, `D${row}`, 'Ending Balance:', styles.balanceLabel);
  setCell(octSheet, `E${row}`, octoberSummary.endingBalance, styles.balanceValue);
  row++;
  setCell(octSheet, `D${row}`, 'Statement Balance:', styles.balanceLabel);
  setCell(octSheet, `E${row}`, octoberSummary.statementEndingBalance, styles.balanceValue);
  row++;
  setCell(octSheet, `D${row}`, 'Status:', styles.balanceLabel);
  const octReconciled = octoberSummary.endingBalance === octoberSummary.statementEndingBalance;
  setCell(octSheet, `E${row}`, octReconciled ? '✓ RECONCILED' : 'VARIANCE', octReconciled ? styles.reconciledBadge : styles.varianceBadge);
  
  octSheet['!ref'] = `A1:F${row}`;
  XLSX.utils.book_append_sheet(workbook, octSheet, 'Oct 2025 Checking');

  // ==========================================
  // Sheet 3: November 2025 Checking Account
  // ==========================================
  const { sheet: novSheet, startRow: novStart } = createProfessionalSheet(
    'Checking Account - November 2025',
    'CVS Auto Sales Inc.',
    [12, 35, 12, 10, 22, 15]
  );
  
  row = novStart;
  setCell(novSheet, `A${row}`, 'Beginning Balance:', styles.balanceLabel);
  setCell(novSheet, `B${row}`, novemberSummary.beginningBalance, styles.balanceValue);
  
  // Deposits section
  row += 2;
  setCell(novSheet, `A${row}`, 'DEPOSITS', styles.sectionTitle);
  for (let i = 1; i < 6; i++) {
    setCell(novSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(novSheet, row, ['Date', 'Description', 'COA Code', 'Category', 'Amount']);
  row++;
  
  novemberDeposits.forEach((d, idx) => {
    addDataRow(novSheet, row, [d.date, d.description, d.coaCode, d.category, d.amount], [4], idx % 2 === 1);
    row++;
  });
  
  addTotalRow(novSheet, row, ['', '', '', 'TOTAL DEPOSITS', novemberDeposits.reduce((sum, d) => sum + d.amount, 0)], [4]);
  row++;
  
  // Withdrawals section
  row += 2;
  setCell(novSheet, `A${row}`, 'WITHDRAWALS', styles.sectionTitle);
  for (let i = 1; i < 6; i++) {
    setCell(novSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(novSheet, row, ['Date', 'Description', 'Check #', 'COA Code', 'Category', 'Amount']);
  row++;
  
  novemberWithdrawals.forEach((w, idx) => {
    addDataRow(novSheet, row, [w.date, w.description, w.checkNumber || '', w.coaCode, w.category, w.amount], [5], idx % 2 === 1);
    row++;
  });
  
  addTotalRow(novSheet, row, ['', '', '', '', 'TOTAL WITHDRAWALS', novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0)], [5]);
  row++;
  
  // Ending balance
  row += 2;
  setCell(novSheet, `D${row}`, 'Ending Balance:', styles.balanceLabel);
  setCell(novSheet, `E${row}`, novemberSummary.endingBalance, styles.balanceValue);
  row++;
  setCell(novSheet, `D${row}`, 'Statement Balance:', styles.balanceLabel);
  setCell(novSheet, `E${row}`, novemberSummary.statementEndingBalance, styles.balanceValue);
  row++;
  setCell(novSheet, `D${row}`, 'Status:', styles.balanceLabel);
  const novReconciled = novemberSummary.endingBalance === novemberSummary.statementEndingBalance;
  setCell(novSheet, `E${row}`, novReconciled ? '✓ RECONCILED' : 'VARIANCE', novReconciled ? styles.reconciledBadge : styles.varianceBadge);
  
  novSheet['!ref'] = `A1:F${row}`;
  XLSX.utils.book_append_sheet(workbook, novSheet, 'Nov 2025 Checking');

  // ==========================================
  // Sheet 4: Inter-Account Transfers
  // ==========================================
  const { sheet: transSheet, startRow: transStart } = createProfessionalSheet(
    'Inter-Account Transfers',
    'Q4 2025',
    [12, 18, 18, 15, 25]
  );
  
  row = transStart;
  addTableHeader(transSheet, row, ['Date', 'From Account', 'To Account', 'Amount', 'Reference']);
  row++;
  
  transfers.forEach((t, idx) => {
    addDataRow(transSheet, row, [t.date, t.from, t.to, t.amount, t.reference], [3], idx % 2 === 1);
    row++;
  });
  
  addTotalRow(transSheet, row, ['', '', 'TOTAL', transfers.reduce((sum, t) => sum + t.amount, 0), ''], [3]);
  
  transSheet['!ref'] = `A1:E${row}`;
  XLSX.utils.book_append_sheet(workbook, transSheet, 'Transfers');

  // ==========================================
  // Sheet 5: PA eSafety Inspections
  // ==========================================
  const { sheet: esafetySheet, startRow: esafetyStart } = createProfessionalSheet(
    'PA eSafety - Salvage Inspections',
    'October - December 2025',
    [12, 15, 12, 32, 22, 12]
  );
  
  row = esafetyStart;
  setCell(esafetySheet, `A${row}`, 'QUARTERLY SUMMARY', styles.sectionTitle);
  for (let i = 1; i < 6; i++) {
    setCell(esafetySheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(esafetySheet, row, ['Month', 'Inspections', 'Revenue']);
  row++;
  
  const inspSummaryData = [
    ['October 2025', inspectionsSummary.october.count, inspectionsSummary.october.revenue],
    ['November 2025', inspectionsSummary.november.count, inspectionsSummary.november.revenue],
    ['December 2025', inspectionsSummary.december.count, inspectionsSummary.december.revenue],
  ];
  
  inspSummaryData.forEach((d, idx) => {
    addDataRow(esafetySheet, row, d, [2], idx % 2 === 1);
    row++;
  });
  
  addTotalRow(esafetySheet, row, ['TOTAL', inspectionsSummary.total.count, inspectionsSummary.total.revenue], [2]);
  row++;
  
  // Detailed inspections
  row += 2;
  setCell(esafetySheet, `A${row}`, 'DETAILED INSPECTIONS', styles.sectionTitle);
  for (let i = 1; i < 6; i++) {
    setCell(esafetySheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(esafetySheet, row, ['Date', 'Sticker #', 'Work Order', 'Customer Name', 'VIN', 'Fee']);
  row++;
  
  const allInspections = [...octoberInspections, ...novemberInspections, ...decemberInspections];
  allInspections.forEach((i, idx) => {
    addDataRow(esafetySheet, row, [i.date, i.stickerNumber, i.workOrder, i.customerName, i.vin, i.fee], [5], idx % 2 === 1);
    row++;
  });
  
  esafetySheet['!ref'] = `A1:F${row}`;
  XLSX.utils.book_append_sheet(workbook, esafetySheet, 'PA eSafety');

  // ==========================================
  // Sheet 6: Vitu Title Services
  // ==========================================
  const { sheet: vituSheet, startRow: vituStart } = createProfessionalSheet(
    'Vitu - Title Services',
    'October - December 2025',
    [28, 15, 15, 15]
  );
  
  row = vituStart;
  setCell(vituSheet, `A${row}`, 'QUARTER SUMMARY', styles.sectionTitle);
  for (let i = 1; i < 4; i++) {
    setCell(vituSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(vituSheet, row, ['Metric', 'Value']);
  row++;
  addDataRow(vituSheet, row, ['Total DLDV Lookups', vituSummary.totalDLDVLookups], [], false);
  row++;
  addDataRow(vituSheet, row, ['Total NMVTIS Inquiries', vituSummary.totalNMVTISInquiries], [], true);
  row++;
  addTotalRow(vituSheet, row, ['Quarter Total', vituSummary.quarterTotal], [1]);
  row++;
  
  // Individual invoices
  vituInvoices.forEach(invoice => {
    row += 2;
    setCell(vituSheet, `A${row}`, `INVOICE #${invoice.invoiceNumber} - ${invoice.month}`, styles.sectionTitle);
    for (let i = 1; i < 4; i++) {
      setCell(vituSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
    }
    
    row += 2;
    addTableHeader(vituSheet, row, ['Service', 'Quantity', 'Rate', 'Total']);
    row++;
    
    invoice.lineItems.forEach((item, idx) => {
      addDataRow(vituSheet, row, [item.service, item.quantity, item.rate, item.total], [2, 3], idx % 2 === 1);
      row++;
    });
    
    addTotalRow(vituSheet, row, ['', '', 'Invoice Total', invoice.total], [3]);
    row++;
  });
  
  vituSheet['!ref'] = `A1:D${row}`;
  XLSX.utils.book_append_sheet(workbook, vituSheet, 'Vitu');

  // ==========================================
  // Sheet 7: Chart of Accounts
  // ==========================================
  const { sheet: coaSheet, startRow: coaStart } = createProfessionalSheet(
    'Chart of Accounts',
    'CVS Auto Sales Inc.',
    [12, 32, 15, 45]
  );
  
  row = coaStart;
  addTableHeader(coaSheet, row, ['Code', 'Account Name', 'Type', 'Description']);
  row++;
  
  chartOfAccounts.forEach((account, idx) => {
    addDataRow(coaSheet, row, [account.code, account.name, account.type, account.description || ''], [], idx % 2 === 1);
    row++;
  });
  
  coaSheet['!ref'] = `A1:D${row}`;
  XLSX.utils.book_append_sheet(workbook, coaSheet, 'Chart of Accounts');

  // ==========================================
  // Sheet 8: Reconciliation Summary
  // ==========================================
  const { sheet: reconSheet, startRow: reconStart } = createProfessionalSheet(
    'Bank Reconciliation Summary',
    'Q4 2025',
    [15, 18, 16, 16, 16, 18, 15]
  );
  
  row = reconStart;
  setCell(reconSheet, `A${row}`, 'MONTHLY RECONCILIATION', styles.sectionTitle);
  for (let i = 1; i < 7; i++) {
    setCell(reconSheet, String.fromCharCode(65 + i) + row, '', styles.sectionTitle);
  }
  
  row += 2;
  addTableHeader(reconSheet, row, ['Month', 'Beginning', 'Deposits', 'Withdrawals', 'Ending', 'Statement', 'Status']);
  row++;
  
  // October reconciliation
  const octDepositsTotal = octoberDeposits.reduce((sum, d) => sum + d.amount, 0);
  const octWithdrawalsTotal = octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const octStatus = octoberSummary.endingBalance === octoberSummary.statementEndingBalance;
  
  addDataRow(reconSheet, row, [
    'October 2025',
    octoberSummary.beginningBalance,
    octDepositsTotal,
    octWithdrawalsTotal,
    octoberSummary.endingBalance,
    octoberSummary.statementEndingBalance,
  ], [1, 2, 3, 4, 5], false);
  setCell(reconSheet, `G${row}`, octStatus ? '✓ Reconciled' : 'Variance', octStatus ? styles.reconciledBadge : styles.varianceBadge);
  row++;
  
  // November reconciliation
  const novDepositsTotal = novemberDeposits.reduce((sum, d) => sum + d.amount, 0);
  const novWithdrawalsTotal = novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const novStatus = novemberSummary.endingBalance === novemberSummary.statementEndingBalance;
  
  addDataRow(reconSheet, row, [
    'November 2025',
    novemberSummary.beginningBalance,
    novDepositsTotal,
    novWithdrawalsTotal,
    novemberSummary.endingBalance,
    novemberSummary.statementEndingBalance,
  ], [1, 2, 3, 4, 5], true);
  setCell(reconSheet, `G${row}`, novStatus ? '✓ Reconciled' : 'Variance', novStatus ? styles.reconciledBadge : styles.varianceBadge);
  
  reconSheet['!ref'] = `A1:G${row}`;
  XLSX.utils.book_append_sheet(workbook, reconSheet, 'Reconciliation');

  // Generate and download the file
  XLSX.writeFile(workbook, 'CVS_Auto_Sales_Q4_2025_Bookkeeping.xlsx');
};
