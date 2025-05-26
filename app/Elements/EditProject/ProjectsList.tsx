import React from "react";
import { reRouteTo } from "../../Functions/commonFunctions";
import { formatDatestring } from "../../Functions/Dates";
import {
  getFormattedDateString,
  priorityToColor,
  priorityToCSSButton,
  priorityToIcon,
  priorityToWord,
  statusToColor,
  statusToCSSButton,
} from "./ProjectsBL";
import { FFClient, FFProject } from "../../assets/Types";
import IonIcon from "@reacticons/ionicons";
import { IoniconName } from "../../assets/Ionicons";
import { projectOptions } from "../Projects/DATA";

type ProjectsListProps = {
  projects: FFProject[] | undefined;
  onStatusClick: (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onPriorityClick: (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onDeliveryClick: (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onShootClick: (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

export default function projectsList({
  projects,
  onStatusClick,
  onPriorityClick,
  onDeliveryClick,
  onShootClick,
}: ProjectsListProps) {
  return (
    <div className="w100 ml2" style={{ alignItems: "stretch" }}>
      {projects && projects.length > 0 ? (
        projects?.map((proj) => (
          <div
            key={proj.id}
            onClick={() => reRouteTo(`/projects/${proj.id}/edit`)}
            className={`projectRow shrinkRow hundred row p0 mediumFade boxedOutline m0 mb2 mt2`}
            style={{ minWidth: 250, width: "98%" }}
          >
            <div className="leftRow thirty m0 p0">
              <button
                className={`centerRow p0 boxedOutline middle`}
                style={{
                  borderRadius: 5,
                  zIndex: 5,
                  width: 60,
                  border: `1px solid ${priorityToColor(
                    proj.priority
                  )}`,
                }}
                onClick={(e) => onPriorityClick(proj.id, e)}
              >
                <IonIcon
                  name={priorityToIcon(proj.priority)}
                  className="basicIcon mr1"
                  style={{ color: priorityToColor(proj.priority) }}
                />
                <h3>{priorityToWord(proj.priority, true)}</h3>
              </button>

              <div className="leftRow middle">
                <h3>{`${
                  proj.clients
                    ? ((proj.clients as FFClient).nickname ||
                        (proj.clients as FFClient).name) + " | "
                    : ""
                }${proj.name || "New project"}`}</h3>
              </div>
            </div>

            <div className="row sixty m0 p0">
              <div className="row m0" style={{ width: "33%" }}>
                <button
                  className="centerRow middle w100"
                  onClick={(e) => onStatusClick(proj.id, e)}
                  style={{
                    border: `1px solid ${statusToColor(
                      proj.status,
                      "color"
                    )}`,
                  }}
                >
                  <IonIcon
                    name={
                      statusToColor(
                        proj.status,
                        "icon"
                      ) as IoniconName
                    }
                    className="basicIcon mr1"
                    style={{
                      color: statusToColor(proj.status, "color"),
                    }}
                  />
                  <p className="m0">{proj.status}</p>
                </button>
              </div>
              <div className="row m0" style={{ width: "33%" }}>
                <button
                  className="dark hundred centerRow middle"
                  onClick={(e) => onShootClick(proj.id, e)}
                >
                  <IonIcon
                    name={projectOptions.projectDate.icon}
                    className="basicIcon mr2 hiddenOnShrink"
                  />
                  <div className="centerRow m0 p0">
                    <p className="m0">
                      {getFormattedDateString(
                        projects.find((i) => i.id == proj.id)
                          ?.project_date.start,
                        projects.find((i) => i.id == proj.id)
                          ?.project_date.end
                      )}
                    </p>
                  </div>
                </button>
              </div>
              <div className="row m0" style={{ width: "33%" }}>
                <button
                  className="dark hundred centerRow"
                  onClick={(e) => onDeliveryClick(proj.id, e)}
                >
                  <IonIcon
                    name={projectOptions.deadline.icon}
                    className="basicIcon mr2 hiddenOnShrink"
                  />
                  <p className="m0">
                    {getFormattedDateString(
                      projects.find((i) => i.id == proj.id)
                        ?.project_delivery_date.date
                    )}
                  </p>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="middleContainer mediumFade">
          <IonIcon
            name="analytics"
            style={{
              height: 200,
              width: 200,
              color: "var(--smallAccent)",
            }}
          />
          <h2>Sorry! You're out of luck.</h2>
          <p className="pb2">
            We searched high and low, but we couldn't find a project
            that matched your search!
          </p>
        </div>
      )}
    </div>
  );
}
