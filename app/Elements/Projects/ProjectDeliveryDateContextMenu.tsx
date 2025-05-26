import MoveableMenu from "../MoveableMenu";
import {
  insertError,
  updateProjectAttribute,
} from "../../Functions/DBAccess";
import { ProjectDateContextMenuProps } from "./PROJECT_TYPES";
import React, { useEffect, useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { formatDatestring } from "../../Functions/Dates";
import {
  AddGoogleCalendarSingleDayEvent,
  getTimeToNearest15,
} from "../GoogleCalendar/GoogleCalendarBL";
import { DateTime } from "luxon";
import AddDateModal from "../AddDateModal";
import {
  FFClient,
  FFProject,
  FFProjectDeliveryDate,
} from "../../assets/Types";
import spinners from "react-spinners";
import Toggle from "react-toggle";
import { projectOptions } from "./DATA";

export default function ProjectDeliveryDateContextMenu({
  selectedProject,
  boxPosition,
  isActive,
  integrations,
  profile,
  setProjects,
  onError,
  onClose,
  onSave,
}: ProjectDateContextMenuProps) {
  const [dateActive, setDateActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [savedProject, setSavedProject] = useState<FFProject>();

  useEffect(() => {
    if (isActive == true) {
      setSavedProject(structuredClone(selectedProject));

      if (
        selectedProject &&
        !selectedProject?.project_delivery_date.date
      ) {
        selectedProject.project_delivery_date.date =
          getTimeToNearest15(new Date());

        setEdited(true);
      } else {
        setEdited(false);
      }
    }
  }, [isActive]);

  /*****************************************
   * Update the relevant date
   * @param newDate The date to assign to the project
   * @param attr Whether to update the start or end date
   */
  function onDateChange(newDate: Date | null) {
    if (!selectedProject?.project_delivery_date) return;
    else if (newDate == null)
      selectedProject.project_delivery_date.include_time = false;

    selectedProject.project_delivery_date.date = newDate;

    setEdited(true);
    setProjects(selectedProject);
  }

  /************************************
   * Update the time of the project
   * @param e The event object
   * @param attr The attribute to update
   */
  function onTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedProject || !selectedProject.project_delivery_date)
      return;

    let date = DateTime.fromJSDate(
      new Date(
        selectedProject.project_delivery_date.date ||
          new Date(
            selectedProject.project_delivery_date.date || new Date()
          )
      )
    );
    date = date.set({
      hour: parseInt(e.target.value.split(":")[0]),
      minute: parseInt(e.target.value.split(":")[1]),
    });

    selectedProject.project_delivery_date.date = date.toJSDate();

    setEdited(true);
    setProjects(selectedProject);
  }

  /***************************************
   * Update the time active setting
   * @param active Whether or not a specific time is enabled on the date
   */
  function toggleTimeActive(active: boolean) {
    if (!selectedProject) return;

    selectedProject.project_delivery_date.include_time = active;
    setProjects(selectedProject);

    const date = getTimeToNearest15(
      selectedProject.project_delivery_date.date || new Date()
    );

    selectedProject.project_delivery_date.date = date;

    setEdited(true);
    setProjects(selectedProject);
    return;
  }

  /***********************************
   * Save the project to the database and
   * update the google calendar event
   */
  async function saveProject() {
    if (!selectedProject || !selectedProject.project_delivery_date) {
      onError(
        "There was an issue retrieving your project details. Refresh the page and try again."
      );
      return;
    }

    setLoading(true);

    // Update database
    try {
      await updateProjectAttribute(
        selectedProject.id,
        "project_delivery_date",
        selectedProject.project_delivery_date
      );

      // Add the event in the user's google calendar
      const success = await addEventToGoogleCalendar(
        selectedProject.project_delivery_date
      );

      setProjects(selectedProject);
      setSavedProject(selectedProject);
      setEdited(false);
      if (success) onSave();
    } catch (error) {
      await insertError(
        error,
        "ProjectDeliveryDateContectMenu::saveProject",
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
  async function addEventToGoogleCalendar(
    delivery_date: FFProjectDeliveryDate
  ): Promise<boolean> {
    if (!integrations?.add_to_calendar) {
      return true;
    }
    try {
      let eventData = await AddGoogleCalendarSingleDayEvent(
        profile,
        `${selectedProject.name || "New Project"}${
          (selectedProject.clients as FFClient)?.name
            ? " for " + (selectedProject.clients as FFClient).name
            : ""
        } due`,
        "Added by FreeFlex",
        delivery_date.date,
        delivery_date.include_time,

        delivery_date.gcal_id,
        integrations.gcal_id
      );

      const prevId = selectedProject.project_date.gcal_id;

      // Update the google cal id in supabase if the id changes
      if (eventData && prevId != eventData.id) {
        selectedProject.project_date.gcal_id = eventData.id;
        selectedProject.project_delivery_date.gcal_id = eventData.id;

        await updateProjectAttribute(
          selectedProject.id,
          "project_delivery_date",
          {
            ...selectedProject.project_delivery_date,
            gcal_id: eventData?.id || null,
          }
        );
      }

      return true;
    } catch (error) {
      await insertError(
        error,
        "ProjectDeliveryDateContectMenu::AddEventToGoogleCalendar",
        {}
      );
      onError(error?.message || "Refresh the page and try again");
      return false;
    }
  }

  if (!selectedProject) return;

  return (
    <div>
      <MoveableMenu
        x={boxPosition.x}
        y={boxPosition.y}
        isActive={isActive}
        setIsActive={() => onClose(savedProject)}
        height={240}
        width={320}
      >
        <div className="col h100 between m0 p0">
          <div>
            <div className="centerRow mt2">
            <IonIcon
              name={projectOptions.deadline.icon}
              className="basicIcon mr2"
            />
            <h3 className="centerRow">
              {projectOptions.deadline.label.toUpperCase()}
            </h3>
          </div>
            <div className="leftRow m2">
              <button
                className="p1 m0 hundred"
                onClick={() => setDateActive(true)}
              >
                {(selectedProject?.project_delivery_date.date &&
                  formatDatestring(
                    new Date(
                      selectedProject?.project_delivery_date.date
                    )
                  )) ||
                  "no date"}
              </button>
              {selectedProject.project_delivery_date.date && (
                <div className="m0 middle ml2">
                  <IonIcon
                    onClick={() => onDateChange(null)}
                    className="m0 buttonIcon dangerButton"
                    name="close"
                  />
                </div>
              )}
            </div>
            {selectedProject.project_delivery_date.include_time ==
              true &&
              selectedProject.project_delivery_date.date && (
                <div className="p0 m2">
                  <input
                    type="time"
                    className="p0 hundred noBorder"
                    onChange={(e) => onTimeChange(e)}
                    value={DateTime.fromJSDate(
                      new Date(
                        selectedProject?.project_delivery_date.date ||
                          new Date()
                      )
                    ).toFormat("HH:mm")}
                  />
                </div>
              )}
                <div className="boxed centerRow middle pt2 pb2">
              {/*@ts-ignore */}
              <Toggle
                checked={
                  selectedProject.project_delivery_date.include_time
                }
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
                <IonIcon
                  name="sync-sharp"
                  className="basicIcon mr1"
                />
                <p className="m0">Update</p>
              </div>
            )}
          </button>
        </div>

        <AddDateModal
          active={dateActive}
          onClose={() => setDateActive(false)}
          date={
            new Date(
              selectedProject?.project_delivery_date?.date ||
                new Date()
            )
          }
          setDate={(date) => onDateChange(date)}
          label={
            (selectedProject?.project_delivery_date.date &&
              formatDatestring(
                new Date(selectedProject?.project_delivery_date.date)
              )) ||
            "no date"
          }
        />
      </MoveableMenu>
    </div>
  );
}
