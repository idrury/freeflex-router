import React, { useState } from "react";
import BasicMenu from "../BasicMenu";
import { Importer, ImporterField } from "react-csv-importer";
import { FFImportType, popSavedModalFn } from "../../assets/Types";
import {
  dateTimeFromUnknownFormat,
  handleBulkUpload,
} from "./ImportBL";
import { insertError } from "../../Functions/DBAccess";
import "react-csv-importer/dist/index.css";
import "./csvImport.css";

import IonIcon from "@reacticons/ionicons";
import ImportHistory from "./ImportHistory";
import { reRouteTo } from "../../Functions/commonFunctions";

interface BulkImportMenuProps {
  active: boolean;
  onClose: () => void;
  popSavedModal: popSavedModalFn;
}

export default function BulkImportMenu({
  active,
  onClose,
  popSavedModal,
}: BulkImportMenuProps) {
  const [historyActive, setHistoryActive] = useState(true);
  const [type, setType] = useState<FFImportType | undefined>();

  /*******************************************************
   * Handle the process of adding expenses or invoices from csv import
   * @param items The array of expenses or invoices to add
   * @param type The type of import
   */
  async function bulkUpload(items: any[], type: FFImportType) {
    try {
      if (items.length > 1) {
        await handleBulkUpload(items, type);
        popSavedModal(`${type}s imported`);
      } else if (items.length == 1) {
        await handleBulkUpload(items, type);
      }
    } catch (error) {
      await insertError(error, "ImportMenu:bulkUpload", {
        items,
      });
      popSavedModal(
        `An error occured importing your ${type}s`,
        `${
          error.code == 0
            ? error.message
            : "Refresh the page and try again!"
        }`,
        true
      );
    }
    onClose();
  }

  return (
    <BasicMenu
      width={1400}
      setIsActive={onClose}
      isActive={active}
      disableClickOff
    >
      <div>
        <div className="row middle">
          <div className="leftRow middle m0">
            <IonIcon
              name="cloud-upload"
              className="basicIcon mr2 ml1"
              style={{
                width: "1.5em",
                height: "1.5em",
              }}
            />
            <h2 className="pl1">Bulk import</h2>
            <select
              style={{
                fontSize: "1.6em",
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "1px",
                color: "var(--background)",
                marginLeft: 0,
                background: "var(--primaryColor)",
              }}
              onChange={(e) =>
                setType(e.target.value as FFImportType)
              }
            >
              <option value={""}>select type</option>
              <option value={"expense"}>expenses</option>
              <option value={"invoice"}>income</option>
            </select>
          </div>
          <a
            href="help/csv-import"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IonIcon
              name="help-circle"
              className="buttonIcon"
              style={{
                height: 50,
                width: 50,
                color: "var(--primaryColor)",
              }}
            />
          </a>
        </div>
        {type == "expense" ? (
          <Importer
            dataHandler={async (rows) => bulkUpload(rows, "expense")}
            restartable={false}
          >
            <ImporterField name="date" label="Date" />
            <ImporterField name="description" label="Description" />
            <ImporterField name="amount" label="Amount" />
            <ImporterField
              name="is_deductible"
              label="Tax Deductible"
              optional
            />
            <ImporterField
              name="category"
              label="Category"
              optional
            />
            <ImporterField name="url" label="Link" optional />
          </Importer>
        ) : (
          type == "invoice" && (
            <Importer
              dataHandler={async (rows) =>
                bulkUpload(rows, "invoice")
              }
              restartable={false}
            >
              <ImporterField name="date" label="Date" />
              <ImporterField name="project" label="Project" />
              <ImporterField name="client" label="Client" optional />
              <ImporterField name="total_amount" label="Amount" />
              <ImporterField
                name="invoice_number"
                label="Invoice number"
                optional
              />
              <ImporterField
                name="due_date"
                label="Date due"
                optional
              />
              <ImporterField
                name="description"
                label="Description"
                optional
              />
              <ImporterField
                name="show_gst"
                label="Includes GST"
                optional
              />
              <ImporterField name="isPaid" label="Is paid" optional />
            </Importer>
          )
        )}
      </div>
      <div className="divider m2" />
      <div className="leftRow middle">
        <h3 className="pl1">Import history</h3>
        <IonIcon
          name="eye"
          className="boxedAccent buttonIcon ml2"
          onClick={() => setHistoryActive(!historyActive)}
        />
      </div>
      <div>
        <ImportHistory
          active={historyActive}
          onClose={() => setHistoryActive(false)}
          popSavedModal={popSavedModal}
        />
      </div>
    </BasicMenu>
  );
}
