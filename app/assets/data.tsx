import { StyleSheet } from "@react-pdf/renderer";
import { ColorType, ExtendedColorType } from "./Types";

export const COLORS: ColorType[] = [
  { name: "Light Gray", hex: "#EEEEEEFF" },
  { name: "Creamy White", hex: "#EEE6DAFF" },
  { name: "Light Green", hex: "#D5F3EBFF" },
  { name: "Mint Green", hex: "#CAF1DEFF" },
  { name: "Pale Green", hex: "#E1F8DCFF" },
  { name: "Light Yellow", hex: "#FEF8DDFF" },
  { name: "Light Gold", hex: "#FFE7C7FF" },
  { name: "Peach", hex: "#F7D8BAFF" },
  { name: "Lavender", hex: "#EBD5F3FF" },
  { name: "Pinkish White", hex: "#F8E8F3FF" },
];

export const LIGHT_MODE_COLORS: ExtendedColorType[] = [
  {
    name: "White smoke",
    hex: "#f5f5f5ff",
    rgb: [245, 245, 245],
    cmyk: [0, 0, 0, 4],
    hsb: [0, 0, 96],
    hsl: [0, 0, 96],
    lab: [97, 0, 0],
  },
  {
    name: "Buff",
    hex: "#c89676ff",
    rgb: [200, 150, 118],
    cmyk: [0, 25, 41, 22],
    hsb: [23, 41, 78],
    hsl: [23, 43, 62],
    lab: [66, 15, 24],
  },
  {
    name: "Fawn",
    hex: "#eca877ff",
    rgb: [236, 168, 119],
    cmyk: [0, 29, 50, 7],
    hsb: [25, 50, 93],
    hsl: [25, 75, 70],
    lab: [74, 20, 35],
  },
  {
    name: "Jasmine",
    hex: "#f2d079ff",
    rgb: [242, 208, 121],
    cmyk: [0, 14, 50, 5],
    hsb: [43, 50, 95],
    hsl: [43, 82, 71],
    lab: [85, 1, 47],
  },
  {
    name: "Celadon",
    hex: "#b1d496ff",
    rgb: [177, 212, 150],
    cmyk: [17, 0, 29, 17],
    hsb: [94, 29, 83],
    hsl: [94, 42, 71],
    lab: [81, -23, 27],
  },
  {
    name: "Tiffany Blue",
    hex: "#90c7bbff",
    rgb: [144, 199, 187],
    cmyk: [28, 0, 6, 22],
    hsb: [167, 28, 78],
    hsl: [167, 33, 67],
    lab: [76, -20, 0],
  },
  {
    name: "Carolina blue",
    hex: "#7fb4e0ff",
    rgb: [127, 180, 224],
    cmyk: [43, 20, 0, 12],
    hsb: [207, 43, 88],
    hsl: [207, 61, 69],
    lab: [71, -6, -28],
  },
  {
    name: "Lavender (floral)",
    hex: "#a988dbff",
    rgb: [169, 136, 219],
    cmyk: [23, 38, 0, 14],
    hsb: [264, 38, 86],
    hsl: [264, 54, 70],
    lab: [63, 29, -38],
  },
  {
    name: "Persian pink",
    hex: "#e27db4ff",
    rgb: [226, 125, 180],
    cmyk: [0, 45, 20, 11],
    hsb: [327, 45, 89],
    hsl: [327, 64, 69],
    lab: [65, 46, -12],
  },
  {
    name: "Light coral",
    hex: "#f1767fff",
    rgb: [241, 118, 127],
    cmyk: [0, 51, 47, 5],
    hsb: [356, 51, 95],
    hsl: [356, 81, 70],
    lab: [64, 48, 18],
  },
];

/**
 * The stylesheet for the contracts pdf
 */
export const CONTRACT_STYLES = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontWeight: "normal",
    color: "#121212",
    fontSize: 10,
    borderRadius: 2,
    lineHeight: 2,
    padding: "30pt 0 30pt 0",
  },
  header: {
    fontFamily: "Inter",
    fontWeight: "extrabold",
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
});

const disableLimits = process.env.NODE_ENV == "development";
export const LIMITS = {
  contracts: disableLimits ? Infinity : 1,
  clients: disableLimits ? Infinity : 5,
  invoices: disableLimits ? Infinity : 1,
  projects: disableLimits ? Infinity : 5,
  expenses: disableLimits ? Infinity : 10,
};

export const CUSTOM_CONTRACT_WORDS = [
  "TODAYS_DATE",
  "PROJECT_START_DATE",
  "PROJECT_END_DATE",
  "DEADLINE_DATE",
  "PROJECT_NAME",
  "BUSINESS_NAME",
  "ABN",
  "CLIENT_NAME",
  "CLIENT_EMAIL",
] as const;
