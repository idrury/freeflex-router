import IonIcon from "@reacticons/ionicons";
import React from "react";

export default function PredictedProfitSummary() {
  return (
    <div
      className="boxed centerRow mediumFade boxedOutline"
      style={{ height: "50vh" }}
    >
      <IonIcon
        name="wallet"
        style={{
          width: 150,
          height: 150,
          color: "var(--smallAccent)",
        }}
      />
      <p>Fun stuff coming here soon!</p>
    </div>
  );
}
