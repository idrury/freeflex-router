import { StyleSheet } from "@react-pdf/renderer";

/**
 * A list of roman numerals
 */
export const ROMAN_NUMERALS = [
  "",
  "C",
  "CC",
  "CCC",
  "CD",
  "D",
  "DC",
  "DCC",
  "DCCC",
  "CM",
  "",
  "X",
  "XX",
  "XXX",
  "XL",
  "L",
  "LX",
  "LXX",
  "LXXX",
  "XC",
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
];

/**
 * The stylesheet used to build the delta PDF
 */
export const DELTA_STYLES = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontWeight: "normal",
    color: "#121212",
    fontSize: 10,
    borderRadius: 2,
    lineHeight: 2,
    padding: "10pt 0 30pt 0",
  },
  delta: {
    margin: "50 20 20 20",
    padding: 20,
  },
  header: {
    fontFamily: "Inter",
    fontWeight: "heavy",
    fontSize: 27,
    textTransform: "uppercase",
    position: "absolute",
    width: "100%",
    top: 0,
    height: 100,
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10 20",
    backgroundColor: "grey",
  },
  footer: {
    fontFamily: "Inter",
    fontWeight: "bold",
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10pt 20pt 0 20pt",
    backgroundColor: "grey",
  },
  p: {
    fontFamily: "Inter",
    fontWeight: "normal",
    fontSize: 10,
  },
  h1: {
    fontFamily: "Inter",
    fontWeight: "heavy",
    fontSize: 20,
  },
  h2: {
    fontFamily: "Inter",
    fontWeight: "heavy",
    fontSize: 14,
  },
  h3: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 10,
  },
  bold: {
    display: "flex",
    fontFamily: "Inter",
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  boldItalic: {
    fontStyle: "italic",
    fontWeight: "bold"
  },
  blockquote: {
    borderLeft: "3px solid #333333",
    paddingLeft: 10,
  },
  list: {
    fontFamily: "Inter",
    fontWeight: "normal",
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  listItem: {
    width: 15,
    fontWeight: "bold",
    marginRight: 10,
    paddingLeft: 5,
  },
  textLine: {
    position: "relative",
    left: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingBottom: 5,
  },
  space: {
    paddingRight: 5,
  },
});
