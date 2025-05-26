import { IoniconName } from "../../assets/Ionicons";

export const statusOptions = {
  actionRequired: "NEEDS ACTION",
  readyToShoot: "READY",
  awaitingPayment: "AWAITING PAYMENT",
  awaitingResponse: "AWAITING RESPONSE",
  finished: "FINISHED",
};

interface ObjectStyle {
  label: string;
  icon: IoniconName;
  button?: string;
  color?: string;
}

type StatusOptionsStyleList = {
  actionRequired: ObjectStyle;
  readyToShoot: ObjectStyle;
  awaitingPayment: ObjectStyle;
  awaitingResponse: ObjectStyle;
  finished: ObjectStyle;
};

type ProjectOptionsList = {
  priority: ObjectStyle;
  project: ObjectStyle;
  status: ObjectStyle;
  projectDate: ObjectStyle;
  deadline: ObjectStyle;
}

type ClientOptionsList = {
 legalName: ObjectStyle,
 nickname: ObjectStyle,
 phone: ObjectStyle,
 email: ObjectStyle;
}

export const statusOptionsStyles: StatusOptionsStyleList = {
  actionRequired: {
    label: "Needs Action",
    color: "var(--dangerColor)",
    icon: "pulse-sharp",
    button: "dangerButton",
  },
  readyToShoot: {
    label: "Ready",
    color: "var(--safeColor)",
    icon: "thumbs-up-sharp",
    button: "safeButton",
  },
  awaitingPayment: {
    label: "Awaiting Payment",
    color: "var(--warningColor)",
    icon: "card-sharp",
    button: "warningButton",
  },
  awaitingResponse: {
    label: "Awaiting Response",
    color: "var(--warningColor)",
    icon: "chatbubble-ellipses-sharp",
    button: "warningButton",
  },
  finished: {
    label: "Finished",
    color: "var(--mediumAccent)",
    icon: "checkmark-circle-sharp",
    button: "smallAccent",
  },
};

export const projectOptions:ProjectOptionsList = {
  priority: {label: "Priority", icon: "caret-up-circle-sharp"},
  project: {label: "Project", icon: "documents-sharp"},
  status: {label: "Status", icon: "analytics-sharp"},
  projectDate: {label: "Project date", icon: "calendar-number-sharp"},
  deadline: {label: "Deadline", icon: "alarm-sharp"},
}

export const clientOptions:ClientOptionsList = {
  legalName: {label: "Legal name", icon: "person-sharp"},
  nickname: {label: "Nickname", icon: "happy-sharp"},
  email: {label: "Email", icon: "mail-open-sharp"},
  phone: {label: "Phone", icon: "call-sharp"},
}


export const statusOptionsOrder = [
  statusOptions.finished,
  statusOptions.readyToShoot,
  statusOptions.actionRequired,
  statusOptions.awaitingResponse,
  statusOptions.readyToShoot,
  statusOptions.awaitingPayment,
];

export const STATUS_SELECT_OPTIONS = [
  { label: "Needs Action", value: "NEEDS ACTION" },
  { label: "Ready", value: "READY" },
  { label: "Awaiting Payment", value: "AWAITING PAYMENT" },
  { label: "Awaiting Response", value: "AWAITING RESPONSE" },
];

export const PRIORITY_SELECT_OPTIONS = [
  { label: "High", value: 3 },
  { label: "Med", value: 2 },
  { label: "Low", value: 1 },
];

export const orderOptions = [
  "status",
  "priority",
  "start date",
  "delivery date",
];
