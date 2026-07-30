/**
 * Expense composition now renders as a stacked horizontal bar plus a ranked
 * ledger — it reads better than a donut past three categories and prints cleanly.
 * Kept as a named export so existing call sites stay valid.
 */
export {
  ExpenseCompositionBar as ExpenseBreakdownChart,
  rampColor,
} from "./ExpenseCompositionBar";
export type { CompositionSlice as CategorySlice } from "./ExpenseCompositionBar";
