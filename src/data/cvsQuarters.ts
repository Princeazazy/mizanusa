import {
  octoberDeposits,
  octoberWithdrawals,
  novemberDeposits,
  novemberWithdrawals,
  decemberDeposits,
  decemberWithdrawals,
  octoberSummary,
  decemberSummary,
} from "@/data/bankTransactions";
import { cvs2026Months } from "@/data/cvs2026Transactions";

const m = (key: string) => cvs2026Months.find((x) => x.key === key)!;

const jan = m("january2026");
const feb = m("february2026");
const mar = m("march2026");
const apr = m("april2026");
const may = m("may2026");

export interface QuarterPeriod {
  key: string;
  label: string;
  monthsLabel: string;
  asOfLabel: string;
  beginningLabel: string;
  deposits: any[];
  withdrawals: any[];
  beginningBalance: number;
  endingBalance: number;
}

export const cvsQuarters: QuarterPeriod[] = [
  {
    key: "q4-2025",
    label: "Q4 2025",
    monthsLabel: "October – December 2025",
    asOfLabel: "December 31, 2025",
    beginningLabel: "10/01/2025",
    deposits: [...octoberDeposits, ...novemberDeposits, ...decemberDeposits],
    withdrawals: [...octoberWithdrawals, ...novemberWithdrawals, ...decemberWithdrawals],
    beginningBalance: octoberSummary.beginningBalance,
    endingBalance: decemberSummary.endingBalance,
  },
  {
    key: "q1-2026",
    label: "Q1 2026",
    monthsLabel: "January – March 2026",
    asOfLabel: "March 31, 2026",
    beginningLabel: "01/01/2026",
    deposits: [...jan.deposits, ...feb.deposits, ...mar.deposits],
    withdrawals: [...jan.withdrawals, ...feb.withdrawals, ...mar.withdrawals],
    beginningBalance: jan.beginningBalance,
    endingBalance: mar.endingBalance,
  },
  {
    key: "q2-2026",
    label: "Q2 2026",
    monthsLabel: "April – May 2026 (partial quarter)",
    asOfLabel: "May 31, 2026",
    beginningLabel: "04/01/2026",
    deposits: [...apr.deposits, ...may.deposits],
    withdrawals: [...apr.withdrawals, ...may.withdrawals],
    beginningBalance: apr.beginningBalance,
    endingBalance: may.endingBalance,
  },
];

export const defaultQuarter = cvsQuarters[cvsQuarters.length - 1];
