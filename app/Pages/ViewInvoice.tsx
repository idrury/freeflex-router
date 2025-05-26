import React, { useEffect, useState } from "react";
import {
  deleteInvoice,
  fetchBusiness,
  fetchContracts,
  fetchInvoice,
  fetchInvoicesForProject,
  fetchProject,
  insertError,
  insertInvoice,
  updateBusinessAttribute,
  updateInvoice,
  updateProjectAttribute,
} from "../Functions/DBAccess";
import { useParams, useSearchParams } from "react-router-dom";
import EditInvoiceMenu from "../Elements/Invoices/EditInvoiceMenu";
import {
  copyToClipboard,
  reRouteTo,
} from "../Functions/commonFunctions";
import spinners from "react-spinners";

import DeletePopup from "../Elements/DeletePopup";

import InvoiceStylePicker from "../Elements/Invoices/InvoiceStylePicker";
import BasicMenu from "../Elements/BasicMenu";
import { DateTime, Duration } from "luxon";
import SavedModal from "../Elements/SavedModal";
import {
  FFBusiness,
  FFClient,
  FFContract,
  FFInvoice,
  FFInvoiceProject,
  FFProfile,
  FFProject,
  InvoiceItemType,
  LimitReachedType,
  ProjectAttribute,
  SavedModalType,
} from "../assets/Types";

import {
  InvoiceAttribute,
  InvoiceDefaultAttribute,
} from "../Elements/Invoices/Types";
import { DEFAULT_ITEM } from "../Elements/Invoices/INVOICE_DATA";

import InvoiceActionBar from "../Elements/Invoices/InvoiceActionBar";
import {
  buildInvoiceNumber,
  calculateInclusiveTotal,
} from "../Elements/Invoices/InvoiceBL";
import FixedRow from "../Elements/FixedRow";
import IonIcon from "@reacticons/ionicons";
import { LIMITS } from "../assets/data";
import LimitReachedPopup from "../Elements/LimitReachedPopup";
import { parseString } from "../Elements/CsvImport/ImportBL";

const STYLES = [
  {
    id: 0,
    name: "Sleek",
    src: "https://img.playbook.com/Y4-trE1yrz2JMuLnukuG7xXxx8kAa8F3Y3SgiGvOvDo/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2IxM2UwNDhm/LTBlYzQtNGJmNy1h/YmQ1LThlNGUzNTIy/ZDZkOA",
  },
  {
    id: 1,
    name: "Sidebar",
    src: "https://img.playbook.com/rDTFeAxY7ASy5lQCHTsykvzV-kiErhDcwfuU8T2D98o/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2IzNGEwZjEy/LTg4NmMtNDYxMi1h/MDI2LTViNDFiZWMw/YTY2Ng",
  },
  {
    id: 2,
    name: "Blocked",
    src: "https://img.playbook.com/90tSE1H2oo8J4rJkNMKdaRO9mqqlu3sh9k8w9S_xUAc/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzE1OGU1NDhl/LTgzMjYtNDEzZi1h/ZjQzLTRiZTM4Yjdj/MjNkYg",
  },
];

interface ViewInvoiceProps {
  profile: FFProfile;
  menuVisible: boolean;
  inShrink: boolean;
}

/****************************************
 * The master page for invoice editing
 ***************************************/
export default function ViewInvoice({
  profile,
  menuVisible,
  inShrink,
}: ViewInvoiceProps) {
  let { projectId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const [businessDetails, setBusinessDetails] =
    useState<FFBusiness>();
  const [invoiceCount, setInvoiceCount] = useState<number>();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [invoiceStyleId, setInvoiceStyleId] = useState(0);
  const [invoiceStylePickerActive, setInvoiceStylePickerActive] =
    useState(false);
  const [invoiceStyleLoading, setInvoiceStyleLoading] =
    useState(false);
  const [invoiceColor, setInvoiceColor] = useState("#EEEEEE");
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showGst, setShowGst] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showTotalPaid, setShowTotalPaid] = useState(false);
  const [showOutstanding, setShowOutstanding] = useState(false);

  const [deletePopupActive, setDeletePopupActive] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [paidPopupActive, setPaidPopupActive] = useState(false);
  const [LimitReachedModal, setLimitReachedModal] =
    useState<LimitReachedType>({ isActive: false, body: "" });
  const [backPopup, setBackPopup] = useState<{
    active: boolean;
    route: string | undefined;
  }>({ active: false, route: undefined });

  const [contracts, setContracts] = useState<
    FFContract[] | undefined
  >(undefined);
  const [selectedContract, setSelectedContract] = useState<
    FFContract | undefined
  >();

  const [savedModal, setSavedModal] = useState<SavedModalType>({
    visible: false,
    body: undefined,
    header: undefined,
  });

  const [invoiceData, setInvoiceData] = useState<FFInvoice>({
    id: undefined,
    created_at: new Date(),
    date: new Date(),
    projects: [],
    invoice_number: "",
    invoice_items: [DEFAULT_ITEM],
    total_amount: 0,
    due_date: undefined,
    description: undefined,
    total_paid: undefined,
    outstanding_balance: undefined,
    message: undefined,
    location: undefined,
    show_gst: false,
    isInvoice: searchParams?.get("type") == "invoice",
    isPaid: false,
    contract_id: undefined,
  });

  useEffect(() => {
    getInvoice();
  }, []);

  /************************************
   * Fetch an invoice from the database
   */
  async function getInvoice() {
    const iId = parseInt(searchParams.get("IID") || "");
    let bResult: FFBusiness | null = null;

    // Fetch the business details
    try {
      bResult = await fetchBusiness();

      if (!profile.default_settings.business_details_exist) {
        alert(
          "You need to add your business information to create quotes & invoices!"
        );
        reRouteTo("/account");
        return;
      }

      setBusinessDetails(bResult);
      setInvoiceStyleId(bResult?.default_invoice || 0);
      setInvoiceCount(bResult.invoice_count);
      setInvoiceColor(bResult.invoice_color);
      handleUpdateInvoiceAttribute(
        "show_gst",
        bResult.invoice_show_gst
      );
      setShowClientDetails(bResult.invoice_show_client_details);
      setShowDueDate(bResult.invoice_show_due);
      setShowDescription(bResult.invoice_show_description);
      setShowLocation(bResult.invoice_show_location);
      setShowTotalPaid(bResult.invoice_show_total_paid);
      setShowOutstanding(bResult.invoice_show_outstanding);
      handleUpdateInvoiceAttribute(
        "invoice_number",
        buildInvoiceNumber(
          bResult.invoice_prefix,
          bResult.invoice_count + 1,
          bResult.invoice_reset_monthly
        )
      );

      if (bResult.invoice_show_due == true)
        invoiceData.due_date = DateTime.fromJSDate(new Date())
          .plus(Duration.fromObject({ months: 1 }))
          .toJSDate();
      if (bResult.invoice_show_description == true)
        invoiceData.description = "";
      if (bResult.invoice_show_location == true)
        invoiceData.location = "";
      if (bResult.invoice_show_total_paid == true)
        invoiceData.total_paid = 0;
      if (bResult.invoice_show_outstanding == true)
        invoiceData.outstanding_balance = 0;
    } catch (error) {
      alert(
        "This invoice has encountered an error. Try again in a few moments."
      );
    }

    if (!bResult) return;

    let localContracts = await getContracts();

    //Fetch the invoice details
    try {
      if (iId) {
        let iResult = await fetchInvoice(iId);
        if (iResult) setInvoiceData(iResult);
        if (iResult.contract_id)
          setSelectedContract(
            localContracts?.find((c) => c.id == iResult.contract_id)
          );
        // Get the project data from the project if none can be retrieved from the invoice
      }
    } catch (error) {
      setSavedModal({
        visible: true,
        header: "An error occured",
        body: "This invoice has encountered an error",
        state: "fail",
      });
    }
    if (iId) setSaved(true);
    setLoading(false);
  }

  /*************************************************
   * Fetch contracts for user project from the database
   * and assign to state variable
   */
  async function getContracts(): Promise<FFContract[] | null> {
    try {
      const contracts = await fetchContracts();
      setContracts(contracts);
      return contracts;
    } catch (error) {
      insertError(error, "createQuote:getContracts", null);
    }
    return null;
  }

  /**************************************
   * Update the current list of invoice items
   * @param newInvoiceItems The updated item list
   */
  function updateInvoiceItems(newInvoiceItems: InvoiceItemType[]) {
    setSaved(false);
    setInvoiceData({
      ...invoiceData,
      invoice_items: newInvoiceItems,
      total_amount: calculateInclusiveTotal(
        newInvoiceItems,
        invoiceData.show_gst
      ),
    });
  }

  /*********************************************
   * Save the invoice to the database
   * @param showSuccess Whether to show a success message
   */
  async function saveInvoice(showSuccess: boolean = true) {
    if (
      !projectId ||
      !businessDetails?.id ||
      invoiceCount == null ||
      !invoiceData
    ) {
      insertError(
        new Error("missing important invoice detail"),
        "saveInvoice",
        {
          invoiceDate: invoiceData.date,
          projectId: projectId,
          busId: businessDetails?.id,
          invoiceCount: invoiceCount,
        },
        null
      );
      setSavedModal({
        visible: true,
        header: "Could not save invoice",
        body: "Refresh the page and try again",
        state: "fail",
      });
      return;
    }

    if (
      !invoiceData.invoice_items ||
      invoiceData.invoice_items.length < 1
    ) {
      setSavedModal({
        visible: true,
        header: "Could not save invoice",
        body: "Add some items first!",
        state: "fail",
      });
      return;
    }

    let invoiceID: number | null = null;
    try {
      if (!invoiceData.id)
        invoiceID = await insertInvoice(
          invoiceData.date,
          invoiceData.invoice_items,
          projectId,
          invoiceData.total_amount,
          invoiceData.invoice_number,
          businessDetails.id,
          invoiceData.due_date,
          invoiceData.description || null,
          invoiceData.total_paid || null,
          invoiceData.outstanding_balance || null,
          invoiceData.message || null,
          invoiceData.location || null,
          invoiceData.show_gst,
          invoiceData.isInvoice,
          invoiceData.contract_id || null
        );
      else
        invoiceID = await updateInvoice(
          invoiceData.id,
          invoiceData.date,
          invoiceData.invoice_items,
          projectId,
          invoiceData.total_amount,
          invoiceData.due_date,
          invoiceData.description || null,
          invoiceData.total_paid || null,
          invoiceData.outstanding_balance || null,
          invoiceData.show_gst,
          invoiceData.message || null,
          invoiceData.location || null,
          invoiceData?.isPaid,
          invoiceData.contract_id || null
        );

      const params = new URLSearchParams();
      if (!invoiceID)
        throw {
          code: 0,
          message:
            "Something strange has happened when trying to save the invoice.",
        };
      params.set("IID", parseString(invoiceID));
      if (!invoiceData.id)
        setInvoiceData({
          ...invoiceData,
          id: invoiceID || undefined,
        });

      setSearchParams(params);
      setSaved(true);
      showSuccess == true &&
        setSavedModal({
          visible: true,
          header: "Invoice saved",
        });
    } catch (error) {
      setSavedModal({
        visible: true,
        header: "Could not save invoice",
        body: "Refresh the page and try again",
        state: "fail",
      });
      setLoading(false);
    }
    return;
  }

  /*************************************
   * Turn an invoice into a quote or vice versa and
   * navigate to the newly created item
   */
  async function transformAndDuplicate() {
    if (!businessDetails) return;

    await saveInvoice(false);

    // Stop user from creating new invoice if limit is reached
    if (profile.role == "free") {
      try {
        if (!projectId) return;

        const invoices = await fetchInvoicesForProject(
          parseInt(projectId)
        );

        if (
          invoices.filter(
            (inv) => inv.isInvoice != invoiceData.isInvoice
          ).length >= LIMITS.invoices
        ) {
          setLimitReachedModal({
            isActive: true,
            body: `You can only create ${LIMITS.invoices} ${
              !invoiceData.isInvoice == true ? "invoice" : "quote"
            } per project on the free plan.`,
          });
          return;
        }
      } catch (error) {
        setLimitReachedModal({
          isActive: true,
          body: `You can only create ${LIMITS.invoices} ${
            !invoiceData.isInvoice == true ? "invoice" : "quote"
          } per project on the free plan.`,
        });
        return;
      }
    }

    // Insert into DB as quote or invoice
    try {
      let newIID = await insertInvoice(
        invoiceData.date,
        invoiceData.invoice_items,
        projectId,
        invoiceData.total_amount,
        buildInvoiceNumber(
          businessDetails.invoice_prefix,
          businessDetails.invoice_count + 1,
          businessDetails.invoice_reset_monthly
        ),
        (businessDetails as FFBusiness).id,
        invoiceData.due_date,
        invoiceData.description || null,
        invoiceData.total_paid || null,
        invoiceData.outstanding_balance || null,
        invoiceData.message || null,
        invoiceData.location || null,
        invoiceData.show_gst,
        !invoiceData.isInvoice, // invert the type
        invoiceData.contract_id || null
      );

      // Navigate to new page
      if (newIID) {
        reRouteTo(`/projects/${projectId}/invoice?IID=${newIID}`);
      }
    } catch (error) {
      setSavedModal({
        visible: true,
        header: `Error duplicating this item ${
          invoiceData.isInvoice ? "invoice" : "quote"
        }`,
        body: "Refresh the page and try again",
        state: "fail",
      });
    }
  }

  /**************************
   * Delete this invoice
   */
  async function removeInvoice() {
    setLoadingDelete(true);
    if (!invoiceData.id) return;
    try {
      await deleteInvoice(invoiceData.id);
    } catch (error) {
      setSavedModal({
        visible: true,
        header: "Could not delete invoice",
        body: "Refresh the page and try again",
        state: "fail",
      });
      setLoadingDelete(false);
      return;
    }

    setLoadingDelete(false);
    navigateTo(`/projects/${projectId}/edit`, true);
  }

  /********************************************
   * Update the default invoice settings
   * @param att The attribute to update
   * @param val The value to set the attribute to
   */
  async function handleUpdateBusinessAttribute(
    att: InvoiceDefaultAttribute,
    val: any
  ) {
    setSaved(false);
    setInvoiceStyleLoading(true);

    try {
      await updateBusinessAttribute(
        (businessDetails as FFBusiness)?.id,
        att,
        val
      );

      // Update the state var if successful
      if (att == "default_invoice") setInvoiceStyleId(val);
      else if (att == "invoice_color") setInvoiceColor(val);
      else if (att == "invoice_show_client_details")
        setShowClientDetails(val);
      else if (att == "invoice_show_gst") setShowGst(val);
      else if (att == "invoice_show_due") setShowDueDate(val);
      else if (att == "invoice_show_description")
        setShowDescription(val);
      else if (att == "invoice_show_location") setShowLocation(val);
      else if (att == "invoice_show_total_paid")
        setShowTotalPaid(val);
      else if (att == "invoice_show_outstanding")
        setShowOutstanding(val);

      setSavedModal({
        visible: true,
        header: "Invoice settings updated!",
      });
    } catch (error) {
      setSavedModal({
        visible: true,
        header: "Could not update style",
        body: "Refresh the page and try again",
        state: "fail",
      });
    }

    setInvoiceStyleLoading(false);
    return;
  }

  /********************************************
   * Update a specific attribute of an invoice
   * @param attr The attribute to update
   * @param val The value to update it to
   */
  async function handleUpdateInvoiceAttribute(
    attr: InvoiceAttribute,
    val: any,
    updateDB = false
  ) {
    setSaved(false);
    if (!invoiceData) return;

    /*@ts-ignore*/ //Update local var
    invoiceData[attr] = val;

    // Update the appropriate attribute
    if (attr == "show_gst") {
      setInvoiceData({
        ...invoiceData,
        show_gst: val,
        total_amount: calculateInclusiveTotal(
          invoiceData.invoice_items,
          val
        ),
      });
    } else if (attr == "contract_id") {
      setInvoiceData({ ...invoiceData, contract_id: val });
      setSelectedContract(contracts?.find((c) => c.id == val));
    } else setInvoiceData({ ...invoiceData, [attr]: val });
    if (updateDB) await saveInvoice(false);
    if (attr == "isPaid" && invoiceData.isPaid == true)
      setPaidPopupActive(true);
  }

  async function handleUpdateProjectAttribute(
    attr: ProjectAttribute,
    value: any
  ) {
    try {
      if (!projectId) throw "Could not find your project";
      if (!saved) await saveInvoice();
      await updateProjectAttribute(parseInt(projectId), attr, value);
      await getInvoice();
    } catch (error) {}
  }

  function navigateTo(route: string | undefined, validated: boolean) {
    if (!validated && !saved && route) {
      setBackPopup({ active: true, route: route });
      return;
    }
    if (route) reRouteTo(route);
  }

  return (
    <div>
      {loading ? (
        <div className="loadingContainer">
          <spinners.ClimbingBoxLoader color="var(--primaryColor)" />{" "}
        </div>
      ) : (
        <div className="mediumFade">
          <DeletePopup
            active={deletePopupActive}
            onCancel={() => setDeletePopupActive(false)}
            onDelete={removeInvoice}
            type={invoiceData.isInvoice ? "invoice" : "quote"}
          />

          <LimitReachedPopup
            isActive={LimitReachedModal.isActive}
            onClose={() =>
              setLimitReachedModal({ isActive: false, body: "" })
            }
            message={LimitReachedModal.body}
          />

          {!invoiceData?.isPaid &&
            invoiceData?.due_date &&
            new Date() > new Date(invoiceData.due_date as Date) &&
            invoiceData.isInvoice && (
              <div>
                <FixedRow
                  menuVisible={menuVisible}
                  danger
                  minHeight={0}
                >
                  <div className="centerRow middle hundred m2">
                    <p className="ph2 mh2 textCenter">
                      This invoice is past the due date and has not
                      been paid
                    </p>
                    <button
                      onClick={(e) =>
                        copyToClipboard(
                          e,
                          (
                            (invoiceData.projects as FFProject)
                              ?.clients as FFClient
                          )?.email,
                          "email"
                        )
                      }
                      className="m0 p1"
                    >
                      Email Client
                    </button>
                  </div>
                </FixedRow>
              </div>
            )}

          {(invoiceData.projects as FFInvoiceProject).is_complete ==
            true && (
            <FixedRow menuVisible={menuVisible} danger minHeight={0}>
              <div className="centerRow middle hundred m2">
                <p
                  className="ph2 mh2 textCenter"
                  style={{ color: "var(--background)" }}
                >
                  This invoice can not be modified because the project
                  is complete
                </p>
                <button
                  onClick={(e) =>
                    handleUpdateProjectAttribute("is_complete", false)
                  }
                  className="m0 p1"
                >
                  <p className="m0">Edit project</p>
                </button>
              </div>
            </FixedRow>
          )}

          <div className="centerContainer">
            <InvoiceActionBar
              invoice={invoiceData as FFInvoice}
              menuVisible={menuVisible}
              saved={saved}
              invoiceStyleId={invoiceStyleId}
              businessDetails={businessDetails}
              gst={{
                show: invoiceData.show_gst,
                value: invoiceData.total_amount / 11,
              }}
              showClientDetails={showClientDetails}
              invoiceColor={invoiceColor}
              searchParams={searchParams}
              setIsInvoice={(val) =>
                handleUpdateInvoiceAttribute("isInvoice", val)
              }
              saveInvoice={saveInvoice}
              tryGoBack={() =>
                navigateTo(`/projects/${projectId}/edit`, false)
              }
              activateInvoiceOptions={setInvoiceStylePickerActive}
              inShrink={inShrink}
              selectedContract={selectedContract}
            />
            <div className="leftRow dynamicRow m0">
              <EditInvoiceMenu
                disabled={
                  (invoiceData.projects as FFInvoiceProject)
                    .is_complete
                }
                invoice={invoiceData}
                invoiceNumber={invoiceData.invoice_number}
                showGst={invoiceData.show_gst}
                inShrink={inShrink}
                contracts={contracts}
                business={businessDetails}
                selectedContract={selectedContract}
                updateAttribute={(attr, val) =>
                  handleUpdateInvoiceAttribute(attr, val)
                }
                setInvoiceItems={updateInvoiceItems}
                navigateTo={navigateTo}
              />

              <InvoiceStylePicker
                disabled={
                  (invoiceData.projects as FFInvoiceProject)
                    .is_complete
                }
                invoiceId={invoiceData.id}
                styles={STYLES}
                businessDetails={businessDetails}
                userId={profile.id}
                active={invoiceStylePickerActive}
                setActive={setInvoiceStylePickerActive}
                updateAttribute={handleUpdateBusinessAttribute}
                styleId={invoiceStyleId}
                loading={invoiceStyleLoading}
                color={invoiceColor}
                showClientDetails={showClientDetails}
                showGst={showGst}
                showDue={showDueDate}
                showDescription={showDescription}
                showLocation={showLocation}
                showTotalPaid={showTotalPaid}
                showOutstanding={showOutstanding}
                onDelete={setDeletePopupActive}
                onTransform={transformAndDuplicate}
                isPaid={invoiceData?.isPaid}
                isInvoice={invoiceData.isInvoice}
                onPaid={() =>
                  handleUpdateInvoiceAttribute(
                    "isPaid",
                    !invoiceData.isPaid,
                    true
                  )
                }
              />

              <BasicMenu
                icon={{
                  name: "checkmark-circle",
                  color: "var(--safeColor)",
                  size: 100,
                }}
                isActive={paidPopupActive}
                setIsActive={setPaidPopupActive}
                width={400}
              >
                <div className="m2">
                  <h2>Invoice is paid!</h2>
                  <div className="centerRow">
                    <button
                      className="hundred"
                      onClick={() =>
                        handleUpdateProjectAttribute(
                          "is_complete",
                          true
                        )
                      }
                    >
                      <div className="centerRow m0 middle">
                        <IonIcon
                          name="checkmark-done-outline"
                          style={{ width: 20, height: 20 }}
                          className="mr2"
                        />
                        <h3 className="p0 m0">Complete project</h3>
                      </div>
                    </button>
                  </div>
                </div>
              </BasicMenu>

              <BasicMenu
                isActive={backPopup.active}
                setIsActive={() =>
                  setBackPopup({ active: false, route: undefined })
                }
                icon={{
                  name: "close-circle",
                  color: "var(--dangerColor)",
                  size: 100,
                }}
                width={400}
              >
                <div className="m2">
                  <h2>This isn't saved.</h2>
                  <h3 className="textCenter">
                    Are you sure you want to navigate away from this
                    page?
                  </h3>
                  <div className="centerRow">
                    <button
                      className="accentButton centerRow hundred middle"
                      onClick={() => {}}
                    >
                      <IonIcon
                        name="arrow-back"
                        className="basicIcon mr2"
                      />
                      Cancel
                    </button>
                    <button
                      className="hundred centerRow middle"
                      onClick={() =>
                        navigateTo(backPopup.route || "/home", true)
                      }
                    >
                      <IonIcon
                        name="checkmark-circle"
                        className="basicIcon mr2"
                      />
                      Yes
                    </button>
                  </div>
                </div>
              </BasicMenu>

              <SavedModal
                visible={savedModal.visible}
                setVisible={() =>
                  setSavedModal({
                    visible: false,
                    body: undefined,
                    header: undefined,
                  })
                }
                header={savedModal.header}
                body={savedModal.body}
                state={savedModal.state}
                timeout={6}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
