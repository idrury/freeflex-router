import React, { cloneElement, useEffect, useState } from "react";
import MoveableMenu from "../MoveableMenu";
import { FFClient, FFProject } from "../../assets/Types";
import {
  insertError,
  updateProjectAttribute,
} from "../../Functions/DBAccess";
import AddDateModal from "../AddDateModal";
import { formatDatestring } from "../../Functions/Dates";
import { DateTime } from "luxon";
import {
  dateIsSameDayOrAfter,
  getTimeToNearest15,
  handleAddGoogleCalendarEvent,
} from "../GoogleCalendar/GoogleCalendarBL";
import Toggle from "react-toggle";
import IonIcon from "@reacticons/ionicons";
import spinners from "react-spinners";
import { ProjectDateContextMenuProps } from "./PROJECT_TYPES";
import { projectOptions } from "./DATA";

export default function ProjectDurationSelector({
  isActive,
  boxPosition,
  selectedProject,
  session,
  profile,
  integrations,
  setProjects,
  onClose,
  onSave,
  onError,
}: ProjectDateContextMenuProps) {
  const [endDateActive, setEndDateActive] = useState(false);
  const [startDateACtive, setStartDateActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [savedProject, setSavedProject] = useState<FFProject>();

  useEffect(() => {
    if (isActive == true) {
      setSavedProject(structuredClone(selectedProject));
      if (selectedProject) setProjects(selectedProject);

      if (selectedProject && !selectedProject?.project_date.start) {
        selectedProject.project_date.start = getTimeToNearest15(
          new Date()
        );

        setEdited(true);
      } else {
        setEdited(false);
      }
    }
  }, [isActive]);

  if (!selectedProject) return null;

  /*****************************************
   * Update the relevant date
   * @param newDate The date to assign to the project
   * @param attr Whether to update the start or end date
   */
  function onDateChange(newDate: Date | null, attr: "start" | "end") {
    if (!selectedProject?.project_date) return;
    else if (newDate == null) {
      selectedProject.project_date.include_time = false;
      if (attr == "start") selectedProject.project_date.end = null;
    } else if (attr == "end" && !selectedProject.project_date.start)
      return;

    selectedProject.project_date[attr] = newDate;

    setEdited(true);
    setProjects(selectedProject);
  }

  /************************************
   * Update the time of the project
   * @param e The event object
   * @param attr The attribute to update
   */
  function onTimeChange(
    e: React.ChangeEvent<HTMLInputElement>,
    attr: "start" | "end"
  ) {
    if (!selectedProject || !selectedProject.project_date) return;

    let date = DateTime.fromJSDate(
      new Date(
        selectedProject.project_date[attr] ||
          new Date(selectedProject.project_date.start || new Date())
      )
    );
    date = date.set({
      hour: parseInt(e.target.value.split(":")[0]),
      minute: parseInt(e.target.value.split(":")[1]),
    });

    selectedProject.project_date[attr] = date.toJSDate();

    setEdited(true);
    setProjects(selectedProject);
  }

  /***************************************
   * Update the time active setting
   * @param active Whether or not a specific time is enabled on the date
   */
  function toggleTimeActive(active: boolean) {
    if (!selectedProject) return;

    selectedProject.project_date.include_time = active;
    if (active == false) {
      setProjects(selectedProject);
      return;
    }

    const startDate = getTimeToNearest15(
      selectedProject.project_date.start || new Date()
    );

    const endDate = getTimeToNearest15(
      new Date(
        selectedProject.project_date.end ||
          DateTime.fromJSDate(startDate).plus({ hours: 1 }).toJSDate()
      )
    );

    selectedProject.project_date.start = startDate;
    selectedProject.project_date.end = endDate;

    setEdited(true);
    setProjects(selectedProject);
    return;
  }

  /***********************************
   * Save the project to the database and
   * update the google calendar event
   */
  async function saveProject() {
    if (!selectedProject || !selectedProject.project_date) {
      onError(
        "There was an issue retrieving your project details. Refresh the page and try again."
      );
      return;
    }

    // Stop user from setting end date before start
    if (
      selectedProject.project_date.end &&
      selectedProject.project_date.start &&
      !dateIsSameDayOrAfter(
        selectedProject.project_date.end,
        selectedProject.project_date.start
      )
    ) {
      onError("The end date must be after the start date");
      return;
    }

    setLoading(true);

    // Update database
    try {
      await updateProjectAttribute(
        selectedProject.id,
        "project_date",
        selectedProject.project_date
      );

      // Add the event in the user's google calendar
      const success = await addEventToGoogleCalendar(selectedProject);

      setProjects(selectedProject);
      setSavedProject(selectedProject);
      setEdited(false);
      if (success) onSave();
    } catch (error) {
      await insertError(
        error,
        "ProjectDurationSelector::saveProject",
        {}
      );
      if (savedProject) setProjects(savedProject);
      onError(error?.message || "Refresh the page and try again");
    }

    setLoading(false);
  }

  /***************************************************
   * Handle the process of adding an event to google cal
   * @param project The current project
   */
  async function addEventToGoogleCalendar(localProject: FFProject) {
    if (!integrations?.add_to_calendar) {
      return true;
    }
    if (!profile) return false;

    try {
      let eventData = await handleAddGoogleCalendarEvent(
        profile,
        `${localProject.name || "New Project"}${
          (localProject.clients as FFClient)?.name
            ? " for " + (localProject.clients as FFClient).name
            : ""
        }`,
        "Added by FreeFlex",
        localProject.project_date,

        localProject.project_date.gcal_id,
        integrations.gcal_id
      );

      const prevId = localProject.project_date.gcal_id;

      // Update the google cal id in supabase if the id changes
      if (eventData && prevId != eventData.id) {
        localProject.project_date.gcal_id = eventData.id;

        await updateProjectAttribute(
          localProject.id,
          "project_date",
          {
            ...localProject.project_date,
            gcal_id: eventData?.id || null,
          }
        );
      }
      return true;
    } catch (error) {
      await insertError(
        error,
        "ProjectDurationSelector::AddEventToGoogleCalendar",
        {}
      );
      onError(error?.message || "Could not save in google calendar");
      return false;
    }
  }

  return (
    <MoveableMenu
      isActive={isActive}
      setIsActive={() => onClose(savedProject)}
      x={boxPosition.x || 0}
      y={boxPosition.y || 0}
      height={280}
    >
      <div className="col h100 between m0 p0">
        <div>
          <div className="centerRow mt2">
            <IonIcon
              name={projectOptions.projectDate.icon}
              className="basicIcon mr2"
            />
            <h3 className="centerRow">
              {projectOptions.projectDate.label.toUpperCase()}
            </h3>
          </div>
          <div className="row-no-shrink m2">
            <div className="col hundred fifty">
              <button
                className="p1 m0 hundred"
                onClick={() => setStartDateActive(true)}
              >
                {(selectedProject?.project_date.start &&
                  formatDatestring(
                    new Date(selectedProject?.project_date.start)
                  )) ||
                  "no date"}
              </button>
              <AddDateModal
                active={startDateACtive}
                onClose={() => setStartDateActive(false)}
                date={
                  new Date(
                    selectedProject?.project_date?.start || new Date()
                  )
                }
                setDate={(date) => onDateChange(date, "start")}
                label={
                  (selectedProject?.project_date.start &&
                    formatDatestring(
                      new Date(selectedProject?.project_date.start)
                    )) ||
                  "no date"
                }
              />
              {selectedProject.project_date.include_time == true &&
                selectedProject.project_date.start && (
                  <div className="p0 mt2">
                    <input
                      type="time"
                      className="p0 hundred noBorder"
                      onChange={(e) => onTimeChange(e, "start")}
                      value={DateTime.fromJSDate(
                        new Date(
                          selectedProject?.project_date.start ||
                            new Date()
                        )
                      ).toFormat("HH:mm")}
                    />
                  </div>
                )}
              {selectedProject.project_date.start && (
                <div className="hundred center m0">
                  <IonIcon
                    onClick={() => onDateChange(null, "start")}
                    className="m2 buttonIcon dangerButton"
                    name="close"
                  />
                </div>
              )}
            </div>
            <p className="m1"> - </p>
            <div className="leftRow m0 hundred">
              <div className="hundred">
                <button
                  className="p1 m0 hundred"
                  onClick={() => setEndDateActive(true)}
                >
                  {selectedProject?.project_date.start
                    ? formatDatestring(
                        new Date(
                          selectedProject?.project_date.end ||
                            new Date(
                              selectedProject?.project_date.start ||
                                new Date()
                            )
                        )
                      )
                    : "no date"}
                </button>
                {endDateActive && (
                  <AddDateModal
                    date={
                      new Date(
                        selectedProject?.project_date.end ||
                          selectedProject.project_date.start ||
                          new Date()
                      )
                    }
                    setDate={(date) => onDateChange(date, "end")}
                    active={endDateActive}
                    onClose={() => setEndDateActive(false)}
                  />
                )}
                {selectedProject.project_date.include_time == true &&
                  selectedProject.project_date.start && (
                    <div className="p0 mt2">
                      <input
                        className="p0 noBorder"
                        type="time"
                        onChange={(e) => onTimeChange(e, "end")}
                        value={DateTime.fromJSDate(
                          new Date(
                            selectedProject?.project_date.end ||
                              new Date(
                                selectedProject?.project_date.start ||
                                  new Date()
                              )
                          )
                        ).toFormat("HH:mm")}
                      />
                    </div>
                  )}
                {selectedProject.project_date.end && (
                  <div className="hundred center m0">
                    <IonIcon
                      onClick={() => onDateChange(null, "end")}
                      className="m2 buttonIcon dangerButton"
                      name="close"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="centerRow pt2 pb2 boxed">
            {/*@ts-ignore */}
            <Toggle
              checked={selectedProject.project_date.include_time}
              onChange={(e) => toggleTimeActive(e.target.checked)}
              className="mr2"
              icons={false}
            />
            <label className="m0">Include time</label>
          </div>
        </div>
        <button
          disabled={!edited}
          onClick={saveProject}
          className="accentButton m1 middle center"
        >
          {loading ? (
            <spinners.BeatLoader size={12} color={"#121212"} />
          ) : (
            <div className="centerRow">
              <IonIcon name="sync-sharp" className="basicIcon mr1" />
              <p className="m0">Update</p>
            </div>
          )}
        </button>
      </div>
    </MoveableMenu>
  );
}
