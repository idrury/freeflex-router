import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Authorization from "../Authorization";
import {
  fetchUserProfile,
  insertError
} from "../Functions/DBAccess";
import { Analytics } from "@vercel/analytics/react";
import OnBoard from "../Elements/OnBoarding/OnBoard";
import NewFeatureModal from "../Elements/NewFeatures/NewFeatureModal";
import supabaseTypes from "@supabase/supabase-js";
import type {
  FFProfile,
  popSavedModalFn,
  SavedModalType,
} from "../assets/Types";
import Footer from "../Elements/Footer";
import {
  changeDefaultColors,
  handleUserProfileUpdate,
  maybeRefreshGoogleSession,
  setAccentColor,
  setProviderAccessToken,
  setUserDefaults,
} from "../Elements/Auth/AuthBL";
import { setProviderRefreshToken } from "../Elements/Auth/AuthBL";
import SavedModal from "../Elements/SavedModal";
import AlwaysAccessiblePages from "../Elements/Help/AlwaysAccessiblePages";
import FixedRow from "../Elements/FixedRow";
import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../Functions/commonFunctions";


function App() {
  const shrinkSize = 1200;
  const [session, setSession] = useState<supabaseTypes.Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FFProfile>();
  const [width, setWidth] = useState(0);
  const [menuVisible, setMenuVisible] = useState(
    width < shrinkSize ? false : true
  );
  const [inShrinkState, setInShrinkState] = useState(
    width < shrinkSize ? false : true
  );
  const [onBoard, setOnBoard] = useState(false);
  const [lightModeOn, setLightModeOn] = useState(false);
  const [savedModal, setSavedModal] = useState<SavedModalType>({
    visible: false,
    header: undefined,
  });
  const [renderedPage, setRenderedPage] = useState<Document>();

  useEffect(() => {
    setRenderedPage(document);
    supabase.auth.onAuthStateChange((_event, session) => {
      if (_event == "SIGNED_IN") {
        setProviderRefreshToken(session);
        setProviderAccessToken(session);
      }

      if (_event != "SIGNED_OUT") {
        getProfile(session?.user?.id);
      }
      setSession(session);
    });

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  /*********************************************
   * Update the menu position and default colors
   * based on the current screen size
   */
  function updateViewState() {
    const isLight = localStorage.getItem("isLight");
    const accentHex = localStorage.getItem("accentColor");

    if (inShrinkState == false && width < shrinkSize) {
      setInShrinkState(true);
      changeMenuVisibility(false);
    } else if (inShrinkState == true && width >= shrinkSize) {
      setInShrinkState(false);
      changeMenuVisibility(true);
    }

    if (isLight == "true") changeColorMode(true);
    else changeColorMode(false);
    setAccentColor(accentHex);
  }

  /***********************************************
   * Change the visibility of the menu
   * @param setVis Should the menu be visible
   * @param forceClose Force the menu to be invisible
   */
  function changeMenuVisibility(setVis: boolean, forceClose = false) {
    if (setVis == true) {
      setMenuVisible(true);
    } else {
      if (inShrinkState == true || forceClose == true)
        setMenuVisible(false);
    }
  }

  /*********************************
   * Get the current users profile
   * @param id The id of the user profile to fetch
   * @param event the type of event
   */
  async function getProfile(id: string | undefined) {
    try {
      if (!id) throw { code: -1, message: "user id was null" };

      const profile = await fetchUserProfile(id);
      setProfile(profile);
      let localProfile = profile;

      if (!localProfile.first_name) setOnBoard(true);

      setUserDefaults(localProfile.role, renderedPage);
      maybeRefreshGoogleSession(localProfile, 600);
    } catch (error: any) {
      if (error.code != -1)
        await insertError(error.message, "app:getProfile", { id });
    }
    setLoading(false);
  }

  /***********************************
   * Set light or dark mode
   * @param checked true=light or false=dark
   */
  function changeColorMode(isLightMode: boolean) {
    changeDefaultColors(isLightMode, renderedPage);

    setLightModeOn(isLightMode);
  }

  /***********************************************
   * Update users profile settings after they read the
   * new feature dialogue
   */
  async function onNewFeaturesRead() {
    if (!profile) return;

    handleUserProfileUpdate(profile);
    setProfile({ ...profile, new_features_read: true });
  }

  const popSavedModal: popSavedModalFn = (
    header,
    body,
    isError = false
  ) => {
    setSavedModal({
      visible: true,
      header: header,
      body: body,
      state: isError ? "fail" : "success",
    });
  };
  return (
    <div
      data-theme={lightModeOn ? "light" : "dark"}
      style={{ minHeight: "100vh" }}
    >
      {loading ? (
        <div
          className="centerRow slowFade"
          style={{ height: "100vh" }}
        >
          <img
            src="https://img.playbook.com/IR8ld9DMC6GajY155YEiPfyNabJU8k7bKFiOsk_t7sQ/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzU3NjdiOGQ0/LTgzMTQtNDliMC1h/OGYwLTNkMGI2YTVl/MTE3Zg"
            width={200}
          />
        </div>
      ) : (
        <div className="slowFade">
          {!session ? (
            <Authorization />
          ) : onBoard == true ? (
            <OnBoard
              uid={session?.user?.id}
              setOnBoard={setOnBoard}
            />
          ) : (
            <div>
              <SavedModal
                visible={savedModal.visible}
                header={savedModal.header}
                body={savedModal.body}
                state={savedModal.state}
                setVisible={() =>
                  setSavedModal({
                    visible: false,
                    header: undefined,
                    body: undefined,
                  })
                }
              />
              {profile && (
                <div>
                  {!profile.default_settings
                    .business_details_exist && (
                    <FixedRow accent menuVisible={menuVisible}>
                      <div className="centerRow middle hundred" style={{marginLeft: `${menuVisible ? 300: 0}px`}}>
                        <h3>
                          You haven't added your business details yet!
                        </h3>
                        <button
                          onClick={() => reRouteTo("/account")}
                          className="centerRow middle accentButton"
                        >
                          <IonIcon
                            name="link-sharp"
                            className="basicIcon smallIcon mr2"
                          />
                          Add my details
                        </button>
                      </div>
                    </FixedRow>
                  )}
                  <NewFeatureModal
                    featuresRead={profile?.new_features_read}
                    onClose={() => onNewFeaturesRead()}
                  />
                  {/* <Index
                    popSavedModal={popSavedModal}
                    session={session}
                    profile={profile}
                    menuVisible={menuVisible}
                    setMenuVisible={changeMenuVisibility}
                    inShrinkState={inShrinkState}
                    lightModeOn={lightModeOn}
                    setLightModeOn={changeColorMode}
                    setPrimaryColor={setAccentColor}
                  /> */}
                </div>
              )}
            </div>
          )}
          <Analytics />
          <Footer menuVisible={session ? menuVisible : false} />
        </div>
      )}
    </div>
  );
}

export default App;
