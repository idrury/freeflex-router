import React from "react";
import Modal from "../Modal";
import { Link } from "react-router-dom";
import IonIcon from "@reacticons/ionicons";

/**
 * Give user contract editing tips
 */
export default function HelpModal({ active, setActive }) {
  return (
    <Modal isActive={active} setActive={setActive}>
      <div className="hundred center">
        <div
          className="fifty boxed boxedOutline"
          style={{ marginTop: 100 }}
        >
          <div className="rightRow m0 p0">
            <button className="m0 middle">
              <IonIcon name="close" />
            </button>
          </div>
          <div style={{ margin: "0 20px 20px 20px" }}>
            <h3>Quick tips</h3>
            <li>
              You can copy in an existing contract, or start from
              scratch! (We should have some custom contract templates
              coming soon)
            </li>
            <li>Use the style bar to highlight text</li>
            <br />
            <h3>Usage</h3>
            <li>
              Press the download button in the PDF previewer to
              download the contract.
            </li>
            <li>
              Alternatively, you can attach a contract to a quote by
              selecting it from the 'Quotes' page.
            </li>
            <br />
            <h3>Other notes</h3>
            <p
              style={{
                fontWeight: "bold",
                margin: 0,
                lineHeight: "1.5em",
              }}
            >
              Please note that your contract may change slightly when
              it is converted to a pdf! You can preview the final
              contract by pressing the menu icon in the selection
              pane.
            </p>
            <br />
            <Link to={"/Feedback"}>
              <p className="m0">
                Please help us improve the program by sending through
                feedback!
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
