import IonIcon from "@reacticons/ionicons";
import React from "react";
import {
  FFExpense,
  FFSimpleRecurringExpense,
} from "../../assets/Types";
import ExpenseList from "./ExpenseList";
import ExpenseAggregates from "./ExpenseAggregates";

interface ExpenseSummaryProps {
  expenses?: FFExpense[];
  expenseSum: number | undefined;
  expensesByCategory:
    | { category: string; value: number }[]
    | undefined;
  onExpenseClick: (exp?: FFExpense) => void;
  onImportClick: () => void;
}

export default function ExpenseSummary({
  onExpenseClick,
  onImportClick,
  expenses,
  expenseSum,
  expensesByCategory,
}: ExpenseSummaryProps) {
  return (
    <div className="row w100">
      <ExpenseAggregates
        expenseSum={expenseSum}
        expensesByCategory={expensesByCategory}
      />
      <div className="row dynamicRow mediumFade w100">
        <div className="boxed boxedOutline w100">
          <div className="row">
            <h2 className="textLeft m0 ml2 mt2 pt2 pl2">Expenses</h2>
            <button
              className="accentButton m2"
              onClick={() => onExpenseClick()}
            >
              + Expense
            </button>
          </div>
          <ExpenseList
            expenses={expenses}
            onExpenseClick={onExpenseClick}
            onImportClick={onImportClick}
          />
        </div>
      </div>
    </div>
  );
}
