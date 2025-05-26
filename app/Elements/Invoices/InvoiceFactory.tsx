import IonIcon from "@reacticons/ionicons";
import { Document, Page, PDFDownloadLink } from "@react-pdf/renderer";

import { useEffect, useState } from "react";

import splitString from "../../Functions/StringSplitter.jsx";
import DefaultInvoicePdf from "./PDFS/DefaultInvoicePdf.js";
import SidebarInvoicePdf from "./PDFS/SidebarInvoicePdf.js";
import BlockedInvoicePdf from "./PDFS/BlockedInvoicePdf.js";
import { FFInvoiceBusiness, InvoiceOptionsType } from "./Types.js";
import React from "react";
import {
  FFBusiness,
  FFClient,
  FFInvoice,
  FFProject,
  InvoiceItemType,
} from "../../assets/Types.js";
import { calculateItemTotal } from "./InvoiceBL.js";
import { Op } from "quill";
import ContractPdf from "../Contracts/ContractPdf/ContractPdf.js";

type InvoiceFactoryProps = {
  invoice: FFInvoice;
  formatId;
  businessDetails: FFBusiness;
  date: Date;
  project: FFProject;
  client: FFClient;
  gst: { show: boolean; value: number };
  settings;
  color;
  contractDelta: Op[] | undefined;
};

export default function InvoiceFactory({
  invoice,
  formatId,
  businessDetails,
  project,
  client,
  gst,
  settings,
  color,
  contractDelta,
}: InvoiceFactoryProps) {
  const [pdfFile, setPdfFile] = useState<React.JSX.Element>();
  const [contractFile, setContractFile] = useState(
    <ContractPdf
      delta={contractDelta}
      businessDetails={businessDetails as FFBusiness}
      color={color}
    />
  );
  const [invoiceFileName, setInvoiceFileName] = useState("new invoice")

  useEffect(() => {
    createInvoiceFormat();
  }, []);

  /****************************************
   * Transform the requirement params for the invoice
   * pdf into an appropriate form
   */
  function createInvoiceFormat() {
    if (!businessDetails) {
      alert(
        "Sorry! There was an error saving your invoice. \
        Refresh the page and try again."
      );
      return;
    }

    const invoiceBusiness = createInvoiceBusiness();
    const invoiceOptions = createInvoiceOptions(invoiceBusiness);

    invoice.isInvoice ?
      setInvoiceFileName(`Invoice ${invoice.invoice_number || "NO_NUM"} - ${
        client?.name || "no client"
      } - ${project?.name || "no project"}`) :
      setInvoiceFileName(`Quote - ${
        client?.name || "no client"
      } - ${project?.name || "no project"}`);

    if (!invoiceOptions) return;

    switch (formatId) {
      case 0:
        setPdfFile(<DefaultInvoicePdf options={invoiceOptions} />);
        break;
      case 1:
        setPdfFile(<SidebarInvoicePdf options={invoiceOptions} />);
        break;
      case 2:
        setPdfFile(<BlockedInvoicePdf options={invoiceOptions} />);
        break;
    }
  }

  /********************************************
   * Buld the invoice business
   */
  function createInvoiceBusiness(): FFInvoiceBusiness {
    return {
      logo: businessDetails.logo,
      suburb: businessDetails.suburb,
      name: businessDetails.name,
      email: businessDetails.email,
      street_number: businessDetails.street_number,
      street: businessDetails.street,
      state: businessDetails.state,
      postcode: businessDetails.postcode,
      phone: splitString(businessDetails.phone, [4, 3, 3]),
      account_name:
        businessDetails.account_name || businessDetails.name,
      abn: splitString(businessDetails?.abn, [2, 3, 3, 3]),
      bsb_num: splitString(businessDetails?.bsb_num, 3) as string,
      account_num: splitString(
        businessDetails?.account_num,
        [2, 3],
        "ACCOUNT"
      ),
      pay_id: splitString(businessDetails?.pay_id, 3),
    };
  }

  /*******************************************
   * Create the invoice options object
   * @param business The options for the invoice
   * @returns A newly built invoice options or null
   */
  function createInvoiceOptions(
    business: FFInvoiceBusiness
  ): InvoiceOptionsType | null {
    if (!invoice.invoice_items) return null;

    return {
      isInvoice: invoice.isInvoice,
      date: invoice.date,
      businessDetails: business,
      project,
      client,
      invoiceItems: invoice.invoice_items?.filter(
        (i) => !i.discount_type
      ),
      invoiceDiscounts: invoice.invoice_items.filter(
        (i) => i.discount_type
      ),
      invoiceNumber: invoice.invoice_number,
      dueDate: invoice.due_date,
      totalPaid: invoice.total_paid?.toString(),
      outstandingBalance: invoice.outstanding_balance?.toString(),
      location: invoice.location,
      gst: { show: gst.show, value: gst.value.toFixed(2) },
      description: invoice.description,
      message: invoice.message,
      subTotal: calculateItemTotal(invoice.invoice_items).toFixed(2),
      total: invoice.total_amount.toFixed(2),
      settings,
      color,
    };
  }

  return (
    <PDFDownloadLink
      className="p0 m0"
      document={
        <Document>
          {pdfFile}
          {contractDelta && contractFile}
        </Document>
      }
      fileName={invoiceFileName}
    >
      <button
        className="accentButton centerRow p0 middle mediumFade"
        style={{ margin: "0 10px" }}
      >
        <IonIcon
          name="download-sharp"
          style={{ height: 22, width: 22, margin: 5 }}
        />
        <p className="hiddenOnShrink">Download</p>
      </button>
    </PDFDownloadLink>
  );
}
