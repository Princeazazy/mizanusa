import * as XLSX from 'xlsx';
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

const formatCurrency = (value: number): string => {
  return value.toFixed(2);
};

export const exportToExcel = () => {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Dashboard Summary
  const dashboardData = [
    ['APEX ACCOUNTING'],
    ['CVS Auto Sales Inc.'],
    ['Financial Workbook - Q4 2025'],
    ['715 Huntingdon Pike, Rockledge, PA 19046'],
    [],
    ['EXECUTIVE SUMMARY'],
    [],
    ['Metric', 'Value'],
    ['Total Bank Deposits (Oct-Nov)', formatCurrency(
      octoberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0) +
      novemberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0)
    )],
    ['Total Bank Expenses (Oct-Nov)', formatCurrency(
      octoberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0) +
      novemberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0)
    )],
    ['PA eSafety Revenue (423 inspections)', formatCurrency(inspectionsSummary.total.revenue)],
    ['Vitu Expenses (Q4)', formatCurrency(vituSummary.quarterTotal)],
    [],
    ['PERIOD BREAKDOWN'],
    [],
    ['Month', 'Beginning Balance', 'Deposits', 'Withdrawals', 'Ending Balance'],
    ['October 2025', formatCurrency(octoberSummary.beginningBalance), 
      formatCurrency(octoberDeposits.reduce((sum, d) => sum + d.amount, 0)),
      formatCurrency(octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0)),
      formatCurrency(octoberSummary.endingBalance)],
    ['November 2025', formatCurrency(novemberSummary.beginningBalance), 
      formatCurrency(novemberDeposits.reduce((sum, d) => sum + d.amount, 0)),
      formatCurrency(novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0)),
      formatCurrency(novemberSummary.endingBalance)],
  ];
  const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardData);
  dashboardSheet['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(workbook, dashboardSheet, 'Dashboard');

  // Sheet 2: October 2025 - Checking Account
  const octoberData = [
    ['APEX ACCOUNTING | CVS Auto Sales Inc. - Checking Account'],
    ['October 2025'],
    [],
    ['Beginning Balance:', formatCurrency(octoberSummary.beginningBalance)],
    [],
    ['DEPOSITS'],
    ['Date', 'Description', 'COA Code', 'Category', 'Amount'],
    ...octoberDeposits.map(d => [d.date, d.description, d.coaCode, d.category, formatCurrency(d.amount)]),
    ['', '', '', 'TOTAL DEPOSITS', formatCurrency(octoberDeposits.reduce((sum, d) => sum + d.amount, 0))],
    [],
    ['WITHDRAWALS'],
    ['Date', 'Description', 'Check #', 'COA Code', 'Category', 'Amount'],
    ...octoberWithdrawals.map(w => [w.date, w.description, w.checkNumber || '', w.coaCode, w.category, formatCurrency(w.amount)]),
    ['', '', '', '', 'TOTAL WITHDRAWALS', formatCurrency(octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0))],
    [],
    ['Ending Balance:', formatCurrency(octoberSummary.endingBalance)],
    ['Statement Balance:', formatCurrency(octoberSummary.statementEndingBalance)],
    ['Reconciled:', octoberSummary.endingBalance === octoberSummary.statementEndingBalance ? '✓ BALANCED' : 'VARIANCE'],
  ];
  const octoberSheet = XLSX.utils.aoa_to_sheet(octoberData);
  octoberSheet['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, octoberSheet, 'Oct 2025 Checking');

  // Sheet 3: November 2025 - Checking Account
  const novemberData = [
    ['APEX ACCOUNTING | CVS Auto Sales Inc. - Checking Account'],
    ['November 2025'],
    [],
    ['Beginning Balance:', formatCurrency(novemberSummary.beginningBalance)],
    [],
    ['DEPOSITS'],
    ['Date', 'Description', 'COA Code', 'Category', 'Amount'],
    ...novemberDeposits.map(d => [d.date, d.description, d.coaCode, d.category, formatCurrency(d.amount)]),
    ['', '', '', 'TOTAL DEPOSITS', formatCurrency(novemberDeposits.reduce((sum, d) => sum + d.amount, 0))],
    [],
    ['WITHDRAWALS'],
    ['Date', 'Description', 'Check #', 'COA Code', 'Category', 'Amount'],
    ...novemberWithdrawals.map(w => [w.date, w.description, w.checkNumber || '', w.coaCode, w.category, formatCurrency(w.amount)]),
    ['', '', '', '', 'TOTAL WITHDRAWALS', formatCurrency(novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0))],
    [],
    ['Ending Balance:', formatCurrency(novemberSummary.endingBalance)],
    ['Statement Balance:', formatCurrency(novemberSummary.statementEndingBalance)],
    ['Reconciled:', novemberSummary.endingBalance === novemberSummary.statementEndingBalance ? '✓ BALANCED' : 'VARIANCE'],
  ];
  const novemberSheet = XLSX.utils.aoa_to_sheet(novemberData);
  novemberSheet['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, novemberSheet, 'Nov 2025 Checking');

  // Sheet 4: Inter-Account Transfers
  const transfersData = [
    ['APEX ACCOUNTING | Inter-Account Transfers'],
    ['Q4 2025'],
    [],
    ['Date', 'From Account', 'To Account', 'Amount', 'Reference'],
    ...transfers.map(t => [t.date, t.from, t.to, formatCurrency(t.amount), t.reference]),
    [],
    ['', '', 'TOTAL', formatCurrency(transfers.reduce((sum, t) => sum + t.amount, 0)), ''],
  ];
  const transfersSheet = XLSX.utils.aoa_to_sheet(transfersData);
  transfersSheet['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, transfersSheet, 'Transfers');

  // Sheet 5: PA eSafety Inspections
  const allInspections = [...octoberInspections, ...novemberInspections, ...decemberInspections];
  const esafetyData = [
    ['APEX ACCOUNTING | PA eSafety - Salvage Inspections'],
    ['October - December 2025'],
    [],
    ['SUMMARY'],
    ['Month', 'Inspections', 'Revenue'],
    ['October 2025', inspectionsSummary.october.count, formatCurrency(inspectionsSummary.october.revenue)],
    ['November 2025', inspectionsSummary.november.count, formatCurrency(inspectionsSummary.november.revenue)],
    ['December 2025', inspectionsSummary.december.count, formatCurrency(inspectionsSummary.december.revenue)],
    ['TOTAL', inspectionsSummary.total.count, formatCurrency(inspectionsSummary.total.revenue)],
    [],
    ['DETAILED INSPECTIONS'],
    ['Date', 'Sticker #', 'Work Order', 'Customer Name', 'VIN', 'Fee'],
    ...allInspections.map(i => [i.date, i.stickerNumber, i.workOrder, i.customerName, i.vin, formatCurrency(i.fee)]),
  ];
  const esafetySheet = XLSX.utils.aoa_to_sheet(esafetyData);
  esafetySheet['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(workbook, esafetySheet, 'PA eSafety');

  // Sheet 6: Vitu Title Services
  const vituData = [
    ['APEX ACCOUNTING | Vitu - Title Services'],
    ['October - December 2025'],
    [],
    ['QUARTER SUMMARY'],
    ['Total DLDV Lookups:', vituSummary.totalDLDVLookups],
    ['Total NMVTIS Inquiries:', vituSummary.totalNMVTISInquiries],
    ['Quarter Total:', formatCurrency(vituSummary.quarterTotal)],
    [],
  ];
  
  vituInvoices.forEach(invoice => {
    vituData.push(
      [`INVOICE #${invoice.invoiceNumber} - ${invoice.month}`],
      ['Invoice Date:', invoice.invoiceDate, 'Due Date:', invoice.dueDate],
      [],
      ['Service', 'Quantity', 'Rate', 'Total'],
      ...invoice.lineItems.map(item => [item.service, item.quantity, formatCurrency(item.rate), formatCurrency(item.total)]),
      ['', '', 'Invoice Total:', formatCurrency(invoice.total)],
      [],
    );
  });

  const vituSheet = XLSX.utils.aoa_to_sheet(vituData);
  vituSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, vituSheet, 'Vitu');

  // Sheet 7: Chart of Accounts
  const coaData = [
    ['APEX ACCOUNTING | Chart of Accounts'],
    ['CVS Auto Sales Inc.'],
    [],
    ['Code', 'Account Name', 'Type', 'Description'],
    ...chartOfAccounts.map(account => [account.code, account.name, account.type, account.description || '']),
  ];
  const coaSheet = XLSX.utils.aoa_to_sheet(coaData);
  coaSheet['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 12 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(workbook, coaSheet, 'Chart of Accounts');

  // Sheet 8: Reconciliation
  const reconciliationData = [
    ['APEX ACCOUNTING | Bank Reconciliation Summary'],
    ['Q4 2025'],
    [],
    ['MONTHLY RECONCILIATION'],
    ['Month', 'Beginning Balance', 'Total Deposits', 'Total Withdrawals', 'Ending Balance', 'Statement Balance', 'Status'],
    [
      'October 2025',
      formatCurrency(octoberSummary.beginningBalance),
      formatCurrency(octoberDeposits.reduce((sum, d) => sum + d.amount, 0)),
      formatCurrency(octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0)),
      formatCurrency(octoberSummary.endingBalance),
      formatCurrency(octoberSummary.statementEndingBalance),
      octoberSummary.endingBalance === octoberSummary.statementEndingBalance ? '✓ Reconciled' : 'Variance'
    ],
    [
      'November 2025',
      formatCurrency(novemberSummary.beginningBalance),
      formatCurrency(novemberDeposits.reduce((sum, d) => sum + d.amount, 0)),
      formatCurrency(novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0)),
      formatCurrency(novemberSummary.endingBalance),
      formatCurrency(novemberSummary.statementEndingBalance),
      novemberSummary.endingBalance === novemberSummary.statementEndingBalance ? '✓ Reconciled' : 'Variance'
    ],
    [],
    ['DEPOSIT VERIFICATION - OCTOBER 2025'],
    ['Date', 'Description', 'Amount', 'Running Total'],
    ...octoberDeposits.reduce((acc, d, idx) => {
      const runningTotal = octoberDeposits.slice(0, idx + 1).reduce((sum, dep) => sum + dep.amount, 0);
      acc.push([d.date, d.description, formatCurrency(d.amount), formatCurrency(runningTotal)]);
      return acc;
    }, [] as (string | number)[][]),
    [],
    ['DEPOSIT VERIFICATION - NOVEMBER 2025'],
    ['Date', 'Description', 'Amount', 'Running Total'],
    ...novemberDeposits.reduce((acc, d, idx) => {
      const runningTotal = novemberDeposits.slice(0, idx + 1).reduce((sum, dep) => sum + dep.amount, 0);
      acc.push([d.date, d.description, formatCurrency(d.amount), formatCurrency(runningTotal)]);
      return acc;
    }, [] as (string | number)[][]),
  ];
  const reconciliationSheet = XLSX.utils.aoa_to_sheet(reconciliationData);
  reconciliationSheet['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, reconciliationSheet, 'Reconciliation');

  // Generate and download the file
  XLSX.writeFile(workbook, 'CVS_Auto_Sales_Q4_2025_Bookkeeping.xlsx');
};
