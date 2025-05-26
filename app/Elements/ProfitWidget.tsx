import React, { useState } from "react";
import { reRouteTo } from "../Functions/commonFunctions";
import IonIcon from "@reacticons/ionicons";

export default function ProfitWidget({ data }) {
  const [loading, setLoading] = useState(true);

  function calculateProfit() {
    return Math.round((data[0].value - data[1].value) * 100) / 100;
  }

  function calculatePercentIncrease() {
    let res =
      Math.round((data[0].value / data[1].value - 1) * 10000) / 100 ||
      0;

    if (res < 0) return `${res}%`;
    else return `+${res}%`;
  }

  return (
    <button
      onClick={() => reRouteTo("/budget")}
      className="displayButton dynamicSize thirty"
    >
      <IonIcon
        name="analytics-outline"
        style={{ width: 50, height: 50 }}
      />
      <h3 className="boldLabel textCenter">Profit</h3>
      <h2 style={{ fontSize: 32 }}>${calculateProfit() || 0}</h2>
      <p>{calculatePercentIncrease()}</p>
    </button>
  );
}
