import React, { useState } from "react";
import { FFBusiness, FFContract, FFInvoice, FFProject, MoveableOptions } from "../../assets/Types";
import { InvoiceAttribute } from "./Types";
import InvoiceElement from "./InvoiceElement";
import AddElementMenu from "./AddElementMenu";
import ContractOptionsMenu from "../Contracts/ContractOptionsMenu";
import PreviewPanel from "../Contracts/PreviewPanel";
import TypeInput from "../TypeInput";
import IonIcon from "@reacticons/ionicons";
import { getContractsAsInputOptions } from "./InvoiceBL";
import { parseOps } from "../Contracts/ContractBL";

export type InvoiceElementsType = {
  disabled: boolean;
  description: string | undefined;
  location: string | undefined;
  totalPaid: number | undefined;
  outstandingBalance: number | undefined;
  message: string | undefined;
  addElementMenuActive: boolean;
  boxPosition: MoveableOptions;
  contracts: FFContract[] | undefined;
  selectedContract: FFContract | null;
  businessDetails:FFBusiness | undefined;
  invoice: FFInvoice;

  updateAttribute: (att: InvoiceAttribute, val) => void;
  activateAddMenu: (activate) => void;
  setAddElementMenuActive: (val) => void;
  navigateTo: (location: string, isValidated: boolean) => void;
};

export default function InvoiceElements({
  disabled,
  description,
  location,
  totalPaid,
  outstandingBalance,
  message,
  addElementMenuActive,
  boxPosition,
  contracts,
  selectedContract,
  businessDetails,
  invoice,
  updateAttribute,
  activateAddMenu,
  setAddElementMenuActive,
  navigateTo
}: InvoiceElementsType) {
  if(!businessDetails || !(invoice)) return;

    const [contractOptionsMenu, setContractOptionsMenu] =
      useState<MoveableOptions>({
        active: false,
        x: 0,
        y: 0,
      });
    const [contractPreviewActive, setContractPreviewActive] =
      useState(false);
  return (
    <div className="fifty boxedOutline">
      <ContractOptionsMenu
        options={contractOptionsMenu}
        onDelete={undefined}
        onPreview={
          selectedContract
            ? () => setContractPreviewActive(true)
            : undefined
        }
        onClose={() =>
          setContractOptionsMenu({ active: false, x: 0, y: 0 })
        }
        manageVisible={true}
      />
      <PreviewPanel
        deltaOps={parseOps(selectedContract?.ops, (invoice.projects as FFProject), businessDetails)}
        businessDetails={businessDetails}
        setActive={() => setContractPreviewActive(false)}
        active={contractPreviewActive}
        title={selectedContract?.label}
      />
      <div className="row">
        <h3 className="m2">Information</h3>
        {!disabled && (
          <div className="m2 fifty" onClick={activateAddMenu}>
            <button className="accentButton m0 hundred">
              + Field
            </button>
          </div>
        )}
      </div>

      <div className={`m2 ${disabled && "pr3"}`}>
        {(contracts as [])?.length > 0 ? (
          <div className={`rightRow hundred middle ${disabled && "boxed boxedOutline m0"}`}>
            {!disabled && <label>Send with a contract</label>}
            <div className="row middle">
              <TypeInput
              disabled={disabled}
                placeholder="select a contract"
                options={getContractsAsInputOptions(contracts)}
                onChange={(id) => updateAttribute("contract_id", id)}
                defaultValue={selectedContract?.label}
              />
              <div className="pl2">
                <button
                  className="middle m0"
                  onClick={(e) => setContractOptionsMenu({active: true, x: e.clientX, y: e.clientY})}
                >
                  <IonIcon
                    name="ellipsis-horizontal"
                    style={{ height: 17, width: 17 }}
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rightRow hundred middle">
            <label>Send a contract with this quote</label>
            <div>
              <button
                className="m0 highlight"
                onClick={() => navigateTo("/contracts", false)}
              >
                Create a contract
              </button>
            </div>
          </div>
        )}
      </div>

      {description == null &&
        location == null &&
        totalPaid == null &&
        outstandingBalance == null &&
        message == null &&
        !disabled && (
          <div className="boxed">
            <p>
              Give your clients more information by adding extra
              fields to your invoice.
            </p>
            <button
              onClick={() => updateAttribute("description", "")}
            >
              <p className="m0">+ Description</p>
            </button>
            <button onClick={() => updateAttribute("location", "")}>
              <p className="m0">+ Location</p>
            </button>
            <button
              onClick={() => {
                updateAttribute("outstanding_balance", 0);
              }}
            >
              <p className="m0">+ Outstanding Balance</p>
            </button>
            <button
              onClick={() => {
                updateAttribute("total_paid", 0);
              }}
            >
              <p className="m0">+ Total paid</p>
            </button>
            <button onClick={() => updateAttribute("message", "")}>
              <p className="m0">+ Message</p>
            </button>
          </div>
        )}

     

      <InvoiceElement
        disabled={disabled}
        label={"Description"}
        onChange={updateAttribute}
        value={description}
        element={"description"}
      />
      <InvoiceElement
        disabled={disabled}
        label="Location"
        onChange={updateAttribute}
        value={location}
        element={"location"}
      />

      <div className="leftRow dynamicRow m0">
        <InvoiceElement
          disabled={disabled}
          label={"Total paid"}
          onChange={updateAttribute}
          value={totalPaid}
          element={"total_paid"}
          isNumber
        />
        <InvoiceElement
          disabled={disabled}
          label={"Outstanding balance"}
          onChange={updateAttribute}
          value={outstandingBalance}
          element={"outstanding_balance"}
          isNumber
        />
      </div>

      <InvoiceElement
        disabled={disabled}
        label={"Message"}
        onChange={updateAttribute}
        value={message}
        element={"message"}
      />

      <AddElementMenu
        addElementMenuActive={addElementMenuActive}
        setAddElementMenuActive={setAddElementMenuActive}
        boxPosition={boxPosition}
        updateAttribute={updateAttribute}
        description={description}
        location={location}
        totalPaid={totalPaid}
        outstandingBalance={outstandingBalance}
        message={message}
      />
    </div>
  );
}
