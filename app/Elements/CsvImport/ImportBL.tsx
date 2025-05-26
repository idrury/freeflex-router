import { DateTime } from "luxon";
import {
  FFClient,
  FFExpenseCategory,
  FFImportType,
  FFInvoice,
  FFProject,
} from "../../assets/Types";
import { EXPENSE_CATEGORIES } from "../../Functions/Data";
import {
  bulkInsertClients,
  bulkInsertExpenses,
  bulkInsertInvoices,
  bulkInsertProjects,
  deleteItemsFromBulkImport,
  fetchClients,
  fetchProjects,
  fetchUserBusiness,
  insertBulkImport,
  insertError,
  updateBulkImportAttribute,
} from "../../Functions/DBAccess";

/***************************************
 * Validate and prepare items for bulk upload
 * @param items The array to import
 * @param type The expected kind of item in the array
 */
export async function handleBulkUpload(
  items: any[],
  type: FFImportType
) {
  try {
    // limit length to 200
    if (items.length > 200)
      throw {
        code: 0,
        message:
          "You can not import more than 200 expenses at one time!",
      };

    const importId = await insertBulkImport(type, items.length);

    if (type == "invoice")
      items = await addProjectIdsToInvoices(items, importId);

    // Format the data appropriately
    const handledItems = importRows(items, type, importId);
    if (type == "expense") await bulkInsertExpenses(handledItems);
    else if (type == "invoice") {
      try {
        await bulkInsertInvoices(handledItems);
      } catch (error) {
        // Revert if fails
        await deleteBulkInvoices(importId);
        throw error;
      }
    }

    await updateBulkImportAttribute(importId, "success", true);
  } catch (error) {
    throw error;
  }
}

/********************************
 * Import rows from csv import
 * @param rows The rows to import
 * @param type The type expected in the array
 * @throws Error if adding fails
 */
export function importRows(
  rows: any[],
  type: FFImportType,
  importId: number
): any[] {
  const items = new Array();

  rows.forEach((row) => {
    try {
      items.push(buildImportRow(row, type, importId));
    } catch (error) {
      throw error;
    }
  });

  return items;
}

/************************************
 * Add a new row from a csv
 * @param row The row to add
 * @param type The type of item expected
 * @param importId The id of the bulk import
 * @throws Error if invalid params are found
 */
export function buildImportRow(
  row,
  type: FFImportType,
  importId: number | null
): any {
  try {
    if (type == "expense") return buildExpenseRow(row, importId);
    else if (type == "invoice") return buildInvoiceRow(row, importId);
  } catch (error) {
    throw error;
  }
}

/************************************
 * Add a new expense from a csv row
 * @param row The row to add
 * @param importId
 * @throws Error if invalid params are found
 */
export function buildExpenseRow(row, importId: number | null): any {
  const amount = parseString(row.amount).startsWith("$")
    ? row.amount.split("$")[1]
    : row.amount;
  const date = dateTimeFromUnknownFormat(row.date);
  if (!date)
    throw {
      code: 0,
      message: `Some dates were invalid`,
    };
  else if (!parseFloat(amount))
    throw {
      code: 0,
      message:
        "Some amounts were not numbers or were in an invalid format",
    };

  const expense = {
    date: date,
    description: row.description || "Bulk import by FreeFlex",
    amount: Math.abs(parseFloat(amount)) || 0,
    category: getValidCategory(row.category),
    is_deductible: isTruthy(row.is_deductible),
    url: row.url || null,
    import_id: importId,
  };

  return expense;
}

/*****************************
 * Build an invoice from a row
 * @param row The data to use
 * @param importId THe
 * @returns
 */
export function buildInvoiceRow(
  unvalidatedInvoice,
  importId: number | null
) {
  const amount = parseString(
    unvalidatedInvoice.total_amount
  ).startsWith("$")
    ? unvalidatedInvoice.total_amount.split("$")[1]
    : unvalidatedInvoice.total_amount;

  const date = dateTimeFromUnknownFormat(unvalidatedInvoice.date);
  const dueDate =
    unvalidatedInvoice.due_date &&
    dateTimeFromUnknownFormat(unvalidatedInvoice.date);
  if (!date)
    throw {
      code: 0,
      message: "Some invoice dates were invalid",
    };
  else if (unvalidatedInvoice.due_date && !dueDate)
    throw {
      code: 0,
      message: "Some due dates were invalid",
    };
  else if (!parseFloat(amount))
    throw {
      code: 0,
      message:
        "Some amounts were not numbers or were in an invalid format ",
    };

  const invoice = {
    date: date,
    total_amount: Math.abs(parseFloat(amount)),
    invoice_number: unvalidatedInvoice.invoice_number || "0",
    due_date: unvalidatedInvoice.due_date ? dueDate : null,
    description: unvalidatedInvoice.description || null,
    show_gst: isTruthy(unvalidatedInvoice.show_gst),
    isInvoice: true,
    isPaid: isTruthy(unvalidatedInvoice.isPaid) || true,
    project_id: unvalidatedInvoice.project_id,
    invoice_items: [
      {
        total: Math.abs(parseFloat(amount)),
        quantity: "1",
        unit_cost: Math.abs(parseFloat(amount)),
        description: "Default item (added by FreeFlex)",
      },
    ],
    contract_id: null,
    import_id: importId,
  };

  return invoice;
}

/*****************************************************
 * Return a valid expense category from a given string
 * @param category The category to return as an expense category value
 * @returns The expense category type or 'other'
 */
function getValidCategory(
  category: string | null
): FFExpenseCategory {
  let response: FFExpenseCategory = "other";
  if (!category) return response;

  EXPENSE_CATEGORIES.forEach((cat) => {
    if (cat.value == category || cat.label == category)
      response = cat.value;
  });

  return response;
}

/*********************************
 *
 */
async function addProjectIdsToInvoices(
  unvalidatedInvoices: any[],
  importId: number
): Promise<any[]> {
  const projects = await fetchProjects(true);
  const clients = await fetchClients();
  const projectsToAdd: any[] = new Array();
  const clientsToAdd: any[] = new Array();

  // Loop through imported invoices and check against all projects
  // Currently in the system
  unvalidatedInvoices.forEach((inv) => {
    let isAdded = false;
    projects?.forEach((proj) => {
      // Add the project id if names are the same
      if (
        parseString(inv.project).toLowerCase() ==
        parseString(proj.name).toLowerCase()
      ) {
        inv.project_id = proj.id;
        isAdded = true;
      } else if (
        // Push a new project with the given client name if the client
        // exists but the project doesn't
        inv.client &&
        isAdded == false &&
        (parseString(inv.client).toLowerCase() ==
          parseString(
            (proj.clients as FFClient)?.name
          ).toLowerCase() ||
          parseString(inv.client).toLowerCase() ==
            parseString(
              (proj.clients as FFClient)?.nickname
            ).toLowerCase()) &&
        projects?.find((proj) => proj.name == inv.project) == null
      ) {
        projectsToAdd.push({
          client_id: (proj.clients as FFClient).id,
          is_complete: true,
          name: inv.project || null,
          next_due: null,
          priority: 1,
          project_date: {
            start: null,
            end: null,
            include_time: false,
            gcal_id: null,
            acal_id: null,
          },
          status: "FINISHED",
          notes_delta: [],
          project_delivery_date: {
            date: null,
            include_time: false,
            gcal_id: null,
            acal_id: null,
          },
          import_id: importId,
        });
        isAdded = true;
        return;
      }
    });
    // If no matching project or client has been found, we push
    // A new client and a new project
    if (isAdded == false) {
      if (
        inv.client &&
        !clientsToAdd.find((cli) => cli.name == inv.client) &&
        !clients.find((cli) => cli.name == inv.client)
      )
        clientsToAdd.push({
          nickname: null,
          email: null,
          name: inv.client || "unnamed",
          phone: null,
          import_id: importId,
        });

      projectsToAdd.push({
        client_id: inv.client || null,
        is_complete: true,
        name: inv.project || null,
        next_due: null,
        priority: 1,
        project_date: {
          start: null,
          end: null,
          include_time: false,
          gcal_id: null,
          acal_id: null,
        },
        status: "FINISHED",
        notes_delta: [],
        project_delivery_date: {
          date: null,
          include_time: false,
          gcal_id: null,
          acal_id: null,
        },
        import_id: importId,
      });
    }
  });

  // bulk add clients
  const insertedClients =
    clientsToAdd.length > 0
      ? await bulkInsertClients(clientsToAdd)
      : [];
  // bulk add projects with client ids based on names
  projectsToAdd.forEach((proj) => {
    insertedClients.forEach((cli) => {
      if (proj.client_id == cli.name) {
        proj.client_id = cli.id;
        return;
      }
    });
  });

  const insertedProjects = await bulkInsertProjects(projectsToAdd);

  // try and link invoices to new projects
  unvalidatedInvoices.forEach((inv) => {
    let idAdded = false;
    if (inv.project_id) {
      idAdded = true;
      return;
    }

    insertedProjects.forEach((proj) => {
      if (inv.project == proj.name) {
        inv.project_id = proj.id;
        idAdded = true;
      }
    });
    // throw error if this fails
    if (idAdded == false)
      throw {
        code: 0,
        message: "an error occured linking invoices to projects",
      };
  });

  // Otherwise return the new list of invoices with project ids
  return unvalidatedInvoices;
}

/******************************************
 * Checks if a value is something like true
 * @param value The value to check
 * @returns boolean
 */
export function isTruthy(v): boolean {
  let isTrue = false;

  if (
    v == 1 ||
    v == true ||
    v == "true" ||
    v == "true" ||
    v == "TRUE" ||
    v == "t" ||
    v == "T"
  )
    isTrue = true;

  return isTrue;
}

/*******************************
 * Get a value as a string
 * @param value The parsed string
 * @returns A string or an empty string
 */
export function parseString(value) {
  try {
    if (typeof value === "string") {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    } else if (value === null || value === undefined) {
      return "";
    } else {
      return String(value);
    }
  } catch (error) {
    return "";
  }
}

export async function deleteBulkExpenses(
  id: number
): Promise<number> {
  try {
    return await deleteItemsFromBulkImport("expenses", id);
  } catch (error) {
    throw error;
  }
}

export async function deleteBulkInvoices(
  id: number
): Promise<number> {
  try {
    let num = await deleteItemsFromBulkImport("invoices", id);
    await deleteItemsFromBulkImport("projects", id);
    await deleteItemsFromBulkImport("clients", id);
    return num;
  } catch (error) {
    throw error;
  }
}

/******************************************
 * Parse a date where we don't know what
 * format it will be in
 * @param date The date to parse (as a string)
 * @returns
 */
export function dateTimeFromUnknownFormat(
  date: string
): DateTime | null {
  date = parseString(date).trim();
  if (DateTime.fromFormat(date, "d/M/yyyy").isValid)
    return DateTime.fromFormat(date, "d/M/yyyy");
  if (DateTime.fromFormat(date, "yyyy/M/d").isValid)
    return DateTime.fromFormat(date, "yyyy/M/d");
  if (DateTime.fromFormat(date, "d-M-yyyy").isValid)
    return DateTime.fromFormat(date, "d-M-yyyy");
  if (DateTime.fromFormat(date, "yyyy-M-d").isValid)
    return DateTime.fromFormat(date, "yyyy-M-d");
  if (DateTime.fromFormat(date, "MMM d yyyy").isValid)
    return DateTime.fromFormat(date, "MMM d yyyy");
  if (DateTime.fromFormat(date, "MMMM d yyyy").isValid)
    return DateTime.fromFormat(date, "MMMM d yyyy");
  if (DateTime.fromFormat(date, "d MMM yyyy").isValid)
    return DateTime.fromFormat(date, "d MMM yyyy");

  if (DateTime.fromFormat(date, "d MMMM yyyy").isValid)
    return DateTime.fromFormat(date, "d MMMM yyyy");

  return null;
}

/*****************************************
 * Convert a string of text with spaces to one with dashes
 * @param text The text to parse
 * @returns text with dashes not spaces
 */
export function parseSectionToUrlSection(text: string): string {
  let splitHeader = text.split(" ");
  let rebuiltString = "#";

  splitHeader.forEach((split, i) => {
    rebuiltString = rebuiltString.concat(split).toLowerCase();

    if (i < splitHeader.length - 1)
      rebuiltString = rebuiltString.concat("-");
  });

  return rebuiltString;
}
0;

/***************************************
 * Extract the heading names from the data
 */
export function parseMDtoHeaders(data: string[]): string[] {
  let splits = new Array<string>();

  data.forEach((subSplit) => {
    if(!subSplit) return;
    let spl = subSplit.split("\n## ")[1].split("\n")[0];
    if (spl.length > 0) splits.push(spl);
  });

  return splits;
}

export function parseStringToTag(text: string) {
  const splitSentence = text.split(" ");
  let header = "";

  splitSentence.forEach((word, i) => {
    header = header.concat(word);
    if (i < splitSentence.length - 1) header = header.concat("-");
  });

  return header;
}

export function buildMarkdownFromSections(
  sections: string[]
): string {
  let builtMarkdown = "";
  sections.forEach(
    (sec) => (builtMarkdown = builtMarkdown.concat(sec))
  );
  return builtMarkdown;
}

export function parseMarkdownToSections(
  data: string,
  type: "#" | "##" | "###"
): string[] {
  const splitData = data.split(`\n${type} `);

  splitData.forEach((split, i) => {
    if (split != "") {
      splitData[i] = `<section id=${parseStringToTag(
        split.split("\n")[0]
      ).toLowerCase()}>\n\n${type} ${split}</section>`;
    }
  });

  return splitData;
}
