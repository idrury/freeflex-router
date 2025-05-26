import { useEffect, useState } from "react";
import Toggle from "react-toggle";
import {
  FFProfile,
  FFProfileIntegrations,
  ProfileAttribute,
} from "../../assets/Types";
import {
  signInWithGoogle,
  updateProfileAttribute,
} from "../../Functions/DBAccess";
import IonIcon from "@reacticons/ionicons";
import spinners from "react-spinners";
import { getGoogleCalendars } from "./GoogleCalendarBL";
import { maybeRefreshGoogleSession } from "../Auth/AuthBL";

type GoogleCalendarConnectProps = {
  profile: FFProfile;
  onSave: (msg?: string) => void;
  onError: (msg: string) => void;
};

export default function GoogleCalendarConnect({
  profile,
  onSave,
  onError,
}: GoogleCalendarConnectProps) {
  const [userCalendars, setUserCalendars] =
    useState<gapi.client.calendar.CalendarList>();
  const [loading, setLoading] = useState(true);
  const [localProfile, setLocalProfile] = useState(profile);

  useEffect(() => {
    onLoad();
  }, []);

  /*******************************************************
   * Perform page loading actions
   * @returns
   */
  async function onLoad() {
    setLoading(true);
    try {
      if (!localProfile)
        throw { code: 0, message: "Profile was not defined" };
      maybeRefreshGoogleSession(profile, 600);
      const calendars = await getGoogleCalendars(localProfile);
      if (calendars) setUserCalendars(calendars);
    } catch (error) {
      alert("An error occured fetching your integrations");
    }

    setLoading(false);
  }

  /*********************************************************
   * Update a profile attribute
   * @param attr The attribute to update
   * @param val The value to update it to
   */
  async function updateIntegrationSettings(
    val: FFProfileIntegrations
  ) {
    try {
      if (!localProfile) return;
      await updateProfileAttribute(
        localProfile.id,
        "integration_settings",
        val
      );
    } catch (error) {
      onError("Refresh the page and try again");
      return;
    }
    setLocalProfile({ ...localProfile, integration_settings: val });
    onSave();
  }

  /*************************
   * This does nothing
   * @returns
   */
  async function refresh() {
    throw "This does nothing";
  }

  if (userCalendars && userCalendars?.items.length <= 0)
    return (
      <div className="boxed boxedOutline hundred m0 mt2">
        <button onClick={() => refresh()}>Refresh session</button>
        <div className="leftRow middle">
          <IonIcon
            name="alert-circle"
            style={{
              width: 25,
              marginBottom: 10,
              color: "var(--dangerColor)",
            }}
          />
          <p className="m0 ml2">
            We couldn't connect to google. Refresh the page and try again!
          </p>
          <button onClick={() => signInWithGoogle()}>
            Sign in with google
          </button>
        </div>
      </div>
    );

  return (
    <div className="boxed boxedOutline hundred m0 mt2">
      <div className="leftRow middle m0 ml2">
        <IonIcon name="logo-google" />
        <h3 className="m2">Google calendar</h3>
      </div>
      {!loading && localProfile ? (
        <div className="mediumFade">
          <div className="leftRow middle">
            {/*@ts-ignore*/}
            <Toggle
              checked={
                localProfile.integration_settings.add_to_calendar ||
                false
              }
              id="AddEventsEnabled"
              onChange={(e) =>
                updateIntegrationSettings({
                  ...localProfile.integration_settings,
                  add_to_calendar: e.target.checked,
                })
              }
              icons={false}
            />
            <label htmlFor="AddEventsEnabled">
              Add project dates to google calendar
            </label>
          </div>
          <label htmlFor="selectCalendar">
            Calendar to add events to
          </label>
          <select
            onChange={(e) =>
              updateIntegrationSettings({
                ...localProfile.integration_settings,
                gcal_id: e.target.value,
              })
            }
            defaultValue={localProfile?.integration_settings.gcal_id}
            className="dark boxedOutline"
            id="selectCalendar"
          >
            {userCalendars &&
              userCalendars.items
                ?.filter(
                  (cal) =>
                    cal.accessRole == "owner" ||
                    cal.accessRole == "writer"
                )
                .map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </option>
                ))}
          </select>
        </div>
      ) : (
        <div className="m2">
          <spinners.HashLoader
            size={20}
            className="loader mediumFade"
            color="var(--primaryColor)"
          />
        </div>
      )}
    </div>
  );
}
