import React from "react";
import GearPieChart from "../GearPieChart";
import IonIcon from "@reacticons/ionicons";

interface ExpenseAggregatesProps {
  expenseSum?: number;
  expensesByCategory?: { category: string; value: number }[];
}

export default function ExpenseAggregates({
  expenseSum,
  expensesByCategory,
}: ExpenseAggregatesProps) {
  return (
    <div className="w100">
      <div className="boxed boxedOutline">
        <p className="boldLabel">How you've spent your money</p>
        <div className="leftRow">
          {expenseSum && expenseSum > 0 ? (
            <GearPieChart data={expensesByCategory} />
          ) : (
              <div
                style={{ height: 300 }}
                className="w100 col middle"
              >
                <IonIcon
                  name="pie-chart"
                  style={{ width: 250, height: 250, color: 'var(--smallAccent)' }}
                />
                <p className="textCenter slowFade boxedDark">
                  Cool graphs will show up here once you've added some expenses!
                </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
