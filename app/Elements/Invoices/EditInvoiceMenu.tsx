import React, { useState } from "react";
import { formatDatestring } from "../../Functions/Dates";
import InvoiceItems from "./InvoiceItems";
import { DateTime } from "luxon";
import {
  FFBusiness,
  FFClient,
  FFContract,
  FFInvoice,
  FFProject,
  MoveableOptions,
} from "../../assets/Types";
import {
  calculateDiscountTotal,
  calculateInclusiveTotal,
  calculateItemTotal,
} from "./InvoiceBL";
import InvoiceElements from "./InvoiceElements";
import { InvoiceAttribute } from "./Types";
import DatePickerModal from "../DatePickerModal";
import IonIcon from "@reacticons/ionicons";

type EditInvoiceMenuProps = {
  disabled: boolean;
  invoice: FFInvoice;
  showGst: boolean;
  invoiceNumber: string | undefined;
  inShrink: boolean;
  contracts: FFContract[] | undefined;
  selectedContract: FFContract | undefined;
  business: FFBusiness | undefined;
  setInvoiceItems: (value) => any;
  updateAttribute: (category: InvoiceAttribute, value: any) => any;
  navigateTo: (location: string, isValidated: boolean) => void;
};

/***********************************
 * Allows a user to edit the details of an invoice
 * @returns
 */
export default function EditInvoiceMenu({
  disabled,
  contracts,
  invoice,
  showGst,
  invoiceNumber,
  inShrink,
  business,
  selectedContract,
  updateAttribute,
  setInvoiceItems,
  navigateTo,
}: EditInvoiceMenuProps) {
  const [addElementMenuActive, setAddElementMenuActive] =
    useState(false);
  const [boxPosition, setBoxPosition] = useState<MoveableOptions>({
    active: false,
    x: 0,
    y: 0,
  });
  const [detailsVisible, setDetailsVisible] = useState(!inShrink);
  const [datePickerProps, setDatePickerProps] = useState<{
    active: boolean;
    attribute: InvoiceAttribute;
  }>({ active: false, attribute: "date" });

  function activateAddMenu(e) {
    e.stopPropagation();
    setBoxPosition({ active: false, x: e.clientX, y: e.clientY });
    setAddElementMenuActive(true);
  }

  return (
    <div className="dynamicSize m0 hundred" style={{ marginTop: 10 }}>
      {datePickerProps.active && (
        <DatePickerModal
          currentDate={invoice.date}
          setCurrentDate={(d) =>
            updateAttribute(datePickerProps.attribute, d)
          }
          onClose={() =>
            setDatePickerProps({
              active: false,
              attribute: "date",
            })
          }
        />
      )}
      <div className="row boxed sticky m0" style={{ top: 90, zIndex: 10 }}>
        <div className="hundred">
          <h2 className="textLeft">
            {invoice.isInvoice ? "Invoice" : "Quote"}
            {invoice.isInvoice && ` | ${invoiceNumber}`}
          </h2>
          <div className="leftRow m1">
            <h3 className="m0 p0" style={{ fontSize: "0.85em" }}>
              Project
            </h3>
            <p className="m0 p0 ml1">
              {(invoice.projects as FFProject).name || ""}
            </p>
          </div>
          {!inShrink && (
            <div>
              {((invoice.projects as FFProject).clients as FFClient)
                ?.name && (
                <div className="leftRow m1">
                  <h3
                    className="p0 m0"
                    style={{ fontSize: "0.85em" }}
                  >
                    Client
                  </h3>
                  <p className="m0 ml1 p0">
                    {
                      (
                        (invoice.projects as FFProject)
                          .clients as FFClient
                      )?.name
                    }
                  </p>
                </div>
              )}

              {invoice.date && (
                <div className="leftRow m1 middle">
                  <h3
                    className="p0 m0"
                    style={{ fontSize: "0.85em" }}
                  >
                    Issued
                  </h3>
                  <button
                    disabled={disabled}
                    className="m0 ml1"
                    style={{ padding: "2px 5px" }}
                    onClick={() =>
                      setDatePickerProps({
                        active: true,
                        attribute: "date",
                      })
                    }
                  >
                    <p className="m0">
                      {formatDatestring(invoice.date)}
                    </p>
                  </button>
                </div>
              )}

              <div className="leftRow m1 middle">
                <h3 className="p0 m0" style={{ fontSize: "0.85em" }}>
                  Due
                </h3>
                <button
                  disabled={disabled}
                  onClick={() =>
                    setDatePickerProps({
                      active: true,
                      attribute: "due_date",
                    })
                  }
                  className="m0 ml1"
                  style={{ padding: "2px 5px" }}
                >
                  <p className="m0">
                    {invoice.due_date
                      ? formatDatestring(invoice.due_date)
                      : "never"}
                  </p>
                </button>
                {invoice.due_date && (
                  <div className="leftRow m0 middle">
                    <p className="m0 ml1 p0">
                      (
                      {DateTime.fromJSDate(
                        new Date(invoice.due_date)
                      ).toRelative()}
                      )
                    </p>
                    <IonIcon
                      className="buttonIcon"
                      name="close"
                      style={{ color: "var(--dangerColor)" }}
                      onClick={() =>
                        updateAttribute("due_date", null)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="fifty">
          {!inShrink && (
            <div>
              <div
                className="row m0 p0"
                style={{
                  borderBottom: "1px solid",
                }}
              >
                <p className="m0 pv2">
                  {
                    invoice.invoice_items?.filter(
                      (i) => !i.discount_type
                    )?.length
                  }{" "}
                  item(s)
                </p>
                <p className="m0 pv2 mr2">
                  ${calculateItemTotal(invoice.invoice_items) || 0}
                </p>
              </div>
              {invoice.invoice_items &&
                invoice.invoice_items.filter((i) => i.discount_type)
                  ?.length > 0 && (
                  <div
                    className="row m0 p0"
                    style={{ paddingTop: 10 }}
                  >
                    <p className="m0">
                      {
                        invoice.invoice_items.filter(
                          (i) => i.discount_type
                        )?.length
                      }{" "}
                      discount(s){" "}
                    </p>
                    <p className="m0 mr2">
                      -$
                      {calculateDiscountTotal(invoice.invoice_items)}
                    </p>
                  </div>
                )}
              {showGst && (
                <div className="row m0" style={{ paddingTop: 10 }}>
                  <p className="m0">GST (10%)</p>
                  <p className="textLeft m0 mr2">
                    {/*@ts-ignore */}$
                    {(parseInt(invoice.total_amount) / 11)?.toFixed(
                      2
                    ) || 0}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="m0 p1" />
          <div className="boxedAccent p2 m0">
            <div className="row m0">
              <p className="m0">Total</p>
              <p className="m0">${invoice.total_amount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider m2" />

      <div id="creator" className="row">
        <InvoiceItems
          disabled={disabled}
          inShrink={inShrink}
          setGst={(val) => {
            updateAttribute(
              "total_amount",
              calculateInclusiveTotal(
                invoice.invoice_items,
                val as boolean
              )
            );
            updateAttribute("show_gst", val);
          }}
          gst={{ active: showGst, value: invoice.total_amount / 11 }}
          iItems={invoice.invoice_items || []}
          setI={(val) => setInvoiceItems(val)}
        />
        <InvoiceElements
          disabled={disabled}
          description={invoice.description}
          location={invoice.location}
          totalPaid={invoice.total_paid}
          outstandingBalance={invoice.outstanding_balance}
          message={invoice.message}
          addElementMenuActive={addElementMenuActive}
          boxPosition={boxPosition}
          contracts={contracts}
          businessDetails={business}
          invoice={invoice}
          selectedContract={selectedContract || null}
          updateAttribute={updateAttribute}
          activateAddMenu={activateAddMenu}
          setAddElementMenuActive={setAddElementMenuActive}
          navigateTo={navigateTo}
        />
      </div>
    </div>
  );
}
