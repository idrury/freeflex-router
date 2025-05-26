import MoveableMenu from "../MoveableMenu";
import { updateProjectAttribute } from "../../Functions/DBAccess";
import { projectOptions, statusOptions, statusOptionsStyles } from "./DATA";
import React from "react";
import { ProjectContextMenuProps } from "./PROJECT_TYPES";
import IonIcon from "@reacticons/ionicons";

export default function ProjectStatusContextMenu({
  setProjects,
  boxPosition,
  setClosed,
  isActive,
  onClose,
  onError,
  selectedProject,
}: ProjectContextMenuProps) {
  // Must have a valid project given
  if (!selectedProject) return;

  async function updateProjectStatus(val) {
    const originalProject = structuredClone(selectedProject);

    // Update the local project
    if (val == statusOptions.finished) {
      selectedProject.is_complete = true;
      setClosed && setClosed(true);
    } else if (selectedProject?.is_complete) {
      selectedProject.is_complete = false;
      setClosed && setClosed(false);
    }
    selectedProject.status = val;
    setProjects(selectedProject);

    // Update the database
    try {
      await updateProjectAttribute(selectedProject.id, "status", val);
      if (originalProject.is_complete != selectedProject.is_complete)
        await updateProjectAttribute(
          selectedProject.id,
          "is_complete",
          selectedProject.is_complete
        );
    } catch (error) {
      // Roll back if an error occurs
      selectedProject.status = originalProject.status;
      selectedProject.is_complete = originalProject.is_complete;
      setProjects(selectedProject);
      onError("An unknown error occurred");
    }
  }

  return (
    <div>
      <MoveableMenu
        x={boxPosition.x}
        y={boxPosition.y}
        isActive={isActive}
        setIsActive={onClose}
        width={200}
        height={400}
        autoHide={true}
      >
        <div className="centerRow mt2">
          <IonIcon name={projectOptions.status.icon} className="basicIcon mr2" />
          <h3 className="centerRow">
            STATUS
          </h3>
        </div>
        <button
          disabled={
            selectedProject.status == statusOptions.actionRequired
          }
          className={`centerRow middle`}
          style={{
            border: `1px solid ${statusOptionsStyles.actionRequired.color}`,
          }}
          onClick={() =>
            updateProjectStatus(statusOptions.actionRequired)
          }
        >
          <IonIcon
            name={statusOptionsStyles.actionRequired.icon}
            className="basicIcon mr1"
            style={{
              color: statusOptionsStyles.actionRequired.color,
            }}
          />
          <p className="m0">{statusOptions.actionRequired}</p>
        </button>

        <button
          disabled={
            selectedProject.status == statusOptions.awaitingResponse
          }
          className={`centerRow middle`}
          style={{
            border: `1px solid ${statusOptionsStyles.awaitingResponse.color}`,
          }}
          onClick={() =>
            updateProjectStatus(statusOptions.awaitingResponse)
          }
        >
          <IonIcon
            name={statusOptionsStyles.awaitingResponse.icon}
            className="basicIcon mr1"
            style={{
              color: statusOptionsStyles.awaitingResponse.color,
            }}
          />
          <p className="m0">{statusOptions.awaitingResponse}</p>
        </button>

        <button
          disabled={
            selectedProject.status == statusOptions.awaitingPayment
          }
          className={`centerRow middle`}
          style={{
            border: `1px solid ${statusOptionsStyles.awaitingPayment.color}`,
          }}
          onClick={() =>
            updateProjectStatus(statusOptions.awaitingPayment)
          }
        >
          <IonIcon
            name={statusOptionsStyles.awaitingPayment.icon}
            className="basicIcon mr1"
            style={{
              color: statusOptionsStyles.awaitingPayment.color,
            }}
          />
          <p className="m0">{statusOptions.awaitingPayment}</p>
        </button>

        <button
          disabled={
            selectedProject.status == statusOptions.readyToShoot
          }
          className={`centerRow middle`}
          style={{
            border: `1px solid ${statusOptionsStyles.readyToShoot.color}`,
          }}
          onClick={() =>
            updateProjectStatus(statusOptions.readyToShoot)
          }
        >
          <IonIcon
            name={statusOptionsStyles.readyToShoot.icon}
            className="basicIcon mr1"
            style={{
              color: statusOptionsStyles.readyToShoot.color,
            }}
          />
          <p className="m0">{statusOptions.readyToShoot}</p>
        </button>

             <button
          disabled={
            selectedProject.status == statusOptions.finished
          }
          className={`centerRow middle`}
          style={{
            border: `1px solid ${statusOptionsStyles.finished.color}`,
          }}
          onClick={() =>
            updateProjectStatus(statusOptions.finished)
          }
        >
          <IonIcon
            name={statusOptionsStyles.finished.icon}
            className="basicIcon mr1"
            style={{
              color: statusOptionsStyles.finished.color,
            }}
          />
          <p className="m0">{statusOptions.finished}</p>
        </button>
      </MoveableMenu>
    </div>
  );
}
