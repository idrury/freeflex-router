import AddDateModal from "../AddDateModal";
import { formatDatestring } from "../../Functions/Dates";
import QuoteItems from "../QuoteItems";
import ErrorLabel from "../ErrorLabel";
import IonIcon from "@reacticons/ionicons";
import TypeInput from "../TypeInput";
import { useState } from "react";
import React from "react";
import ContractOptionsMenu from "../Contracts/ContractOptionsMenu";
import PreviewPanel from "../Contracts/PreviewPanel";
import { QuoteMenuProps } from "./QuotesTypes";

export default function QuoteMenu({
  date,
  setDate,
  description,
  setDescription,
  quoteItems,
  setQuoteItems,
  save,
  errorText,
  loading,
  contracts,
  setContract,
  contract,
  businessDetails,
  navigateTo,
  saveLoading,
  saved,
}: QuoteMenuProps) {
  const [options, setOptions] = useState({
    active: false,
    x: 0,
    y: 0,
  });
  const [previewActive, setPreviewActive] = useState(false);

  function activateMenuOptions(
    e: React.MouseEvent<HTMLButtonElement, React.MouseEvent>
  ) {
    if (!contracts) return;
    setOptions({ active: true, x: e.clientX, y: e.clientY });
  }

  function previewPdf(active: boolean) {
    setPreviewActive(active);
  }

  return (
    <div className="dynamicSize fifty m0">
      <ContractOptionsMenu
        options={options}
        onDelete={undefined}
        onPreview={contract ? () => previewPdf(true) : undefined}
        onClose={() => setOptions({ active: false, x: 0, y: 0 })}
        manageVisible={true}
      />
      <PreviewPanel
        deltaOps={contract?.ops}
        businessDetails={businessDetails}
        setActive={() => previewPdf(false)}
        active={previewActive}
        title={contract?.label}
      />
      {loading ? (
        <div></div>
      ) : (
        <div style={{ marginTop: 50 }}>
          <div className="row middle hundred">
            <AddDateModal
              date={date}
              setDate={setDate}
              label={date ? formatDatestring(date) : "no date"}
            />
            <div className="rightRow seventyFive">
              {(contracts as [])?.length > 0 ? (
                <div className="rightRow hundred middle">
                  <label>Send with a contract</label>
                  <div className="row middle">
                    <TypeInput
                      placeholder="select a contract"
                      onChange={(c) => setContract(c)}
                      defaultValue={contract?.label}
                    />
                    <div className="pl2">
                      <button
                        className="middle m0"
                        onClick={(e) => activateMenuOptions(e)}
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
                      onClick={() =>
                        navigateTo("/account?SEC=3", false)
                      }
                    >
                      Create a contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="m2 pr2">
            <textarea
              placeholder="description"
              value={description || ""}
              onChange={(v) => setDescription(v.target.value)}
            />
          </div>
          <ErrorLabel
            active={errorText.field == "description"}
            text={errorText.value}
            color="var(--dangerColor)"
          />

          <div>
            <h3 className="p2">Items</h3>
            <QuoteItems qItems={quoteItems} setQ={setQuoteItems} />
          </div>
          <div className="pr2">
            <button
              disabled={saved}
              className="accentButton centerRow p0 hundred"
              onClick={save}
            >
              <div style={{ paddingLeft: 10 }}>
                <IonIcon
                  name="save-sharp"
                  style={{ paddingTop: 3, height: 18, width: 18 }}
                />
              </div>
              <p style={{ paddingRight: 10 }}>Save</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
