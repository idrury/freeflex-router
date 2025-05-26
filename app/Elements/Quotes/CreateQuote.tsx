import { useEffect, useState } from "react";
import QuoteMenu from "./QuoteMenu";
import {
  fetchBusiness,
  fetchContracts,
  fetchProject,
  insertError,
  updateBusinessAttribute
} from "../../Functions/DBAccess";
import { useParams, useSearchParams } from "react-router-dom";
import { parseInvoiceNumber, reRouteTo } from "../../Functions/commonFunctions";
import BasicMenu from "../BasicMenu";
import QuoteFactory from "./QuoteFactory";
import spinners from "react-spinners";
import IonIcon from "@reacticons/ionicons";
import MoveableMenu from "../MoveableMenu";
import InvoiceStylePicker from "../Invoices/InvoiceStylePicker";
import DeletePopup from "../DeletePopup";
import SavedModal from "../SavedModal";
import { FFBusiness, FFErrorSelector, FFLineItem, FFSavedSelector, FFContract } from "../../assets/Types";
import React from "react";
import FixedRow from "../FixedRow";

const STYLES = [
  {
    id: 0,
    name: "Simple",
    src: "https://img.playbook.com/FJYyArVNa-yxtHOkiMYslNUN3hEtbEIlmhMaeTnqXpA/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzQ0ZjExMjQ4/LTQzNWEtNDdlNi04/MzhjLWU0NjRmYTNm/MDBhZQ",
  },
];

export default function CreateQuote({ menuVisible, inShrink }) {
  let { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [project, setProject] = useState<any | null>(null);
  const [quoteId, setQuoteId] = useState<number | null>(null);
  const [businessDetails, setBusinessDetails] = useState<FFBusiness | undefined>(undefined);

  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState<string | null>(null);

  const [totalCost, setTotalCost] = useState(0);

  const [quoteItems, setQuoteItems] = useState<FFLineItem[]>([]);
  const [defaultQuote, setDefaultQuote] = useState(0);
  const [quoteColor, setQuoteColor] = useState("#eeeeee");
  const [quoteStylePickerActive, setQuoteStylePickerActive] = useState(false);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
  const [quoteOptionsActive, setQuoteOptionsActive] = useState(false);
  const [quoteStylePickerLoading, setQuoteStylePickerLoading] = useState(false);

  const [errorText, setErrorText] = useState<FFErrorSelector>({ field: null, value: null });
  const [errorActive, setErrorActive] = useState(false);
  const [backPopup, setBackPopup] = useState<{active: boolean, route: string | undefined}>({active: false, route: undefined});

  const [deletePopupActive, setDeletePopupActive] = useState(false);
  const [loadingDeleteQuote, setLoadingDeleteQuote] = useState(false);

  const [savedModalData, setSavedModalData] = useState<FFSavedSelector>({ active: false, header: null, body: null });
  const [menuLoading, setMenuLoading] = useState(true);
  const [mainLoading, setMainLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saved, setSaved] = useState(true);

  const [contract, setContract] = useState<FFContract | undefined>(undefined);
  const [contracts, setContracts] = useState<FFContract[] | undefined>(undefined);

  useEffect(() => {
    getQuote();
    getBusinessDetails();
    getContracts();

    if (projectId) getProject();
  }, []);

  async function getQuote() {
    if (searchParams?.get("QID")) {
      loadQuote(searchParams?.get("QID"));
    } else {
      setMenuLoading(false);
      setMainLoading(false);
    }
  }

  async function getBusinessDetails() {
    try {
      let bd = await fetchBusiness();

      if (!bd || !bd.details_complete) {
        alert("You need to add all of your business information before creating a quote");
        reRouteTo("/account");
        return;
      }

      setBusinessDetails(bd);
      setDefaultQuote(bd.quote_id);
      setQuoteColor(bd.quote_color);
    } catch (error) {
      reRouteTo("/Error");
    }
  }

  async function getProject() {
    try {
      setProject(await fetchProject(projectId));
    } catch (error) {
      reRouteTo("/Error");
    }
  }

  async function loadQuote(id) {
    let quote: FFQuote | null = null;

    try {
      quote = await fetchQuote(id);
    } catch (error) {
      reRouteTo("/Error");
      return;
    }

    if (!quote) {
      return;
    }
    setQuoteId(id);
    setDate(new Date(quote.date));
    setDescription(quote.description);
    setContract(quote.contracts)

    let tempItems: FFLineItem[] = new Array();

    if (quote.items) {
      tempItems = [...quote.items];

      for (let i = 0; i < tempItems.length; i++) {
        tempItems[i][3] = parseInvoiceNumber(tempItems[i][3]);
      }
    }

    setQuoteItems(tempItems);

    setMenuLoading(false);
    setMainLoading(false);
  }

  async function getContracts() {
    try {
      setContracts(await fetchContracts());
    } catch (error) {
      insertError(error, "createQuote:getContracts", null);
    }
  }

  async function saveQuote() {
    setSaveLoading(true);

    if (!description) {
      setErrorText({ field: "description", value: "Please enter a valid description" });
      setSaveLoading(false);
      return;
    }

    let quoteID: number | null = null;

    try {
      if (quoteId) {
        quoteID = await updateQuote(quoteId, date, description, processTotal(), projectId, quoteItems, contract?.id || null);
      } else {
        quoteID = await insertQuote(date, description, processTotal(), projectId, quoteItems, contract?.id || null);
      }

      const params = new URLSearchParams();
      if (quoteID) {
        params.set("QID", quoteID.toString());
        setSearchParams(params);
        setQuoteId(quoteID);
        setErrorText({ field: null, value: null });
        setSaved(true);
      }
    } catch (error) {
      setErrorText({ field: null, value: null });
      alert("Sorry! An error has occured saving your quote. Try again in a few moments.");
      return;
    }

    setSaveLoading(false);
  }

  function updateDescription(des) {
    setSaved(false);
    setDescription(des);
  }

  function updateDate(d) {
    setSaved(false);
    setDate(d);
  }

  function updateQuoteItems(items: FFLineItem[]) {
    let tempQuoteItems = items;
    let total = 0;

    // update item totals
    for (let i = 0; i < items.length; i++) {
      const qty = parseInvoiceNumber(items[i][1]) || 0;
      const unit = parseInvoiceNumber(items[i][2]) || 0;
      tempQuoteItems[i][3] = qty * unit || 0;
      total += tempQuoteItems[i][3] as number;
    }

    setQuoteItems(items);
    setTotalCost(total);
    setSaved(false);
  }

  function processTotal() {
    if (!quoteItems) {
      return 0;
    }

    let total = 0;

    for (let i = 0; i < quoteItems.length; i++) {
      total += parseInvoiceNumber(quoteItems[i][3]) || 0;
    }

    return total;
  }

  function navigateTo(route: string | undefined, validated:boolean) {
    if (!validated && !saved) {
      setBackPopup({active: true, route: route});
      return;
    }
    if(route) reRouteTo(route);
  }

  function activateQuoteOptions(e) {
    e.stopPropagation();
    setBoxPosition({ x: e.clientX, y: e.clientY });
    setQuoteOptionsActive(true);
  }

  // Update the users default invoice style
  async function updateQuoteDefault(att, val) {
    setSaved(false);
    setQuoteStylePickerLoading(true);

    try {
      // Update the state var if successful
      if (att == "default_invoice") {
        await updateBusinessAttribute(businessDetails?.id, "quote_id", val);
        setDefaultQuote(val);
      } else if (att == "invoice_color") {
        await updateBusinessAttribute(businessDetails?.id, "quote_color", val);
        setQuoteColor(val);
      }
    } catch (error) {
      alert("Sorry! There was an issue with updating your invoice style. Refresh the page and try again.");
      setQuoteStylePickerLoading(false);
      return;
    }

    setSavedModalData({ active: true, header: "Quote option updated!", body: null });
    setQuoteStylePickerLoading(false);
    return;
  }

  async function handleDeleteQuote() {
    setLoadingDeleteQuote(true);
    try {
      await deleteQuote(quoteId);
      reRouteTo(`/projects/${projectId}/edit`);
    } catch (error) {
      alert("Sorry! There's been an error deleting this quote. Refresh the page and try again.");
    }

    setLoadingDeleteQuote(false);
  }

  function updateSelectedContract(id: number) {
    setSaved(false);
    let contract = contracts?.find((c) => c.id == id);
    setContract(contract);
  }

  return (
    <div className="mediumFade">
      <div
        className="fixedRow row p0"
        style={{
          width: `${menuVisible ? (inShrink ? "80%" : "72%") : inShrink ? "80%" : "92%"}`,
          margin: "10px 0",
          padding: `0 0 0 ${menuVisible && !inShrink ? "0px" : "60px"}`,
        }}
      >

      </div>

      <FixedRow menuVisible={menuVisible}>
      <div className="leftRow middle">
          <button className="centerRow middle p0" style={{ margin: "0 10px" }} onClick={() => navigateTo(`/projects/${projectId}/edit`,false)}>
            <IonIcon name="arrow-back" style={{ height: 22, width: 22, margin: 5 }} />
            <p className="hiddenOnShrink p0">Back</p>
          </button>
          {saved ? (
            <QuoteFactory
              formatID={0}
              businessDetails={businessDetails}
              date={date}
              project={project?.name}
              client={project?.clients?.name}
              description={description}
              total={processTotal()}
              items={quoteItems}
              color={quoteColor}
              label={"Download quote"}
              contractDelta={contract?.ops}
            />
          ) : (
            <button disabled={saved} className="accentButton centerRow p0 m0 middle" style={{ margin: "0 10px" }} onClick={saveQuote}>
              <IonIcon name="save-sharp" style={{ height: 22, width: 22, margin: 5 }} />
              <p className="hiddenOnShrink">Save</p>
            </button>
          )}
        </div>
        <div className="row middle">
          <button className="centerRow middle p0" style={{ margin: "0 10px" }} onClick={activateQuoteOptions}>
            <IonIcon name="ellipsis-horizontal" style={{ height: 22, width: 22, margin: 5 }} />
            <p className="hiddenOnShrink">Options</p>
          </button>
        </div>
      </FixedRow>

      <BasicMenu isActive={backPopup.active} setIsActive={() => setBackPopup({active: false, route: undefined})} width={400}>
        <div className="m2">
          <h2>This isn't saved.</h2>
          <h3 className="textCenter">Are you sure you want to navigate to another page?</h3>
          <div className="centerRow">
            <button className="accentButton hundred" onClick={() => setErrorActive(false)}>
              Cancel
            </button>
            <button className="hundred" onClick={() => navigateTo(backPopup.route, true)}>
              Yes
            </button>
          </div>
        </div>
      </BasicMenu>

      <MoveableMenu isActive={quoteOptionsActive} setIsActive={setQuoteOptionsActive} x={boxPosition.x} y={boxPosition.y} width={200} height={160}>
        <div className="m2">
          <h3 className="boldLabel center">Options</h3>
          <div className="pr3">
            <button
              className="hundred middle center"
              onClick={() => {
                setQuoteOptionsActive(false);
                setQuoteStylePickerActive(true);
              }}
              style={{ padding: "0 10px" }}
            >
              <IonIcon name="sparkles-sharp" style={{ width: 20, height: 20, margin: 5 }} />
              <p className="hiddenOnShrink">Style</p>
            </button>
            {quoteId && (
              <div>
                <button
                  className="hundred centerRow p0 m2 dangerButton"
                  onClick={() => {
                    setQuoteOptionsActive(false);
                    setDeletePopupActive(true);
                  }}
                >
                  <IonIcon name="trash" style={{ width: 20, height: 20, margin: 5 }} />
                  <p className="hiddenOnShrink">Delete</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </MoveableMenu>

      <InvoiceStylePicker
        styles={STYLES}
        type="quote"
        title="Quote Style"
        updateAttribute={updateQuoteDefault}
        active={quoteStylePickerActive}
        setActive={setQuoteStylePickerActive}
        styleId={defaultQuote}
        loading={quoteStylePickerLoading}
        color={quoteColor}
      />

      <DeletePopup
        active={deletePopupActive}
        onDelete={handleDeleteQuote}
        onCancel={() => setDeletePopupActive(false)}
        loading={loadingDeleteQuote}
        type="quote"
      />

      <SavedModal
        visible={savedModalData.active}
        setVisible={() => setSavedModalData({ active: false, header: null, body: null })}
        header={savedModalData.header}
        body={savedModalData.body}
      />

      <div className="centerContainer">
        {mainLoading ? (
          <div className="loadingContainer">
            {" "}
            <spinners.ClimbingBoxLoader color="var(--primaryColor)" />{" "}
          </div>
        ) : (
          <div className="mediumFade">
            <div className="leftRow dynamicRow" style={{ alignItems: "start", margin: "50px 0" }}>
              <QuoteMenu
                date={date}
                setDate={updateDate}
                description={description}
                setDescription={updateDescription}
                contract={contract}
                setContract={updateSelectedContract}
                contracts={contracts}
                save={saveQuote}
                quoteItems={quoteItems}
                setQuoteItems={updateQuoteItems}
                businessDetails={businessDetails}
                errorText={errorText}
                navigateTo={navigateTo}
                loading={menuLoading}
                saveLoading={saveLoading}

                saved={saved}
              />

              <div className="fifty dynamicSize boxed boxedOutline" style={{ margin: "50px 20px" }}>
                <div className="boxedDark">
                  <h3>
                    Project '{project?.name}' for {project?.clients?.name}
                  </h3>
                </div>

                <br />

                <div className="boxedDark">
                  {!description ? (
                    <p style={{ fontStyle: "italic" }}>no description</p>
                  ) : (
                    <div>
                      {description?.split("\n").map((txt, i) => (
                        <p key={i}>{txt || ""}</p>
                      ))}
                    </div>
                  )}
                </div>

                <br />
                <br />

                <div className="boxedDark">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <label>item</label>
                        </th>
                        <th>
                          <label>qty</label>
                        </th>
                        <th>
                          <label>unit cost</label>
                        </th>
                        <th>
                          <label>Total</label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ width: "50%" }}>
                            <p>{item[0] || "no description"}</p>
                          </td>
                          <td style={{ width: "15%" }}>
                            <p>{item[1] || 0}</p>
                          </td>
                          <td style={{ width: "25%" }}>
                            <p>${item[2] || 0}</p>
                          </td>
                          <td style={{ width: "20%" }}>
                            <p>${item[3] || 0}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <br />
                <div className="boxedAccent">
                  <h2 className="leftRow">Total</h2>
                  <h1>${totalCost}</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
