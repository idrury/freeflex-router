import MoveableMenu from "../MoveableMenu";
import { updateProjectAttribute } from "../../Functions/DBAccess";
import React from "react";
import { FFProject } from "../../assets/Types";
import { ProjectContextMenuProps } from "./PROJECT_TYPES";
import {
  priorityToColor,
  priorityToCSSButton,
  priorityToWord,
} from "../EditProject/ProjectsBL";
import IonIcon from "@reacticons/ionicons";
import { projectOptions } from "./DATA";

export default function ProjectStatusContextMenu({
  selectedProject,
  setProjects,
  boxPosition,
  isActive,
  onClose,
  onError,
}: ProjectContextMenuProps) {
  // Must have a valid project given
  if (!selectedProject) return;

  const statusOptions = { high: 3, med: 2, low: 1 };

  async function updatePriority(val) {
    // Update local version of project
    const originalProject = structuredClone(selectedProject);
    selectedProject.priority = val;
    setProjects(selectedProject);

    // Update database
    try {
      await updateProjectAttribute(
        selectedProject.id,
        "priority",
        val
      );
    } catch (error) {
      selectedProject.priority = originalProject.priority;
      setProjects(selectedProject);
      onError("An unknown error has occured");
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
        height={270}
        autoHide={true}
      >
        <div className="centerRow mt2">
          <IonIcon
            name={projectOptions.priority.icon}
            className="basicIcon mr2"
          />
          <h3 className="centerRow">
            {projectOptions.priority.label.toUpperCase()}
          </h3>
        </div>
        <button
          className="centerRow"
          style={{
            border: `2px solid ${priorityToColor(
              statusOptions.high
            )}`,
          }}
          onClick={() => updatePriority(statusOptions.high)}
        >
          <IonIcon
            name="caret-up"
            className="basicButton mr1"
            style={{
              color: `${priorityToColor(statusOptions.high)}`,
            }}
          />
          <p className="p0 m0" style={{ color: "var(--text)" }}>
            {priorityToWord(statusOptions.high, true)}
          </p>
        </button>
        <button
          className="centerRow"
          style={{
            border: `2px solid ${priorityToColor(statusOptions.med)}`,
          }}
          onClick={() => updatePriority(statusOptions.med)}
        >
          <IonIcon
            name="caret-forward"
            className="basicButton mr1"
            style={{
              color: `${priorityToColor(statusOptions.med)}`,
            }}
          />
          <p className="p0 m0" style={{ color: "var(--text)" }}>
            {priorityToWord(statusOptions.med, true)}
          </p>
        </button>
        <button
          className="centerRow"
          style={{
            border: `2px solid ${priorityToColor(statusOptions.low)}`,
          }}
          onClick={() => updatePriority(statusOptions.low)}
        >
          <IonIcon
            name="caret-down"
            className="basicButton mr1"
            style={{
              color: `${priorityToColor(statusOptions.low)}`,
            }}
          />
          <p className="p0 m0" style={{ color: "var(--text)" }}>
            {priorityToWord(statusOptions.low, true)}
          </p>
        </button>
      </MoveableMenu>
    </div>
  );
}
