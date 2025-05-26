import { DateTime, Interval } from "luxon";
import { orderOptions, statusOptionsOrder } from "./DATA";
import { FFClient, FFProject } from "../../assets/Types";
import { parseString } from "../CsvImport/ImportBL";

/************************************
 * Sort the projects by the specified params
 * @param newProjects The list of projects to sort
 * @param sort The category to sort by
 * @returns The sorted list of projects
 */
export function sortProjects(newProjects: FFProject[], sort) {
  if (sort == orderOptions[1]) {
    newProjects.sort((a, b) => b.priority - a.priority);
  } else if (sort == orderOptions[0]) {
    newProjects.sort((a, b) => {
      return (
        statusOptionsOrder.indexOf(a.status) -
        statusOptionsOrder.indexOf(b.status)
      );
    });
  } else if (sort == orderOptions[2]) {
    newProjects.sort((a, b) => {
      let date1 = a.project_date.start
        ? DateTime.fromJSDate(new Date(a.project_date.start || null))
        : DateTime.fromFormat("1/1/2050", "d/M/yyyy");
      let date2 = b.project_date.start
        ? DateTime.fromJSDate(new Date(b.project_date.start || null))
        : DateTime.fromFormat("1/1/2050", "d/M/yyyy");
      return date1.diff(date2).as("seconds");
    });
  } else if (sort == orderOptions[3]) {
    newProjects.sort((a, b) => {
      let date1 = a.project_delivery_date.date
        ? DateTime.fromJSDate(new Date(a.project_delivery_date.date))
        : DateTime.fromFormat("1/1/2050", "d/M/yyyy");
      let date2 = b.project_delivery_date.date
        ? DateTime.fromJSDate(new Date(b.project_delivery_date.date))
        : DateTime.fromFormat("1/1/2050", "d/M/yyyy");
      return date1.diff(date2).as("seconds");
    });
  }

  return newProjects;
}

/********************************************
 * Filter projects in the projects list by category or value
 * @param _projects the projects list to filter
 * @param cat The category to filter
 * @param val The value to filter of the category
 * @returns the list of projects which match the specified criteria
 */
export function filterProjects(
  _projects: FFProject[],
  cat: string,
  val: number | string | Interval
) {
  if (!_projects || !val) {
    return null;
  }

  let newProjects = _projects;

  switch (cat) {
    case "status":
      newProjects = _projects.filter((p) => {
        return p.status == val;
      });
      break;
    case "name":
      newProjects = _projects.filter((p) => {
        if (
          p.name
            ?.toLocaleLowerCase()
            .includes(parseString(val).toLowerCase()) ||
          (p.clients as FFClient)?.name
            ?.toLocaleLowerCase()
            .includes(parseString(val).toLowerCase()) || 
             (p.clients as FFClient)?.nickname
            ?.toLocaleLowerCase()
            .includes(parseString(val).toLowerCase())
        ) return true;
      });
      break;
    case "priority":
      newProjects = _projects.filter((p) => {
        return p.priority == val;
      });
      break;
    case "start date":
      if ((val as Interval).isValid) {
        newProjects = _projects.filter((p) => {
          return (val as Interval).contains(
            DateTime.fromJSDate(
              new Date(p.project_date.start || new Date(""))
            ).set({ hour: 1 })
          );
        });
      }
      break;
    case "delivery date":
      if ((val as Interval).isValid) {
        newProjects = _projects.filter((p) => {
          return (val as Interval).contains(
            DateTime.fromJSDate(
              new Date(p.project_delivery_date.date || new Date(""))
            ).set({ hour: 1 })
          );
        });
      }
      break;
  }

  return newProjects;
}

/**********************************
 * Returns true if the given date falls
 *  on the same date as the default date
 * @returns boolean
 */
export function isSameDay(
  date1: Date | null,
  date2: Date | null
): boolean {
  if (date1 == null || date2 == null) return true;
  return (
    Math.round(
      DateTime.fromJSDate(new Date(date1))
        .diff(DateTime.fromJSDate(new Date(date2)))
        .as("day")
    ) == 0
  );
}
