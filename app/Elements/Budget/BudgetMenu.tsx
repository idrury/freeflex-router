import React, { useState } from "react";
import EditMenu from "../EditMenu";
import IonIcon from "@reacticons/ionicons";
import BulkImportMenu from "../CsvImport/ImportMenu";
import {
  FFActiveComponent,
  popSavedModalFn,
} from "../../assets/Types";
import { isMobileBrowser } from "../../Functions/commonFunctions";

interface BudgetMenuProps extends FFActiveComponent {
  activateImportMenu: () => void;
}

export default function BudgetMenu({
  active,
  onClose,
  activateImportMenu,
}: BudgetMenuProps) {
  return (
    <div>
      <EditMenu
        isActive={active}
        setIsActive={onClose}
        width={250}
        height={300}
      >
        <div className="boxedDark m0 p0">
          <h2 className="textLeft">Menu</h2>

          <div>
            <div>
              {!isMobileBrowser() && (
                <button
                  onClick={activateImportMenu}
                  className="centerRow w100 m1 p0"
                >
                  <IonIcon
                    className="basicIcon"
                    name="cloud-upload"
                  />
                  <p>Bulk import</p>
                </button>
              )}

              {/* <button className="centerRow w100 m1 p0">
                <IonIcon
                  style={{ display: "flex", height: 18, width: 18 }}
                  name="analytics"
                />
                <p>Generate tax report</p>
              </button> */}
            </div>
          </div>
        </div>
      </EditMenu>
    </div>
  );
}
