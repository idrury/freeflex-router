import Quill, { Delta, Op } from "quill";
import {
  insertContract,
  updateContract,
} from "../../Functions/DBAccess";
import { pdfExporter } from "quill-to-pdf";
import {
  FFBusiness,
  FFClient,
  FFContract,
  FFProject,
} from "../../assets/Types";
import { parseString } from "../CsvImport/ImportBL";
import { CUSTOM_CONTRACT_WORDS } from "../../assets/data";
import { DateTime } from "luxon";
import { MutableRefObject } from "react";

/**
 * Save a contract to the database
 * @param ops The delta ops to save
 * @param label The title of the contract
 * @param id the id of the contract to update, or null to insert a new one
 * @returns The contract if it is an insert, or null if an update
 */
export async function handleSaveContract(
  ops: Op[] | undefined,
  label,
  id?: number | null | undefined
) {
  if (!ops) throw Error("no data given");

  try {
    if (id) {
      return await updateContract(id, ops, label);
    } else {
      return await insertContract(ops, label);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Convert a quill delta to a blob
 */
export async function handleQuillToBlob(delta: Delta) {
  if (!delta) return null;

  const blob = await pdfExporter.generatePdf(delta);
  return blob;
}

/**
 * Get a contract by it's ID value
 * @param id
 * @param contracts
 * @returns
 */
export function getContractById(
  id: number | undefined,
  contracts: FFContract[]
) {
  if (!contracts || !id) return undefined;
  return contracts.find((c) => c.id == id);
}

/***************************************
 * Find any custom labels in a contract
 * @param ops
 */
export function parseOps(
  ops: Op[] | undefined,
  project: FFProject,
  business: FFBusiness
) {
  if (!ops) return undefined;

  ops.forEach((op, i) => {
    let text = parseString(op.insert);
    if (text.includes("{")) {
      let textArray = text.split("{");

      textArray.forEach((section, j) => {
        if (j == 0) return; // First is always blank
        let word = section.split("}")[0];

        text = text.replace(
          `{${word}}`,
          replaceContractWord(word, project, business)
        );
      });
    }

    ops[i].insert = text;
  });

  return ops;
}

/******************************************
 * Replace a contract word with the actual word relevant to a user's project
 * @param word The word to replace
 * @param project The current project
 * @param business The current business
 * @returns The relevant word
 */
export function replaceContractWord(
  word: string,
  project: FFProject,
  business: FFBusiness
): string {
  if (word == "TODAYS_DATE")
    return DateTime.now().toFormat("d MMM yyyy");
  else if (word == "PROJECT_START_DATE")
    return project.project_date?.start
      ? DateTime.fromJSDate(
          new Date(project.project_date.start)
        ).toFormat("d MMM yyyy")
      : "<<<ERROR: NO START DATE FOUND>>>";
  else if (word == "PROJECT_END_DATE")
    return project.project_date?.end
      ? DateTime.fromJSDate(
          new Date(project.project_date.end)
        ).toFormat("d MMM yyyy")
      : "<<<ERROR: NO END DATE FOUND>>>";
  else if (word == "DEADLINE_DATE")
    return project.project_delivery_date?.date
      ? DateTime.fromJSDate(
          new Date(project.project_delivery_date.date)
        ).toFormat("d MMM yyyy")
      : "<<<ERROR: NO DEADLINE FOUND>>>";
  else if (word == "PROJECT_NAME")
    return project.name || "The Project";
  else if (word == "BUSINESS_NAME")
    return business.name || "The Business";
  else if (word == "ABN") {
    return parseString(business.abn) || "<<<ERROR: NO ABN FOUND>>>";
  } else if (word == "CLIENT_NAME")
    return (
      (project.clients as FFClient | undefined)?.name || "THE CLIENT"
    );
  else if (word == "CLIENT_EMAIL")
    return (
      (project.clients as FFClient | undefined)?.email ||
      "<<<ERROR: NO CLIENT EMAIL FOUND>>>"
    );

  return `<<<ERROR: NO ${parseString(word).toUpperCase()} FOUND>>>`;
}

/**************************************
 * Enter text at the current position on a quill object
 * @param ref The quill object reference
 * @param text The text to insert
 */
export function insertTextAtCursor(
  ref: MutableRefObject<Quill>,
  text: string
) {
  let selection = (
    ref as MutableRefObject<Quill>
  ).current.getSelection(true);
  (ref as MutableRefObject<Quill>).current.insertText(
    selection.index,
    text
  );
}
