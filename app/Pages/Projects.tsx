import { useEffect, useState } from "react";
import {
  fetchProjects,
  fetchUserProfile,
  insertError,
  insertProject,
  updateProfileAttribute,
} from "../Functions/DBAccess";
import ProjectStatusContextMenu from "../Elements/Projects/ProjectStatusContextMenu";
import ProjectPriorityContextMenu from "../Elements/Projects/ProjectPriorityContextMenu";
import ProjectDeliveryDateContextMenu from "../Elements/Projects/ProjectDeliveryDateContextMenu";
import ProjectSortMenu from "../Elements/Projects/ProjectSortMenu";
import ProjectsList from "../Elements/EditProject/ProjectsList";

import spinners from "react-spinners";
import {
  isMobileBrowser,
  reRouteTo,
} from "../Functions/commonFunctions";
import ProjectFilterMenu from "../Elements/Projects/ProjectFilterMenu";
import PageHeader from "../Elements/PageHeader";
import React from "react";
import {
  FFProfile,
  FFProject,
  LimitReachedType,
  SavedModalType,
} from "../assets/Types";
import {
  filterProjects,
  sortProjects,
} from "../Elements/Projects/ProjectsBL";
import { orderOptions } from "../Elements/Projects/DATA";
import SavedModal from "../Elements/SavedModal";
import LimitReachedPopup from "../Elements/LimitReachedPopup";
import { LIMITS } from "../assets/data";
import ProjectDurationSelector from "../Elements/Projects/ProjectDurationSelector";
import FixedRow from "../Elements/FixedRow";
import IonIcon from "@reacticons/ionicons";
import supabase from "@supabase/supabase-js";
import { maybeRefreshGoogleSession } from "../Elements/Auth/AuthBL";

interface ProjectsProps {
  profile: FFProfile;
  menuVisible;
  inShrink: boolean;
  session: supabase.Session;
}

export default function Projects({
  menuVisible,
  inShrink,
  session,
  profile,
}: ProjectsProps) {
  const [projects, setProjects] = useState<FFProject[]>();
  const [modifiedProjects, setModifiedProjects] =
    useState<FFProject[]>();
  const [selectedProject, setSelectedProject] = useState<FFProject>();
  const [loading, setLoading] = useState(true);
  const [allLoading, setAllLoading] = useState(false);
  const [localProfile, setLocalProfile] =
    useState<FFProfile>(profile);

  const [activeProject, setActiveProject] = useState<number>();
  const [boxPosition, setBoxPosition] = useState({
    x: 0,
    y: 0,
  });

  const [statusPopupActive, setStatusPopupActive] = useState(false);
  const [priorityPopupActive, setPriorityPopupActive] =
    useState(false);
  const [shootDatePopupActive, setShootDatePopupActive] =
    useState(false);
  const [deliveryDatePopupActive, setDeliveryDatePopupActive] =
    useState(false);
  const [sortPopupActive, setSortPopupActive] = useState(false);
  const [LimitReachedModal, setLimitReachedModal] =
    useState<LimitReachedType>({
      isActive: false,
      body: "",
    });

  const [primarySort, setPrimarySort] = useState(
    profile.default_settings.primary_sort || orderOptions[0]
  );
  const [secondarySort, setSecondarySort] = useState(
    profile.default_settings.secondary_sort || orderOptions[1]
  );
  const [filter, setFilter] = useState({
    category: "name",
    value: null,
  });
  const [allVisible, setAllVisible] = useState<boolean>(false);

  const [errorPopup, setErrorPopup] = useState<SavedModalType>({
    visible: false,
    header: undefined,
    body: undefined,
  });

  useEffect(() => {
    getProjects(false);
  }, []);

  /**
   * Fetch the list of projects from the database
   * @param onlyComplete If false, fetch every project that belongs to the user
   * @returns
   */
  async function getProjects(includingComplete: boolean) {
    setAllLoading(true);

    try {
      var newProjects = await fetchProjects(includingComplete);
      if (!newProjects) throw Error("No projects found");
      await handleGoogleRefresh();
      setProjects(newProjects);
      prioritiseProjects(newProjects);
      setAllLoading(false);
    } catch (error) {
      setAllLoading(false);
      popError(
        "An issue occurred loading your projects",
        "Refresh the page and try again",
        "fail"
      );
      return;
    }

    await maybeGetCalendarSettings();
    setAllVisible(includingComplete);
    setLoading(false);
  }

  /*****************************************
   * Refresh the google session and update the local profile
   */
  async function handleGoogleRefresh() {
    const token = await maybeRefreshGoogleSession(profile, 600);

    if (token) {
      setLocalProfile({
        ...localProfile,
        google_access_token: token,
      });
    }
  }

  /***************************************
   * Check for changes to user profile integrations
   * if defaults are still set
   */
  async function maybeGetCalendarSettings() {
    if (
      localProfile.google_access_token &&
      !localProfile.integration_settings.calendar_add_dismissed &&
      !localProfile.integration_settings.add_to_calendar
    )
      setLocalProfile(await fetchUserProfile(localProfile.id));
  }

  /**************************
   * Create a new project
   */
  async function addProject() {
    if (
      localProfile?.role == "free" &&
      projects &&
      projects?.length >= LIMITS.projects
    ) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only have ${LIMITS.projects} active projects on the free plan.`,
      });

      return;
    }

    // Insert to DB
    try {
      var res = await insertProject(1);
      reRouteTo(`projects/${res.id}/edit`);
      return true;
    } catch (error) {
      setErrorPopup({
        visible: true,
        header:
          "Sorry! An error occured while attempting to create a new project!",
        body: "We're not sure what went wrong there. Refresh the page and try again!",
      });
      return false;
    }
  }

  /********************************************
   * Update a project in the local list without
   * updating the database
   * @param project The project to update
   */
  function updateLocalProject(project: FFProject) {
    if (!projects) return;
    const localProjects = [...projects];
    const index = localProjects?.findIndex((p) => p.id == project.id);

    if (project.is_complete == true) {
      localProjects.splice(index, 1);
      popError(
        "Project completed!",
        "This project has been marked as finished and will no longer be visible in your project list."
      );
    } else localProjects[index] = project;

    setProjects(localProjects);
    prioritiseProjects(localProjects);
  }

  /*****************************************
   * Sort and filter projects by specified paramaters
   * @param newProjects The list of projects to apply sort & filter to
   * @param sort1 Primary sorting category
   * @param sort2 secondary sorting category
   * @param filterOptions The filter to use
   */
  function prioritiseProjects(
    newProjects,
    sort1 = primarySort,
    sort2 = secondarySort,
    filterOptions = filter
  ) {
    if (filterOptions.value && filterOptions.category) {
      newProjects = filterProjects(
        newProjects,
        filterOptions.category,
        filterOptions.value
      );
    }

    // Return without sorting if all projects have been filtered out
    if (!newProjects) {
      setModifiedProjects(projects);
      return;
    }

    newProjects = sortProjects(newProjects, sort2);
    newProjects = sortProjects(newProjects, sort1);

    setModifiedProjects(newProjects);
  }

  /**
   * Handle state when priority button is clicked
   * @param id The id of the element clicked on
   */
  function handlePriorityClick(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setBoxPosition({ x: e.clientX, y: e.clientY });
    setPriorityPopupActive(true);
    setActiveProject(id);
    setSelectedProject(projects?.find((project) => project.id == id));
  }

  /**
   * Handle state when a projects status button is clicked
   * @param id The id of the element clicked on
   */
  function handleStatusClick(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setBoxPosition({ x: e.clientX, y: e.clientY });
    setStatusPopupActive(true);
    setSelectedProject(projects?.find((project) => project.id == id));
  }

  /**
   * Handle state when start date button is clicked
   * @param id The id of the element clicked on
   */
  function handleShootDateClick(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setBoxPosition({ x: e.clientX, y: e.clientY });
    setShootDatePopupActive(true);
    setActiveProject(id);
    setSelectedProject(projects?.find((project) => project.id == id));
  }

  /*************************************
   * Handle state when a projects delivery date button is clicked
   * @param id The id of the element clicked on
   */
  function handleDeliveryDateClick(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setBoxPosition({ x: e.clientX, y: e.clientY });
    setDeliveryDatePopupActive(true);
    setActiveProject(id);
    setSelectedProject(projects?.find((project) => project.id == id));
  }

  function handleSortClick(e) {
    e.stopPropagation();
    setBoxPosition({ x: e.clientX, y: e.clientY });
    setSortPopupActive(true);
  }

  function popError(
    header: string | undefined,
    body?: string | undefined,
    state: "success" | "fail" = "success"
  ) {
    if (!header)
      setErrorPopup({
        visible: false,
        header: undefined,
        body: undefined,
      });
    else
      setErrorPopup({
        visible: true,
        header: header,
        body: body,
        state: state,
      });
  }

  /********************************************
   * Sort the projects and save new default to DB
   * @param val The category to sorty by
   */
  async function updateSort(
    val,
    type: "primary_sort" | "secondary_sort"
  ) {
    const newDefaults = {
      ...localProfile.default_settings,
      [type]: val,
    };

    if (type == "primary_sort") {
      setPrimarySort(val);
      prioritiseProjects(modifiedProjects, val);
    } else if (type == "secondary_sort") {
      setSecondarySort(val);
      prioritiseProjects(modifiedProjects, primarySort, val);
    }

    try {
      await updateProfileAttribute(
        localProfile.id,
        "default_settings",
        newDefaults
      );
      setLocalProfile({
        ...localProfile,
        default_settings: newDefaults,
      });
    } catch (error) {
      await insertError(error, "Projects::updateSort", {
        val,
        profile,
      });
    }
  }

  function updateFilter(val) {
    setFilter(val);
    prioritiseProjects(projects, primarySort, secondarySort, val);
  }

  async function dismissCalendarModal() {
    if (!localProfile) return;
    const originalBusiness = structuredClone(localProfile);
    localProfile.integration_settings = {
      ...localProfile.integration_settings,
      calendar_add_dismissed: true,
    };
    setLocalProfile({ ...localProfile });

    try {
      await updateProfileAttribute(
        localProfile.id,
        "integration_settings",
        localProfile.integration_settings
      );
    } catch (error) {
      popError(
        "Could not dismiss message",
        "Refresh the page and try again!",
        "fail"
      );
      setLocalProfile(originalBusiness);
    }
  }

  if (!localProfile || !projects) return;
  return (
    <div className="centerContainer">
      <LimitReachedPopup
        isActive={LimitReachedModal.isActive}
        onClose={() =>
          setLimitReachedModal({ isActive: false, body: "" })
        }
        message={LimitReachedModal.body}
      />
      {localProfile.google_access_token &&
        !localProfile.integration_settings.calendar_add_dismissed &&
        !localProfile.integration_settings.add_to_calendar && (
          <FixedRow menuVisible={menuVisible} accent>
            <div className="hundred">
              <div className="row middle">
                <div></div>
                <div className="centerRow">
                  <h3 className="mr2">
                    You haven't enabled google calendar integrations!
                  </h3>
                  <button
                    className="accentButton"
                    onClick={() => reRouteTo("/account?SEC=3")}
                  >
                    Update calendar settings
                  </button>
                </div>
                <IonIcon
                  onClick={() => dismissCalendarModal()}
                  name="close"
                  className="buttonIcon dangerButton h100 m2 p1 boxedOutline"
                  style={{ width: "1.5em", height: "100%" }}
                />
              </div>
            </div>
          </FixedRow>
        )}
      {loading ? (
        <div className="loadingContainer">
          {" "}
          <spinners.ClimbingBoxLoader color="var(--primaryColor)" />{" "}
        </div>
      ) : (
        <div className="mediumFade">          
          <ProjectStatusContextMenu
            selectedProject={selectedProject as FFProject}
            setProjects={(project) => updateLocalProject(project)}
            boxPosition={boxPosition}
            isActive={statusPopupActive}
            onClose={() => setStatusPopupActive(false)}
            onError={() =>
              popError(
                "An issue occurred updating the status.",
                "Try again in a few moments",
                "fail"
              )
            }
          />

          <ProjectPriorityContextMenu
            setProjects={(project) => updateLocalProject(project)}
            boxPosition={boxPosition}
            isActive={priorityPopupActive}
            onClose={setPriorityPopupActive}
            selectedProject={selectedProject as FFProject}
            onError={() =>
              popError(
                "An issue occurred updating the priority.",
                "Try again in a few moments",
                "fail"
              )
            }
          />

          <ProjectDurationSelector
            isActive={shootDatePopupActive}
            profile={localProfile}
            integrations={localProfile.integration_settings}
            onClose={(project) => {
              setShootDatePopupActive(false);
              project && updateLocalProject(project);
            }}
            selectedProject={selectedProject as FFProject}
            setProjects={(project) => updateLocalProject(project)}
            boxPosition={boxPosition}
            session={session}
            onError={(message) =>
              popError(
                "An issue occurred updating the project.",
                message,
                "fail"
              )
            }
            onSave={() => popError("Project saved")}
          />

          <ProjectDeliveryDateContextMenu
            session={session}
            profile={localProfile}
            boxPosition={boxPosition}
            integrations={localProfile.integration_settings}
            isActive={deliveryDatePopupActive}
            selectedProject={selectedProject as FFProject}
            setProjects={(project) => updateLocalProject(project)}
            onClose={(project) => {
              setDeliveryDatePopupActive(false);
              project && updateLocalProject(project);
            }}
            onError={(message) =>
              popError(
                "An issue occurred updating the date.",
                message,
                "fail"
              )
            }
            onSave={() => popError("Project saved")}
          />

          <ProjectSortMenu
            options={orderOptions}
            primary={primarySort}
            secondary={secondarySort}
            setPrimary={(val) => updateSort(val, "primary_sort")}
            setSecondary={(val) => updateSort(val, "secondary_sort")}
            position={boxPosition}
            active={sortPopupActive}
            setActive={setSortPopupActive}
          />

          <SavedModal
            visible={errorPopup.visible}
            setVisible={() => {
              popError(undefined);
            }}
            header={errorPopup.header}
            body={errorPopup.body}
            state={errorPopup.state}
          />

          <FixedRow menuVisible={menuVisible}>
            <PageHeader
              text="Projects"
              icon="checkmark-done-sharp"
              menuVisible={true}
              inShrink={inShrink}
            />
            {!isMobileBrowser() && (
              <ProjectFilterMenu
                options={orderOptions}
                filter={filter}
                setFilter={updateFilter}
                projects={projects}
              />
            )}
            <div className="row m0 middle pr2">
              <button
                className="centerRow"
                style={{ width: 90, padding: "0 10px" }}
                onClick={(e) => handleSortClick(e)}
              >
                <IonIcon
                  name="layers"
                  size="large"
                  style={{
                    height: 20,
                    width: 20,
                    color: "var(--primaryColor)",
                  }}
                />
                <h3 style={{ marginLeft: 10 }}>Sort</h3>
              </button>
              <button
                style={{ width: 90 }}
                className="accentButton center"
                onClick={() => addProject()}
              >
                + New
              </button>
            </div>
          </FixedRow>

          {projects && projects?.length <= 0 ? (
            <div className="middleContainer">
              <IonIcon
                name="analytics"
                style={{
                  height: 200,
                  width: 200,
                  color: "var(--smallAccent)",
                }}
              />
              <p className="pb2">
                Looks like you haven't got any projects on the go!
              </p>
              <button
                className="accentButton m0"
                onClick={addProject}
              >
                <p className="m0">
                  Add a new project to get started!
                </p>
              </button>
              <p>or</p>
              <button onClick={() => getProjects(true)}>
                <p className="m0">
                  {allLoading ? (
                    <spinners.BeatLoader
                      size={8}
                      color="var(--primaryColor)"
                    />
                  ) : (
                    "View completed projects"
                  )}
                </p>
              </button>
            </div>
          ) : (
            <div>
              <ProjectsList
                projects={modifiedProjects}
                onStatusClick={handleStatusClick}
                onPriorityClick={handlePriorityClick}
                onShootClick={handleShootDateClick}
                onDeliveryClick={handleDeliveryDateClick}
              />
              <div className="centerRow">
                {allVisible ? (
                  <button
                    className="centerRow"
                    onClick={() => getProjects(false)}
                  >
                    <IonIcon name="eye" className="basicIcon mr1" />
                    <p className="m0">
                      {allLoading ? (
                        <spinners.BeatLoader
                          size={8}
                          color="var(--primaryColor)"
                        />
                      ) : (
                        "View current"
                      )}
                    </p>
                  </button>
                ) : (
                  <button
                    className="centerRow"
                    onClick={() => getProjects(true)}
                  >
                    <IonIcon name="eye" className="basicIcon mr1" />
                    <p className="m0">
                      {allLoading ? (
                        <spinners.BeatLoader
                          size={8}
                          color="var(--primaryColor)"
                        />
                      ) : (
                        "View finished projects"
                      )}
                    </p>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
