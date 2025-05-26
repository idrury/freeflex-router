import IonIcon from "@reacticons/ionicons";
import React, { useState } from "react";

type AddLineProps = {
  disabled?,
  alwaysVisible?: boolean;
  onAdd: () => any;
};

export default function AddLine({
  disabled,
  alwaysVisible = false,
  onAdd,
}: AddLineProps) {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState<number>(alwaysVisible ? 30 : 2);

  function onOver() {
    setActive(true);
    setHeight(30);
  }

  function onOut() {
    setActive(false);
    alwaysVisible || setHeight(5);
  }

  if(!disabled)
  return (
    <div
      className="clickable"
      onClick={onAdd}
      onMouseOver={onOver}
      style={{ height: height, backgroundColor: `${alwaysVisible ? 'var(--lightBackground)' : undefined}` }}
      onMouseLeave={onOut}
    >
      {(active==true || alwaysVisible==true) && (
        <div
          className="slowFade"
          style={{ position: "relative", width: "100%" }}
        >
          <div
            className="centerRow hundred"
            style={{
              position: "absolute",
            }}
          >
            <IonIcon
              name="add-circle-outline"
              size="large"
              style={{ position: "relative", zIndex: 6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
