import IonIcon from "@reacticons/ionicons";
import { useState } from "react";
import {
  updateBusinessLogo,
  updateUserProfile,
  uploadBusinessLogo,
} from "../../Functions/DBAccess";
import React from "react";
import { reRouteTo } from "../../Functions/commonFunctions";
import { ALWAYS_ACCESSIBLE_PAGES } from "../Help/MdData";

export default function OnBoard({ uid, setOnBoard }) {
  const [onBoardState, setOnBoardState] = useState(0);

  return (
    <div>
      {onBoardState == 0 && (
        <OnBoardProfile
          uid={uid}
          onComplete={() => {
            setOnBoard(false);
            reRouteTo("/Home");
          }}
        />
      )}
    </div>
  );
}

function OnBoardProfile({ uid, onComplete }) {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [allowEmail, setAllowEmail] = useState<boolean>(false);

  async function handleUpdateProfile(f) {
    f.preventDefault();

    try {
      await updateUserProfile(
        uid,
        firstName || null,
        lastName || null,
        allowEmail,
        false
      );
      onComplete();
    } catch (error) {
      console.log(error);
      alert(
        "Sorry! There was an issue updating your details. Try again later."
      );
    }
  }

  return (
    <form onSubmit={(f) => handleUpdateProfile(f)}>
      <div
        className="centerContainer middle m2"
        style={{ height: "90vh" }}
      >
        <img
          src="https://img.playbook.com/IR8ld9DMC6GajY155YEiPfyNabJU8k7bKFiOsk_t7sQ/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzU3NjdiOGQ0/LTgzMTQtNDliMC1h/OGYwLTNkMGI2YTVl/MTE3Zg"
          width={100}
        />
        <h2>Let's get you set up!</h2>

        <div className="thirty m2 pr3">
          <div className="leftRow m0">
            <div className="m2 pr3">
              <label className="">First Name</label>
              <input
                required
                value={firstName || ""}
                onChange={(e) => setFirstName(e.target.value)}
                className="m2"
              />
            </div>
            <div className="m2 pr3">
              <label>Last Name</label>
              <input
                required
                value={lastName || ""}
                onChange={(e) => setLastName(e.target.value)}
                className="m2"
              />
            </div>
          </div>

          <div className="leftRow m2 p2 middle">
            <input
              type="checkbox"
              checked={allowEmail}
              onChange={(e) => setAllowEmail(e.target.checked)}
              style={{
                height: 5,
                width: 5,
                marginRight: 10,
              }}
            />
            <label>
              I consent to recieving occasional emails from FreeFlex
              about product updates
            </label>
          </div>
          <div className="m2 p2">
            <label className="p0 m0">
              By registering, you agree to the FreeFlex{" "}
              <a
                className="p0"
                href={`/help/${
                  ALWAYS_ACCESSIBLE_PAGES.find((page) => page.id == 1)
                    ?.url
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>{" "}
              and{" "}
              <a
                className="p0"
                href={`/help/${
                  ALWAYS_ACCESSIBLE_PAGES.find((page) => page.id == 2)
                    ?.url
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                terms of service
              </a>
            </label>
          </div>
          <div className="m2">
            <button
              type="submit"
              className={`${
                firstName && lastName && "accentButton"
              } hundred centerRow`}
            >
              <p className="m0">Next</p>
              <IonIcon
                name="arrow-forward"
                style={{ marginLeft: 10 }}
              />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
