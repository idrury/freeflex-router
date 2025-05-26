import { useEffect, useState } from "react";
import AddDateModal from "../AddDateModal";
import { formatDatestring } from "../../Functions/Dates";
import {
  deleteExpense,
  fetchFile,
  updateExpenseFile,
  uploadExpenseFile,
} from "../../Functions/DBAccess";
import EditMenu from "../EditMenu";
import DeletePopup from "../DeletePopup";
import spinners from "react-spinners";
import { Link } from "react-router-dom";
import IonIcon from "@reacticons/ionicons";
import ErrorLabel from "../ErrorLabel";
import TypeInput from "../TypeInput";
import React from "react";
import {
  EXPENSE_CATEGORIES,
  RECURRING_OPTIONS,
} from "../../Functions/Data";
import {
  handleAddOrUpdateExpense,
  validateExpenseForm,
} from "./BudgetBL";
import { LimitReachedType } from "../../assets/Types";
import LimitReachedPopup from "../LimitReachedPopup";
import { LIMITS } from "../../assets/data";
import { isMobileBrowser } from "../../Functions/commonFunctions";

export default function AddExpensePopup({
  isActive,
  close,
  loadingSave,
  setLoadingSave,
  onSubmit,
  date,
  description,
  category,
  amount,
  url,
  setUrl,
  deductible,
  isRecurring,
  recurringFrequency,
  recurringExpenseId,
  setRecurringExpenseId,
  setDate,
  endDate,
  setEndDate,
  setDescription,
  setAmount,
  setCategory,
  setDeductible,
  setIsRecurring,
  uploadFile,
  setUploadFile,
  downloadFile,
  setDownloadFile,
  edited,
  setEdited,
  setRecurringFrequency,
  numExpenses,
  throwError,
  id,
  userId,
  role,
  activateImportMenu,
}) {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [removeFileVisible, setRemoveFileVisible] = useState(false);
  const [fileDownloading, setFileDownloading] = useState(false);

  const [fieldValidation, setFieldValidation] = useState<{
    field: string | null;
    text: string | null;
  }>({
    field: null,
    text: null,
  });
  const [LimitReachedModal, setLimitReachedModal] =
    useState<LimitReachedType>({ isActive: false, body: "" });
  const [renderedPage, setRenderedPage] = useState<Document>();

  useEffect(() => {
    setRenderedPage(document);
  }, [])

  /*************************************************
   * Handle the process of validating the expense form
   * and then inserting or updating the expense
   */
  async function saveExpense() {
    // Limit user expenses on free plan
    if (role == "free" && numExpenses >= LIMITS.expenses) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only create ${LIMITS.expenses} expenses on the free plan.`,
      });
      return;
    }

    // Validate the form
    try {
      validateExpenseForm(description, category, amount);
    } catch (error: any) {
      console.log(error);
      setFieldValidation({
        field: error.field,
        text: error.text,
      });
      return;
    }

    setLoadingSave(true);

    // Insert to the database
    let project: any | null = null;
    project = await triggerExpenseAddOrUpdate();
    if (!project) return;

    let file: {
      id: number;
      path: string;
      fullPath: string;
    } | null = null;

    // Save the file to object storage
    if (uploadFile && userId) {
      file = await triggerUploadExpenseFile(project.id);
      if (!file) return;

      // Update the expense with a link to the file if successful
      triggerLinkToExpenseFile(project.id, file.path);
    }

    closePopup(true);
    return;
  }

  /*******************************************************
   * Trigger the process of adding or updating an expense
   */
  async function triggerExpenseAddOrUpdate(): Promise<any | null> {
    try {
      return await handleAddOrUpdateExpense(
        id,
        recurringExpenseId,
        description,
        category,
        amount,
        deductible,
        url,
        date,
        endDate,
        recurringFrequency
      );
    } catch (error) {
      // Notify user if an error occurs
      setLoadingSave(false);
      throwError(
        "An error occured while adding your expense.",
        "Refresh the page and try again",
        true
      );
      closePopup(false);
      return null;
    }
  }

  /***********************************************************
   * Initiate the process of adding an expense file to the DB
   * @param id The id of the project to add the expense to
   */
  async function triggerUploadExpenseFile(
    id: number
  ): Promise<any | null> {
    try {
      return await uploadExpenseFile(id, uploadFile, userId);
    } catch (error) {
      throwError(
        "An error occured uploading the file.",
        "Expense files must be a pdf less than 200kb in size!",
        true
      );
      setLoadingSave(false);
      return null;
    }
  }

  /*************************************************
   * Trigger the process of linking an uploaded file
   * to a project
   * @param id The id of the project to update
   * @param path The path of the file to link
   */
  async function triggerLinkToExpenseFile(id: number, path: string) {
    try {
      await updateExpenseFile(id, path);
      closePopup(true);
    } catch (error) {
      throwError(
        "An error occured uploading the file.",
        "Expense files must be a pdf less than 200kb in size!",
        true
      );
      setLoadingSave(false);
      return null;
    }
  }

  /******************************************
   * Handle the process of downloading
   * an expense file
   */
  async function downloadExpenseFile() {
    setFileDownloading(true);

    try {
      let blob = await fetchFile(downloadFile);
      let url = window.URL.createObjectURL(blob);

      if(!renderedPage) throw "Page not defined";
      // Create a temporary <a> element to trigger the download
      const tempLink = renderedPage?.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute(
        "download",
        `expense_${description}_${formatDatestring(date)}`
      ); // Set the desired filename for the downloaded file

      // Append the <a> element to the body and click it to trigger the download
      renderedPage?.body.appendChild(tempLink);
      tempLink.click();

      // Clean up the temporary elements and URL
      renderedPage?.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throwError(
        "An error occurred downloading PDF.",
        "Refresh the page and try again",
        true
      );
    }

    setFileDownloading(false);
    return;
  }

  async function closePopup(fetch) {
    if (fetch == true) {
      setLoadingSave(true);
      await onSubmit(true, id == null);
    }

    close();
    setFieldValidation({ field: null, text: null });
  }

  /*********************************************
   * Handle the process of removing a file
   */
  async function removeDownloadFile() {
    try {
      await updateExpenseFile(id, null);
      setDownloadFile(null);
      setRemoveFileVisible(false);
      onSubmit(true);
    } catch (error) {
      throwError(
        "An issue occured while attempting to remove your file.",
        "Try again in a few moments",
        true
      );
    }
  }

  function updateDescription(desc: string) {
    setEdited(true);
    setDescription(desc);
  }

  function updateCategory(cat: string) {
    setEdited(true);

    for (let i = 0; i < EXPENSE_CATEGORIES.length; i++) {
      if (cat == EXPENSE_CATEGORIES[i].value) {
        setCategory(EXPENSE_CATEGORIES[i].label);
        return true;
      }
    }

    setCategory(null);
  }

  function updateAmount(value) {
    setEdited(true);
    setAmount(value);
  }

  function updateDate(val) {
    setEdited(true);
    setDate(val);
  }

  async function removeExpense() {
    let res = await deleteExpense(id);

    if (!res) {
      throwError(
        "An error occured deleting this expense!",
        "Refresh the page and try again."
      );
      return;
    }

    setDeleteVisible(false);
    closePopup(true);
  }

  function updateDeductible(val) {
    setEdited(true);
    if (!recurringExpenseId) {
      setDeductible(val);
    }
  }

  function updateUrl(val) {
    setEdited(true);

    let updatedUrl = null;

    if (val != "") {
      if (val.startsWith("https://"))
        updatedUrl = val.split("https://")[1];
      else updatedUrl = val;
    }

    setUrl(updatedUrl);
  }

  function updateRecurringFrequency(val) {
    setEdited(true);
    setRecurringFrequency(val);
  }

  function updateEndDate(dt) {
    setEdited(true);
    setEndDate(dt);
  }

  function addFile(f) {
    setEdited(true);
    if (f) {
      setUploadFile(f);
    }
  }

  return (
    <EditMenu
      setIsActive={() => closePopup(false)}
      isActive={isActive}
      width={330}
      height={200}
      isLoading={loadingSave}
    >
      <DeletePopup
        active={deleteVisible}
        onDelete={removeExpense}
        onCancel={() => setDeleteVisible(false)}
        type="expense"
      />

      <DeletePopup
        active={removeFileVisible}
        onDelete={removeDownloadFile}
        onCancel={() => setRemoveFileVisible(false)}
        type="file"
      />
      <LimitReachedPopup
        isActive={LimitReachedModal.isActive}
        onClose={() =>
          setLimitReachedModal({ isActive: false, body: "" })
        }
        message={LimitReachedModal.body}
      />
      <div className="col between">
        <div style={{ maxWidth: 330 }}>
          <div className="row">
            <h2>{id ? "" : "Add"} Expense</h2>
            {id && (
              <button
                style={{ padding: 3 }}
                onClick={() => setDeleteVisible(true)}
              >
                {" "}
                <IonIcon name="trash" style={{ width: 22 }} />{" "}
              </button>
            )}
          </div>
          {recurringExpenseId && (
            <div className="leftRow" style={{ alignItems: "center" }}>
              <IonIcon
                name="repeat"
                style={{
                  color: "var(--primaryColor)",
                  marginRight: 5,
                }}
                size="large"
              />
              <p>This expense occurs {recurringFrequency}</p>
            </div>
          )}
          <label>Date</label>
          <div className="m2">
            <AddDateModal
              disabled={recurringExpenseId || isRecurring}
              date={new Date(date)}
              setDate={updateDate}
              label={date && formatDatestring(date)}
            />
          </div>
          <br />
          <label>Description *</label>
          <div className="m2 pr2">
            <textarea
              disabled={recurringExpenseId}
              value={description || ""}
              onChange={(v) => updateDescription(v.target.value)}
            />
            <ErrorLabel
              active={fieldValidation.field == "name"}
              text={fieldValidation.text}
            />
          </div>
          <label>Category *</label>
          <div className="m2 pr2">
            <TypeInput
              options={EXPENSE_CATEGORIES}
              onChange={updateCategory}
              disabled={recurringExpenseId}
              defaultValue={category}
              placeholder="select a category"
            />
          </div>
          <ErrorLabel
            active={fieldValidation.field == "category"}
            text={fieldValidation.text}
          />
          <label>Cost ($) *</label>
          <div className="m2 pr2">
            <input
              disabled={recurringExpenseId}
              type="number"
              value={amount || ""}
              onChange={(v) => updateAmount(v.target.value)}
            />
            <ErrorLabel
              active={fieldValidation.field == "cost"}
              text={fieldValidation.text}
            />
          </div>
          <label>Link</label>
          <div className="m2 pr2">
            <input
              disabled={recurringExpenseId}
              type="url"
              value={url || ""}
              onChange={(v) => updateUrl(v.target.value)}
            />
            {url && (
              <div style={{ marginTop: 10 }}>
                <Link
                  className="m0 p0"
                  to={"https://" + url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Link
                </Link>
              </div>
            )}
          </div>
          {downloadFile ? (
            <div className="leftRow m0 middle">
              <button
                className="hundred"
                style={{ height: 40 }}
                onClick={() => downloadExpenseFile()}
              >
                {fileDownloading ? (
                  <spinners.BeatLoader size={10} color="var(--primaryColor)" />
                ) : (
                  "Download file"
                )}
              </button>
              <button
                onClick={() => setRemoveFileVisible(true)}
                className="p0 m0 dangerButton"
              >
                {" "}
                <IonIcon
                  name="close"
                  style={{ padding: 7, width: 25, height: 25 }}
                />
              </button>
            </div>
          ) : (
            <div>
              <label>File</label>
              <div className="leftRow">
                <input
                  disabled={recurringExpenseId}
                  type="file"
                  onChange={(v) => {
                    v.target.files && addFile(v.target.files[0]);
                  }}
                  accept=".pdf, image/*"
                />
              </div>
            </div>
          )}
          <div
            className="leftRow"
            style={{ alignItems: "center", margin: 0 }}
          >
            <div className="m2">
              <input
                disabled={recurringExpenseId ? true : false}
                type="checkbox"
                checked={deductible}
                onChange={(v) => updateDeductible(v.target.checked)}
              />
            </div>
            <label>Tax deductible</label>
          </div>
          <br></br>
          {!id && (
            <div>
              <div
                className="leftRow"
                style={{ alignItems: "center", margin: 0 }}
              >
                <div className="m2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(v) => setIsRecurring(v.target.checked)}
                  />
                </div>
                <label>Recurring expense</label>
              </div>
            </div>
          )}
          {isRecurring && (
            <div className="mediumFade boxedOutline leftRow">
              <div>
                <label>Frequency</label>
                <select
                  defaultValue={recurringFrequency}
                  onChange={(v) =>
                    updateRecurringFrequency(v.target.value)
                  }
                >
                  {RECURRING_OPTIONS.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Until</label>
                <AddDateModal
                  date={new Date(endDate)}
                  setDate={updateEndDate}
                  label={endDate && formatDatestring(endDate)}
                />
              </div>
            </div>
          )}
          {edited || !id ? (
            <div className="row">
              {id ? (
                <button
                  className="accentButton w100"
                  disabled={loadingSave}
                  onClick={() => saveExpense()}
                >
                  {loadingSave ? (
                    <spinners.BeatLoader
                      color="var(--primaryColor)"
                      size={10}
                    />
                  ) : (
                     <div className="centerRow middle">
                      <IonIcon
                        name="sync"
                        className="basicIcon mr1"
                      />
                      <p className="m0">Update</p>
                    </div>
                  )}
                </button>
              ) : (
                <button
                  className="w100"
                  disabled={loadingSave}
                  onClick={() => saveExpense()}
                >
                  {loadingSave ? (
                    <spinners.BeatLoader
                      color="var(--primaryColor)"
                      size={10}
                    />
                  ) : (
                    <div className="centerRow middle">
                      <IonIcon
                        name="save-sharp"
                        className="basicIcon mr1"
                      />
                      <p className="m0">Save</p>
                    </div>
                  )}
                </button>
              )}
              <button
                className="w100"
                disabled={loadingSave}
                onClick={() => closePopup(false)}
              >
                <div className="centerRow middle">
                  <IonIcon
                    name="save-sharp"
                    className="basicIcon mr1"
                  />
                  <p className="m0">Save</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="pr2">
              <button
                disabled={loadingSave}
                className="w100"
                onClick={() => closePopup(false)}
              >
                {loadingSave ? (
                  <spinners.BeatLoader color="var(--primaryColor)" size={10} />
                ) : (
                   <div className="centerRow middle">
                      <IonIcon
                        name="close"
                        className="basicIcon mr1"
                      />
                      <p className="m0">Close</p>
                    </div>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="pr2">
          {!isMobileBrowser() && (
            <button
              onClick={activateImportMenu}
              className="centerRow w100 p0 borderPrimary"
            >
              <IonIcon className="basicIcon" name="cloud-upload" />
              <p>Bulk import expenses</p>
            </button>
          )}
        </div>
      </div>
    </EditMenu>
  );
}
