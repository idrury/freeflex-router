import { DateTime } from "luxon";
import { useState } from "react";
import SavedModal from "../SavedModal";
import ErrorLabel from "../ErrorLabel";
import { updateInvoiceSettings } from "../../Functions/DBAccess";
import spinners from "react-spinners";
import React from "react";
import { FFErrorSelector } from "../../assets/Types";

/********************************************************
 * The details panel when users are editing an invoice
 */
export default function InvoiceDetails({ businessDetails }) {
  const [businessId, setBusinessId] = useState<number>(
    businessDetails?.id
  );
  const [resetMonthly, setResetMonthly] = useState<boolean>(
    businessDetails?.invoice_reset_monthly || false
  );
  const [prefix, setPrefix] = useState<string | undefined>(
    businessDetails?.invoice_prefix
  );
  const [currentNumber, setCurrentNumber] = useState(
    businessDetails?.invoice_count || "0"
  );

  const [validator, setValidator] = useState<FFErrorSelector>({
    field: null,
    value: null,
  });
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const [savedVisible, setSavedVisible] = useState<boolean>(false);

  async function updateDetails() {
    setUpdateLoading(true);

    // Return if no business id given
    if (!businessId) {
      alert("An error occurred finding your business");
      setUpdateLoading(false);
      return;
    }

    // Validate data
    let invNum = parseInt(currentNumber);
    let invPrefix = prefix || "";

    if (invNum < 0 || (invNum != 0 && !invNum)) {
      setValidator({
        field: "count",
        value: "Please enter a valid number",
      });
      setUpdateLoading(false);
      return;
    }

    if (prefix && prefix.length > 10) {
      setValidator({
        field: "prefix",
        value: "Prefix must be 10 characters or less",
      });
      setUpdateLoading(false);
      return;
    }

    // Call DB
    try {
      await updateInvoiceSettings(
        businessId,
        resetMonthly,
        invPrefix,
        invNum
      );
    } catch (error) {
      alert("An error occurred updating your invoice details");
    }

    // Reset state
    setSavedVisible(true);
    setEdited(false);
    setUpdateLoading(false);
    setValidator({ field: null, value: null });
  }

  function updateAttribute(attr, value) {
    if (attr == "reset_monthly") setResetMonthly(value);
    else if (attr == "prefix") setPrefix(value);
    else if (attr == "current_number") setCurrentNumber(value);

    setEdited(true);
  }

  return (
    <div>
      <div>
        <div className="leftRow middle">
          <input
            type="checkbox"
            checked={resetMonthly}
            onChange={(e) =>
              updateAttribute("reset_monthly", e.target.checked)
            }
            style={{ width: 10, height: 10 }}
          />
          <label>Reset count at start of each month</label>
        </div>
        <div className="leftRow m0 hundred">
          <div className="hundred">
            <label>Prefix</label>
            <div className="m2 pr3">
              <input
                className="m0"
                value={prefix || ""}
                onChange={(e) =>
                  updateAttribute("prefix", e.target.value)
                }
                placeholder="I.E. INV # "
              />
            </div>
            <ErrorLabel
              active={validator.field == "prefix"}
              text={validator.value}
              color="var(--dangerColor)"
            />
          </div>
          <div className="hundred">
            <label>Count</label>
            <div className="m2 pr3">
              <input
                type="number"
                value={currentNumber || ""}
                onChange={(e) =>
                  updateAttribute("current_number", e.target.value)
                }
                placeholder="0"
              />
            </div>
            <ErrorLabel
              active={validator.field == "count"}
              text={validator.value}
              color="var(--dangerColor)"
            />
          </div>
        </div>
        <p>
          Preview:{" "}
          {(prefix || "") +
            `${
              resetMonthly == true
                ? `${DateTime.now()
                    .toFormat("M")
                    .toString()}-${currentNumber}`
                : currentNumber
            }`}{" "}
        </p>
        <div className="pr3">
          <button
            disabled={updateLoading || !edited}
            className={`${edited && "accentButton"} hundred center`}
            style={{ height: 40 }}
            onClick={updateDetails}
          >
            {updateLoading ? (
              <spinners.BeatLoader color="var(--background)" size={10} />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
      <SavedModal
        visible={savedVisible}
        setVisible={setSavedVisible}
        header="Invoice settings updated!"
        body="Changes will be applied on the next invoice you create!"
        timeout={6}
      />
    </div>
  );
}
