import React from "react";
import { FFSimpleInvoice } from "../../assets/Types";

import InvoiceList from "./InvoiceList";
import InvoiceAggregates from "./InvoiceAggregates";

interface IncomeSummaryProps {
  invoices?: FFSimpleInvoice[];
  onImportClick: () => void;
}

export default function IncomeSummary({
  invoices,
  onImportClick,
}: IncomeSummaryProps) {
  if (!invoices) {
    return (
      <div className="leftRow">
        <p>You haven't created any invoices for this period!</p>
      </div>
    );
  } else
    return (
      <div className="row dynamicRow mediumFade">
        <InvoiceAggregates invoices={invoices} />

        <div className="row dynamicRow mediumFade w100">
          <div className="boxed boxedOutline w100">
            <h2 className="textLeft p2">Paid Invoices</h2>
            <InvoiceList
              invoices={invoices.filter((i) => i.isPaid == true)}
              onImportClick={() => onImportClick()}
            />
          </div>
        </div>
      </div>
    );
}
