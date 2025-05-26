import { PropsWithChildren } from "react";
import { FFBusiness, FFClient, InvoiceItemType } from "../../assets/Types";

export type InvoiceOptionsType = {
  isInvoice: boolean;
  businessDetails: FFInvoiceBusiness;
  date: Date;
  project: { name: string };
  client?: FFClient
  invoiceItems: InvoiceItemType[];
  invoiceDiscounts: InvoiceItemType[];
  invoiceNumber: string;
  dueDate: Date | undefined;
  totalPaid: string | undefined;
  location: string | undefined;
  gst: { show: boolean; value: string };
  description: string | undefined;
  message: string | undefined;
  outstandingBalance: string | undefined;
  subTotal: string;
  total: string;
  settings: {
    show_client_details: boolean;
  };
  color: string;
};
export type InvoiceOptionsProps = PropsWithChildren<{
  options: InvoiceOptionsType;
}>;

export type FFInvoiceBusiness = {
  logo: string;
  suburb: string;
  name: string;
  email: string;
  street_number: number;
  street: string;
  state: string;
  postcode: string;
  phone: string | undefined;
  account_name: string;
  abn: string;
  bsb_num: string;
  account_num: string;
  pay_id: string | undefined;
};

export type InvoiceAttribute =
  | "date"
  | "due_date"
  | "description"
  | "message"
  | "total_paid"
  | "outstanding_balance"
  | "show_gst"
  | "location"
  | "isPaid"
  | "isInvoice"
  | "total_amount"
  | "invoice_number"
  | "contract_id";

export type InvoiceDefaultAttribute =
  | "default_invoice"
  | "invoice_color"
  | "invoice_show_client_details"
  | "invoice_show_gst"
  | "invoice_show_due"
  | "invoice_show_description"
  | "invoice_show_location"
  | "invoice_show_total_paid"
  | "invoice_show_outstanding";