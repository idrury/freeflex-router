import React, { useState } from "react";
import DatePicker from "./DatePicker";
import IonIcon from "@reacticons/ionicons";

type AddDateModalProps = {
  date: Date;
  setDate: (Date: Date) => void;
  label?: string;
  disabled?: boolean;
  onClose?: () => void;
  active?: boolean;
};

export default function AddDateModal({
  date,
  setDate,
  label = "",
  disabled = false,
  onClose,
  active,
}: AddDateModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {active==undefined && (
        <button
          disabled={disabled}
          className="m0 hundred"
          onClick={() => setOpen(true)}
        >
          {label}
        </button>
      )}
      <div>
        {(open || active) && (
          <div className="dateModal boxedOutline">
            <div className="centerRow">
              <IonIcon name="calendar" className="mr2" style={{width: 23, height: 23}} />
              <h2>{label}</h2>
            </div>
            <div>
              <DatePicker
                currentDate={date}
                setCurrentDate={setDate}
                closeTrigger={() => {
                  setOpen(false);
                  onClose && onClose();
                }}
              />
              <div className="pr3">
                <button
                  className="hundred accentButton"
                  onClick={() => {
                    setOpen(false);
                    onClose && onClose();
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
