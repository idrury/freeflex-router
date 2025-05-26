import React from "react";

type FixedRowProps = {
  left?: number;
  top?: number;
  height?: number | string;
  minHeight?: number;
  menuVisible: boolean;
  children: any;
  accent?: boolean;
  danger?: boolean;
zIndex?:number;
};

export default function FixedRow({
  left = 0,
  top = 0,
  height = 'auto',
  minHeight = 70,
  menuVisible,
  children,
  accent,
  danger,
  zIndex=9
}: FixedRowProps) {
  return (
      <div
        className={`hundred m0 p0 mediumFade middle ${
          accent == true ? "boxedAccent" : "boxed"
        }`}
        style={{
          position: "sticky",
          left: `${left}px`,
          top: `${top}px`,
          zIndex: zIndex,
          padding: "5px 0px",
          height: height,
          minHeight: minHeight,
          backgroundColor: `${danger ? "var(--dangerColor)" : undefined}`
        }}
      >
        <div
          className="row hundred"
          style={{
            margin: `0 10px 0 ${menuVisible ? "0px" : "50px"}`,
          }}
        >
          {children}
        </div>
      </div>
  );
}
