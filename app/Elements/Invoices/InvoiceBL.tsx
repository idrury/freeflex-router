import {
  FFContract,
  InputOption,
  InvoiceItemType,
} from "../../assets/Types";
import { insertError } from "../../Functions/DBAccess";

/**************************************************
 * Update the subtotal by adding all invoice
 * items together and subtracting discount (does
 * not include GST)
 * @param invoiceItems The array to use to calculate the cost
 */
export function calculateSubtotal(
  invoiceItems: InvoiceItemType[]
): number {
  let sum =
    calculateItemTotal(invoiceItems) -
    calculateDiscountTotal(invoiceItems);
  return Math.round(sum * 100) / 100;
}

/**************************************************
 * Calculate the final cost of the invoice
 */
export function calculateInclusiveTotal(
  invoiceItems: InvoiceItemType[] | null,
  gst = false
): number {

  if(!invoiceItems) return 0;

  let sum =
    gst == true
      ? calculateSubtotal(invoiceItems) * 1.1
      : calculateSubtotal(invoiceItems);

  return Math.round(sum * 100) / 100;
}

/*******************************************
 * Calculate the total sum of discounts for an invoice
 * @param invoiceItems The array of invoice items
 * @returns The sum of discounts
 */
export function calculateDiscountTotal(
  invoiceItems: InvoiceItemType[]
): number {
  let tc = 0;

  for (let r = 0; r < invoiceItems.length; r++) {
    tc += invoiceItems[r].discount_type ? invoiceItems[r].total : 0;
  }

  /*@ts-ignore*/
  return Math.round(parseFloat(tc)*100)/100;
}

/*****************************************
 * Calculate the sum of items for an invoice
 * @param invoiceItems The array of invoice items
 * @returns The sum of all items
 */
export function calculateItemTotal(
  invoiceItems: InvoiceItemType[] | null
): number {
  let tc = 0;

  if(!invoiceItems) return 0;

  for (let r = 0; r < invoiceItems.length; r++) {
    tc += invoiceItems[r].discount_type ? 0 : invoiceItems[r].total;
  }
  /*@ts-ignore*/
  return Math.round(parseFloat(tc)*100)/100;
}

/*********************************************
 * Calculate the total cost of an invoice item
 * @param item The item to calculate the cost of
 * @param attr The attribute to calculate the cost of
 * @param v The new value being added to the position
 * @returns The updated item
 */
export function calculateInvoiceItemCost(
  item: InvoiceItemType
): InvoiceItemType {
  item.total = calculateUnitCost(item);

  return item;
}

/********************************************
 * Get the cost of a row
 * @param item The row to calculate
 */
export function calculateUnitCost(item: InvoiceItemType): number {
  let qty = item?.quantity || 1;
  let cost = item?.unit_cost || 0;

  return Math.round((qty * cost)* 100) / 100;
}

/*********************************************
 * Get the percentage discount of a row
 * @param item The row to calculate
 */
export function calculateUnitDiscount(
  currentTotal: number,
  item: InvoiceItemType
): number {
  return Math.round((currentTotal * (item.unit_cost || 0))) / 100;
}

/**************************************
 * Increase the user's invoice count,
 * taking the prefix into account
 * @returns A string with the prefix and invoice count
 */
export function buildInvoiceNumber(
  prefix: string,
  count: number,
  resetMonthly: boolean
): string {
  if (resetMonthly == true)
    return `${prefix}${new Date().getMonth() + 1}-${count}`;
  else return `${prefix}${count}`;
}

/**********************************************************
 * Turn contracts into the form {value: c.id, label: c.label}
 * @param contracts The array of contracts
 * @returns The new array 
 */
export function getContractsAsInputOptions(
  contracts: FFContract[] | undefined
): InputOption[] | undefined {
  const userContracts: InputOption[] = [
    { value: null, label: "none" },
  ];
  try {
    contracts?.forEach((c) => {
      userContracts.push({ value: c.id, label: c.label });
    });

    if (userContracts.length > 0) {
      return userContracts;
    }
  } catch (error) {
    insertError(
      "error fetching contracts",
      "QuotesBL:getContractsAsInputOptions",
      null
    );
    return;
  }

  return;
}
