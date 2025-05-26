import React from "react";
import { FFProject } from "../../assets/Types";
import IonIcon from "@reacticons/ionicons";
import { IoniconName } from "../../assets/Ionicons";

type ProjectParamaterButtonProps = {
  disabled?: boolean;
  label: string;
  background?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  innerText: string;
  icon?: IoniconName;
};
export default function ProjectParamaterButton({
  disabled = false,
  label,
  background,
  onClick,
  innerText,
  icon,
}: ProjectParamaterButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => onClick(e)}
      className={`m0 mb2 mr1 hundred lightHover`}
      style={{ border: `2px solid ${background}` }}
    >
      <div className="leftRow m0 middle">
        <IonIcon
          name={icon || "calendar-number-sharp"}
          className="basicIcon mr1 ml1"
          style={{ color: background }}
        />
        <label className="smallLabel m1 col">{label}</label>
      </div>
      <div className="p0 m0">
        <h3
          className="textLeft m1"
          style={{ textTransform: "uppercase" }}
        >
          {innerText}
        </h3>
      </div>
    </button>
  );
}
