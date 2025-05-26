import IonIcon from "@reacticons/ionicons";
import React from "react";
import {
  FFExpense,
  FFSimpleRecurringExpense,
} from "../../assets/Types";
import { formatDatestring } from "../../Functions/Dates";
import { getExpenseIcon } from "./BudgetBL";

interface ExpenseListProps {
  expenses?: FFExpense[];
  onExpenseClick: (exp?: FFExpense) => void;
  onImportClick: () => void;
}

export default function ExpenseList({
  onExpenseClick,
  expenses,
  onImportClick,
}: ExpenseListProps) {
  if (!expenses || expenses.length == 0) {
    return (
      <div className="col middle">
        <IonIcon
          name="wallet"
          style={{
            width: 150,
            height: 150,
            color: "var(--smallAccent)",
          }}
        />

        <p className="pb2 boxedDark textCenter">
          You haven't registered an expense for this period.
        </p>
        <div className="row">
          <button className="m0" onClick={() => onExpenseClick()}>
            <p className="m0">Start with one</p>
          </button>
          <p className="textCenter">or</p>
          <button className="m0" onClick={onImportClick}>
            <p className="m0">Bulk import a bunch</p>
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="w100 m2">
        <div className="pr2">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="projectRow row dark boxedOutline p0"
              onClick={() => onExpenseClick(exp)}
            >
              <IonIcon
                name={getExpenseIcon(exp.category)}
                className="basicIcon ml2"
              />
              <p className="w25">
                {formatDatestring(exp.date) || "NO DATE"}
              </p>
              <p className="w50">{exp.description || "No details"}</p>
              <p className="w10 rightRow">{`$${exp.amount || 0}`}</p>
              {(exp.recurring_expenses as FFSimpleRecurringExpense)
                ?.id && (
                <IonIcon
                  name="repeat"
                  style={{ color: "var(--primaryColor)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
}
