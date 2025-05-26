import { Interval } from "luxon";
import { FFExpense } from "../../assets/Types";

export interface FFBudgetFilter {
  totalExpenses: number;
  filteredExpenses: FFExpense[];
  rangeExpenses: number;
  expenseGroupings: { period: Interval; amount: number }[];
}
