import React, { useEffect, useState } from "react";
import {
  deleteContract,
  fetchBusiness,
  fetchContracts,
  insertError,
} from "../../Functions/DBAccess";
import {
  FFBusiness,
  SavedModalType,
  FFRole,
  LimitReachedType,
  FFContract,
} from "../../assets/Types";
import { DateTime } from "luxon";
import IonIcon from "@reacticons/ionicons";
import DeletePopup from "../DeletePopup";
import SavedModal from "../SavedModal";
import spinners from "react-spinners";
import ContractEditor from "./ContractEditor";
import { ActiveContractType } from "./Data";
import PreviewPanel from "./PreviewPanel";
import {
  getContractById,
  handleSaveContract,
  parseOps,
} from "./ContractBL";
import ContractOptionsMenu from "./ContractOptionsMenu";
import PageHeader from "../PageHeader";
import LimitReachedPopup from "../LimitReachedPopup";
import { LIMITS } from "../../assets/data";
import BasicMenu from "../BasicMenu";
import { generatePlaceholderProject } from "../../Functions/commonFunctions";

/*******************************************
 * A page where users can select a contract
 * to edit from their list of available contracts
 * or create new ones
 */
export default function ContractPicker({
  inShrink,
  menuVisible,
  role,
}: {
  inShrink: boolean;
  menuVisible: boolean;
  role: FFRole;
}) {
  const timeout = 5;
  const timerExpiry = new Date();
  timerExpiry.setSeconds(new Date().getSeconds() + timeout);

  const [contracts, setContracts] = useState<
    FFContract[] | undefined
  >(undefined);
  const [optionsPopup, setOptionsPopup] = useState({
    active: false,
    x: 0,
    y: 0,
  });
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [savedPopup, setSavedPopup] = useState<SavedModalType>({
    visible: false,
    body: undefined,
    header: undefined,
    state: "success",
  });
  const [LimitReachedModal, setLimitReachedModal] =
    useState<LimitReachedType>({ isActive: false, body: "" });
  const [loading, setLoading] = useState(true);
  const [activeContract, setActiveContract] =
    useState<ActiveContractType>({
      active: false,
      contract: undefined,
    });
  const [previewActive, setPreviewActive] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<
    FFBusiness | undefined
  >(undefined);
  const [edited, setEdited] = useState(false);
  const [unsavedActive, setUnsavedactive] = useState(false);
  const [targetContractId, setTargetContractId] = useState<number>();

  useEffect(() => {
    getContracts();
    getBusinessDetails();
  }, []);

  useEffect(() => {}, [previewActive]);

  /**********************************************
   * Fetch the user's contracts from the database
   */
  async function getContracts() {
    try {
      let userContracts = await fetchContracts();
      setContracts(userContracts);
      if(activeContract.active)
        setActiveContract({active: true, contract: userContracts.find(c => c.id == activeContract.contract?.id)});
    } catch (error) {
      console.warn("Error getting user contracts");
    }
    setLoading(false);
  }

  /****************************************************
   * Fetch the user's business details from the database
   */
  async function getBusinessDetails() {
    try {
      setBusinessDetails(await fetchBusiness());
    } catch (error) {
      console.warn(
        "Could not find the users business details. Preview will not work as expected"
      );
    }
  }

  /****************************************************
   * Trigger contract deletion and update state afterwards
   */
  async function handleDeleteContract(id: number | undefined) {
    if (!id) {
      displaySavedPopup(
        "There was an issue deleting your contract",
        "Refresh the page and try again",
        "fail"
      );
      return;
    }
    try {
      await deleteContract(id);
    } catch (error) {
      console.warn(error?.code);
      if (error.code == 23503)
        displaySavedPopup(
          "This contract is still referenced in a quote",
          "You can't delete this until you remove it from all quotes",
          "fail"
        );
      else
        displaySavedPopup(
          "There was an issue deleting your contract",
          "Refresh the page and try again",
          "fail"
        );

      return;
    }
    displaySavedPopup(
      "Contract deleted!",
      "Your contract is permanently deleted."
    );
    await getContracts();
    setOptionsPopup({ active: false, x: 0, y: 0 });
    return;
  }

  /**********************************
   * Pop the saved status dialogue
   */
  function displaySavedPopup(
    header,
    body,
    state: "success" | "fail" = "success"
  ) {
    setSavedPopup({
      visible: true,
      body: body,
      header: header,
      state: state,
    });
  }

  /************************************
   * Show the contract editor page
   * @param id The contract id to edit
   */
  async function displayContractEditor(
    id: number | undefined,
    force = false
  ) {
    if (!contracts) return;

    if (
      !id &&
      role == "free" &&
      contracts.length >= LIMITS.contracts
    ) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only create ${LIMITS.contracts} contract on the free plan.`,
      });
      return;
    }

    if (edited && force == false) {
      setTargetContractId(id);
      setUnsavedactive(true);
      return;
    }

    setEdited(false);
    setActiveContract({
      active: true,
      contract: getContractById(id, contracts),
    });
  }

  /**********************************
   * Hide or show the pdf preview pane
   */
  function previewPdf(active: boolean) {
    setPreviewActive(active);
  }

  /*****************************************
   *  Trigger contract duplication of the
   * selected contract
   */
  async function duplicateContract() {
    try {
      let contract = await handleSaveContract(
        activeContract.contract?.ops,
        `Copy of ${activeContract.contract?.label}`
      );

      setOptionsPopup({ active: false, x: 0, y: 0 });

      if (contract) {
        setActiveContract({ active: true, contract: contract });
        displaySavedPopup("Contract duplicated!", null);
      }
      return;
    } catch (error) {
      insertError(error, "contractPicker.duplicateContract", {
        contract: activeContract.contract,
      });
    }

    displaySavedPopup(
      "Failed to duplicate contract",
      "Refresh the page and try again",
      "fail"
    );
  }

  /********************************************
   * Show the contract options menu
   * @param id The id of the contract to trigger options on
   */
  function activateMenuOptions(
    e: React.MouseEvent<HTMLButtonElement, React.MouseEvent>,
    id
  ) {
    e.stopPropagation();
    if (!contracts) return;
    setOptionsPopup({ active: true, x: e.clientX, y: e.clientY });
    setTargetContractId(id);
  }

  /**********************************************
   * Preview a contract with placeholder values
   * for dyanmic fields
   */
  function createPlaceholderOps() {

    if (!activeContract.contract || !businessDetails) return;

    const opsDeepCopy = structuredClone(activeContract.contract.ops)

    const ops = parseOps(
      opsDeepCopy,
      generatePlaceholderProject(),
      businessDetails
    );
    return ops;
  }

  /**********************************************
   * Perform actions after the contract is saved
   */
  async function afterContractSave(contract?: FFContract) {
    if (!contract) return;
  await getContracts();
    setActiveContract({
      active: true,
      contract: contract,
    })

  }
  return (
    <div>
      <LimitReachedPopup
        isActive={LimitReachedModal.isActive}
        onClose={() =>
          setLimitReachedModal({ isActive: false, body: "" })
        }
        message={LimitReachedModal.body}
      />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          <spinners.HashLoader
            className="loader mediumFade"
            color="var(--primaryColor)"
          />
        </div>
      ) : (
        <div className="mediumFade centerContainer">
          <ContractOptionsMenu
            options={optionsPopup}
            onDelete={() => setDeleteSelected(true)}
            onClose={() =>
              setOptionsPopup({ active: false, x: 0, y: 0 })
            }
            onPreview={() => previewPdf(true)}
            onDuplicate={duplicateContract}
          />
          <DeletePopup
            active={deleteSelected}
            onDelete={() =>
              handleDeleteContract(targetContractId)
            }
            onCancel={() => setDeleteSelected(false)}
            type="contract"
          />

          <SavedModal
            visible={savedPopup.visible}
            header={savedPopup.header}
            body={savedPopup.body}
            state={savedPopup.state}
            setVisible={() =>
              setSavedPopup({
                visible: false,
                body: undefined,
                header: undefined,
                state: "success",
              })
            }
          />

          <BasicMenu
            isActive={unsavedActive}
            setIsActive={setUnsavedactive}
            width={400}
            icon={{
              name: "close-circle",
              color: "var(--dangerColor)",
              size: 100,
            }}
          >
            <div className="m2">
              <h2>This isn't saved.</h2>
              <h3 className="textCenter">
                Are you sure you want to switch contracts?
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
                    displayContractEditor(targetContractId, true)
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

          {previewActive && (
            <PreviewPanel
              deltaOps={createPlaceholderOps()}
              businessDetails={businessDetails}
              setActive={() => previewPdf(false)}
              active={previewActive}
              title={activeContract.contract?.label}
            />
          )}

          <div className="row middle wrap">
            <PageHeader
              text="Contracts"
              icon="document-text-sharp"
              inShrink={inShrink}
              menuVisible={menuVisible}
            />
          </div>
          <div className="hundred m0 leftRow">
            <div>
              {!contracts || contracts.length <= 0 ? (
                <div className="middleContainer center middle w100">
                  <IonIcon
                    name="document-text-sharp"
                    style={{
                      height: 200,
                      width: 200,
                      color: "var(--smallAccent)",
                    }}
                  />
                  <p className="pb2 textCenter">
                    Looks like you haven't created any contracts yet!
                  </p>
                  <button
                    className="accentButton m0"
                    onClick={() => displayContractEditor(undefined)}
                  >
                    <p className="m0">
                      Get started with a new contract
                    </p>
                  </button>
                </div>
              ) : (
                <div className="boxed boxedOutline m0 m0 mt2" style={{minHeight: '90vh'}}>
                  <div className="pr3">
                    <button
                      className="highlight hundred"
                      onClick={() => displayContractEditor(undefined)}
                    >
                      + New Contract
                    </button>
                  </div>
                  {contracts?.map((c) => (
                    <div
                      className="projectRow ph2 boxedOutline"
                      key={c.id}
                      onClick={() => displayContractEditor(c.id)}
                      style={{ height: 100, width: 200 }}
                    >
                      <div className="hundred row middle">
                        <div className="leftRow m0 middle">
                          <IonIcon
                            name="document-text-sharp"
                            className="basicIcon"
                          />
                          <h3 className="m1">
                            {c.label || "unnamed contract"}
                          </h3>
                        </div>
                        <button
                          className="p0 m0"
                          onClick={(e) =>
                            activateMenuOptions(e, c.id)
                          }
                        >
                          <IonIcon
                            name="ellipsis-horizontal"
                            style={{
                              width: 20,
                              height: 20,
                              margin: 5,
                            }}
                          />
                        </button>
                      </div>
                      <p className="m1 hundred">
                        {DateTime.fromISO(c.created_at).toFormat(
                          "MMM dd yyyy"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeContract.active ? (
              <div>
                <ContractEditor
                  edited={edited}
                  setEdited={(val) => setEdited(val)}
                  contractObject={activeContract.contract}
                  businessDetails={businessDetails}
                  inShrink={inShrink}
                  onSave={(contract) => afterContractSave(contract)} // Update the contract in the state
                />
              </div>
            ) : <div className="boxed boxedOutline w100 center middle" style={{maxWidth: 900}}>
                  <IonIcon name="document-sharp" style={{height: 50, width: 50, color: "var(--mediumAccent)"}}/>
                  <p>No contract selected</p>
              </div>}
          </div>
        </div>
      )}
    </div>
  );
}
