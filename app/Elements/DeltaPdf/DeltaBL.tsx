import { AttributeMap, Op } from "quill";
import { ROMAN_NUMERALS } from "./DATA";
import { listItemType } from "../../assets/Types";
import { DELTA_STYLES as styles } from "./DATA";

/**
 * This function is used to convert a quill delta into a format
 * which can be processed by our custom PDF builder
 * @param deltaOps The delta operations to build the pdf with
 * @returns
 */
export function splitDeltaIntoLines(deltaOps: Op[]) {
  const tempLines: [Op[]] = [[]];
  const maxLineLength = 90;
  let newLine: Op[] = [];
  let pushed = false;

  // Loop through each element in the delta operations list
  deltaOps.forEach((op, opIdx) => {
    let splitLine = (op.insert as string)?.split("\n");

    if (op.insert != "\n" && op.insert != "\n\n") {
      // If it is a normal element it could have
      // line breaks in the middle of a line
      splitLine.forEach((splitOp, idx) => {
        // Push each individual operation into a new line
        newLine.push({
          insert: splitOp,
          attributes: op.attributes,
        });

        /* Each part of the split should
         * be treated as a seperate line
         * if there are multiple lines in one */
        if (splitLine.length > 1) {
          newLine.push({
            insert: "\n",
            attributes: op.attributes,
          });
          /* Since this is a section break we immediately create
           * a new section */
          if (newLine.length > 0) tempLines.push(newLine);
          newLine = [];
          pushed = true;
        }
      });
      // When a section break is encountered
    } else {
      /* If a new line has already been pushed we need to update 
        the current attributes to affect the previous line, not this one */
      if (pushed == true) {
        pushed = false;
        let lastSection = tempLines[tempLines.length - 1].pop();
        if (lastSection) {
          tempLines[tempLines.length - 1].push({
            insert: lastSection.insert,
            attributes: op.attributes,
          });
        }
      } else {
        newLine.push(op);
      }

      // The document is terminated with a double \n
      if (op.insert == "\n\n") {
        newLine.push({ insert: "\n" });
      }

      // Finally push the new line to the array
      if (newLine.length > 0) tempLines.push(newLine);
      newLine = [];
    }
  });

  return tempLines;
}

/**
 * Turn a number into a roman numeral
 * @param num
 * @returns
 */
export function romanize(num) {
  if (isNaN(num)) return NaN;
  var digits: string[] = String(+num).split(""),
    key = ROMAN_NUMERALS,
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+(digits.pop() as string) + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

/**
 * Return a type of line based on delta attributes
 * @returns
 */
export function getLineTypeFromDeltaAttributes(
  attributes: AttributeMap | undefined
): listItemType | undefined {
  if (!attributes) return undefined;

  for (const [key, value] of Object.entries(attributes)) {
    if (key == "list") {
      Object.entries(attributes);
      let idt = Object.entries(attributes).find((entries) => {
        if (entries[0] == "indent") return entries[1];
      })?.[1] as number | undefined;
      return { key: value as string, attrs: { indent: idt || 0 } };
    } else if (key == "link") {
      return { key: "link" };
    } else if (key == "break") {
      return { key: "break" };
    }
  }

  return undefined;
}

/**
 * Return a pdf style based on a delta attribute
 * @param attributes The attributes of the line to style
 * @param isView Is the current section a paragraph?
 * @returns
 */
export function getStylesFromDeltaAttributes(
  attributes: AttributeMap | undefined,
  isView: boolean
): {}[] {
  const stylesToApply: {}[] = [styles.textLine];

  if (!attributes) {
    if (isView) stylesToApply.push(styles.p);
    return stylesToApply;
  }

  for (const [key, value] of Object.entries(attributes)) {
    if (key == "header") {
      if (value == 1) stylesToApply.push(styles.h1);
      else if (value == 2) stylesToApply.push(styles.h2);
      else if (value == 3) stylesToApply.push(styles.h3);
    } else if (key == "bold")
      stylesToApply.push({ fontWeight: "bold" });
    else if (key == "italic")
      stylesToApply.push({ fontStyle: "italic" });
    else if (key == "indent")
      stylesToApply.push({ paddingLeft: (value as number) * 10 });
    else if (key == "blockquote") {
      stylesToApply.push(styles.p);
      stylesToApply.push(styles.blockquote);
    } else if (key == "break") {
      if (isView) console.log(stylesToApply);
      stylesToApply.push({ height: 20 });
    } else if (key == "list") {
      stylesToApply.push(styles.list);
    } else {
      stylesToApply.push(styles.p);
    }
  }

  return stylesToApply;
}
