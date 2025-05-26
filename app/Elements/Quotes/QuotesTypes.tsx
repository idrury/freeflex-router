import { Op } from "quill";
import { FFBusiness, FFErrorSelector, FFContract } from "../../assets/Types";

export type QuoteMenuProps = {
  date: Date;
  setDate: (any) => void;
  description: string | null;
  setDescription: (any) => any;
  quoteItems: any[];
  setQuoteItems: (any) => any;
  save: (any) => any;
  errorText: FFErrorSelector;
  loading: boolean;
  contracts: FFContract[] | undefined;
  setContract: (any) => any;
  navigateTo: (string, boolean) => void;
  contract: FFContract | undefined;
  businessDetails: FFBusiness | undefined;
  saveLoading: boolean;
  saved: boolean;
};

export type QuoteFactoryProps = {
  formatID: number;
  businessDetails: FFBusiness | undefined;
  date: Date;
  project: string | null;
  client: string | null;
  description: string | null;
  total: number;
  items: any;
  color: string;
  contractDelta: Op[] | undefined;
  label;
};
