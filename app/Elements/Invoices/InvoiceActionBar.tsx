import React from "react";
import IonIcon from "@reacticons/ionicons";
import Toggle from "react-toggle";
import FixedRow from "../FixedRow";
import InvoiceFactory from "./InvoiceFactory";
import { FFClient, FFContract, FFInvoice, FFProject } from "../../assets/Types";
import { parseOps } from "../Contracts/ContractBL";

type InvoiceActionBarProps = {
  invoice: FFInvoice;
  menuVisible: boolean;
  inShrink: boolean;
  saved: boolean;
  invoiceStyleId: number;
  businessDetails: any;
  gst: { show: boolean; value: number };
  showClientDetails: boolean;
  invoiceColor: string;
  searchParams: URLSearchParams;
  selectedContract: FFContract | undefined;
  setIsInvoice: (value: boolean) => void;
  saveInvoice: () => void;
  tryGoBack: () => void;
  activateInvoiceOptions: (active: boolean) => void;
};

export default function InvoiceActionBar({
  menuVisible,
  saved,
  invoice,
  invoiceStyleId,
  businessDetails,
  gst,
  showClientDetails,
  selectedContract,
  invoiceColor,
  searchParams,
  inShrink,
  setIsInvoice,
  saveInvoice,
  tryGoBack,
  activateInvoiceOptions,
}: InvoiceActionBarProps) {
  return (
    <FixedRow menuVisible={menuVisible} minHeight={90}>
      <div className="leftRow middle">
        <button
          className="centerRow middle p0"
          onClick={() => tryGoBack()}
        >
          <IonIcon
            name="arrow-back"
            style={{ height: 22, width: 22, margin: 5 }}
          />
          <p className="hiddenOnShrink">Back</p>
        </button>
        {saved ? (
          <InvoiceFactory
            invoice={invoice}
            formatId={invoiceStyleId}
            date={invoice.date}
            businessDetails={businessDetails}
            project={invoice.projects as FFProject}
            client={(invoice.projects as FFProject).clients as FFClient}
            gst={gst}
            settings={{
              show_client_details: showClientDetails,
            }}
            color={invoiceColor}
            contractDelta={parseOps(selectedContract?.ops, invoice.projects as FFProject, businessDetails)}
          />
        ) : (
          <button
            disabled={saved}
            className="accentButton centerRow p0 m0 middle"
            style={{ margin: "0 10px" }}
            onClick={saveInvoice}
          >
            <IonIcon
              name="save-sharp"
              style={{ height: 22, width: 22, margin: 5 }}
            />
            <p className="hiddenOnShrink">Save</p>
          </button>
        )}
      </div>

      {(!searchParams.get("IID") && !inShrink) && (
        <div className="flexRow middle">
          <label>Quote</label>
          {/*@ts-ignore*/}
          <Toggle
            name="schemeToggle"
            id="schemeToggle"
            defaultChecked={invoice.isInvoice}
            onChange={(e) => setIsInvoice(e.target.checked)}
            icons={false}
          />
          <label>Invoice</label>
        </div>
      )}

      <div className="leftRow">
        <button
          className="centerRow middle p0 m2"
          onClick={() => activateInvoiceOptions(true)}
        >
          <IonIcon
            name="options-sharp"
            style={{ width: 20, height: 20, margin: 5 }}
          />
          <p className="hiddenOnShrink">Options</p>
        </button>
      </div>
    </FixedRow>
  );
}