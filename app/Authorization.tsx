import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ErrorPopup from "./Elements/ErrorPopup";
import BasicMenu from "./Elements/BasicMenu";
import Landing from "./Pages/Landing";
import { reRouteTo } from "./Functions/commonFunctions";
import stopwatch from "react-timer-hook";
import { FREELANCEJOBS, QUOTES } from "./Functions/Data";
import IonIcon from "@reacticons/ionicons";
import { signInWithGoogle } from "./Functions/DBAccess";
import AuthHeaderBar from "./Elements/Auth/AuthHeaderBar";

export default function Authorization({}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);

  const [confirmationMenuActive, setConfirmationMenuActive] =
    useState(false);

  const [errorPopupActive, setErrorPopupActive] = useState(false);
  const [errorPopupText, setErrorPopupText] = useState(null);
  const [status, setStatus] = useState(getParamater("status"));
  const page = window.location.href.split("/")[3].split("?")[0];

  const [jobType, setJobType] = useState(FREELANCEJOBS[0]);
  const [currentJobPosition, setCurrentJobPosition] = useState(0);

  const [quoteCounter, setquoteCounter] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [width, setWidth] = useState(window.innerWidth);

  const totalSeconds = 1;
  // const {
  //   totalSeconds,
  //   seconds,
  //   minutes,
  //   hours,
  //   days,
  //   isRunning,
  //   start,
  //   pause,
  //   reset,
  // } = useStopwatch({ autoStart: true });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getParamater(param) {
    const params =
      window.location.href.split("/")[3].split("?")[1]?.split("&") ||
      null;
    let paramater = params?.find((par) => par.split("=")[0] == param);
    return paramater?.split("=")[1];
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      /*@ts-ignore*/
      showError(error.error_description || error.message);
    } else {
      setConfirmationMenuActive(true);
    }
    setLoading(false);
  };

  function showError(text) {
    setErrorPopupActive(true);
    setErrorPopupText(text);
  }

  // Update screen text
  if (totalSeconds > 1) {
    let currentPosition = currentJobPosition + 1;
    let quoteSecondCount = quoteCounter + 1;

    // Handle job title changing
    if (currentPosition >= FREELANCEJOBS.length) {
      currentPosition = 0;
    }
    setJobType(FREELANCEJOBS[currentPosition]);
    setCurrentJobPosition(currentPosition);

    // Handle businesses changing
    if (quoteSecondCount > 3) {
      let quoteIndex = currentQuoteIndex + 1;

      if (quoteIndex >= QUOTES.length) {
        quoteIndex = 0;
      }
      setCurrentQuote(QUOTES[quoteIndex]);
      setCurrentQuoteIndex(quoteIndex);
      setquoteCounter(0);
    } else {
      setquoteCounter(quoteSecondCount);
    }

    reset();
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Failed to sign in");
    }
  }

  if (page == "login") {
    return (
      <div className="centerContainer m0 p0">
        <div className="leftRow dynamicRow mediumFade m0 p0 middle">
          <ErrorPopup
            active={errorPopupActive}
            text={errorPopupText}
            setActive={setErrorPopupActive}
          />
          <BasicMenu
            isActive={confirmationMenuActive}
            setIsActive={setConfirmationMenuActive}
            width={400}
          >
            <div className="col middle center m2">
              <IonIcon name="paper-plane" style={{width: 100, height: 100}}/>
              <h2>EMAIL SENT!</h2>
              <p style={{ textAlign: "center" }}>
                Check your inbox for the login link!
              </p>
                <button className="accentButton w100 centerRow">
                  <IonIcon  name="arrow-back" className="basicIcon mr1"/> 
                  <p className="m0">Back</p>
                </button>
              <br />
            </div>
          </BasicMenu>
          <div
            className="boxedDark boxedOutline m0 fifty"
            style={{ height: "100%", minHeight: "100vh" }}
          >
            <div className="p3">
              <div className="leftRow">
                <img
                  onClick={() => reRouteTo("/")}
                  className="leftRow"
                  style={{
                    width: "50%",
                    margin: "0 0 70px 0",
                    cursor: "pointer",
                  }}
                  src="https://img.playbook.com/er7GlNhfNA8YuB-WPxcDZHSk7qAFLhNmk2yLebKjJpA/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2I5ZWIwNGY2/LTNhNmYtNDRjOC04/MDRjLThlZDlhNGVm/ZmE5Mw"
                  alt="Freeflex logo on freeflex.com.au"
                />
              </div>
              <br />
              <h1>
                {status == "login" ? "Welcome back!" : "Welcome!"}
              </h1>
              <div className="m2 pr2">
                <button
                  className="centerRow middle hundred"
                  onClick={() => handleGoogleSignIn()}
                >
                  <IonIcon
                    name="logo-google"
                    className="smallIcon mr2"
                  />
                  <p className="m0">Sign in with google</p>
                </button>
              </div>
              <form className="form-widget" onSubmit={handleLogin}>
                <div className="m2 pr2">
                  <label className="m2 ">
                    {status == "login"
                      ? "Login in with email"
                      : "Sign up with email"}
                  </label>
                  <div className="m2">
                    <input
                      className="p2"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      required={true}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {status == "register" && (
                    <div className="leftRow middle">
                      <input
                        type="checkbox"
                        className=""
                        checked={emailUpdates}
                        onChange={(e) =>
                          setEmailUpdates(e.target.checked)
                        }
                        style={{ width: 20, height: 20 }}
                      />
                      <label>
                        I consent to recieving occasional emails about
                        updates to FreeFlex
                      </label>
                    </div>
                  )}
                  <button
                    className="accentButton hundred"
                    disabled={loading}
                  >
                    {loading ? (
                      <spinners.BeatLoader color="#111111" size={10} />
                    ) : (
                      <span className="centerRow middle">
                         <IonIcon
                        name="mail-open-sharp"
                        className="basicIcon mr2"
                      />
                        Email link
                        </span>
                    )}
                  </button>
                </div>
                <div className="leftRow"></div>
              </form>
            </div>
          </div>
          <div className="" />
          <div className="m2 hundred hiddenOnShrink">
            <div className="centerRow">
              <img
                className="thirty"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
                src="https://img.playbook.com/er7GlNhfNA8YuB-WPxcDZHSk7qAFLhNmk2yLebKjJpA/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2I5ZWIwNGY2/LTNhNmYtNDRjOC04/MDRjLThlZDlhNGVm/ZmE5Mw"
                alt="Freeflex logo on freeflex.com.au"
              />
            </div>
            <div
              style={{
                fontWeight: 300,
                fontSize: 30,
                margin: "20px 20%",
              }}
            >
              <span
                style={{
                  lineHeight: 1.3,
                  width: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "block",
                }}
              >
                <span>Helping Aussie</span>
                <span
                  style={{
                    backgroundColor: "#ebc273",
                    borderRadius: 5,
                    padding: "2px 5px 2px 5px",
                    margin: 5,
                    color: "var(--background)",
                    fontWeight: 700,
                    boxShadow: "0 0 20px #ebc27344",
                  }}
                >
                  {jobType}
                </span>
                <span>
                  run more effective businesses by streamlining your
                  admin.
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div>
        <AuthHeaderBar width={width} />
        <Landing width={width} currentJob={jobType} />
      </div>
    );
  }
}
