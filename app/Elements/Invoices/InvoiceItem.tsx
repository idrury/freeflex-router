import React from "react";
import AddLine from "../AddLine";
import IonIcon from "@reacticons/ionicons";
import { InvoiceItemType } from "../../assets/Types";

type InvoiceItemProps = {
  disabled: boolean;
  item: InvoiceItemType;
  inShrink: boolean;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  pos: number;
  setSelectedPosition: (position: number) => void;
  addItem: (isDiscount: boolean, idx: number) => void;
  updateItem: (
    idx: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    attr: "quantity" | "unit_cost" | "description" | "discount_type"
  ) => void;
  removeItem: (idx: number) => void;
};

export default function InvoiceItem({
  disabled,
  item,
  inShrink,
  inputRefs,
  pos,
  setSelectedPosition,
  addItem,
  updateItem,
  removeItem,
}: InvoiceItemProps) {
  return (
    <div>
      <div className="ml1 mr1">
        <AddLine
          disabled={disabled}
          alwaysVisible={inShrink}
          onAdd={() =>
            addItem(item.discount_type ? true : false, pos)
          }
        />
      </div>
      <div
        className="leftRow dynamicRow middle boxed boxedOutline m1 "
        style={{ padding: "0px 10px 0px 10px" }}
      >
        <div className="leftRow fifty m0">
          <input
            name="description"
            disabled={disabled}
            ref={(el) => (inputRefs.current[pos] = el)} // Assign ref
            onFocus={() => setSelectedPosition(pos + 1)}
            className="hundred p0 noBorder"
            style={{margin: "10px 10px 10px 0"}}
            placeholder="none"
            type="text"
            value={item.description ?? ""}
            onChange={(v) => updateItem(pos, v, "description")}
          />
        </div>
        <div className="leftRow fifty m0 middle">
          {item.discount_type ? (
            <div id="discount" className="leftRow middle m0">
              <select
                name="discount type"
                disabled={disabled}
                onFocus={() => setSelectedPosition(pos + 1)}
                className="m1 p0"
                value={item.discount_type || ""}
                onChange={(v) => updateItem(pos, v, "discount_type")}
              >
                <option id="$">$</option>
                <option id="%">%</option>
              </select>
              <input
                name="discount unit cost"
                disabled={disabled}
                onFocus={() => setSelectedPosition(pos + 1)}
                type="number"
                className="p0 m0 noBorder"
                placeholder="0"
                value={item.unit_cost || ""}
                onChange={(v) => updateItem(pos, v, "unit_cost")}
              />
            </div>
          ) : (
            <div id="item" className="leftRow middle m0">
              <input
                name="quantity"
                disabled={disabled}
                onFocus={() => setSelectedPosition(pos + 1)}
                className="m0 p0 hundred noBorder"
                style={{ width: "90%" }}
                placeholder="0"
                type="number"
                value={item.quantity || ""}
                onChange={(v) => updateItem(pos, v, "quantity")}
              />
              <div className="middle">
                <label className="ml1">$</label>
                <input
                  name="item unit cost"
                  disabled={disabled}
                  onFocus={() => setSelectedPosition(pos + 1)}
                  className="m0 p0 hundred noBorder"
                  style={{ width: "90%" }}
                  placeholder="0"
                  type="number"
                  value={item.unit_cost || ""}
                  onChange={(v) => updateItem(pos, v, "unit_cost")}
                />
              </div>
            </div>
          )}

          <div id="total" className="leftRow middle fifty m0">
            <label
              className={`m1 boldLabel hundred ${
                (item.total && "boxedAccent ") || "boxed"
              }`}
            >
              ${item.total || 0}
            </label>
          </div>
        </div>
        {!disabled && (
          <div style={{ width: 32 }}>
            <IonIcon
              className="buttonIcon"
              onClick={() => removeItem(pos)}
              name="close-circle-outline"
              style={{
                width: 28,
                color: "var(--dangerColor)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
