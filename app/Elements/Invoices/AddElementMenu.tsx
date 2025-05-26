import React from "react";
import MoveableMenu from "../MoveableMenu";
import { MoveableOptions } from "../../assets/Types";
import { InvoiceAttribute } from "./Types";

type AddElementMenuProps = {
  addElementMenuActive: boolean;
  setAddElementMenuActive: (active: boolean) => void;
  boxPosition: MoveableOptions;
  updateAttribute: (attr: InvoiceAttribute, val: any) => void;
  description: string | undefined;
  totalPaid: number | undefined;
  outstandingBalance: number | undefined;
  location: string | undefined;
  message: string | undefined;
};

/************************************
 * Give users a selection of elements 
 * to add to the invoice 
 */
export default function AddElementMenu({
  addElementMenuActive,
  setAddElementMenuActive,
  boxPosition,
  updateAttribute,
  description,
  totalPaid,
  outstandingBalance,
  location,
  message,
}: AddElementMenuProps) {
  return (
    <MoveableMenu
      isActive={addElementMenuActive}
      setIsActive={setAddElementMenuActive}
      x={boxPosition.x}
      y={boxPosition.y}
      width={250}
      height={450}
      autoHide
    >
      <div className="hundred">
        <h3 className="textCenter boldLabel">Add Field</h3>
        {description == null && (
          <div className="m2 pr2">
            <button
              className="hundred m1"
              onClick={() => updateAttribute("description", "")}
            >
              Description
            </button>
          </div>
        )}
        {totalPaid == null && (
          <div className="m2 pr2">
            <button
              className="hundred m1"
              onClick={() => updateAttribute("total_paid", 0)}
            >
              Total Paid
            </button>
          </div>
        )}
        {outstandingBalance == null && (
          <div className="m2 pr2">
            <button
              className="hundred m1"
              onClick={() => updateAttribute("outstanding_balance", 0)}
            >
              Outstanding Balance
            </button>
          </div>
        )}
        {location == null && (
          <div className="m2 pr2">
            <button
              className="hundred m1"
              onClick={() => updateAttribute("location", "")}
            >
              Location
            </button>
          </div>
        )}
        {message == null && (
          <div className="m2 pr2">
            <button
              className="hundred m1"
              onClick={() => updateAttribute("message", "")}
            >
              Message
            </button>
          </div>
        )}
      </div>
    </MoveableMenu>
  );
}
