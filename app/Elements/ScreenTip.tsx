import React from "react";
import { ToolTip } from "../assets/Types";

type screenTipProps = {
  props: ToolTip
};

export default function ScreenTip({ props }: screenTipProps) {
  if (props.value)
    return (
      <div
        className="slowFade boxedDark boxedOutline m0 p1"
        style={{ position: "fixed", left: props.x, top: props.y, zIndex: 20, boxShadow: "0  0 20px black" }}
      >
        <label className="m2">{props.value || ""}</label>
      </div>
    );
}
