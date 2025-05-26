import IonIcon from "@reacticons/ionicons";
import React from "react";
import { IoniconName } from "../assets/Ionicons";

type BasicMenuProps = {
  isActive: boolean;
  setIsActive: (boolean) => void;
  children;
  width: number | string;
  icon?: { name: IoniconName; color?: string, size: number };
  zIndex?: number;
  disableClickOff?:boolean;
};

const BasicMenu = ({
  isActive,
  setIsActive,
  children,
  width,
  icon,
  zIndex=20,
  disableClickOff=false
}: BasicMenuProps) => {
  if (isActive) {
    return (
      <div
        style={{ zIndex: zIndex }}
        className="moveableMenuBackground mediumFade center middle"
        onClick={() => {if(!disableClickOff) setIsActive(false)}}
      >
        <div
          className="boxedDark s2 p0 boxedOutline"
          style={{ width: width, height: "auto" }}
        >
          <div
            className="rightRow boxed m0"
            style={{
              width: "90%",
              margin: "0 0 10px 0",
              padding: "10px 5%",
            }}
          >
            <IonIcon className="buttonIcon" name="close" onClick={() => setIsActive(false)} />
          </div>
          <div style={{ padding: 10 }}>
            {icon && (
              <div className="center">
                <IonIcon
                  style={{ width: icon.size, height: icon.size, color: icon.color || "red" }}
                  name={icon.name}
                />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }
};
export default BasicMenu;
