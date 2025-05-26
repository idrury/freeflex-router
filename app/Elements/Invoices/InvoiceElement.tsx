import IonIcon from "@reacticons/ionicons";
import React from "react";
import { InvoiceAttribute } from "./Types";

type InvoiceElementProps = {
  disabled,
  label: string;
  onChange: (type: InvoiceAttribute, val: any) => void;
  value: any;
  element: InvoiceAttribute;
  isNumber?: boolean;
  description?: string;
};

export default function InvoiceElement({
  disabled,
  onChange,
  value,
  element,
  label,
  isNumber=false,
  description
}: InvoiceElementProps) {

  if(value!=null)
  return (
    <div className="mediumFade">
      <div className="leftRow middle m0 p0" style={{ marginTop: 10 }}>
        <label>{label}</label>
        <IonIcon
          className="buttonIcon"
          name="close"
          style={{ color: "var(--dangerColor)" }}
          onClick={() => onChange(element, null)}
        />
      </div>
      <div className="m2 pr3">
        {isNumber ? (
          <div className="row m0 p0 middle">
            <p className="m0 mr1">$</p>
            <input
            disabled={disabled}
              className="hundred"
              value={value || ""}
              type="number"
              placeholder={description || `Enter ${label}...`}
              onChange={(e) => onChange(element, e.target.value)}
            />
          </div>
        ) : (
          <textarea
          disabled={disabled}
            value={value || ""}
            placeholder={description || `Enter ${label}...`}
            onChange={(e) => onChange(element, e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
