/*******************************************
 * Wrapper for date picker that does not include
 * a button
 */

import React from "react";
import DatePicker from "./DatePicker";

type DatePickerModalProps = {
    label?: string,
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onClose: () => any;
};
export default function DatePickerModal({
    label,
  currentDate,
  setCurrentDate,
  onClose,
}: DatePickerModalProps) {
  return (
    <div className="moveableMenuBackground">
        <div className="dateModal">
          {label && <h2>{label}</h2>}
          <div>
            <DatePicker
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              closeTrigger={onClose}
            />
            <div className="pr3">
              <button
                className="hundred accentButton"
                onClick={() => onClose()}
              >
                Done
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
