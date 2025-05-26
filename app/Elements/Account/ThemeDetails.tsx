import React, { useState } from "react";
import Toggle from "react-toggle";
import { LIGHT_MODE_COLORS } from "../../assets/data";
import IonIcon from "@reacticons/ionicons";
import SavedModal from "../SavedModal";
import { SavedModalType } from "../../assets/Types";

export default function ThemeDetails({
  lightModeOn,
  setLightModeOn,
  setPrimaryColor,
}) {
  const [savedModal, setSavedModal] = useState<SavedModalType>({
    visible: false,
    header: undefined,
    body: undefined,
  });

  function updateColor(hex) {
    localStorage.setItem("accentColor", hex);
    setPrimaryColor(hex);
    updateSavedModal(true, "Primary color updated!", null);
  }

  function updateSavedModal(_visible, _header, _body) {
    setSavedModal({
      visible: _visible,
      header: _header,
      body: _body,
    });
  }

  return (
    <div className="ml1 mr1">
      <SavedModal
        visible={savedModal.visible}
        setVisible={(e) =>
          setSavedModal({
            visible: false,
            header: undefined,
            body: undefined,
          })
        }
        body={savedModal.body}
        header={savedModal.header}
      />

      <div className="leftRow middle">
        <IonIcon
          name="color-palette-sharp"
          className="basicIcon mr1"
          style={{ width: "20pt", height: "20pt" }}
        />
        <h2 className="textLeft">Theme</h2>
      </div>
      <p>Change the look and feel of your account.</p>

      <div style={{height: 20}}/>

      <div>
        <h3 className="m2">Color Scheme</h3>
        <div className="leftRow middle m0 p0">
          <label htmlFor="schemeToggle" className="">
            Dark
          </label>
          {/* @ts-ignore */}
          <Toggle
            name="schemeToggle"
            id="schemeToggle"
            defaultChecked={lightModeOn}
            onChange={(e) => setLightModeOn(e.target.checked)}
            icons={false}
          />
          <label htmlFor="schemeToggle">Light</label>
        </div>

        <h3 className="m2">Accent Color</h3>
        <div
          className="m2 center boxed"
          style={{ flexWrap: "wrap", width: 210 }}
        >
          {LIGHT_MODE_COLORS.map((col, id) => (
            <div
              className="m0 buttonIcon"
              key={id}
              onClick={() => updateColor(col.hex)}
            >
              <IonIcon
                name="square"
                size="large"
                style={{ color: col.hex, opacity: `${"inherit"}` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
