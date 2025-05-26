import IonIcon from "@reacticons/ionicons";
import React from "react";
import { useEffect, useState } from "react";
import { ModalProps } from "../assets/Types";

export default function Modal({
  isActive,
  setActive,
  children,
  noBlur = false,
  autoHide = true,
  exitButton = false,
  zIndex,
  style,
}: ModalProps) {
  useEffect(() => {}, []);

  function updateIsActive(e, forceClose = false) {
    if (e?.target?.id == "close" || (forceClose == true && autoHide == true))
      setActive(false);
  }

  if (isActive) {
    return (
      <div
        id="close"
        className={`${!noBlur && "moveableMenuBackground"} mediumFade`}
        onClick={(e) => updateIsActive(e, true)}
        style={{zIndex: zIndex}}
      >
        <div className="delayFadeIn hundred" style={{ height: "100%" }}>
          {exitButton && (
            <div className="">
              <IonIcon
                className="buttonIcon"
                name="close"
                onClick={(e) => updateIsActive(e, true)}
              ></IonIcon>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
}
