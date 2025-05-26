import MoveableMenu from "../MoveableMenu";
import DatePicker from "../DatePicker";
import { updateProjectAttribute } from "../../Functions/DBAccess";
import { FFProject } from "../../assets/Types";
import React from "react";
import { ProjectContextMenuProps } from "./PROJECT_TYPES";


export default function ProjectShootDateContextMenu({
  selectedProject,
  boxPosition,
  isActive,
  setIsActive,
  setProjects,
  onError,
}: ProjectContextMenuProps) {
  // Must have a valid project given
  if (!selectedProject) return;

  async function updateCurrentDate(newDate: Date) {
    // Update local version of project
    const originalProject = structuredClone(selectedProject);
    selectedProject.shoot_date = newDate;
    setProjects(selectedProject);

    // Update database
    try {
      await updateProjectAttribute(selectedProject.id, "shoot_date", newDate);
    } catch (error) {
      selectedProject.shoot_date = originalProject.shoot_date;
      setProjects(selectedProject);
      onError();
    }
  }

  return (
    <div>
      <MoveableMenu
        x={boxPosition.x}
        y={boxPosition.y}
        isActive={isActive}
        setIsActive={setIsActive}
        width={320}
        height={500}
      >
        <h3 className="centerRow" style={{ marginTop: "2vh" }}>
          START DATE
        </h3>
        <DatePicker
          currentDate={new Date(selectedProject.shoot_date || new Date())}
          setCurrentDate={updateCurrentDate}
          closeTrigger={setIsActive}
        />
      </MoveableMenu>
    </div>
  );
}
