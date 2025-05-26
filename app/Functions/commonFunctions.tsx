import React from "react";
import { FFProject } from "../assets/Types";
import { DateTime, Duration } from "luxon";
import { redirect } from "react-router";

/**********************************
 * Change to a different page
 * @param url The url to redirect to
 */
export function reRouteTo(url: string | undefined) {
  if (!url) return;

 return redirect(url);
}

/** *************************************
 * Go back one step in history
 */
export function reRouteToPrevious() {
  history.back();
}

export function parseInvoiceNumber(num?: string | null) {
  if (!num) return null;
  return parseFloat(num);
}

export function isMobileBrowser() {
  const userAgent =
    typeof window.navigator === "undefined"
      ? ""
      : navigator.userAgent;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

export function isPhoneBrowser() {
  const userAgent =
    typeof window.navigator === "undefined"
      ? ""
      : navigator.userAgent;
  return /iPhone|iPod|Android/i.test(userAgent);
}

export function copyToClipboard(
  e: React.MouseEvent<HTMLButtonElement>,
  val: string | undefined,
  type?: "email" | "phone"
) {
  e.preventDefault();
  e.stopPropagation();

  if (type == "email") window.location.href = `mailto:${val}`;
  else if (type == "phone") window.location.href = `tel:${val}`;

  if (val == null) {
    return;
  }
  // Copy text
  navigator.clipboard.writeText(val || "");
}

export function generatePlaceholderProject(): FFProject {
  return {
    id: 0,
    clients: {
      id: 0,
      created_at: new Date().toISOString(),
      nickname: "Johnny",
      email: "john-smith@gmail.com",
      name: "John Smith",
      phone: "2345 678 910",
      /*@ts-ignore*/
      user_id: "12345",
    },
    created_at: new Date().toISOString(),
    is_complete: false,
    name: "Test Project",
    next_due: undefined,
    notes: [],
    priority: 2,
    project_date: {
      start: DateTime.now()
        .plus(Duration.fromObject({ weeks: 1 }))
        .toJSDate(),
      end: DateTime.now()
        .plus(Duration.fromObject({ weeks: 2 }))
        .toJSDate(),
      include_time: false,
      gcal_id: undefined,
      acal_id: undefined,
    },
    status: "AWAITING RESPONSE",
    notes_delta: [],
    project_delivery_date: {
      date: DateTime.now()
        .plus(Duration.fromObject({ weeks: 3 }))
        .toJSDate(),
      include_time: true,
      gcal_id: undefined,
      acal_id: undefined,
    },
  };
}

export async function pause(delay: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
}
