import React from "react";
import { FFInvoice, FFSimpleInvoice } from "../../assets/Types";
import { sumUnpaidInvoices } from "./BudgetBL";
import InvoiceList from "./InvoiceList";
import { dateIsSameDayOrAfter } from "../GoogleCalendar/GoogleCalendarBL";
import { reRouteTo } from "../../Functions/commonFunctions";
import IonIcon from "@reacticons/ionicons";

interface InvoiceAggregatesProps {
  onClick?: (invoice: FFInvoice) => void;
  invoices?: FFSimpleInvoice[];
}

export default function InvoiceAggregates({
  invoices,
}: InvoiceAggregatesProps) {
  if (!invoices || invoices.length <= 0)
    return (
      <div className="w100 ">
        <div className="boxed boxedOutline">
          <div style={{ height: 350 }} className="w100 col middle">
            <IonIcon
              name="stats-chart"
              style={{
                width: 250,
                height: 250,
                color: "var(--smallAccent)",
              }}
            />
            <p className="textCenter slowFade boxedDark">
              Cool graphs will show up here once you've added some
              invoices!
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="hundred">
      <div className="">
        <div className="boxedOutline boxed">
          <p className="boldLabel">In a nutshell</p>
          <div className="row">
            <div>
              <h2 className="textLeft m1">
                ${sumUnpaidInvoices(invoices).avg}
              </h2>
              <label>Avg invoice total</label>
            </div>
            <div>
              <h2 className="textLeft m1">
                ${sumUnpaidInvoices(invoices).smallest}
              </h2>
              <label>Smallest invoice</label>
            </div>
            <div>
              <h2 className="textLeft m1">
                ${sumUnpaidInvoices(invoices).biggest}
              </h2>
              <label>Biggest invoice</label>
            </div>
          </div>
        </div>

        <div className="boxedOutline boxed">
          <p className="boldLabel">Anticpated income</p>
          <h2 className="textLeft m1">
            ${sumUnpaidInvoices(invoices).sum}
          </h2>
          <label className="">Based on your unpaid invoices</label>
          <InvoiceList
            invoices={invoices.filter((inv) => inv.isPaid == false)}
            onImportClick={() => {}}
          />
        </div>
      </div>
      <div className="centerRow">
        <button
          className="accentButton"
          onClick={() => reRouteTo("/feedback")}
        >
          What else would you like to see here?
        </button>
      </div>
    </div>
  );
}
