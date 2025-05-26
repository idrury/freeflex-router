import type { FFError } from "../assets/Types";

/***************************
 * Attempt to reauthenticate a google session 
 * using a refresh token saved in DB
 * @param session The current session
 * @returns The fetched token
 */
export async function tryRefreshGoogleToken(
  refresh_token: string | undefined
):Promise<gapi.client.TokenObject | null> {
  let newToken:gapi.client.TokenObject | null = null;

  if (!refresh_token) throw { code: 0, message: "token not defined" };

  try {
    await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        /*@ts-ignore*/
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        /*@ts-ignore*/
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (data.error)
          throw {
            code: data.error.code,
            message: data.error.message,
          };
        else newToken = data;
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.log(error);
  }

  return newToken;
}
/***************************************
 * Fetch the user's google calendars
 * @param session The current supabase session
 * @returns The user's google calendars
 */
export async function fetchGoogleCalendars(
  access_token: string
): Promise<gapi.client.calendar.CalendarList | undefined> {
  let calendarData: gapi.client.calendar.CalendarList | undefined;

  await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      method: "get",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if(data.error) throw { code: data.error.code, message: "MSG"+data.error.message };
      calendarData = data;
    })
    .catch((e) => {
      throw e;
    });

  return calendarData;
}

/*****************************************
 * Add a new event to users google calendar
 * @param event The event object to create
 * @param session The current supabase session
 * @returns The created event object
 */
export async function createCalendarEvent(
  event,
  accessToken:string,
  calendarId: string = "primary"
): Promise<gapi.client.calendar.Event | undefined> {
  let calendarEvent: gapi.client.calendar.Event | undefined;

  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: "post",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if(data.error) throw { code: data.error.code, message: data.error.message };
      calendarEvent = data;
    })
    .catch((e) => {
      throw e;
    });

  return calendarEvent;
}

/***************************************
 * Update an existing event in the user's google calendar
 * @param eventDetails The event object to update
 * @param session The current supabase session
 * @param eventId The id of the event to update
 * @param calendarId The id of the calendar to update the event in
 * @returns THe updated event object if successful
 */
export async function updateCalendarEvent(
  eventDetails,
  accessToken:string,
  eventId: string,
  calendarId: string = "primary"
): Promise<gapi.client.calendar.Event | undefined> {
  let calendarEvent: gapi.client.calendar.Event | undefined;

  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: "put",
      headers: {
        Authorization: "Bearer " +  accessToken,
      },
      body: JSON.stringify(eventDetails),
    }
  )
    .then((data) => {
      return data?.json();
    })
    .then((data) => {
      if (data?.error)
        throw { code: data.error.code, message: data.error.message };
      calendarEvent = data;
    })
    .catch((e) => {
      throw e;
    });

  return calendarEvent;
}

/************************
 * DELETE an event from the users calendar
 * @param accessToken The google access token
 * @param eventId The id of the calendar event to delete
 * @param calendarId The id of the calendar to delete
 * @returns
 */
export async function deleteCalendarEvent(
  accessToken:string,
  eventId: string,
  calendarId: string = "primary"
): Promise<boolean | FFError> {
  const error: FFError | null = null;
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: "delete",
      headers: {
        Authorization: "Bearer " +  accessToken,
      },
    }
  )
    .then((data) => {
      return data;
    })
    .then((data) => {
      /*@ts-ignore */
      if (data?.error)
        /*@ts-ignore */
        throw { code: data.error.code, message: data.error.message };
    })
    .catch((e) => {
      throw e;
    });

  return true;
}
