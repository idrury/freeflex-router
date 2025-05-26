import React from "react";
import IonIcon from "@reacticons/ionicons";
import MoveableMenu from "../MoveableMenu";

type InvoiceOptionsMenuProps = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  x: number;
  y: number;
  invoiceId?: number;
  setInvoiceStylePickerActive: (active: boolean) => void;
  setDeletePopupActive: (active: boolean) => void;
};

/*********************************************
 * Menu which gives users ability to
 * add new invoice components to an invoice
 */
export default function SettingsMoveableMenu({
  isActive,
  setIsActive,
  x,
  y,
  invoiceId,
  setInvoiceStylePickerActive,
  setDeletePopupActive,
}: InvoiceOptionsMenuProps) {
  return (
    <MoveableMenu
      isActive={isActive}
      setIsActive={setIsActive}
      x={x}
      y={y}
      width={200}
      height={160}
    >
      <div className="m2">
        <h3 className="boldLabel center">Options</h3>
        <div className="pr3">
          <button
            className="hundred middle center"
            onClick={() => {
              setIsActive(false);
              setInvoiceStylePickerActive(true);
            }}
            style={{ padding: "0 10px" }}
          >
            <IonIcon
              name="sparkles-sharp"
              style={{ width: 20, height: 20, margin: 5 }}
            />
            <p className="hiddenOnShrink">Settings</p>
          </button>

        </div>
      </div>
    </MoveableMenu>
  );
}
