import IonIcon from "@reacticons/ionicons";
import React from "react";
import MoveableMenu from "../MoveableMenu";
import { Link } from "react-router-dom";
import { ContractOptionsMenuProps } from "../../assets/Types";
import { isMobileBrowser } from "../../Functions/commonFunctions";

/**
 * A moveable modal which can be used to trigger different events on contracts
 */
export default function ContractOptionsMenu({
  options,
  onClose,
  onPreview,
  onDelete,
  onDuplicate,
  manageVisible = false,
}: ContractOptionsMenuProps) {
  return (
    <MoveableMenu
      isActive={options.active}
      x={options.x}
      y={options.y}
      setIsActive={onClose}
      height={200}
      width={200}
    >
      <div className="pr3">
        {(onPreview && isMobileBrowser()==false) && (
          <button
            className="hundred centerRow p0 m2"
            onClick={() => {
              onPreview();
            }}
          >
            <IonIcon
              name="eye"
              style={{ width: 20, height: 20, margin: 5 }}
            />
            <p className="">Preview</p>
          </button>
        )}
        {onDuplicate && (
          <button
            className="hundred centerRow p0 m2"
            onClick={() => {
              onDuplicate();
            }}
          >
            <IonIcon
              name="duplicate"
              style={{ width: 20, height: 20, margin: 5 }}
            />
            <p className="">Duplicate</p>
          </button>
        )}
        {onDelete && (
          <button
            className="hundred centerRow p0 m2 dangerButton"
            onClick={() => {
              onDelete();
            }}
          >
            <IonIcon
              name="trash"
              style={{ width: 20, height: 20, margin: 5 }}
            />
            <p className="">Delete</p>
          </button>
        )}
        {manageVisible && (
          <Link className="p0" to={"/Account?SEC=3"}>
            <p className="">Manage contracts</p>
          </Link>
        )}
      </div>
    </MoveableMenu>
  );
}
