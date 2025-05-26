import React, {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Editor from "../QuillEditor/QuillEditor.js";
import Quill, { Op } from "quill";
import SavedModal from "../SavedModal.jsx";
import {
  FFBusiness,
  FFContract,
  MoveableOptions,
  SavedModalType,
} from "../../assets/Types.tsx";
import {
  handleSaveContract,
  insertTextAtCursor,
} from "./ContractBL.tsx";
import IonIcon from "@reacticons/ionicons";
import { DateTime } from "luxon";
import spinners from "react-spinners";

import "./Quill.css";
import ContractInputs from "./ContractInputs.tsx";


const Delta = Quill.import("delta");

type ContractEditorProps = {
  contractObject: FFContract | undefined;
  businessDetails: FFBusiness | undefined;
  inShrink: boolean;
  edited: boolean;
  setEdited: (edited: boolean) => void;
  onSave: (contract?: FFContract) => void;
};

/**
 * A page which allows users to edit a contract
 */
export default function ContractEditor({
  contractObject,
  businessDetails,
  edited,
  setEdited,
  onSave,
}: ContractEditorProps) {
  const [loading, setLoading] = useState(false);
  const [savedModal, setSavedModal] = useState<SavedModalType>({
    visible: false,
    header: undefined,
    body: undefined,
    state: "success",
  });

  const [label, setLabel] = useState<string | undefined | null>();
  const [dynamicPropertyMenu, setDynamicPropertyMenu] =
    useState<MoveableOptions>({ x: 0, y: 0, active: false });
  const quillRef = useRef<Quill>(); // Use a ref to access the quill instance directly

  useEffect(() => {
    setLabel(contractObject?.label);
    quillRef.current?.setContents(new Delta(contractObject?.ops));

    setEdited(false);
  }, [contractObject]);

  /*******************************************
   * Save the current document to the database
   */
  async function saveContract(): Promise<boolean> {
    if (!quillRef?.current) return false;
    let deltaOps = quillRef.current.getContents().ops;

    if (!label) {
      setSavedModal({
        visible: true,
        header: "No name given",
        body: "Give the contract a name!",
        state: "fail",
      });
      return false;
    }

    try {
      let res = await handleSaveContract(
        deltaOps,
        label,
        contractObject?.id
      );
      onSave(res||undefined);
    } catch (error) {
      console.error("An issue occured saving the contract");
      return false;
    }

    setSavedModal({
      visible: true,
      header: "Contract saved successfully",
      body: undefined,
      state: "success",
    });

    setEdited(false);
    return true;
  }

  /*************************************
   * Update the text of the contract title
   */
  function changeLabelText(text: string) {
    if (edited == false) setEdited(true);
    setLabel(text);
  }

  /**************************************
   * Activate the menu which allows users 
   * to add dynamic properties to their quotes
   * @param e The button event
   */
  function activateDynamicPropertyMenu(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    const button = document
      .getElementById("dyanmic-property-button")
      ?.getBoundingClientRect();

    if (!button) return;

    setDynamicPropertyMenu({
      x: button.left - 10,
      y: button.top + 50,
      active: true,
    });
  }

  return (
    <div>
      <ContractInputs
        x={dynamicPropertyMenu.x}
        y={dynamicPropertyMenu.y}
        active={dynamicPropertyMenu.active}
        onClose={() =>
          setDynamicPropertyMenu({ x: 0, y: 0, active: false })
        }
        onWordClick={(word) =>
          insertTextAtCursor(
            quillRef as MutableRefObject<Quill>,
            word
          )
        }
      />
      <div className="row">
        {loading ? (
          <div className="loadingContainer">
            <spinners.ClimbingBoxLoader color="var(--primaryColor)" />
          </div>
        ) : (
          <div
            className="boxed boxedOutline"
            style={{ height: "100%", minHeight: "100vh" }}
          >
            <div className="row m0">
              <div className="leftRow">
                <button
                  className="accentButton centerRow m0 middle mediumFade mr2"
                  disabled={!edited}
                  onClick={saveContract}
                >
                  <IonIcon
                    name="save-sharp"
                    className="basicIcon smallIcon mr2"
                  />
                  <p className="m0">{edited ? "Save" : "Saved"}</p>
                </button>
                <button
                  id="dyanmic-property-button"
                  className="centerRow m0"
                  onClick={(e) => activateDynamicPropertyMenu(e)}
                >
                  <IonIcon
                    name="add-circle"
                    className="basicIcon smallIcon mr1"
                  />
                  <p className="m0">Dynamic property</p>
                </button>
              </div>
              <a
                className="centerRow boxed boxedOutline p0 pl2 pr2"
                href="help/contracts"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IonIcon
                  name="help-circle"
                  className="basicIcon smallIcon mr1"
                />
                <p className="m0">Help</p>
              </a>
            </div>
            <form
              action="submit"
              onSubmit={(e) => {
                e.preventDefault();
                saveContract();
              }}
            >
              <div className="row middle">
                <IonIcon
                  name="document-text-sharp"
                  className="basicIcon ml2 hiddenOnShrink"
                  style={{ minWidth: 50, minHeight: 50 }}
                />
                <input
                  className="headerInput m2 noBorder"
                  placeholder="unnamed contract"
                  value={label || ""}
                  onChange={(e) => changeLabelText(e.target.value)}
                  style={{ textTransform: "inherit" }}
                />
              </div>
            </form>
            <SavedModal
              visible={savedModal.visible}
              setVisible={() =>
                setSavedModal({
                  visible: false,
                  header: undefined,
                  body: undefined,
                  state: "success",
                })
              }
              header={savedModal.header}
              body={savedModal.body}
              state={savedModal.state}
            />

            <div className="hundred row">
              <div
                className="m2 hundred"
                style={{
                  backgroundColor: "whitesmoke",
                  maxWidth: 900,
                  minWidth: 900,
                  borderRadius: 5,
                  maxHeight: 800,
                  overflow: "scroll",
                }}
              >
                <div
                  id="header"
                  className="middle boxed m0"
                  style={{
                    height: 100,
                    backgroundColor: `${businessDetails?.invoice_color}`,
                  }}
                >
                  <div className="row hundred">
                    <h1 style={{ color: "#121212" }}>Contract</h1>
                  </div>
                  <img
                    src={businessDetails?.logo}
                    style={{ height: "100%" }}
                  />
                </div>
                <Editor
                  ref={quillRef as MutableRefObject<Quill>}
                  defaultValue={"Enter your contract details..."}
                  onTextChange={() => setEdited(true)}
                  toolbar={[
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ]}
                />
                <div
                  id="footer"
                  className="boxed m0 p1 row"
                  style={{
                    backgroundColor: `${
                      businessDetails?.invoice_color || "white"
                    }`,
                  }}
                >
                  <p
                    style={{ color: "#121212" }}
                    className="boldLabel"
                  >
                    {businessDetails?.name || "QUOTE"}
                  </p>
                  <p style={{ color: "#121212" }}>
                    {DateTime.now().toFormat("MMM dd yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
