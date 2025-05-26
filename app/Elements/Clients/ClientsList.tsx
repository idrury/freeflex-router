import { useState } from "react";
import IonIcon from "@reacticons/ionicons";
import React from "react";
import ScreenTip from "../ScreenTip";
import splitString from "../../Functions/StringSplitter";
import { ToolTip } from "../../assets/Types";
import { clientOptions } from "../Projects/DATA";

/**
 * Displays the clients in list form
 */
export default function ClientsList({
  clients,
  onClick,
  clientSearch,
}) {
  const [screenTip, setScreenTip] = useState<ToolTip>({
    value: undefined,
    x: 0,
    y: 0,
  });

  function copyToClipboard(e, val, type) {
    e.preventDefault();
    e.stopPropagation();

    if (type == "email") window.location.href = `mailto:${val}`;
    else if (type == "phone") window.location.href = `tel:${val}`;

    if (val == null) {
      return;
    }
    // Copy text
    navigator.clipboard.writeText(val || "");

    // Show copy result in screen tip
    setScreenTip({
      value: "Copied!",
      x: screenTip.x,
      y: screenTip.y,
    });
  }

  function showScreenTip(e, text) {
    setScreenTip({ value: text, x: e.clientX, y: e.clientY });
  }

  function hideScreenTip() {
    setScreenTip({ value: undefined, x: 0, y: 0 });
  }

  return (
    <div style={{ marginRight: 40 }}>
      <ScreenTip props={screenTip} />
      <div className="hundred">
        {clients?.length > 0 ? (
          clients.map((client) => (
            <div
              key={client.id}
              className="projectRow hundred leftRow p2 mediumFade boxedOutline"
              onClick={(e) => onClick(client.id)}
            >
              <div className="leftRow fifty m0 p0">
                <div
                  className="leftRow middle m0"
                  style={{ width: "60%" }}
                >
                  <IonIcon
                    name={clientOptions.legalName.icon}
                    style={{ width: 20, height: 20 }}
                    className="pr2 m0"
                  />
                  <h3
                    className="m0"
                    style={{ overflowWrap: "break-word" }}
                  >
                    {client.name}
                  </h3>
                </div>
                <div
                  className="leftRow middle"
                  style={{ width: "40%" }}
                >
                  <IonIcon
                    name={clientOptions.nickname.icon}
                    style={{ width: 20, height: 20 }}
                    className="pr2"
                  />
                  <p
                    className="m0"
                    style={{ overflowWrap: "break-word" }}
                  >
                    {client.nickname || "-"}
                  </p>
                </div>
              </div>
              <div className="leftRow fifty m0 p0">
                <div
                  className="leftRow middle m0"
                  style={{ width: "60%" }}
                >
                  <IonIcon
                    name={clientOptions.email.icon}
                    style={{ width: 20, height: 20 }}
                    className="pr2"
                  />
                  {client.email ? (
                    <div>
                      <button
                        onMouseLeave={hideScreenTip}
                        onMouseOver={(e) =>
                          showScreenTip(e, "Email client")
                        }
                        onClick={(e) =>
                          copyToClipboard(e, client.email, "email")
                        }
                        className="m0"
                        style={{
                          overflowWrap: "break-word",
                          fontFamily: "Inter",
                        }}
                      >
                        {client.email}
                      </button>
                    </div>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div
                  className="leftRow middle m0"
                  style={{ width: "40%" }}
                >
                  <IonIcon
                    name={clientOptions.phone.icon}
                    style={{ width: 20, height: 20 }}
                    className="pr2"
                  />
                  {client.phone ? (
                    <button
                      onMouseLeave={hideScreenTip}
                      onClick={(e) =>
                        copyToClipboard(e, client.phone, "phone")
                      }
                      className="m0 textLeft"
                      style={{
                        overflowWrap: "break-word",
                        fontFamily: "Inter",
                      }}
                    >
                      {splitString(client.phone, [4, 3, 3]) || "-"}
                    </button>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="middleContainer middle center mediumFade">
            <IonIcon
              name="person-circle"
              style={{
                color: "var(--smallAccent)",
                height: 200,
                width: 200,
              }}
            />
            {clientSearch ? (
              <p>
                No clients are listed with the name or nickname '
                {clientSearch}'
              </p>
            ) : (
              <p>No clients created yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
