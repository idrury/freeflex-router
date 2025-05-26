import IonIcon from "@reacticons/ionicons";
import EditMenu from "../EditMenu";
import { useEffect, useState } from "react";
import InvoiceDetails from "../Account/InvoiceDetails";
import { COLORS } from "../../assets/data";
import React from "react";

type FFStylePickerProps = {
  disabled: boolean;
  invoiceId: number | undefined;
  active;
  setActive: (active: boolean) => void;
  isInvoice: boolean;
  userId?;
  businessDetails?;
  styleId;
  updateAttribute;
  loading;
  color;
  styles;
  showClientDetails?;
  showGst?;
  showDue?;
  showDescription?;
  showLocation?;
  showTotalPaid?;
  showOutstanding?;
  isPaid;
  onDelete: (active: boolean) => void;
  onTransform: () => void;
  onPaid: () => void;
};

export default function InvoiceStylePicker({
  active,
  setActive,
  invoiceId,
  userId,
  businessDetails,
  styleId,
  updateAttribute,
  loading,
  color,
  styles,
  showClientDetails,
  showGst,
  showDue,
  showDescription,
  showLocation,
  showTotalPaid,
  showOutstanding,
  isInvoice,
  isPaid,
  onDelete,
  onTransform,
  onPaid,
  disabled,
}: FFStylePickerProps) {
  const [window, setWindow] = useState(0);

  return (
    <EditMenu
      isActive={active}
      setIsActive={setActive}
      isLoading={loading}
      width={250}
      height={400}
    >
      <div className="row middle">
        <h2 className="textLeft m1">Options</h2>
        {invoiceId && !disabled && (
          <div>
            <button
              className="hundred centerRow p0 m2 dangerButton"
              onClick={() => {
                setActive(false);
                onDelete(true);
              }}
            >
              <IonIcon
                name="trash"
                style={{
                  width: 20,
                  height: 20,
                  margin: 5,
                }}
              />
            </button>
          </div>
        )}
      </div>
      {invoiceId && (
        <div>
          {isInvoice && (
            <div className="mr2">
              <button
                disabled={disabled}
                className="m1 hundred"
                onClick={() => onPaid()}
              >
                <div className="leftRow middle m0">
                  <IonIcon
                    name={
                      isPaid
                        ? "checkmark-done-circle"
                        : "close-circle"
                    }
                    className="mr2"
                    style={{
                      height: 20,
                      width: 20,
                      color: `${
                        isPaid
                          ? "var(--safeColor)"
                          : "var(--dangerColor)"
                      }`,
                    }}
                  />
                  <h3 className="m0">
                    Has {isPaid ? "been" : "not been"} payed
                  </h3>
                </div>
              </button>
            </div>
          )}
          <div className="mr2">
            <button
              className="m1 hundred"
              onClick={() => onTransform()}
            >
              <div className="leftRow middle m0">
                <IonIcon
                  name="duplicate"
                  className="mr2"
                  style={{ height: 20, width: 20 }}
                />
                <h3 className="m0">
                  {" "}
                  Turn into {isInvoice ? "quote" : "invoice"}
                </h3>
              </div>
            </button>
          </div>

          <div className="divider" style={{ margin: "10px 5px" }} />
        </div>
      )}

      <div className="flexRow" style={{ maxWidth: 250 }}>
        <button
          className={` p1 m1 ${
            window == 0 ? "accentButton" : undefined
          }`}
          onClick={() => setWindow(0)}
        >
          <div className="row m1">
            <IonIcon name="sparkles" />
          </div>
        </button>
        {isInvoice == true && (
          <button
            className={` p1 m1 ${
              window == 1 ? "accentButton" : undefined
            }`}
            onClick={() => setWindow(1)}
          >
            <div className="row p1">
              <IonIcon name="text" />
            </div>
          </button>
        )}

        <button
          className={` p1 m1 ${
            window == 2 ? "accentButton" : undefined
          }`}
          onClick={() => setWindow(2)}
        >
          <div className="row p1">
            <IonIcon name="cog" />
          </div>
        </button>
      </div>

      {window == 0 && (
        <StyleWindow
          styleId={styleId}
          color={color}
          styles={styles}
          updateAttribute={updateAttribute}
        />
      )}
      {window == 1 && (
        <div style={{ maxWidth: 250 }}>
          <h3 className="m2">Numbering</h3>
          <InvoiceDetails businessDetails={businessDetails} />
        </div>
      )}
      {window == 2 && (
        <div>
          <h3 className="m2">Defaults</h3>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showGst}
              onChange={(e) =>
                updateAttribute("invoice_show_gst", e.target.checked)
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Include GST</label>
          </div>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showDue}
              onChange={(e) =>
                updateAttribute("invoice_show_due", e.target.checked)
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Show due date</label>
          </div>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showDescription}
              onChange={(e) =>
                updateAttribute(
                  "invoice_show_description",
                  e.target.checked
                )
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Show description</label>
          </div>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showLocation}
              onChange={(e) =>
                updateAttribute(
                  "invoice_show_location",
                  e.target.checked
                )
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Show location</label>
          </div>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showTotalPaid}
              onChange={(e) =>
                updateAttribute(
                  "invoice_show_total_paid",
                  e.target.checked
                )
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Show total paid</label>
          </div>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showOutstanding}
              onChange={(e) =>
                updateAttribute(
                  "invoice_show_outstanding",
                  e.target.checked
                )
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Show outstanding balance</label>
          </div>
          <div className="leftRow middle">
            <input
              type="checkbox"
              checked={showClientDetails}
              onChange={(e) =>
                updateAttribute(
                  "invoice_show_client_details",
                  e.target.checked
                )
              }
              style={{ width: 20, height: 20 }}
            />
            <label>Show client's contact details</label>
          </div>
        </div>
      )}
    </EditMenu>
  );
}

/*****************************************************
 * Handle style setting changes
 */
function StyleWindow({ styleId, color, styles, updateAttribute }) {
  return (
    <div>
      <h3 className="m2">Color</h3>
      <div
        className="m2 center boxed"
        style={{ flexWrap: "wrap", width: 210 }}
      >
        {COLORS.map((col, id) => (
          <div
            className="m0 buttonIcon"
            key={id}
            onClick={() => updateAttribute("invoice_color", col.hex)}
          >
            <IonIcon
              name="square"
              size="large"
              style={{
                color: col.hex,
                opacity: `${color == col.hex ? "30%" : "inherit"}`,
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }} />

      <div className="row">
        <h3 className="m2">Style</h3>
      </div>
      {styles?.map((style) => (
        <div
          key={style.id}
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 250,
          }}
          onClick={() => updateAttribute("default_invoice", style.id)}
        >
          <div
            className="centerRow"
            style={{
              position: "absolute",
              width: 230,
              margin: "150px 10px 10px 10px",
              zIndex: 10,
            }}
          >
            <h3>{style?.name?.toUpperCase()}</h3>
          </div>
          <img
            src={style.src}
            alt={"thumbnail of " + style.name}
            className="m2 ThumbnailImage"
            style={{
              borderRadius: 3,
              opacity: `${styleId == style.id ? "30%" : "inherit"}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
