import { Document, PDFViewer } from "@react-pdf/renderer";
import ContractPdf from "./ContractPdf/ContractPdf";
import { FFBusiness, ContractPreviewPanelProps } from "../../assets/Types";
import React from "react";
import Modal from "../Modal";
import IonIcon from "@reacticons/ionicons";

/**
 * View a created contract by converting it's delta ops
 * to react-pdf form
 */
export default function PreviewPanel({
  deltaOps,
  businessDetails,
  active,
  setActive,
  title,
}:ContractPreviewPanelProps) {
  return (
    <Modal isActive={active} setActive={setActive} zIndex={100}>
      <div
        className="hundred center middle pv2"
        style={{ height: "90%" }}
      >
        <div className="fifty" style={{ height: "100%" }}>
          <div
            className="boxed boxedOutline m0 rightRow"
            style={{ padding: "10px 0" }}
          >
            <div className="ph2">
              <button
                className="m0 middle"
                onClick={() => setActive(false)}
              >
                <IonIcon name="close" />
              </button>
            </div>
          </div>
          <PDFViewer
            style={{ width: "100%", borderRadius: 5, border: "none" }}
            height={"100%"}
            className=""
          >
            <Document
              title={`Preview ${title || "contract"}`}
              author={
                (businessDetails as FFBusiness)?.name || "N/A"
              }
              subject={"contract"}
            >
              <ContractPdf
                delta={deltaOps}
                businessDetails={businessDetails as FFBusiness}
                color={businessDetails?.invoice_color as string}
              />
            </Document>
          </PDFViewer>
        </div>
      </div>
    </Modal>
  );
}
