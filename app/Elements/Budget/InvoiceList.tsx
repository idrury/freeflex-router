import React from "react";
import {
  FFClient,
  FFInvoice,
  FFInvoiceProject,
  FFSimpleInvoice,
} from "../../assets/Types";
import { reRouteTo } from "../../Functions/commonFunctions";
import { formatDatestring } from "../../Functions/Dates";
import IonIcon from "@reacticons/ionicons";
import { dateIsSameDayOrAfter } from "../GoogleCalendar/GoogleCalendarBL";

interface InvoiceListProps {
  invoices?: FFSimpleInvoice[];
  onImportClick: () => void;
}

export default function InvoiceList({
  invoices,
  onImportClick,
}: InvoiceListProps) {
  if (!invoices || invoices.length <= 0) {
    return (
      <div className="col middle">
        <IonIcon
          name="wallet"
          style={{
            width: 150,
            height: 150,
            color: "var(--smallAccent)",
          }}
        />

        <p className="pb2 boxedDark textCenter">
          You haven't created any invoices for this period.
        </p>
        <div className="row">
          <button
            className="m0"
            onClick={() => reRouteTo("/projects")}
          >
            <p className="m0">Create a project</p>
          </button>
          <p className="textCenter">or</p>
          <button className="m0" onClick={() => onImportClick()}>
            <p className="m0">Bulk import a bunch</p>
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="w100">
        <div className="pr3">
          {invoices?.map(
            (inv) =>
              inv.total_amount > 0 && (
                <div
                  key={inv?.id}
                  className="row middle dark boxedOutline p0 w100 clickable"
                  onClick={
                    inv.invoice_number
                      ? () =>
                          reRouteTo(
                            `/projects/${
                              (inv.projects as FFInvoiceProject).id
                            }/invoice?IID=${inv.id}`
                          )
                      : () => {
                          return;
                        }
                  }
                >
                  <div className="leftRow w25 middle flexShrink m0">
                    <IonIcon
                      className="ml1"
                      name={`${
                        inv.isPaid
                          ? "checkmark-done-circle"
                          : "close-circle"
                      }`}
                      style={{
                        height: "100%",
                        minWidth: 20,
                        color: `${
                          inv.isPaid
                            ? "var(--safeColor)"
                            : dateIsSameDayOrAfter(
                                new Date(),
                                new Date(inv.due_date)
                              )
                            ? "var(--dangerColor)"
                            : "var(--text)"
                        }`,
                      }}
                    />
                    <p>{inv.invoice_number}</p>
                  </div>
                  <div className="w25 flexShrink">
                    <p> {formatDatestring(inv.date) || "NO DATE"}</p>
                  </div>
                  <div className="leftRow m0 p0 middle w50 flexShrink">
                    <p className="m0 mr1 ml2 pl1">
                      {(inv.projects as FFInvoiceProject)?.name ||
                        "None"}
                    </p>
                    <p className="ml1"> | </p>
                    <p className="m0">
                      {(
                        (inv.projects as FFInvoiceProject)
                          ?.clients as FFClient
                      )?.name || "None"}
                    </p>
                  </div>
                  <p className="w25 rightRow flexShrink">{`$${
                    Math.round(inv.total_amount * 100) / 100 || 0
                  }`}</p>
                </div>
              )
          )}
        </div>
      </div>
    );
}
