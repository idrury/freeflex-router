import React, {  useState } from "react";
import GoogleCalendarConnect from "../GoogleCalendar/GoogleCalendarConnect";
import { FFProfile, SavedModalType } from "../../assets/Types";
import SavedModal from "../SavedModal";
import IonIcon from "@reacticons/ionicons";

type IntegrationsProps = {
  profile: FFProfile;
};

export default function Integrations({ profile }: IntegrationsProps) {
  const [savedModal, setSavedModal] = useState<SavedModalType>();
  const usesGoogle = profile?.google_access_token;

  function popSavedModal(
    header: string,
    body?: string,
    state: "success" | "fail" = "success"
  ) {
    setSavedModal({
      visible: true,
      header: header,
      body: body,
      state: state,
    });
  }

  return (
    <div className="m1 ml2 pr2">
      <SavedModal
        visible={savedModal?.visible}
        header={savedModal?.header}
        body={savedModal?.body}
        state={savedModal?.state}
        setVisible={() =>
          setSavedModal({
            visible: false,
            header: undefined,
            body: undefined,
          })
        }
      />
      <div className="m2">
        <div className="leftRow middle m0 pt2 pb2">
          <IonIcon
            name="globe-sharp"
            className="basicIcon mr1"
            style={{ width: "20pt", height: "20pt" }}
          />
          <h2 className="textLeft m0">Integrations</h2>
        </div>
        <p className="m0 pt2 pb2">Extend the functionality of FreeFlex by integrating with apps you already use!</p>
        <p className="m1"></p>
        {usesGoogle ? (
          <GoogleCalendarConnect
            profile={profile}
            onSave={(msg) =>
              popSavedModal(
                "Integration settings updated!",
                msg,
                "success"
              )
            }
            onError={(msg) =>
              popSavedModal("An error occured", msg, "fail")
            }
          />
        ) : (
          <div className="m1 boxed boxedOutline leftRow middle">
            <IonIcon
              name="globe-outline"
              className="mr2"
              style={{ height: "100%", width: "20px" }}
            />
            <p>Apps you integrate with will show up here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
