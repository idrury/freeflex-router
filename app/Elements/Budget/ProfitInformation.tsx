import React, { useEffect } from "react";
import GearPieChart from "../../Elements/GearPieChart";
import IncomePieChart from "../../Elements/Charts/IncomePieChart";
import ProfitAreaChart from "../../Elements/Charts/ProfitAreaChart";
import ExpenseEarningGraph from "../../Elements/ExpenseEarningGraph";
import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../../Functions/commonFunctions";

interface ProfitInformationProps {
  profitByMonth: { period: string; amount: number }[];
  expensesByCategory?: { category: string; value: number }[];
  invoicesByClient?: { client: string; amount: number }[];
  expenseSum?: number;
  incomeSum?: number;
  onExpenseClick: () => void;
  onImportClick: () => void;
}

export default function ProfitInformation({
  profitByMonth,
  expensesByCategory,
  invoicesByClient,
  expenseSum,
  incomeSum,
  onExpenseClick,
  onImportClick,
}: ProfitInformationProps) {
  useEffect(() => {
  }, []);

  return (
    <div className="mediumFade">
      <div className="row dynamicRow">
        <div className="boxed boxedOutline hundred m2 p2">
          <h2 className="textLeft">Profit</h2>
          {profitByMonth.length > 0 ? (
            <ProfitAreaChart data={profitByMonth} />
          ) : (
            <div className="col middle" style={{height: 300}}>
              <IonIcon
                name="stats-chart"
                style={{
                  width: 250,
                  height: 75,
                  color: "var(--smallAccent)",
                }}
              />

              <p className="pb2 boxedDark textCenter">
                You haven't created any invoices or expenses for this
                period.
              </p>
              <div className="row">
                <button
                  className="m0"
                  onClick={() => reRouteTo("/projects")}
                >
                  <p className="m0">Create a project</p>
                </button>
                <p className="textCenter">or</p>
                <button
                  className="m0"
                  onClick={() => onImportClick()}
                >
                  <p className="m0">Bulk import a bunch</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="row dynamicRow">
        <div className="boxed boxedOutline hundred m2 p2">
          <h2 className="textLeft">Expenses</h2>
          {(expenseSum && expenseSum > 0) ? (
            <GearPieChart data={expensesByCategory} />
          ) : (
            <div
              style={{ height: 300 }}
              className="col center middle m2 p2 slowFade"
            >
              <IonIcon
                name="pie-chart"
                style={{
                  width: 200,
                  height: 200,
                  color: "var(--smallAccent)",
                }}
              />
              <button onClick={() => onExpenseClick()}>
                <p className="m0">Add an expense</p>
              </button>
            </div>
          )}
        </div>

        <div className="boxed boxedOutline hundred m2 p2">
          <h2 className="textLeft">Overview</h2>
          {(expenseSum || incomeSum) ? (
            <ExpenseEarningGraph
              data={[
                { name: "expenses", value: expenseSum },
                { name: "earnings", value: incomeSum },
              ]}
            />
          ) : (
            <div
              style={{ height: 300 }}
              className="col center middle m2 p2 slowFade"
            >
              <IonIcon
                name="stats-chart"
                style={{
                  width: 200,
                  height: 200,
                  color: "var(--smallAccent)",
                }}
              />
              <button onClick={() => onImportClick()}>
                <p className="m0">Bulk add expenses or invoices</p>
              </button>
            </div>
          )}
        </div>

        <div className="boxed boxedOutline hundred m2 p2">
          <h2 className="textLeft">Client Income</h2>
          {invoicesByClient && invoicesByClient?.length > 0 ? (
            <IncomePieChart data={invoicesByClient} />
          ) : (
            <div
              style={{ height: 300 }}
              className="center middle m2 p2 slowFade"
            >
              <div
                style={{ height: 300 }}
                className="col center middle m2 p2 slowFade"
              >
                <IonIcon
                  name="pie-chart"
                  style={{
                    width: 200,
                    height: 200,
                    color: "var(--smallAccent)",
                  }}
                />
                <button onClick={() => reRouteTo("/projects")}>
                  <p className="m0">
                    Create a project to add an invoice
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
