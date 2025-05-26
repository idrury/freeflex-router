import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../Functions/commonFunctions";
import React from "react"

export default function ProjectWidget({ data }) {
  return (
    <button
      className="dynamicSize thirty"
      onClick={() => reRouteTo("/projects")}
    >
      <IonIcon
        name="checkmark-done"
        style={{ width: 50, height: 50 }}
      />
      <h3 className="boldLabel center">Active projects</h3>

      <h2 style={{ fontSize: 32 }}>{data[0].value || 0}</h2>
      <p>{data[1].value} due this week</p>
    </button>
  );
}
