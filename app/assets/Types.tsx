import { Op } from "quill";
import React from "react";

export type NotesWidgetType = {
  notes: FFNote[];
  setNotes: any;
  saved: boolean;
  setSaved: any;
  disableFocus: boolean;
  setDisableFocus: any;
  logHistory: any;
};

export type ColorType = {
  name: string;
  hex: string;
};

export type ExtendedColorType = {
  name: string;
  hex: string;
  rgb: [number, number, number];
  cmyk: [number, number, number, number];
  hsb: [number, number, number];
  hsl: [number, number, number];
  lab: [number, number, number];
};

export type SavedModalType = {
  visible: boolean;
  header: string | undefined;
  body?: string | undefined;
  state?: "success" | "fail";
};

export type FFBusiness = {
  abn: string;
  account_name: string;
  account_num: string;
  bsb_num: string;
  created_at: string;
  default_invoice: number;
  email: string;
  id: number;
  invoice_color: string;
  invoice_count: number;
  invoice_prefix: string;
  invoice_reset_monthly: boolean;
  invoice_show_client_details: boolean;
  invoice_show_description: boolean;
  invoice_show_due: boolean;
  invoice_show_gst: boolean;
  invoice_show_location: boolean;
  invoice_show_outstanding: boolean;
  invoice_show_total_paid: boolean;
  logo: string;
  name: string;
  pay_id: string | undefined;
  phone: string;
  postcode: string;
  profile: string;
  quote_color: string;
  quote_id: number;
  rate: number;
  state: string;
  street: string;
  street_number: number;
  suburb: string;
  user_id: string;
};

export type FFSimpleInvoice = {
  id: number;
  created_at: Date;
  date: string;
  due_date: Date;
  total_amount: number;
  invoice_number: number;
  isInvoice: boolean;
  isPaid: boolean;
  projects: FFInvoiceProject | FFInvoiceProject[];
};

export type FFInvoiceProject = {
  id: number;
  name: string;
  is_complete: boolean;
  clients: FFClient | FFClient[];
};

export type FFInvoice = {
  id: number | undefined;
  created_at: Date;
  date: Date;
  total_amount: number;
  invoice_number: string;
  due_date: Date | undefined;
  location: string | undefined;
  description: string | undefined;
  message: string | undefined;
  outstanding_balance: number | undefined;
  total_paid: number | undefined;
  show_gst: boolean;
  isInvoice: boolean;
  isPaid: boolean;
  projects: FFInvoiceProject | FFInvoiceProject[];
  invoice_items: InvoiceItemType[] | null;
  contract_id: number | undefined;
};

export type FFExpense = {
  id: number;
  created_at: Date;
  date: string | Date;
  description: string;
  category: string;
  amount: number;
  is_deductible: boolean;
  url: string;
  user_id: string;
  file: string;
  recurring_expenses:
    | FFSimpleRecurringExpense
    | FFSimpleRecurringExpense[];
};

export type FFSimpleRecurringExpense = {
  id: number;
  frequency: string;
  end_date: Date;
};

export type FFContract = {
  id: number;
  created_at: string;
  ops: Op[];
  label: string | undefined;
};

export type listItemType = {
  key: string;
  attrs?: {
    indent?: number;
  };
};

export type ContractPdfType = {
  delta: Op[] | undefined;
  businessDetails: FFBusiness;
  color: string;
};

export type ModalProps = {
  isActive: boolean;
  setActive: any;
  children: any;
  noBlur?: boolean;
  autoHide?: boolean;
  exitButton?: boolean;
  zIndex?: number | string;
  style?: string;
};

export type SelectableInputType = {
  options: InputOption[] | undefined;
  defaultValue?;
  onChange;
  disabled?;
  placeholder?: string;
  width?;
};

export type InputOption = {
  value: any;
  label: any;
};

export type FFProjectDate = {
  start: Date | null;
  end: Date | null;
  include_time: boolean;
  gcal_id?: string;
  acal_id?: string;
};

export type FFProjectDeliveryDate = {
  date: Date | null;
  include_time: boolean;
  gcal_id?: string;
  acal_id?: string;
};

export type FFProject = {
  id: number;
  clients: FFClient | FFClient[];
  created_at: string;
  is_complete: boolean;
  name: string;
  next_due: undefined | string;
  notes: any[];
  priority: 1 | 2 | 3;
  project_date: FFProjectDate;
  status: FFStatus;
  notes_delta: Op[];
  project_delivery_date: FFProjectDeliveryDate;
  documents: FFDocument[];
};

export type EncrypedToken = {
  key: string;
  value: string;
};

export type FFProfile = {
  id: string;
  updated_at: Date;
  first_name: string | undefined;
  last_name: string | undefined;
  user_name: string | undefined;
  role: FFRole;
  allow_email: boolean;
  new_features_read: boolean;
  integration_settings: FFProfileIntegrations;
  google_access_token: FFAccessToken;
  provider_refresh_token: EncrypedToken | undefined;
  default_settings: FFProfileDefaults;
};

type FFProfileDefaults = {
  primary_sort?: string;
  secondary_sort?: string;
  business_details_exist?: boolean;
};

export type FFProfileIntegrations = {
  add_to_calendar?: boolean;
  gcal_id?: string;
  calendar_add_dismissed?: boolean;
};

export type FFStatus =
  | "AWAITING RESPONSE"
  | "NEEDS ACTION"
  | "AWAITING PAYMENT"
  | "READY"
  | "BLOCKED"
  | "FINISHED";

export type FFClient = {
  id: number;
  created_at: string;
  nickname: string | undefined;
  email: string | undefined;
  name: string;
  phone: string | undefined;
  user_id: string;
};

export type FFLineItem = [string, string, string, null | number];

export type FFErrorSelector = {
  field: null | string;
  value: null | string;
};

export type FFError = {
  code: number | undefined;
  message: string | undefined;
};

export type FFSavedSelector = {
  active: boolean;
  header: string | null;
  body: string | null;
};

export type ContractOptionsMenuProps = {
  options: MoveableOptions;
  onClose: () => any;
  onPreview?: () => any;
  onDelete?: () => any;
  onDuplicate?: () => any;
  manageVisible?: boolean;
};

export type MoveableOptions = {
  active: boolean;
  x: number | undefined;
  y: number | undefined;
};

export type ContractPreviewPanelProps = {
  deltaOps?: Op[];
  businessDetails?: FFBusiness;
  active: boolean;
  setActive: (active) => any;
  title?: string;
};

export type FFRole =
  | "free"
  | "basic_subscriber"
  | "admin"
  | undefined;

export type FFNote = {
  type: "dotPoint" | "h1" | "h2" | "checkbox" | "";
  value: string;
  checked: boolean;
};

export type InvoiceItemType = {
  discount_type?: "$" | "%";
  description: string | undefined;
  quantity: number | undefined;
  unit_cost: number | undefined;
  total: number;
};

export type BusinessAttribute =
  | "default_invoice"
  | "invoice_color"
  | "invoice_show_client_details"
  | "invoice_show_gst"
  | "invoice_show_due"
  | "invoice_show_description"
  | "invoice_show_location"
  | "invoice_show_total_paid"
  | "invoice_show_outstanding"
  | "integrations";

export type ExpenseAttribute =
  | "date"
  | "category"
  | "description"
  | "amount"
  | "is_deductible"
  | "url"
  | "file";

export type ProjectAttribute =
  | "priority"
  | "status"
  | "project_date"
  | "project_delivery_date"
  | "is_complete"
  | "client_id"
  | "documents";

export type ProfileAttribute =
  | "allow_email"
  | "first_name"
  | "last_name"
  | "user_name"
  | "role"
  | "integration_settings"
  | "google_access_token"
  | "provider_refresh_token"
  | "default_settings";

export type ToolTip = {
  value: string | undefined;
  x: number;
  y: number;
};

export type LimitReachedType = {
  isActive: boolean;
  body: string;
};

export type FFAccessToken =
  | {
      token_id: string;
      expiry_date: Date;
      scope: string;
    }
  | undefined;

export type FFImportType = "expense" | "invoice";

export interface FFTable {
  id: number;
  created_at: Date;
  user_id: string;
}

export interface FFBulkImport extends FFTable {
  import_type: "expense" | "invoice";
  num_rows: number;
  success: boolean;
  is_deleted: boolean;
}

export type popSavedModalFn = (
  header: string,
  body?: string,
  isError?: boolean
) => void;

export type FFExpenseCategory =
  | "equipment"
  | "travel"
  | "marketing"
  | "Professional Development"
  | "subcontractors"
  | "insurance"
  | "legal"
  | "tax"
  | "programs_subscriptions"
  | "other";

export type FFBulkImportAttribute =
  | "import_type"
  | "num_rows"
  | "success"
  | "is_deleted";

export interface FFActiveComponent {
  active: boolean;
  onClose: () => void;
  popSavedModal?: popSavedModalFn;
}

export type FFPeriodDuration = "days" | "weeks" | "months";

export type InformationPageStructure = {
  heading: string;
  html: React.ReactNode;
};

export interface FFPage {
  id: number,
  title: string,
  description: string,
  url: string,
  markdown: string
}

export type FFDocument = {
  name: string;
  url: string;
}