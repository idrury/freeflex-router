import { StyleSheet } from "@react-pdf/renderer";

// Create styles
export const BlockedPdfStyles = StyleSheet.create({
    page: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'normal',
        borderRadius: 2,
        lineHeight: 1.5,
        width: 595,
        minHeight: 842
    },
    normal: {
        fontFamily: "Inter",
        fontSize: 12,
        fontWeight: 'normal'
    },
    bold: {
        fontFamily: "Inter",
        fontSize: 12,
        fontWeight: 'bold'
    },
    header: {
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: 45,
        paddingTop: 10
    },

    header2: {
        textAlign: 'left',
        fontFamily: 'Inter',
        fontWeight: 'medium',
        fontSize: 25,
        marginHorizontal: 25,
        paddingHorizontal: 10,
    },

    header3: {
        fontFamily: 'Inter',
        display: "flex",
        fontWeight: 'medium',
        textAlign: 'left',
        fontSize: 15
    },
    leftRow: {
        display: "flex",
        flexDirection: "row"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    rightRow: {
        display: "flex",
        flexDirection: "row",

        justifyContent: "flex-end",
        alignItems: "center",
        alignContent: "center"
    },
    m2: {
        margin: 10
    },
    m3: {
        margin: 20
    },
    p2: {
        padding: 10
    },
    middle: {
        alignItems: 'center'
    },
    center: {
        justifyContent: 'center'
    }
});


// Create styles
export const DefaultPdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 1.5,
    width: 595,
    minHeight: 842,
  },
  header: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 45,
    marginHorizontal: 25,
    paddingHorizontal: 10,
    marginTop: 30,
  },

  header2: {
    fontFamily: "Inter",
    fontWeight: "medium",
    fontSize: 25,
    marginHorizontal: 25,
    paddingHorizontal: 10,
  },

  header3: {
    fontFamily: "Inter",
    display: "flex",
    fontWeight: "medium",
    fontSize: 15,
    marginVertical: 10,
  },

  leftSection: {
    fontFamily: "Inter",
    fontSize: 12,
    paddingHorizontal: 35,
    paddingVertical: 10,
  },

  mainSection: {
    fontFamily: "Inter",
    fontSize: 12,
    marginHorizontal: 25,
    padding: 10,
  },
  description: {
    fontSize: 12,
    marginHorizontal: 35,
    marginVertical: 10,
    borderRadius: 2,

    padding: 25,
  },
  item: {
    fontWeight: "medium",
    marginVertical: 5,
  },
  itemsSection: {
    fontSize: 12,
    marginHorizontal: 35,
    marginVertical: 10,
    borderRadius: 2,

    padding: 25,
  },
  total: {
    fontWeight: "bold",
    fontSize: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    marginVertical: 20,
  },
  disclaimer: {
    fontSize: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  leftRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 3,
  },
  rightRow: {
    display: "flex",
    flexDirection: "row",

    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 3,
  },
  leftRowHeader: {
    fontWeight: "medium",
    display: "flex",
    paddingBottom: 2,

    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",

    flexDirection: "row",
    marginVertical: 10,
  },
  normalText: {
    fontFamily: "Inter",
    fontWeight: "normal",
  },
  boldText: {
    fontFamily: "Inter",
    fontWeight: "bold",
  },
});


// Create styles
export const SidebarPdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 11,
    lineHeight: 1.5,
    width: 595,
    minHeight: 842,
  },
  header: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 45,
    marginVertical: 10,
  },

  header2: {
    fontFamily: "Inter",
    fontWeight: "medium",
    fontSize: 25,
    marginVertical: 10,
  },

  header3: {
    display: "flex",
    fontFamily: "Inter",
    fontWeight: "medium",
    fontSize: 15,
    marginVertical: 10,
  },
  container: {
    margin: 10,
  },
  boxed: {
    padding: 20,
  },
  total: {
    fontFamily: "Inter",
    fontSize: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    marginVertical: 20,
  },
  leftRow: {
    fontFamily: "Inter",
    display: "flex",
    flexDirection: "row",
    marginVertical: 3,
  },
  row: {
    fontFamily: "Inter",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
  },
  verticalRow: {
    fontFamily: "Inter",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rightRow: {
    fontFamily: "Inter",
    display: "flex",
    flexDirection: "row",

    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 3,
  },
  leftRowHeader: {
    fontFamily: "Inter",
    fontWeight: "medium",
    display: "flex",
    paddingBottom: 10,

    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",

    flexDirection: "row",
    marginVertical: 10,
  },
});