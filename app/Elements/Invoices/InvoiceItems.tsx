import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import React from "react";
import { InvoiceItemType } from "../../assets/Types";
import AddLine from "../AddLine";
import {
  calculateInvoiceItemCost,
  calculateItemTotal,
  calculateUnitDiscount,
} from "./InvoiceBL";
import Toggle from "react-toggle";
import InvoiceItem from "./InvoiceItem";
import { getInitialCropFromCroppedAreaPixels } from "react-easy-crop";

type InvoiceItemsProps = {
  disabled;
  iItems: InvoiceItemType[];
  setI: (
    value: SetStateAction<InvoiceItemType[]>
  ) => void;
  setGst: (
    value: SetStateAction<boolean>
  ) => void;
  gst: { active: boolean; value: number };
  inShrink: boolean;
};

export default function invoiceItems({
  disabled,
  iItems,
  setI,
  setGst,
  gst,
  inShrink,
}: InvoiceItemsProps) {
  const [selectedPosition, setSelectedPosition] =
    useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [discountCount, setDiscountCount] =
    useState(0);
  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  useEffect(() => {
    loadItems();
  }, []);

  // Focus the input after the DOM updates
  useEffect(() => {
    if (
      selectedPosition >= 0 &&
      inputRefs.current[selectedPosition]
    )
      inputRefs.current[
        selectedPosition
      ]?.focus();
  }, [iItems.length]);

  /****************************
   * Build the invoice items array
   */
  function loadItems() {
    let iCount = 0;
    let dCount = 0;

    iItems.forEach((i) => {
      if (i.discount_type) dCount++;
      else iCount++;
    });

    setItemCount(iCount);
    setDiscountCount(dCount);
  }

  /***********************************
   * Add a new row to the item array
   */
  function addItem(
    isDiscount: boolean,
    pos: number
  ) {
    if (iItems?.length > 20) return;

    isDiscount
      ? setDiscountCount(discountCount + 1)
      : setItemCount(itemCount + 1);

    setI([
      ...iItems.slice(0, pos),
      {
        discount_type: isDiscount
          ? "$"
          : undefined,
        description: undefined,
        quantity: 0,
        unit_cost: 0,
        total: 0,
      },
      ...iItems.slice(pos),
    ]);

    setSelectedPosition(pos);
  }

  /*******************************
   * Remove a row from the item array
   * @param i The row to remove
   */
  function removeItem(i: number) {
    const newInvoiceItems = [...iItems];
    let deletedRow = newInvoiceItems.splice(i, 1);

    if (!deletedRow || deletedRow.length == 0)
      return;

    deletedRow[0]?.discount_type
      ? setDiscountCount(discountCount - 1)
      : setItemCount(itemCount - 1);
    updateDiscounts(newInvoiceItems);
    setI(newInvoiceItems);

    return;
  }

  /**************************************
   * Update the cost properties of an invoice item
   * @param index The position to update
   * @param v The value to update the attribute to
   * @param attr The attribute to update
   * @returns The updated item
   */
  function updateItem(
    index: number,
    v: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
    attr:
      | "quantity"
      | "unit_cost"
      | "discount_type"
      | "description"
  ) {
    const allItems = [...iItems];
    const value = v.target.value;

    if (index == -1) return allItems;

    /*@ts-ignore*/
    allItems[index][attr] =
      attr == "description" ||
      attr == "discount_type"
        ? value
        : parseFloat(value);

    if (attr != "description") {
      allItems[index] = calculateInvoiceItemCost(
        allItems[index]
      );
      updateDiscounts(allItems);
    }

    setI(allItems);
    return allItems[index];
  }

  /**********************************************
   * Update all discounts which are based on percentages
   * @param items The latest version of the Items array
   */
  function updateDiscounts(
    items: InvoiceItemType[]
  ) {
    const currentTotal =
      calculateItemTotal(items);

    items
      .filter((i) => i.discount_type == "%")
      ?.forEach(
        (item) =>
          (item.total = calculateUnitDiscount(
            currentTotal,
            item
          ))
      );
  }

  /**********************************
   * Submit the items form
   * @param f The form object
   * @param isDiscount Is it the discount section?
   */
  function onFormSubmit(
    f: FormEvent<HTMLFormElement>,
    isDiscount: boolean
  ) {
    f.preventDefault();
    addItem(isDiscount, selectedPosition);
  }

  return (
    <div className="fifty boxedOutline">
      <div className="ml2">
        <h3>Items</h3>
      </div>
      <div className="divider ml2 mr2" />
      <div className="leftRow hiddenOnShrink m2">
        <div className="fifty m0 p0">
          <label className="m0">
            Description
          </label>
        </div>
        <div className="row fifty m0 p0">
          <label className="m0">Quantity</label>
          <label className="m0">Unit cost</label>
          <label
            className="m0"
            style={{
              marginRight: `${
                disabled ? "10%" : "20%"
              }`,
            }}
          >
            Total
          </label>
        </div>
        <div>
          <label style={{ width: 1 }}></label>
        </div>
      </div>
      <form
        onSubmit={(f) => onFormSubmit(f, false)}
        id="item"
      >
        {iItems
          ?.filter((item) => !item.discount_type)
          .map((item, pos) => (
            <InvoiceItem
              key={pos}
              disabled={disabled}
              item={item}
              inShrink={inShrink}
              inputRefs={inputRefs}
              pos={pos}
              setSelectedPosition={
                setSelectedPosition
              }
              addItem={addItem}
              updateItem={updateItem}
              removeItem={() => removeItem(pos)}
            />
          ))}
        <div className="ml1 mr1">
          <AddLine
            disabled={disabled}
            onAdd={() =>
              addItem(false, itemCount)
            }
            alwaysVisible
          />
        </div>
        <button hidden type="submit"></button>
      </form>

      <div style={{ marginTop: 30 }} />

      <div className="ml2">
        <h3>Discounts</h3>
      </div>
      <div className="divider ml2 mr2 " />
      <form
        onSubmit={(f) => onFormSubmit(f, true)}
      >
        {iItems
          ?.filter((item) => item.discount_type)
          .map((discount, pos) => (
            <InvoiceItem
              key={itemCount + pos}
              pos={itemCount + pos}
              disabled={disabled}
              item={discount}
              inShrink={inShrink}
              inputRefs={inputRefs}
              setSelectedPosition={
                setSelectedPosition
              }
              addItem={addItem}
              updateItem={updateItem}
              removeItem={(idx) =>
                removeItem(idx)
              }
            />
          ))}
        <div className="ml1 mr1">
          <AddLine
            disabled={disabled}
            onAdd={() =>
              addItem(
                true,
                itemCount + discountCount
              )
            }
            alwaysVisible
          />
        </div>
        <button hidden type="submit"></button>
      </form>

      <div style={{ marginTop: 30 }} />

      <div className="row-no-shrink m0 middle">
        <div className="leftRow fifty m1 pr2">
          <input
            disabled
            className="hundred m1 boxedDark"
            placeholder="description"
            type="text"
            value={"Include GST"}
          />
        </div>
        <div className="middle m0 mr1">
          {/*@ts-ignore*/}
          <Toggle
            disabled={disabled}
            name="schemeToggle"
            id="schemeToggle"
            defaultChecked={gst.active}
            onChange={(e) =>
              setGst(e.target.checked)
            }
            icons={false}
          />
        </div>
      </div>
    </div>
  );
}
