import { ALWAYS_ACCESSIBLE_PAGES } from "./MdData";

/**
 * Checks if the given URL is a valid url of a help page.
 * @param url The FULL url to check (must include https:// or will fail)
 * @returns Boolean indicating if the URL is a help page
 */
export function isHelpUrl(url: string) {
  const exists = !!ALWAYS_ACCESSIBLE_PAGES.find(
    (page) => page.url == getUrlPage(url)
  );
  return exists;
}

/*******************************************
 * Get a specific section a url
 * @param url The full url to check
 * @param level The section number to get (From first /)
 * @returns a string of the section name (or empty for invalid section)
 */
export function getUrlPage(url: string, level = 2) {
  let text = url.split("/")[2 + level];

  if (text) return text.split("?")[0].split("#")[0];
  else return "";
}
