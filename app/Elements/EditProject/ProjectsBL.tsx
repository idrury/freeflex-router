import React from "react";
import { statusOptions, statusOptionsStyles } from "../Projects/DATA";
import { formatDatestring } from "../../Functions/Dates";
import { isSameDay } from "../Projects/ProjectsBL";
import { DateTime } from "luxon";
import { updateProjectAttribute } from "../../Functions/DBAccess";
import { FFDocument, FFProject } from "../../assets/Types";

export function priorityToWord(
  num: number,
  asString: boolean = false,
  asColor: boolean = false
) {
  let wordString = "none";
  let wordColor = "text";
  if (num == 1) {
    wordString = "LOW";
    wordColor = "var(--safeColor)";
  }
  if (num == 2) {
    wordString = "MED";
    wordColor = "var(--warningColor)";
  }
  if (num == 3) {
    wordString = "HIGH";
    wordColor = "var(--dangerColor)";
  }

  if (asString == true) {
    if (asColor == true) return wordColor;
    else return wordString;
  }
  return (
    <label className="boldLabel" style={{ color: wordColor }}>
      {wordString}
    </label>
  );
}

export function priorityToCSSButton(
  priority: number
): "dangerButton" | "safeButton" | "warningButton" | undefined {
  if (priority == 1) return "safeButton";
  else if (priority == 2) return "warningButton";
  else if (priority == 3) return "dangerButton";

  return undefined;
}

export function priorityToColor(
  priority: number
):
  | "var(--safeColor)"
  | "var(--warningColor)"
  | "var(--dangerColor)"
  | "var(--smallAccent)" {
  if (priority == 1) return "var(--safeColor)";
  else if (priority == 2) return "var(--warningColor)";
  else if (priority == 3) return "var(--dangerColor)";

  return "var(--smallAccent)";
}

export function priorityToIcon(
  priority: number | undefined
): "caret-up-sharp" | "caret-forward-sharp" | "caret-down-sharp" {
  if (priority == 1) return "caret-down-sharp";
  else if (priority == 2) return "caret-forward-sharp";
  else if (priority == 3) return "caret-up-sharp";

  return "caret-forward-sharp";
}

export function statusToColor(
  status: string | undefined,
  as: "color" | "icon" | "button" = "button"
): string {
  if (status == statusOptions.actionRequired)
    return (
      statusOptionsStyles.actionRequired[as] || "var(--smallAccent)"
    );
  if (status == statusOptions.awaitingPayment)
    return (
      statusOptionsStyles.awaitingPayment[as] || "var(--smallAccent)"
    );
  if (status == statusOptions.awaitingResponse)
    return (
      statusOptionsStyles.awaitingResponse[as] || "var(--smallAccent)"
    );
  if (status == statusOptions.readyToShoot)
    return (
      statusOptionsStyles.readyToShoot[as] || "var(--smallAccent)"
    );
  if (status == statusOptions.finished)
    return statusOptionsStyles.finished[as] || "var(--smallAccent)";
  else {
    if (as == "button") return "lightButton";
    if (as == "color") return "var(--mediumAccent)";
    if (as == "icon") return "accessibility";
  }
  return "";
}

export function statusToCSSButton(
  status: string | undefined
): "dangerButton" | "safeButton" | "warningButton" | "dark" {
  if (status == statusOptions.actionRequired) return "dangerButton";
  else if (
    status == statusOptions.awaitingPayment ||
    status == statusOptions.awaitingResponse
  )
    return "warningButton";
  else if (status == statusOptions.readyToShoot) return "safeButton";
  else return "dark";
}

export function getFormattedDateString(
  start?: Date | null,
  end?: Date | null
): string {
  if (!start) return "No date";
  start = new Date(start);
  if (end) end = new Date(end);

  return `${DateTime.fromJSDate(start).toFormat("d MMM")}${
    end && !isSameDay(start, end)
      ? " - ".concat(DateTime.fromJSDate(end).toFormat("d MMM"))
      : ""
  } (${DateTime.fromJSDate(new Date(start)).toRelativeCalendar()})`;
}

/*****************************************************
 * Add a document to a project
 * @param project The id of the project to add to
 * @param name The name of the document
 * @param url The url to the document
 * @returns The added document
 * @throws Error if the document could not be added
 */
export async function handleUpdateDocuments(
  project: FFProject,
  documents: FFDocument[]
):Promise<boolean> {
 
  try {
    await updateProjectAttribute(project.id, "documents",  documents);
    return true;
  } catch (error) {
    throw error;
  }
}
