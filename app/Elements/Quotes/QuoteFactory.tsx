import { Document, PDFDownloadLink } from "@react-pdf/renderer";
import QuotePDF from "./QuotePDF";
import SimpleQuotePDF from "./SimpleQuotePDF";
import IonIcon from "@reacticons/ionicons";
import { useEffect, useState } from "react";
import ContractPdf from "../Contracts/ContractPdf/ContractPdf";
import React from "react";
import { QuoteFactoryProps } from "./QuotesTypes";
import { FFBusiness } from "../../assets/Types";

export default function QuoteFactory({
  formatID,
  businessDetails,
  date,
  project,
  client,
  description,
  total,
  items,
  color,
  contractDelta,
  label = "download",
}: QuoteFactoryProps) {
  const quoteOptions = {
    businessDetails,
    date,
    project,
    client,
    description,
    total,
    items,
    color,
  };
  const delta = contractDelta;
  const [quoteFile, setQuoteFile] = useState(<QuotePDF options={quoteOptions} />);
  const [contractFile, setContractFile] = useState(<ContractPdf delta={delta} businessDetails={businessDetails as FFBusiness} color={color} />)

  useEffect(() => {
    updateQuoteFormat();
  }, []);

  function updateQuoteFormat() {
    switch (formatID) {
      case 1:
        setQuoteFile(<SimpleQuotePDF options={quoteOptions} />);
    }
  }
  return (
    <PDFDownloadLink
      className="p0 m0"
      document={
        <Document>
          {quoteFile}
          {contractDelta && contractFile}
        </Document>
      }
      fileName={`QUOTE - ${client || "no client"} - ${project || "no project"}`}
    >
      {(
        <button className="accentButton p0 middle mediumFade" style={{ margin: "0 10px" }}>
          <IonIcon name="download-sharp" style={{ height: 22, width: 22, margin: 5 }} />
          <p className="hiddenOnShrink">Download</p>
        </button>
      )}
    </PDFDownloadLink>
  );
}
