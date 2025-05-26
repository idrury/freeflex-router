import React from "react";
import { CUSTOM_CONTRACT_WORDS } from "../../assets/data";
import MoveableMenu from "../MoveableMenu";
import { MoveableOptions } from "../../assets/Types";
import IonIcon from "@reacticons/ionicons";

interface ContractInputsProps extends MoveableOptions {
  onWordClick: (word: string) => void;
  onClose: () => void;
}

export default function ContractInputs({
  onWordClick,
  active,
  x,
  y,
  onClose,
}: ContractInputsProps) {
  return (
    <MoveableMenu
      x={x}
      y={y}
      isActive={active}
      setIsActive={onClose}
      height={CUSTOM_CONTRACT_WORDS.length * 50 + 105}
      width={300}
      autoHide
    >
      <div className="col w100">
        <div className="centerRow p2 mt2 mb2 middle">
          <IonIcon name="shapes-sharp" className="basicIcon mr1" />
          <h3 className="m0">Dynamic property</h3>
        </div>
        {CUSTOM_CONTRACT_WORDS.map((word) => (
          <button
            key={word}
            className="centerRow middle m0 mb2 mr2 ml2"
            onClick={() => onWordClick(`{${word}}`)}
          >
            <IonIcon name="add-circle" className="basicIcon mr1" />
            <p className="m0">{`{${word}}`}</p>
          </button>
        ))}
      </div>
    </MoveableMenu>
  );
}
