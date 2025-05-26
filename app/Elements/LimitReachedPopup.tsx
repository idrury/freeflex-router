import React from "react";
import BasicMenu from "./BasicMenu";
import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../Functions/commonFunctions";

type LimitReachedModalProps = {
  isActive: boolean;
  onClose: () => void;
  message: string;
};

export default function LimitReachedPopup({
  isActive,
  onClose,
  message,
}: LimitReachedModalProps) {
  return (
    <BasicMenu isActive={isActive} setIsActive={onClose} width={400}>
      <div className="col middle m2">
        <IonIcon
          name="arrow-up-circle"
          style={{
            color: "var(--dangerColor)",
            width: 120,
            height: 120,
          }}
        />
        <h2>You've hit a limit!</h2>
        <h3 className="textCenter">{message}</h3>
        <button
          onClick={() => reRouteTo("/plans")}
          className="accentButton hundred centerRow boxedOutline middle"
        >
            <IonIcon  name="key" style={{width: 18, marginRight: 10}}/>
          <h3 className="m0">Upgrade to remove all limits!</h3>
        </button>
      </div>
    </BasicMenu>
  );
}
