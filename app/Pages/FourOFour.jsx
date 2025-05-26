import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../Functions/commonFunctions";

export default function FourOFour() {
  return (
    <div className="centerContainer" style={{ minHeight: "100vh" }}>
      <div className="centerRow m2 p2">
        <img
          src="https://img.playbook.com/er7GlNhfNA8YuB-WPxcDZHSk7qAFLhNmk2yLebKjJpA/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2I5ZWIwNGY2/LTNhNmYtNDRjOC04/MDRjLThlZDlhNGVm/ZmE5Mw"
          width={200}
        />
      </div>
      <div className="middleContainer">
        <IonIcon
          name="close-circle"
          className="basicIcon"
          style={{
            height: 200,
            width: 200,
            color: "var(--dangerColor)",
          }}
        />

        <div className="w75 m2 middle center">
          <div className="hundred">
            <h1 style={{fontSize: "40pt", textTransform: "none"}} className="textCenter">What you're looking for ain't here!</h1>
            <h3 className="textCenter">
              Sorry! No pages exist at this url!
            </h3>

          <div style={{height: 20}}/>

            <div className="centerRow">
              <IonIcon
                onClick={() => reRouteTo("/home")}
                name="home"
                className="buttonIcon"
                style={{
                  height: 50,
                  width: 50,
                }}
              />
               <IonIcon
                onClick={() => reRouteTo("/help")}
                name="help-circle"
                className="buttonIcon"
                style={{
                  height: 60,
                  width: 60,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
