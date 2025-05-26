import IonIcon from "@reacticons/ionicons";
import React from "react";

type PageHeaderType = {
  text: string;
  icon: any;
  menuVisible: boolean;
  inShrink: boolean;
};

export default function PageHeader({
  text,
  icon,
  menuVisible,
  inShrink,
}:PageHeaderType) {
  return (
    <div
      className="leftRow middle"
      style={{
        padding: `0 0 0 ${menuVisible && !inShrink ? 0 : "60px"}`,
        margin: "10px 0 10px 20px"
      }}
    >
      <IonIcon name={icon} size="large" />
      <h1 className="centerRow">{text}</h1>
    </div>
  );
}
