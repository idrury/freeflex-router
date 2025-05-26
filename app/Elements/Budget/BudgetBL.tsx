import { DateTime, Duration, Interval } from "luxon";
import {
  FFClient,
  FFExpense,
  FFInvoiceProject,
  FFPeriodDuration,
  FFSimpleInvoice,
} from "../../assets/Types";
import { parseInvoiceNumber } from "../../Functions/commonFunctions";
import {
  insertExpense,
  insertRecurringExpense,
  updateExpense,
  updateRecurringExpense,
} from "../../Functions/DBAccess";
import { EXPENSE_CATEGORIES } from "../../Functions/Data";
import { FFBudgetFilter } from "./BUDGET_TYPES";
import { IoniconName } from "../../assets/Ionicons";
import { parseString } from "../CsvImport/ImportBL";

/***********************************************
 * Validate an expense form
 * @param description The description field value
 * @param category The category field value
 * @param amount The amount field value
 *
 * @throws Error in form {field: string, text: string}
 */
export function validateExpenseForm(
  description: string,
  category: string,
  amount: string
) {
  if (!description || description.length <= 0) {
    throw {
      field: "name",
      text: "You must enter a name!",
    };
  } else if (category == null) {
    throw {
      field: "category",
      text: "Select a category",
    };
  } else if (parseInvoiceNumber(amount) == null) {
    throw {
      field: "cost",
      text: "Enter a valid amount",
    };
  }
}

/******************************************
 * Handles the process of adding or updating
 * an expense in the database
 *
 * @returns the inserted object if successful,
 * otherwise throws an error
 */
export async function handleAddOrUpdateExpense(
  id,
  recurringExpenseId,
  description,
  category,
  amount,
  deductible,
  url,
  date,
  endDate,
  recurringFrequency
): Promise<any> {
  if (!id) {
    // Insert a new recurring expense
    if (recurringExpenseId) {
      return await insertRecurringExpense(
        description,
        category,
        parseInvoiceNumber(amount),
        deductible,
        url,
        date,
        endDate,
        recurringFrequency
      );
    } else {
      // Insert a new expense
      return await insertExpense(
        date,
        description,
        category,
        parseInvoiceNumber(amount),
        deductible,
        recurringExpenseId,
        url
      );
    }
  } else {
    // Update a recurring expense
    if (recurringExpenseId) {
      return await updateRecurringExpense(
        recurringExpenseId,
        endDate,
        recurringFrequency
      );
    } else {
      // Update an expense
      return await updateExpense(
        id,
        date,
        description,
        category,
        parseInvoiceNumber(amount),
        deductible,
        recurringExpenseId,
        url
      );
    }
  }
}

function getIdealSplitForDuration(interval: Interval): {
  type: FFPeriodDuration;
  periodCount: number;
  format: string;
} {
  if (!interval.end || !interval.start)
    return { type: "months", periodCount: 12, format: "yyyy-MMM" };
  let numMonths = Math.round(
    interval.end.diff(interval.start).as("months")
  );

  if (numMonths >= 6)
    return {
      type: "months",
      periodCount: numMonths,
      format: "MMM yyyy",
    };
  if (numMonths >= 2)
    return {
      type: "weeks",
      periodCount: Math.round(
        interval.end.diff(interval.start).as("weeks")
      ),
      format: "dd MMM",
    };
  else
    return {
      type: "days",
      periodCount: Math.round(
        interval.end.diff(interval.start).as("days")
      ),
      format: "dd MMM",
    };
}

/******************************************
 * Sort an array of expenses by date inside
 * of a given time period
 *
 * @param exp The array of expenses to sort
 * @param interval The time period to return
 * @returns The updated expense array with expenses
 * only inside the given time period
 */
export function filterExpenses(
  exp: FFExpense[],
  interval: Interval
): FFBudgetFilter {
  if (!interval.end || !interval.start) throw "Fail";
  let { type, periodCount, format } =
    getIdealSplitForDuration(interval);
  let tempExpenses = new Array<FFExpense>();
  let totalExpenses = 0;
  let rangeExpenses = 0;

  let expenseGroupings = new Array<{
    period: Interval;
    amount: number;
  }>();

  // Populate the array with empty intervals
  const periodDuration = Duration.fromObject({ [type]: 1 });
  let tempPeriod = Interval.fromDateTimes(
    DateTime.now(),
    DateTime.now().plus(periodDuration)
  );

  for (let i = 0; i < periodCount; i++) {
    if (!tempPeriod.end || !tempPeriod.start)
      throw { code: 0, message: "could not find the interval dates" };
    tempPeriod = tempPeriod.set({
      start: tempPeriod.start.minus(periodDuration),
      end: tempPeriod.start,
    });
    expenseGroupings.push({ period: tempPeriod, amount: 0 });
  }

  for (let i = 0; i < exp?.length; i++) {
    let expenseDate = DateTime.fromISO(exp[i].date as string);

    // Get expenses within given timeframe
    if (interval.contains(expenseDate)) {
      tempExpenses.push(exp[i]);
      rangeExpenses += exp[i].amount;

      // Group expenses by period
      for (let j = 0; j < expenseGroupings?.length; j++) {
        if (expenseGroupings[j].period.contains(expenseDate)) {
          expenseGroupings[j].amount += exp[i].amount;
          break;
        }
      }

      totalExpenses += exp[i].amount;
    }
  }

  // Sort dates
  expenseGroupings.sort((entryA, entryB) => {
    if (!entryA.period.start || !entryB.period.start) return 0;
    return entryA.period.start.diff(entryB.period.start).as('hours');
  });

  expenseGroupings.forEach(
    /*@ts-ignore*/
    (exp) => (exp.period = exp.period.start?.toFormat("dd MMM yyyy"))
  );

  return {
    totalExpenses,
    filteredExpenses: tempExpenses,
    rangeExpenses,
    expenseGroupings,
  };
}

/******************************************************
 * Sort an array of invoices by date and filter out any
 * which fall outside a specific period of time
 *
 * @param inv The array of invoices to sort
 * @param interval The time period to sort
 * @returns An array which has been sorted and filtered
 */
export function filterInvoices(
  inv: FFSimpleInvoice[],
  interval: Interval
) {
  if (!interval.end || !interval.start) throw "Fail";
  const tempInvoices = new Array<FFSimpleInvoice>();
  let totalEarnings = 0;
  let rangeEarnings = 0;
  let { type, periodCount, format } =
    getIdealSplitForDuration(interval);

  const paidInvoices = new Array<{
    period: Interval;
    amount: number;
  }>();
  const unpaidInvoices = new Array<{
    period: Interval;
    amount: number;
  }>();

  // Populate the array with empty intervals
  const periodDuration = Duration.fromObject({ [type]: 1 });
  let tempPeriod = Interval.fromDateTimes(
    DateTime.now(),
    DateTime.now().plus(periodDuration)
  );

  for (let i = 0; i < periodCount; i++) {
    if (!tempPeriod.end || !tempPeriod.start)
      throw { code: 0, message: "could not find the interval dates" };
    tempPeriod = tempPeriod.set({
      start: tempPeriod.start.minus(periodDuration),
      end: tempPeriod.start,
    });

    const defaultPeriod = {
      period: tempPeriod,
      amount: 0,
    };

    paidInvoices.push(defaultPeriod);
    unpaidInvoices.push(defaultPeriod);
  }

  for (let i = 0; i < inv?.length; i++) {
    let invoiceDate = DateTime.fromISO(inv[i].date);

    // Get invoices within given timeframe
    if (
      interval.contains(DateTime.fromISO(inv[i].date)) &&
      inv[i].isInvoice
    ) {
      tempInvoices.push(inv[i]);
      if (inv[i].isPaid) rangeEarnings += inv[i].total_amount;

      // Group invoices by period
      for (let j = 0; j < paidInvoices.length; j++) {
        if (paidInvoices[j].period.contains(invoiceDate)) {
          if (inv[i].isPaid)
            paidInvoices[j].amount += inv[i].total_amount;
          else if (!inv[i].isPaid)
            unpaidInvoices[j].amount += inv[i].total_amount;
          break;
        }
      }
    }

    totalEarnings += inv[i].total_amount;
  }

  // Sort periods
  paidInvoices.sort((entryA, entryB) => {
    if (!entryA.period.start || !entryB.period.start) return 0;
    return entryA.period.start.diff(entryB.period.start).as('hours');
  });

  paidInvoices.forEach(
    /*@ts-ignore*/
    (inv) => (inv.period = inv.period.start.toFormat("dd MMM yyyy"))
  );

  return {
    totalEarnings,
    filteredInvoices: tempInvoices,
    rangeEarnings,
    paidInvoices,
    unpaidInvoices,
  };
}

/*****************************************************
 * Get the number of expenses in each category
 *
 * @param exp The array of expenses to use
 * @returns An array with the count of expenses in
 * each category
 */
export function groupExpensesByCategory(
  exp: FFExpense[]
): { category: string; value: number }[] {
  let catArray = new Array<{ category: string; value: number }>();

  for (let i = 0; i < EXPENSE_CATEGORIES.length; i++) {
    catArray.push({
      category: EXPENSE_CATEGORIES[i].label,
      value: 0,
    });
  }

  for (let i = 0; i < exp.length; i++) {
    let cat = exp[i].category;

    for (let j = 0; j < catArray.length; j++) {
      if (parseString(cat).toLowerCase() == parseString(catArray[j].category).toLowerCase()) {
        catArray[j].value += exp[i].amount;
      }
    }
  }

  return catArray;
}

/*******************************************************
 * Aggregate invoices into the amount of money that
 * has been earnt from each client
 *
 * @param inv The array of invoices to use
 * @returns A new array with clients and their aggregated income
 */
export function groupInvoicesByClient(
  inv: FFSimpleInvoice[]
): { client: string; amount: number }[] {
  let invoicesByClient = new Array<{
    client: string;
    amount: number;
  }>();

  for (let i = 0; i < inv?.length; i++) {
    let client = (
      (inv[i]?.projects as FFInvoiceProject)?.clients as FFClient
    )?.name;
    let clientAdded = false;

    for (let j = 0; j < invoicesByClient.length; j++) {
      if (
        invoicesByClient[j]?.client?.toLowerCase() ==
        client?.toLowerCase()
      ) {
        invoicesByClient[j].amount += inv[i].total_amount;
        clientAdded = true;
      }
    }

    if (clientAdded == false) {
      invoicesByClient.push({
        client: client,
        amount: inv[i].total_amount,
      });
    }
  }
  return invoicesByClient;
}

/***********************************************
 * Given a list of user invoices, return
 * the sum of the ones that haven't been paid
 * @param invoices
 */
export function sumUnpaidInvoices(invoices: FFSimpleInvoice[]) {
  let sum = 0;
  let avg = 0;
  let biggest = 0;
  let smallest = Infinity;
  invoices.forEach((inv) => {
    if (inv.isPaid == false) sum += inv.total_amount;
    if (inv.total_amount > biggest) biggest = inv.total_amount;
    else if (inv.total_amount < smallest) smallest = inv.total_amount;
  });

  avg = Math.round(sum / invoices.length);

  return { sum, avg, biggest, smallest };
}

export function getExpenseIcon(category: string): IoniconName {
  category = parseString(category).toLowerCase();
  if (category == "equipment") return "hammer";
  if (category == "travel") return "paper-plane";
  if (category == "marketing") return "megaphone";
  if (category == "Professional Development") return "school";
  if (category == "subcontractors") return "hand-left";
  if (category == "insurance") return "thunderstorm";
  if (category == "legal") return "person-circle";
  if (category == "tax") return "cash";
  if (category == "programs_subscriptions") return "repeat";
  else return "document";
}
