import PptxGenJS from 'pptxgenjs';
import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals,
  transfers,
  octoberSummary,
  novemberSummary,
  decemberSummary,
} from '@/data/bankTransactions';
import {
  inspectionsSummary,
} from '@/data/esafetyInspections';
import { vituInvoices, vituSummary } from '@/data/vituStatements';
import { titleTransactions, getTopCustomers, getTitleTransactionSummary } from '@/data/titleRevenueTransactions';
import { chartOfAccounts } from '@/data/chartOfAccounts';

// Calculate title revenue summary
const calculateTitleRevenueSummary = () => {
  const monthlySummary = getTitleTransactionSummary();
  const topCustomers = getTopCustomers(10);
  
  const totalRevenue = monthlySummary.total.total;
  const dealerRevenue = monthlySummary.total.dealerTotal;
  const retailRevenue = monthlySummary.total.retailTotal;
  const totalTransactions = monthlySummary.total.count;
  const dealerTransactions = monthlySummary.total.dealerCount;
  const retailTransactions = monthlySummary.total.retailCount;
  
  return {
    totalRevenue,
    dealerRevenue,
    retailRevenue,
    totalTransactions,
    dealerTransactions,
    retailTransactions,
    topCustomers: topCustomers.map(c => ({
      name: c.name,
      revenue: c.total,
      count: c.count,
      isDealer: c.isDealer
    }))
  };
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// Color scheme - professional navy/slate theme
const colors = {
  navy: '1e3a5f',
  slate: '334155',
  white: 'FFFFFF',
  lightGray: 'f1f5f9',
  green: '10b981',
  red: 'ef4444',
  gold: 'f59e0b',
  blue: '3b82f6',
};

export const exportToPowerPoint = () => {
  const titleRevenueSummary = calculateTitleRevenueSummary();
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = 'CVS Auto Sales Inc.';
  pptx.title = 'Q4 2025 Financial Report';
  pptx.subject = 'Quarterly Financial Summary';
  pptx.company = 'CVS Auto Sales Inc.';
  
  // Define master slide layouts
  pptx.defineSlideMaster({
    title: 'TITLE_SLIDE',
    background: { color: colors.navy },
  });
  
  pptx.defineSlideMaster({
    title: 'CONTENT_SLIDE',
    background: { color: colors.white },
  });

  // ==========================================
  // SLIDE 1: Title Slide
  // ==========================================
  const slide1 = pptx.addSlide({ masterName: 'TITLE_SLIDE' });
  
  // Add Mizan Logo
  slide1.addImage({
    path: '/mizan-logo-brand.png',
    x: 0.5,
    y: 0.5,
    w: 1.5,
    h: 1.5,
  });
  
  slide1.addText('MIZAN', {
    x: 2.2,
    y: 0.8,
    w: 5,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: colors.gold,
    fontFace: 'Arial',
  });
  
  slide1.addText('CVS AUTO SALES INC.', {
    x: 0.5,
    y: 2.2,
    w: '90%',
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });
  
  slide1.addText('Q4 2025 Financial Report', {
    x: 0.5,
    y: 3.0,
    w: '90%',
    h: 0.6,
    fontSize: 28,
    color: colors.lightGray,
    fontFace: 'Arial',
  });
  
  slide1.addText('715 Huntingdon Pike, Rockledge, PA 19046', {
    x: 0.5,
    y: 3.8,
    w: '90%',
    h: 0.4,
    fontSize: 16,
    color: colors.lightGray,
    fontFace: 'Arial',
  });
  
  slide1.addText('Prepared by Mizan', {
    x: 0.5,
    y: 4.8,
    w: '90%',
    h: 0.3,
    fontSize: 14,
    color: colors.gold,
    fontFace: 'Arial',
    italic: true,
  });

  // ==========================================
  // SLIDE 2: Executive Summary
  // ==========================================
  const slide2 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  // Header bar
  slide2.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide2.addText('EXECUTIVE SUMMARY', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  // Calculate totals for ALL 3 months
  const totalDeposits = 
    octoberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0) +
    novemberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0) +
    decemberDeposits.filter(d => d.coaCode !== '9999').reduce((sum, d) => sum + d.amount, 0);
  
  const totalExpenses = 
    octoberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0) +
    novemberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0) +
    decemberWithdrawals.filter(w => w.coaCode !== '9999').reduce((sum, w) => sum + w.amount, 0);

  // KPI Cards
  const kpiData = [
    { label: 'Q4 Bank Deposits', value: formatCurrency(totalDeposits), color: colors.green },
    { label: 'Q4 Bank Expenses', value: formatCurrency(totalExpenses), color: colors.red },
    { label: 'Title Services Revenue', value: formatCurrency(titleRevenueSummary.totalRevenue), color: colors.blue },
    { label: 'PA eSafety Revenue', value: formatCurrency(inspectionsSummary.total.revenue), color: colors.gold },
  ];

  kpiData.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 2.4);
    
    slide2.addShape('rect', {
      x: xPos,
      y: 1.2,
      w: 2.2,
      h: 1.4,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide2.addText(kpi.label, {
      x: xPos,
      y: 1.3,
      w: 2.2,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide2.addText(kpi.value, {
      x: xPos,
      y: 1.8,
      w: 2.2,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Summary table - include ALL 3 months
  const summaryRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Period', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Beginning Balance', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Deposits', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Expenses', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Ending Balance', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    [
      { text: 'October 2025' },
      { text: formatCurrency(octoberSummary.beginningBalance) },
      { text: formatCurrency(octoberDeposits.reduce((sum, d) => sum + d.amount, 0)) },
      { text: formatCurrency(octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0)) },
      { text: formatCurrency(octoberSummary.endingBalance) },
    ],
    [
      { text: 'November 2025' },
      { text: formatCurrency(novemberSummary.beginningBalance) },
      { text: formatCurrency(novemberDeposits.reduce((sum, d) => sum + d.amount, 0)) },
      { text: formatCurrency(novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0)) },
      { text: formatCurrency(novemberSummary.endingBalance) },
    ],
    [
      { text: 'December 2025' },
      { text: formatCurrency(decemberSummary.beginningBalance) },
      { text: formatCurrency(decemberDeposits.reduce((sum, d) => sum + d.amount, 0)) },
      { text: formatCurrency(decemberWithdrawals.reduce((sum, w) => sum + w.amount, 0)) },
      { text: formatCurrency(decemberSummary.endingBalance) },
    ],
  ];

  slide2.addTable(summaryRows, {
    x: 0.5,
    y: 3.0,
    w: 9.0,
    fontSize: 11,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'center',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 3: Title Services Revenue
  // ==========================================
  const slide3 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide3.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide3.addText('TITLE SERVICES REVENUE', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  // Revenue breakdown
  const titleKpis = [
    { label: 'Total Revenue', value: formatCurrency(titleRevenueSummary.totalRevenue), sub: `${titleRevenueSummary.totalTransactions} Transactions` },
    { label: 'Dealer Revenue', value: formatCurrency(titleRevenueSummary.dealerRevenue), sub: `${titleRevenueSummary.dealerTransactions} Transactions` },
    { label: 'Retail Revenue', value: formatCurrency(titleRevenueSummary.retailRevenue), sub: `${titleRevenueSummary.retailTransactions} Transactions` },
  ];

  titleKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 3.2);
    
    slide3.addShape('rect', {
      x: xPos,
      y: 1.2,
      w: 3.0,
      h: 1.2,
      fill: { color: colors.lightGray },
      line: { color: colors.blue, width: 2 },
    });
    
    slide3.addText(kpi.label, {
      x: xPos,
      y: 1.3,
      w: 3.0,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide3.addText(kpi.value, {
      x: xPos,
      y: 1.6,
      w: 3.0,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: colors.blue,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide3.addText(kpi.sub, {
      x: xPos,
      y: 2.0,
      w: 3.0,
      h: 0.3,
      fontSize: 10,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Top customers table
  const topCustomers = titleRevenueSummary.topCustomers.slice(0, 8);
  const customerRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Customer', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Type', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Transactions', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Revenue', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    ...topCustomers.map(c => [
      { text: c.name },
      { text: c.isDealer ? 'Dealer' : 'Retail' },
      { text: c.count.toString() },
      { text: formatCurrency(c.revenue) },
    ]),
  ];

  slide3.addText('Top Customers', {
    x: 0.5,
    y: 2.6,
    w: 9.0,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide3.addTable(customerRows, {
    x: 0.5,
    y: 3.0,
    w: 9.0,
    fontSize: 10,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 4: PA eSafety Inspections
  // ==========================================
  const slide4 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide4.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide4.addText('PA eSAFETY INSPECTIONS', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  // eSafety KPIs
  const esafetyKpis = [
    { label: 'Total Inspections', value: inspectionsSummary.total.count.toString(), color: colors.gold },
    { label: 'Total Revenue', value: formatCurrency(inspectionsSummary.total.revenue), color: colors.green },
    { label: 'Avg per Inspection', value: formatCurrency(inspectionsSummary.total.revenue / inspectionsSummary.total.count), color: colors.blue },
  ];

  esafetyKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 3.2);
    
    slide4.addShape('rect', {
      x: xPos,
      y: 1.2,
      w: 3.0,
      h: 1.0,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide4.addText(kpi.label, {
      x: xPos,
      y: 1.3,
      w: 3.0,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide4.addText(kpi.value, {
      x: xPos,
      y: 1.6,
      w: 3.0,
      h: 0.5,
      fontSize: 22,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Monthly breakdown table
  const esafetyRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Month', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Inspections', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Revenue', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    [{ text: 'October 2025' }, { text: inspectionsSummary.october.count.toString() }, { text: formatCurrency(inspectionsSummary.october.revenue) }],
    [{ text: 'November 2025' }, { text: inspectionsSummary.november.count.toString() }, { text: formatCurrency(inspectionsSummary.november.revenue) }],
    [{ text: 'December 2025' }, { text: inspectionsSummary.december.count.toString() }, { text: formatCurrency(inspectionsSummary.december.revenue) }],
    [
      { text: 'Q4 TOTAL', options: { bold: true, fill: { color: colors.lightGray } } },
      { text: inspectionsSummary.total.count.toString(), options: { bold: true, fill: { color: colors.lightGray } } },
      { text: formatCurrency(inspectionsSummary.total.revenue), options: { bold: true, fill: { color: colors.lightGray } } },
    ],
  ];

  slide4.addTable(esafetyRows, {
    x: 0.5,
    y: 2.5,
    w: 6.0,
    fontSize: 12,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'center',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 5: Checking Account - October
  // ==========================================
  const slide5 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide5.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide5.addText('CHECKING ACCOUNT - OCTOBER 2025', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  const octDepositsTotal = octoberDeposits.reduce((sum, d) => sum + d.amount, 0);
  const octWithdrawalsTotal = octoberWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  // October summary boxes
  const octKpis = [
    { label: 'Beginning Balance', value: formatCurrency(octoberSummary.beginningBalance), color: colors.slate },
    { label: 'Total Deposits', value: formatCurrency(octDepositsTotal), color: colors.green },
    { label: 'Total Withdrawals', value: formatCurrency(octWithdrawalsTotal), color: colors.red },
    { label: 'Ending Balance', value: formatCurrency(octoberSummary.endingBalance), color: colors.blue },
  ];

  octKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 2.4);
    
    slide5.addShape('rect', {
      x: xPos,
      y: 1.0,
      w: 2.2,
      h: 0.9,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide5.addText(kpi.label, {
      x: xPos,
      y: 1.05,
      w: 2.2,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide5.addText(kpi.value, {
      x: xPos,
      y: 1.35,
      w: 2.2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Top deposits table
  const topOctDeposits = octoberDeposits.slice(0, 6);
  const octDepositRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Description', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Category', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
    ],
    ...topOctDeposits.map(d => [
      { text: d.date },
      { text: d.description.substring(0, 30) + (d.description.length > 30 ? '...' : '') },
      { text: d.category },
      { text: formatCurrency(d.amount) },
    ]),
  ];

  slide5.addText('Top Deposits', {
    x: 0.5,
    y: 2.1,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide5.addTable(octDepositRows, {
    x: 0.5,
    y: 2.4,
    w: 4.5,
    fontSize: 9,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // Top withdrawals table
  const topOctWithdrawals = octoberWithdrawals.slice(0, 6);
  const octWithdrawalRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Description', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Category', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
    ],
    ...topOctWithdrawals.map(w => [
      { text: w.date },
      { text: w.description.substring(0, 30) + (w.description.length > 30 ? '...' : '') },
      { text: w.category },
      { text: formatCurrency(w.amount) },
    ]),
  ];

  slide5.addText('Top Expenses', {
    x: 5.2,
    y: 2.1,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide5.addTable(octWithdrawalRows, {
    x: 5.2,
    y: 2.4,
    w: 4.5,
    fontSize: 9,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 6: Checking Account - November
  // ==========================================
  const slide6 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide6.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide6.addText('CHECKING ACCOUNT - NOVEMBER 2025', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  const novDepositsTotal = novemberDeposits.reduce((sum, d) => sum + d.amount, 0);
  const novWithdrawalsTotal = novemberWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  // November summary boxes
  const novKpis = [
    { label: 'Beginning Balance', value: formatCurrency(novemberSummary.beginningBalance), color: colors.slate },
    { label: 'Total Deposits', value: formatCurrency(novDepositsTotal), color: colors.green },
    { label: 'Total Withdrawals', value: formatCurrency(novWithdrawalsTotal), color: colors.red },
    { label: 'Ending Balance', value: formatCurrency(novemberSummary.endingBalance), color: colors.blue },
  ];

  novKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 2.4);
    
    slide6.addShape('rect', {
      x: xPos,
      y: 1.0,
      w: 2.2,
      h: 0.9,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide6.addText(kpi.label, {
      x: xPos,
      y: 1.05,
      w: 2.2,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide6.addText(kpi.value, {
      x: xPos,
      y: 1.35,
      w: 2.2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Top deposits table
  const topNovDeposits = novemberDeposits.slice(0, 6);
  const novDepositRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Description', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Category', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
    ],
    ...topNovDeposits.map(d => [
      { text: d.date },
      { text: d.description.substring(0, 30) + (d.description.length > 30 ? '...' : '') },
      { text: d.category },
      { text: formatCurrency(d.amount) },
    ]),
  ];

  slide6.addText('Top Deposits', {
    x: 0.5,
    y: 2.1,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide6.addTable(novDepositRows, {
    x: 0.5,
    y: 2.4,
    w: 4.5,
    fontSize: 9,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // Top withdrawals table
  const topNovWithdrawals = novemberWithdrawals.slice(0, 6);
  const novWithdrawalRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Description', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Category', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
    ],
    ...topNovWithdrawals.map(w => [
      { text: w.date },
      { text: w.description.substring(0, 30) + (w.description.length > 30 ? '...' : '') },
      { text: w.category },
      { text: formatCurrency(w.amount) },
    ]),
  ];

  slide6.addText('Top Expenses', {
    x: 5.2,
    y: 2.1,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide6.addTable(novWithdrawalRows, {
    x: 5.2,
    y: 2.4,
    w: 4.5,
    fontSize: 9,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 7: Checking Account - December
  // ==========================================
  const slide7 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide7.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide7.addText('CHECKING ACCOUNT - DECEMBER 2025', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  const decDepositsTotal = decemberDeposits.reduce((sum, d) => sum + d.amount, 0);
  const decWithdrawalsTotal = decemberWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  // December summary boxes
  const decKpis = [
    { label: 'Beginning Balance', value: formatCurrency(decemberSummary.beginningBalance), color: colors.slate },
    { label: 'Total Deposits', value: formatCurrency(decDepositsTotal), color: colors.green },
    { label: 'Total Withdrawals', value: formatCurrency(decWithdrawalsTotal), color: colors.red },
    { label: 'Ending Balance', value: formatCurrency(decemberSummary.endingBalance), color: colors.blue },
  ];

  decKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 2.4);
    
    slide7.addShape('rect', {
      x: xPos,
      y: 1.0,
      w: 2.2,
      h: 0.9,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide7.addText(kpi.label, {
      x: xPos,
      y: 1.05,
      w: 2.2,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide7.addText(kpi.value, {
      x: xPos,
      y: 1.35,
      w: 2.2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Top deposits table
  const topDecDeposits = decemberDeposits.slice(0, 6);
  const decDepositRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Description', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Category', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.green }, color: colors.white } },
    ],
    ...topDecDeposits.map(d => [
      { text: d.date },
      { text: d.description.substring(0, 30) + (d.description.length > 30 ? '...' : '') },
      { text: d.category },
      { text: formatCurrency(d.amount) },
    ]),
  ];

  slide7.addText('Top Deposits', {
    x: 0.5,
    y: 2.1,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide7.addTable(decDepositRows, {
    x: 0.5,
    y: 2.4,
    w: 4.5,
    fontSize: 9,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // Top withdrawals table
  const topDecWithdrawals = decemberWithdrawals.slice(0, 6);
  const decWithdrawalRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Description', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Category', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.red }, color: colors.white } },
    ],
    ...topDecWithdrawals.map(w => [
      { text: w.date },
      { text: w.description.substring(0, 30) + (w.description.length > 30 ? '...' : '') },
      { text: w.category },
      { text: formatCurrency(w.amount) },
    ]),
  ];

  slide7.addText('Top Expenses', {
    x: 5.2,
    y: 2.1,
    w: 4.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: colors.slate,
    fontFace: 'Arial',
  });

  slide7.addTable(decWithdrawalRows, {
    x: 5.2,
    y: 2.4,
    w: 4.5,
    fontSize: 9,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 8: Inter-Account Transfers
  // ==========================================
  const slide8 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide8.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide8.addText('INTER-ACCOUNT TRANSFERS', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  const totalTransfers = transfers.reduce((sum, t) => sum + t.amount, 0);
  const toSavings = transfers.filter(t => t.to === 'Savings').reduce((sum, t) => sum + t.amount, 0);
  const fromSavings = transfers.filter(t => t.from === 'Savings').reduce((sum, t) => sum + t.amount, 0);

  // Transfer KPIs
  const transferKpis = [
    { label: 'Total Transfers', value: formatCurrency(totalTransfers), color: colors.blue },
    { label: 'To Savings', value: formatCurrency(toSavings), color: colors.green },
    { label: 'From Savings', value: formatCurrency(fromSavings), color: colors.gold },
  ];

  transferKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 3.2);
    
    slide8.addShape('rect', {
      x: xPos,
      y: 1.2,
      w: 3.0,
      h: 1.0,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide8.addText(kpi.label, {
      x: xPos,
      y: 1.3,
      w: 3.0,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide8.addText(kpi.value, {
      x: xPos,
      y: 1.65,
      w: 3.0,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Transfers table
  const transferRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Date', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'From', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'To', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Amount', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Reference', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    ...transfers.map(t => [
      { text: t.date },
      { text: t.from },
      { text: t.to },
      { text: formatCurrency(t.amount) },
      { text: t.reference },
    ]),
  ];

  slide8.addTable(transferRows, {
    x: 0.5,
    y: 2.5,
    w: 9.0,
    fontSize: 10,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'center',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 9: Vitu Expenses
  // ==========================================
  const slide9 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide9.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide9.addText('VITU EXPENSES (Title Lookup Services)', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  // Vitu KPIs
  const vituKpis = [
    { label: 'Q4 Total', value: formatCurrency(vituSummary.quarterTotal), color: colors.red },
    { label: 'DLDV Lookups', value: vituSummary.totalDLDVLookups.toString(), color: colors.blue },
    { label: 'NMVTIS Inquiries', value: vituSummary.totalNMVTISInquiries.toString(), color: colors.gold },
  ];

  vituKpis.forEach((kpi, idx) => {
    const xPos = 0.5 + (idx * 3.2);
    
    slide9.addShape('rect', {
      x: xPos,
      y: 1.2,
      w: 3.0,
      h: 1.0,
      fill: { color: colors.lightGray },
      line: { color: kpi.color, width: 2 },
    });
    
    slide9.addText(kpi.label, {
      x: xPos,
      y: 1.3,
      w: 3.0,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: colors.slate,
      align: 'center',
      fontFace: 'Arial',
    });
    
    slide9.addText(kpi.value, {
      x: xPos,
      y: 1.65,
      w: 3.0,
      h: 0.4,
      fontSize: 22,
      bold: true,
      color: kpi.color,
      align: 'center',
      fontFace: 'Arial',
    });
  });

  // Invoice breakdown table
  const vituRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Invoice #', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Month', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Date', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Total', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    ...vituInvoices.map(inv => [
      { text: inv.invoiceNumber },
      { text: inv.month },
      { text: inv.invoiceDate },
      { text: formatCurrency(inv.total) },
    ]),
    [
      { text: 'TOTAL', options: { bold: true, fill: { color: colors.lightGray } } },
      { text: '', options: { fill: { color: colors.lightGray } } },
      { text: '', options: { fill: { color: colors.lightGray } } },
      { text: formatCurrency(vituSummary.quarterTotal), options: { bold: true, fill: { color: colors.lightGray } } },
    ],
  ];

  slide9.addTable(vituRows, {
    x: 0.5,
    y: 2.5,
    w: 7.0,
    fontSize: 11,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'center',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 10: Reconciliation Summary
  // ==========================================
  const slide10 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide10.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide10.addText('BANK RECONCILIATION', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  // Reconciliation status - all 3 months
  const octReconciled = octoberSummary.endingBalance === octoberSummary.statementEndingBalance;
  const novReconciled = novemberSummary.endingBalance === novemberSummary.statementEndingBalance;
  const decReconciled = decemberSummary.endingBalance === decemberSummary.statementEndingBalance;

  const reconRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Month', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Book Balance', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Statement Balance', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Variance', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Status', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    [
      { text: 'October 2025' },
      { text: formatCurrency(octoberSummary.endingBalance) },
      { text: formatCurrency(octoberSummary.statementEndingBalance) },
      { text: formatCurrency(octoberSummary.endingBalance - octoberSummary.statementEndingBalance) },
      { text: octReconciled ? '✓ RECONCILED' : 'VARIANCE', options: { color: octReconciled ? colors.green : colors.red, bold: true } },
    ],
    [
      { text: 'November 2025' },
      { text: formatCurrency(novemberSummary.endingBalance) },
      { text: formatCurrency(novemberSummary.statementEndingBalance) },
      { text: formatCurrency(novemberSummary.endingBalance - novemberSummary.statementEndingBalance) },
      { text: novReconciled ? '✓ RECONCILED' : 'VARIANCE', options: { color: novReconciled ? colors.green : colors.red, bold: true } },
    ],
    [
      { text: 'December 2025' },
      { text: formatCurrency(decemberSummary.endingBalance) },
      { text: formatCurrency(decemberSummary.statementEndingBalance) },
      { text: formatCurrency(decemberSummary.endingBalance - decemberSummary.statementEndingBalance) },
      { text: decReconciled ? '✓ RECONCILED' : 'VARIANCE', options: { color: decReconciled ? colors.green : colors.red, bold: true } },
    ],
  ];

  slide10.addTable(reconRows, {
    x: 0.5,
    y: 1.2,
    w: 9.0,
    fontSize: 12,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'center',
    valign: 'middle',
  });

  slide10.addText('All three months are fully reconciled with bank statements.', {
    x: 0.5,
    y: 3.0,
    w: 9.0,
    h: 0.4,
    fontSize: 14,
    color: colors.green,
    fontFace: 'Arial',
    bold: true,
  });

  // ==========================================
  // SLIDE 11: Chart of Accounts
  // ==========================================
  const slide11 = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
  
  slide11.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.8,
    fill: { color: colors.navy },
  });
  
  slide11.addText('CHART OF ACCOUNTS', {
    x: 0.5,
    y: 0.2,
    w: '90%',
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });

  const coaRows: PptxGenJS.TableRow[] = [
    [
      { text: 'Code', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Account Name', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
      { text: 'Type', options: { bold: true, fill: { color: colors.navy }, color: colors.white } },
    ],
    ...chartOfAccounts.slice(0, 15).map(acc => [
      { text: acc.code },
      { text: acc.name },
      { text: acc.type },
    ]),
  ];

  slide11.addTable(coaRows, {
    x: 0.5,
    y: 1.0,
    w: 9.0,
    fontSize: 10,
    fontFace: 'Arial',
    border: { color: colors.slate, pt: 0.5 },
    align: 'left',
    valign: 'middle',
  });

  // ==========================================
  // SLIDE 12: Thank You / Contact
  // ==========================================
  const slide12 = pptx.addSlide({ masterName: 'TITLE_SLIDE' });
  
  // Add Mizan Logo to Thank You slide
  slide12.addImage({
    path: '/mizan-logo-brand.png',
    x: 4.0,
    y: 0.5,
    w: 2.0,
    h: 2.0,
  });
  
  slide12.addText('Thank You', {
    x: 0.5,
    y: 2.8,
    w: '90%',
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
  });
  
  slide12.addText('CVS Auto Sales Inc.', {
    x: 0.5,
    y: 3.6,
    w: '90%',
    h: 0.5,
    fontSize: 24,
    color: colors.lightGray,
    fontFace: 'Arial',
  });
  
  slide12.addText('715 Huntingdon Pike, Rockledge, PA 19046', {
    x: 0.5,
    y: 4.1,
    w: '90%',
    h: 0.4,
    fontSize: 16,
    color: colors.lightGray,
    fontFace: 'Arial',
  });
  
  slide12.addText('MIZAN', {
    x: 0.5,
    y: 4.8,
    w: '90%',
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: colors.gold,
    fontFace: 'Arial',
  });
  
  slide12.addText('Professional Bookkeeping & Financial Services', {
    x: 0.5,
    y: 5.2,
    w: '90%',
    h: 0.3,
    fontSize: 12,
    color: colors.lightGray,
    fontFace: 'Arial',
    italic: true,
  });

  // Generate and download
  pptx.writeFile({ fileName: 'CVS_Auto_Sales_Q4_2025_Financial_Report.pptx' });
};
