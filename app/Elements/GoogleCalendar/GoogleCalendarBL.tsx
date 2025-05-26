import {
  createCalendarEvent,
  deleteCalendarEvent,
  fetchGoogleCalendars,
  tryRefreshGoogleToken,
  updateCalendarEvent,
} from "../../Functions/GoogleCalendarAccess";
import {
  insertError,
  updateProfileAttribute,
} from "../../Functions/DBAccess";
// import { DateTime, Duration } from "luxon";
// import type {
//   FFAccessToken,
//   FFProfile,
//   FFProjectDate,
// } from "../../assets/Types";
// import { decryptRefreshToken } from "../Auth/AuthBL";

/*********************************************
 * Refresh a session in google and update the users
 * profile in the database with the new session token
 * @param profile The profile of the current user
 * @return The new access token
 * @throws Error if the refresh token is invalid
 */
export async function refreshGoogleSession(
  profile: FFProfile
): Promise<FFAccessToken | null> {
  let newToken: gapi.client.TokenObject | null = null;
  try {
    if (!profile.provider_refresh_token)
      throw { code: 0, message: "refresh token was null" };

    const decrypted_refresh_token = await decryptRefreshToken(
      profile.provider_refresh_token
    );

    // Get a new token from google
    newToken = await tryRefreshGoogleToken(decrypted_refresh_token);

    if (!newToken)
      throw { code: 0, message: "Failed to refresh token" };

    // Convert the token to database form
    const newFFToken: FFAccessToken = {
      token_id: newToken.access_token,
      scope: newToken.scope,
      expiry_date: DateTime.now()
        .plus(Duration.fromObject({ seconds: newToken.expires_in }))
        .toJSDate(),
    };

    // Update the token value in the user's profile
    await updateProfileAttribute(
      profile.id,
      "google_access_token",
      newFFToken
    );

    return newFFToken;
  } catch (error) {
    await insertError(error, "tryRefreshGoogleSession", profile);
  }
  return null;
}

/****************************************************
 * Updates an event in user's google calendar if an ID is provided,
 * otherwise creates a new event
 * @param profile The current supabase profile
 * @param summary The event name
 * @param description The event description
 * @param date The ProjectDate
 * @param eventId The id of the event to update (if applicable)
 * @param calendarId The id of the calendar to add the event to
 * @returns The newly created or updated event object
 */
export async function handleAddGoogleCalendarEvent(
  profile: FFProfile,
  summary: string,
  description: string,
  date: FFProjectDate,
  eventId?: string | null,
  calendarId: string = "primary"
): Promise<gapi.client.calendar.Event | undefined> {
  if (!profile.google_access_token) return;

  // Delete the event if no start date is given
  if (eventId && !date.start) {
    try {
      await deleteCalendarEvent(
        profile.google_access_token?.token_id,
        eventId,
        calendarId
      );
      return;
    } catch (error) {
      if (error?.code == 401) {
        await refreshGoogleSession(profile);
        error.message =
          "Could not connect to google. Refresh the page and try again!";
      }
      await insertError(
        error?.message || "unknown error",
        "handleCreateCalendarEvent::DELETE",
        {}
      );
      throw error;
    }
  } else if (!eventId && !date.start) {
    throw { code: 1, message: "No date was given" };
  }

  // Re-do this check to stop typescript being annoying
  if (!date.start) return;

  const eventStart = {
    date:
      date.include_time == true
        ? undefined
        : DateTime.fromJSDate(new Date(date.start)).toFormat(
            "yyyy-MM-dd"
          ),
    dateTime:
      date.include_time == true
        ? new Date(date.start).toISOString()
        : undefined,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get timezone
  };

  const eventEnd = {
    date:
      date.include_time == true
        ? undefined
        : DateTime.fromJSDate(
            date.end
              ? DateTime.fromJSDate(new Date(date.end))
                  .toJSDate()
              : new Date(date.start)
          ).toFormat("yyyy-MM-dd"),
    dateTime:
      date.include_time == true
        ? DateTime.fromJSDate(
            date.end
              ? DateTime.fromJSDate(new Date(date.end))
                  .toJSDate()
              : new Date(date.start)
          ).toISO() || undefined
        : undefined,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get timezone
  };

  // Build the calendar event object
  /*@ts-ignore*/
  const calendarEvent: gapi.client.calendar.Event = {
    summary,
    description,
    start: eventStart,
    end: eventEnd,
    source: { title: "FreeFlex", url: "https://freeflex.com.au" },
  };

  try {
    if (!eventId)
      return await createCalendarEvent(
        calendarEvent,
        profile.google_access_token.token_id,
        calendarId
      );
    else
      return await updateCalendarEvent(
        calendarEvent,
        profile.google_access_token.token_id,
        eventId,
        calendarId
      );
  } catch (error) {
    /* 404 error means the event doesn't exist, 
    so we try inserting instead of deleting */
    if (error?.code == 404) {
      try {
        return await createCalendarEvent(
          calendarEvent,
          profile.google_access_token.token_id,
          calendarId
        );
      } catch (error) {}
    }
    if (error?.code == 401) {
      await refreshGoogleSession(profile);
      error.message =
        "Could not connect to google. Refresh the page and try again!";
    }
    await insertError(
      error?.message || "unknown error",
      "handleCreateCalendarEvent",
      calendarEvent
    );
    throw error;
  }
}

/*************************************************
 * Add an event which is only on one day to google calendar
 * @param profile The current user profile
 * @param summary The event name
 * @param description The event description
 * @param date The date of the event
 * @param includeTime Whether a timestamp is included in the event
 * @param eventId The eventID to update (or null)
 * @returns The newly created or updated event object
 */
export async function AddGoogleCalendarSingleDayEvent(
  profile: FFProfile | undefined,
  summary: string,
  description: string,
  date: Date | null,
  includeTime: boolean,

  eventId?: string,
  calendarId?: string
) {
  if (!profile || !profile.google_access_token) return;
  // Delete the event if no start date is given
  if (eventId && !date) {
    try {
      await deleteCalendarEvent(
        profile.google_access_token.token_id,
        eventId,
        calendarId
      );
      return;
    } catch (error) {
      if (error?.code == 401) {
        await refreshGoogleSession(profile);
        error.message =
          "Could not connect to google. Refresh the page and try again!";
      }
      await insertError(
        error?.message || "unknown error",
        "handleCreateCalendarEvent::DELETE",
        {}
      );
      throw error;
    }
  } else if (!eventId && !date) {
    throw { code: 0, message: "No date was given" };
  }

  if (!date) return;

  const eventDate = {
    [`${includeTime ? "dateTime" : "date"}`]: includeTime
      ? new Date(date).toISOString()
      : DateTime.fromJSDate(new Date(date)).toFormat("yyyy-MM-dd"),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get timezone
  };

  // Build the calendar event object
  /*@ts-ignore*/
  const calendarEvent: gapi.client.calendar.Event = {
    summary,
    description,
    start: eventDate,
    end: eventDate,
    source: { title: "FreeFlex", url: "https://freeflex.com.au" },
  };

  try {
    if (!eventId)
      return await createCalendarEvent(
        calendarEvent,
        profile.google_access_token.token_id,
        calendarId
      );
    else
      return await updateCalendarEvent(
        calendarEvent,
        profile.google_access_token.token_id,
        eventId,
        calendarId
      );
  } catch (error) {
    /* 404 error means the event doesn't exist, 
    so we try inserting instead of deleting */
    if (error?.code == 404) {
      try {
        return await createCalendarEvent(
          calendarEvent,
          profile.google_access_token.token_id,
          calendarId
        );
      } catch (error) {}
    }
    if (error?.code == 401) {
      await refreshGoogleSession(profile);
      error.message =
        "Could not connect to google. Refresh the page and try again!";
    }
    await insertError(
      error?.message || "unknown error",
      "handleCreateCalendarEvent",
      calendarEvent
    );
    throw error;
  }
}

/*************************************
 * Return a date with time rounded to nearest 15 min interval
 * @param date The date to round
 */
export function getTimeToNearest15(date: Date): Date {
  let currentDate = DateTime.fromJSDate(new Date(date));

  return currentDate
    .set({
      minute: Math.round(currentDate.minute / 15) * 15,
    })
    .toJSDate();
}

/**
 * Fetch all of a user's google calendars
 * @param profile
 * @param forceError
 */
export async function getGoogleCalendars(
  profile: FFProfile,
  customToken?: string
): Promise<gapi.client.calendar.CalendarList | undefined> {
  try {
    if (!profile.google_access_token) return;

    // Get the users calendars
    return await fetchGoogleCalendars(
      customToken || profile.google_access_token.token_id
    );
  } catch (error) {

    // Refresh the session and retry if a 401 error occurs
    if (error.code == 401) {
      const newToken = await refreshGoogleSession(profile);
      if (newToken && !customToken) {
        try {
          return await getGoogleCalendars(profile, newToken.token_id);

          // Otherwise just throw an error
        } catch (error) {
          throw await insertError(
            error?.message || "unknown authorization error",
            "getGoogleCalendars",
            profile,
            customToken
          );
        }
      }
    }
    throw await insertError(
      error?.message || "unknown error",
      "getGoogleCalendars",
      profile,
      customToken
    );
  }
}

/**************************************
 * returns true if date1 is after date 2
 * @param date1
 * @param date2
 */
export function dateIsSameDayOrAfter(
  date1: Date,
  date2: Date
): boolean {
  const result =
    Math.round(
      DateTime.fromJSDate(new Date(date1))
        .diff(DateTime.fromJSDate(new Date(date2)))
        .as("days")
    ) >= 0;

  return result;
}
