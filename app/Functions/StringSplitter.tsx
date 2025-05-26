// Custom string splitter functions

/**
 * Split a string into multiple sections
 * @param string The string to split
 * @param length A number if there is only one split 
 * required, or an array representing how long each section of the string should be
 * @param type If a type is given, the length param is
 *  ignored and the string is split using an algorithm 
 * specific to the type of string (the length param is 
 * used however if the given string dosen't fit the length of the expected type)
 * @returns a string with spaces at the desired location(s)
 */
export default function splitString(
  string: string | undefined,
  length: number | number[],
  type?: "ACCOUNT" | "PHONE"
): string {
  if (!string) return "-";

  if (type) {
    if (type == "ACCOUNT") {
      if (string.length == 8) return splitFixedString(string, 4);
      else if (string.length == 9)
        return splitVariedString(string, [2, 3]);
      else if (string.length == 10)
        return splitVariedString(string, [4, 4]);
    }
  }

  if (typeof length === "object")
    return splitVariedString(string, length as number[]);
  else if (typeof length === "number")
    return splitFixedString(string, length as number);

  return "-";
}

/**
 * Handle splitting a string from an array
 * @returns
 */
function splitVariedString(
  string: string,
  lengths: number[]
): string {
  let localStr = "";
  let counter = 0;
  let section = 0;
  let endFound = false;

  for (let i = 0; i < string?.length; i++) {
    localStr = localStr.concat(string[i]);
    counter++;

    if (counter == lengths[section] && endFound == false) {
      localStr = localStr.concat(" ");
      counter = 0;
      if (section < lengths.length - 1) {
        section++;
      } else {
        endFound = true;
      }
    }
  }

  return localStr;
}

/**
 * Handle splitting a string from a number
 */
function splitFixedString(string: string, length: number): string {
  let localStr = "";
  let counter = 0;

  for (let i = 0; i < string?.length; i++) {
    localStr = localStr.concat(string[i]);
    counter++;

    if (counter == length) {
      localStr = localStr.concat(" ");
      counter = 0;
    }
  }

  return localStr;
}
