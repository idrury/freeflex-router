import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  deleteProject,
  fetchClients,
  fetchInvoicesForProject,
  fetchProject,
  insertClient,
  updateProject,
  updateProjectAttribute,
} from "../Functions/DBAccess";
import { formatDatestring } from "../Functions/Dates";
import {
  copyToClipboard,
  reRouteTo,
} from "../Functions/commonFunctions";
import MoveableMenu from "../Elements/MoveableMenu";
import IonIcon from "@reacticons/ionicons";
import spinners from "react-spinners";
import { useStopwatch } from "react-timer-hook";
import DeletePopup from "../Elements/DeletePopup";
import TitleElement from "../Elements/EditProject/TitleElement";
import ProjectStatusContextMenu from "../Elements/Projects/ProjectStatusContextMenu";
import ProjectPriorityContextMenu from "../Elements/Projects/ProjectPriorityContextMenu";
import ProjectDeliveryDateContextMenu from "../Elements/Projects/ProjectDeliveryDateContextMenu";
import FixedRow from "../Elements/FixedRow";
import EditClients from "../Elements/Projects/EditClients";
import React from "react";
import {
  FFClient,
  FFInvoice,
  FFProfile,
  FFProject,
  FFRole,
  LimitReachedType,
  popSavedModalFn,
  SavedModalType,
  ToolTip,
} from "../assets/Types";

import DeltaNotesWidget from "../Elements/EditProject/DeltaNotesWidget";
import { Delta, Op } from "quill";
import SavedModal from "../Elements/SavedModal";
import ScreenTip from "../Elements/ScreenTip";
import LimitReachedPopup from "../Elements/LimitReachedPopup";
import { LIMITS } from "../assets/data";
import {
  getFormattedDateString,
  priorityToColor,
  priorityToIcon,
  priorityToWord,
  statusToColor,
  statusToCSSButton,
} from "../Elements/EditProject/ProjectsBL";
import ProjectParamaterButton from "../Elements/EditProject/ProjectParamaterButton";
import { statusOptions } from "../Elements/Projects/DATA";
import ProjectDurationSelector from "../Elements/Projects/ProjectDurationSelector";
import { isSameDay } from "../Elements/Projects/ProjectsBL";
import supabase from "@supabase/supabase-js";
import { IoniconName } from "../assets/Ionicons";
import { DateTime } from "luxon";
import ProjectDocuments from "../Elements/EditProject/ProjectDocuments";
import { maybeRefreshGoogleSession } from "../Elements/Auth/AuthBL";

interface EditProjectProps {
  profile: FFProfile;
  menuVisible: boolean;
  inShrink: boolean;
  session: Session;
  popSavedModal: popSavedModalFn;
}

/*********************************************
 * This component gives users ability to
 * view and edit project details
 *******************************************/
export default function EditProject({
  profile,
  menuVisible,
  inShrink,
  session,
  popSavedModal,
}: EditProjectProps) {
  const { totalSeconds, reset } = useStopwatch({ autoStart: true });

  let { projectId } = useParams();
  const [project, setProject] = useState<FFProject>();
  const [invoices, setInvoices] = useState<FFInvoice[]>();
  const [localProfile, setLocalProfile] = useState<FFProfile>(profile);

  const [userClients, setUserClients] = useState<FFClient[]>();

  const [name, setName] = useState("");
  const [client, setClient] = useState("");

  const [saving, setSaving] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [LimitReachedModal, setLimitReachedModal] =
    useState<LimitReachedType>({ isActive: false, body: "" });

  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState<Op[]>(new Delta().ops);
  const [notesSaved, setNotesSaved] = useState(true);

  const [editMenuActive, setEditMenuActive] = useState(false);
  const [editMenuLoading, setEditMenuLoading] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
  const [statusPopupActive, setStatusPopupActive] = useState(false);
  const [priorityPopupActive, setPriorityPopupActive] =
    useState(false);
  const [shootDatePopupActive, setShootDatePopupActive] =
    useState(false);
  const [deliveryDatePopupActive, setDeliveryDatePopupActive] =
    useState(false);

  const [screenTip, setScreenTip] = useState<ToolTip>({
    value: undefined,
    x: 0,
    y: 0,
  });

  const ref = useRef();

  useEffect(() => {
    getProject();
  }, []);

  if (totalSeconds > 3) {
    saveNotes();
  }

  /******************************
   * Save the current notes
   */
  async function saveNotes() {
    if (!notesSaved) {
      saveProject();
      reset();
    }
  }

  /**********************************************
   * Fetch the project details from the database
   * @returns
   */
  async function getProject() {
    if (!projectId) {
      popSavedModal(
        "Could not load project",
        "An error has occured while loading this project. Refresh the page and try again.",
        true
      );
      return;
    }

    

    try {
      let proj = await fetchProject(parseInt(projectId));
      setProject(proj);
      setName(proj.name || "");
      setNotes(proj.notes_delta || new Delta().ops);
    } catch (error) {
      alert("An error has occured loading this project");
      reRouteTo("/projects");
      return;
    }

    try {
      setInvoices(await fetchInvoicesForProject(parseInt(projectId)));
    } catch (error) {
      alert("An error has occured loading these invoices");
      reRouteTo("/projects");
      return;
    }
    setLoading(false);

    try {
      setUserClients(await fetchClients());
    } catch (error) {
      console.log("An error has occured loading clients");
    }

    handleGoogleRefresh()
  }

  /************************************************
   * Update a projects complete status to be true
   * @param isComplete Whether the project should be set to complete
   */
  async function setProjectComplete(isComplete) {
    try {
      if (!projectId) {
        console.error("no project");
        return;
      }
      await updateProjectAttribute(
        parseInt(projectId),
        "is_complete",
        isComplete
      );
      getProject();
    } catch (error) {
      alert("An error occured while updating the project");
    }
  }

  /****************************************
   * Handles the process of updating the
   * details of a client in the database
   * @param cId The clientID
   * @returns Boolean indicating success
   */
  async function updateClient(cId) {
    setEditMenuLoading(true);

    if (!projectId) return;

    try {
      await updateProjectAttribute(
        parseInt(projectId),
        "client_id",
        cId
      );
      getProject();
      closeEditMenu();
      return true;
    } catch (error) {
      alert("That client name is not valid");
      closeEditMenu();
      return false;
    }
  }

  /***************************************************
   * Save the current state of the project in the database
   */
  async function saveProject() {
    setSaving(true);

    if (!project) return;
    try {
      await updateProject(
        projectId,
        name,
        project.priority,
        project.status,
        project.project_date,
        project.project_delivery_date,
        notes
      );
    } catch (error) {
      popSavedModal("Error saving your project", undefined, true);
    }

    setSaving(false);
    setNotesSaved(true);
  }

  /*******************************************
   * Pop the movable menu
   * @param e The mouse event
   */
  function activateMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuActive(!menuActive);
  }

  /********************************************
   * Handle the process of deleting a project
   */
  async function deleteProj() {
    setDeleteLoading(true);

    try {
      await deleteProject(projectId);
      setDeleteLoading(false);
      await goBack();
      return;
    } catch (error) {
      // Check if still references foreign tables
      if (error.code == 23503) {
        alert(
          "This project could not be deleted because it contains invoices or quotes"
        );
      } else {
        alert(
          "This project could not be deleted. Refresh the page and try again"
        );
      }
      setDeleteLoading(false);
      return;
    }
  }

  /***************************************
   * Navigate back to previous page
   */
  async function goBack() {
    if (!notesSaved) await saveProject();
    reRouteTo("/projects");
  }

  /********************************************
   * Insert a new client to the DB
   * @param name The name of the client to insert
   */
  async function insertNewClient(name) {
    if (
      localProfile.role == "free" &&
      userClients &&
      userClients.length >= LIMITS.clients
    ) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only create ${LIMITS.clients} clients on the free plan.`,
      });
      return;
    }

    setEditMenuLoading(true);

    // Insert the client into the DB
    try {
      let client = await insertClient(name);
      await updateClient(client.id);
    } catch (error) {
      popSavedModal(
        "Error adding client!",
        "Try again in a few moments.",
        true
      );
    }
    closeEditMenu();
    setEditMenuLoading(false);
    return true;
  }

  /******************************
   * Close the edit menu
   */
  function closeEditMenu() {
    setClient("");
    setEditMenuActive(false);
    setEditMenuLoading(false);
  }

  /*****************************
   * Route to the quotes page
   */
  async function createQuote() {
    if (
      localProfile.role == "free" &&
      invoices &&
      invoices.filter((i) => i.isInvoice == false).length >=
        LIMITS.invoices
    ) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only create ${LIMITS.invoices} quote per project on the free plan.`,
      });
      return;
    }

    await saveProject();
    reRouteTo("invoice?type=quote");
  }

  /**************************************
   * Re-route to the invoice page
   */
  async function createInvoice() {
    if (
      localProfile.role == "free" &&
      invoices &&
      invoices.filter((i) => i.isInvoice == true)?.length >=
        LIMITS.invoices
    ) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only create ${LIMITS.invoices} invoice per project on the free plan.`,
      });

      return;
    }
    await saveProject();
    reRouteTo("invoice?type=invoice");
  }

  function handleStatusClick(e) {
    e.stopPropagation();

    setBoxPosition({ x: e.clientX, y: e.clientY });
    setStatusPopupActive(true);
  }

  function handlePriorityClick(e) {
    e.stopPropagation();

    setBoxPosition({ x: e.clientX, y: e.clientY });
    setPriorityPopupActive(true);
  }

  function handleShootDateClick(e) {
    e.stopPropagation();

    setBoxPosition({ x: e.clientX, y: e.clientY });
    setShootDatePopupActive(true);
  }

  function handleDeliveryDateClick(e) {
    e.stopPropagation();

    setBoxPosition({ x: e.clientX, y: e.clientY });
    setDeliveryDatePopupActive(true);
  }

  function onNotesChange(newNotes: Op[]) {
    setNotesSaved(false);
    setNotes(newNotes);
  }

  function contactClient(
    e: React.MouseEvent<HTMLButtonElement>,
    val: string,
    type?: "email" | "phone"
  ) {
    copyToClipboard(e, val, type);

    // Show copy result in screen tip
    popSavedModal("Copied!");
  }

    /*****************************************
     * Refresh the google session and update the local profile
     */
    async function handleGoogleRefresh() {
      const token = await maybeRefreshGoogleSession(localProfile, 600);
  
      if (token) {
        setLocalProfile({
          ...localProfile,
          google_access_token: token,
        });
      }
    }
  

  if (!project) return;

  return (
    <div className="centerContainer" style={{ padding: 0 }}>
      <ScreenTip props={screenTip} />
      <LimitReachedPopup
        isActive={LimitReachedModal.isActive}
        onClose={() =>
          setLimitReachedModal({ isActive: false, body: "" })
        }
        message={LimitReachedModal.body}
      />
      <EditClients
        isActive={editMenuActive}
        setIsActive={setEditMenuActive}
        originalClient={(project?.clients as FFClient)?.name}
        updateClient={updateClient}
        insertClient={insertNewClient}
        clientSearch={client}
        setClientSearch={setClient}
        allClients={userClients}
        isLoading={editMenuLoading}
      />
      <ProjectStatusContextMenu
        setProjects={(project) => setProject(project)}
        boxPosition={boxPosition}
        isActive={statusPopupActive}
        onClose={setStatusPopupActive}
        onError={() =>
          popSavedModal(
            "Sorry! An error occured updating the status of the project",
            "Refresh the page and try again!",
            true
          )
        }
        selectedProject={project as FFProject}
        setClosed={(closed) => setProjectComplete(closed)}
      />

      <ProjectPriorityContextMenu
        selectedProject={project as FFProject}
        setProjects={(val) => setProject(val)}
        boxPosition={boxPosition}
        isActive={priorityPopupActive}
        onClose={setPriorityPopupActive}
        onError={() =>
          popSavedModal(
            "Sorry! An error occured updating the priority of the project",
            "Refresh the page and try again!",
            true
          )
        }
      />

      <ProjectDurationSelector
        selectedProject={project as FFProject}
        integrations={localProfile?.integration_settings}
        isActive={shootDatePopupActive}
        profile={localProfile}
        onClose={(project) => {
          setShootDatePopupActive(false);
          project && setProject(project);
        }}
        setProjects={(project) =>
          setProject({
            ...project,
            project_date: project.project_date,
          })
        }
        boxPosition={boxPosition}
        session={session}
        onError={(message) =>
          popSavedModal(
            "An error occured updating the project",
            message,
            true
          )
        }
        onSave={() => popSavedModal("Project saved", undefined)}
      />

      <ProjectDeliveryDateContextMenu
        boxPosition={boxPosition}
        isActive={deliveryDatePopupActive}
        profile={localProfile}
        selectedProject={project as FFProject}
        integrations={localProfile?.integration_settings}
        setProjects={(project) =>
          setProject({
            ...project,
            project_delivery_date: project.project_delivery_date,
          })
        }
        session={session}
        onClose={(project) => {
          setDeliveryDatePopupActive(false);
          project && setProject(project);
        }}
        onError={(message) =>
          popSavedModal(
            "An error occured updating the priorty of the project",
            message,
            true
          )
        }
        onSave={() => popSavedModal("Project saved", undefined)}
      />

      <DeletePopup
        active={deleteVisible}
        loading={deleteLoading}
        onDelete={deleteProj}
        onCancel={() => setDeleteVisible(false)}
        type="project"
      />
     
      <MoveableMenu
        isActive={menuActive}
        setIsActive={setMenuActive}
        x={menuPosition.x}
        y={menuPosition.y}
        width={200}
        height={210}
        onRight={true}
        autoHide={true}
      >
        <h3 style={{ marginTop: "1em" }} className="centerRow">
          MENU
        </h3>
        {project?.is_complete || (
          <button
            className="mediumFade"
            onClick={() => setProjectComplete(true)}
          >
            Close Project
          </button>
        )}
        <button
          disabled={project?.is_complete}
          onClick={() => setDeleteVisible(true)}
        >
          Delete
        </button>
      </MoveableMenu>
      {loading ? (
        <div className="loadingContainer">
          <spinners.ClimbingBoxLoader color="var(--primaryColor)" />{" "}
        </div>
      ) : (
        <div className="leftContainer hundred mediumFade">
          {project?.is_complete && (
            <FixedRow
              menuVisible={menuVisible}
              top={0}
              danger
              zIndex={8}
            >
              <div className="centerRow middle hundred">
                <p
                  className="textCenter"
                  style={{ color: "var(--background)" }}
                >
                  This project is closed and can not be edited.
                </p>
                <button
                  value={statusOptions.actionRequired}
                  className="p0 m2"
                  onClick={(e) => handleStatusClick(e)}
                >
                  <p className="m0 p1">Change status</p>
                </button>
              </div>
            </FixedRow>
          )}
          <FixedRow menuVisible={menuVisible} minHeight={90}>
            <div className="leftRow">
              <div className="middle ml2">
                <button
                  className="centerRow middle p0"
                  style={{ margin: "0 10px" }}
                  onClick={() => goBack()}
                >
                  <IonIcon
                    name="arrow-back"
                    style={{ width: 20, height: 20, margin: 5 }}
                  />
                  <p className="hiddenOnShrink">Back</p>
                </button>
              </div>
            </div>

            <div className="leftRow middle">
              <IonIcon
                name="ellipse"
                style={{
                  padding: "0 0px",
                  color: `${
                    notesSaved
                      ? "var(--safeColor)"
                      : "var(--warningColor)"
                  }`,
                  textShadow: "0 0px 10px var(--safeColor)",
                }}
              />
              <label style={{ fontWeight: "400" }}>
                {notesSaved ? "saved" : "unsaved"}
              </label>
            </div>
            <div className="middle">
              <button
                className="centerRow middle p0"
                style={{ margin: "0 10px" }}
                onClick={(e) => activateMenu(e)}
              >
                <IonIcon
                  name="ellipsis-horizontal"
                  style={{ width: 20, height: 20, margin: 5 }}
                />
                <p className="hiddenOnShrink">Options</p>
              </button>
            </div>
          </FixedRow>

          <TitleElement
            setName={setName}
            innerRef={ref}
            name={name}
            setSaved={setNotesSaved}
            disabled={project?.is_complete}
          />
          <div className="row">
            <button
              disabled={project?.is_complete}
              onClick={() => setEditMenuActive(true)}
              className="noBkg thirty textLeft boldLabel m1 noBorder"
            >
              {(project?.clients as FFClient)?.nickname ||
                (project?.clients as FFClient)?.name ||
                "Add Client"}
            </button>
            <div className="rightRow thirty pr2">
              {(project?.clients as FFClient)?.email && (
                <div className="leftRow middle m0">
                  <IonIcon
                    name="mail-open-sharp"
                    className="ph2"
                    style={{ width: 20, height: 20 }}
                  />
                  <button
                    onClick={(e) =>
                      copyToClipboard(
                        e,
                        (project?.clients as FFClient)
                          .email as string,
                        "email"
                      )
                    }
                    className="p1"
                  >
                    <p className="thirty m0">
                      {(project?.clients as FFClient).email}
                    </p>
                  </button>
                </div>
              )}
              {(project?.clients as FFClient)?.phone && (
                <div className="leftRow middle m0">
                  <IonIcon
                    name="call-sharp"
                    className="ph2"
                    style={{ width: 20, height: 20 }}
                  />

                  <button
                    onClick={(e) =>
                      contactClient(
                        e,
                        (project?.clients as FFClient)
                          .phone as string,
                        "phone"
                      )
                    }
                    className="p1"
                  >
                    <p className="thirty m0">
                      {(project?.clients as FFClient).phone}
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="row mr1">
            <div
              className="centerRow dynamicSize hundred"
              style={{ alignItems: "stretch" }}
            >
              <ProjectParamaterButton
                disabled={project?.is_complete}
                label="Priority"
                onClick={handlePriorityClick}
                background={`${priorityToColor(
                  project?.priority || -1
                )}`}
                innerText={
                  priorityToWord(
                    project?.priority || -1,
                    true
                  ) as string
                }
                icon={priorityToIcon(project?.priority)}
              />
              <ProjectParamaterButton
                label="status"
                onClick={handleStatusClick}
                background={`${statusToColor(
                  project?.status,
                  "color"
                )}`}
                innerText={project?.status || ""}
                icon={
                  statusToColor(
                    project?.status,
                    "icon"
                  ) as IoniconName
                }
              />
            </div>

            <div
              className="centerRow dynamicSize hundred"
              style={{ alignItems: "stretch" }}
            >
              <ProjectParamaterButton
                disabled={project?.is_complete}
                label="start date"
                onClick={handleShootDateClick}
                background={`boxedDark`}
                innerText={getFormattedDateString(
                  project?.project_date.start,
                  project?.project_date.end
                )}
              />
              <ProjectParamaterButton
                disabled={project?.is_complete}
                label="Deadline"
                background={`boxedDark`}
                onClick={handleDeliveryDateClick}
                innerText={getFormattedDateString(
                  project?.project_delivery_date.date
                )}
                icon="alarm-sharp"
              />
            </div>
          </div>

          <div
            className="row"
            style={{
              alignItems: "start",
              paddingRight: `${inShrink ? "10px" : "10px"}`,
            }}
          >
            <DeltaNotesWidget
              disabled={project?.is_complete || false}
              onChange={onNotesChange}
              ops={notes}
            />
            <div className="m1" />

            <div className="dynamicSize thirty pr3">
              <div className="boxed dynamicSize hundred m0 boxedOutline">
                <div className="leftRow middle">
                  <IonIcon
                    name="pricetag"
                    className="basicIcon mr2"
                  />
                  <h3 className="row m0">QUOTES</h3>
                </div>
                <div style={{ marginRight: "20px" }}>
                  {invoices
                    ?.filter((inv) => inv.isInvoice == false)
                    .map((quote) => (
                      <div key={quote?.id}>
                        <button
                          className="hundred dark row middle"
                          onClick={() => {
                            reRouteTo(`invoice?IID=${quote.id}`);
                          }}
                        >
                          <p className="m0">${quote.total_amount}</p>

                          <p className="m0">
                            {formatDatestring(quote?.created_at)}
                          </p>
                        </button>
                      </div>
                    ))}
                </div>
                <div className="row">
                  <button
                    disabled={project?.is_complete}
                    className="hundred dark"
                    onClick={() => createQuote()}
                  >
                    <p className="m0">+ Quote</p>
                  </button>
                </div>
              </div>
              <div className="boxed dynamicSize hundred m0 mt2 boxedOutline">
                <div className="leftRow middle">
                  <IonIcon name="card" className="basicIcon mr2" />
                  <h3 className="row m0">INVOICES</h3>
                </div>
                <div>
                  {invoices
                    ?.filter((inv) => inv.isInvoice == true)
                    .map((invoice) => (
                      <div
                        key={invoice?.id}
                        style={{ marginRight: "20px" }}
                      >
                        <button
                          className="hundred dark row middle"
                          onClick={() => {
                            reRouteTo(
                              invoice?.id
                                ? `invoice?IID=${invoice?.id}`
                                : `invoice`
                            );
                          }}
                        >
                          <div className="leftRow m0 p0 middle">
                            <IonIcon
                              name={
                                invoice.isPaid
                                  ? "checkmark-done-circle"
                                  : "close-circle"
                              }
                              className="mr2"
                              style={{
                                height: 20,
                                width: 20,
                                color: `${
                                  invoice.isPaid
                                    ? "var(--safeColor)"
                                    : "var(--dangerColor)"
                                }`,
                              }}
                            />
                            <p className="m0">
                              {invoice?.invoice_number}
                            </p>
                          </div>
                          <p className="m0">
                            {`${formatDatestring(
                              invoice?.created_at
                            )}`}
                          </p>
                        </button>
                      </div>
                    ))}
                </div>
                <div className="row">
                  <button
                    disabled={project?.is_complete}
                    className="hundred dark"
                    onClick={() => createInvoice()}
                  >
                    <p className="m0">+ Invoice</p>
                  </button>
                </div>
              </div>
              <ProjectDocuments
              onError={popSavedModal}
                project={project}
                documents={project.documents}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
