import React, { act, useState } from "react";
import { FEATURE_25_4_22 } from "./FEATURE_DATA";
import NewFeatureSlide from "./NewFeatureSlide";
import BasicMenu from "../BasicMenu";
import IonIcon from "@reacticons/ionicons";

type FeatureModalProps = {
  featuresRead: boolean;
  onClose: () => void;
};

export default function NewFeatureModal({
  featuresRead,
  onClose,
}: FeatureModalProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = FEATURE_25_4_22;

  /*******************************
   * Go back to the prev feature
   */
  function decrease() {
    if (activeFeature <= 0) return;

    setActiveFeature(activeFeature - 1);
  }

  /*******************************
   * Go forward to the next feature
   */
  function increase() {
    if (activeFeature >= features.length - 1) {
      onClose();
    }

    setActiveFeature(activeFeature + 1);
  }

  return (
    <div>
      <BasicMenu
        isActive={featuresRead == true ? false : true}
        setIsActive={onClose}
        width={600}
        disableClickOff={true}
      >
        <h1 className="textCenter boxedAccent">
          What's new in FreeFlex?
        </h1>
        <NewFeatureSlide data={features.at(activeFeature)} />
        <div className="row">
          <button
            onClick={decrease}
            className="middle center accentButton ten"
          >
            <IonIcon name="arrow-back" />
          </button>
          <button onClick={onClose} className="hundred m2">
            Skip
          </button>
          <button
            onClick={increase}
            className="middle center accentButton ten"
          >
            <IonIcon name="arrow-forward" />
          </button>
        </div>
      </BasicMenu>
    </div>
  );
}
