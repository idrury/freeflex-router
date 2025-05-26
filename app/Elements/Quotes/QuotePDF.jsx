import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { formatDatestring } from '../../Functions/Dates';

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: "medium",
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf",
      fontWeight: "heavy",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    margin: 20,
    fontFamily: 'Inter',
    fontWeight: "normal",
    fontSize: 12,
  },
  header: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 45,
    marginHorizontal: 25,
    paddingHorizontal: 10,
    marginTop: 30
  },

  header2: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 25,
    marginHorizontal: 25,
    paddingHorizontal: 10,
  },

  leftSection: {
    fontFamily: 'Inter',
    fontWeight: "normal",
    fontSize: 12,
    paddingHorizontal: 35,
    paddingVertical: 20
  },

  mainSection: {
    fontFamily: 'Inter',
    fontWeight: "normal",
    fontSize: 12,
    marginHorizontal: 25,
    padding: 10,

  },
  description: {
    fontFamily: 'Inter',
    fontWeight: "normal",
    fontSize: 12,
    marginHorizontal: 35,
    marginVertical: 10,
    borderRadius: 5,

    padding: 25
  },
  item: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  total: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    marginVertical: 20
  },
  disclaimer: {
    fontFamily: 'Inter',
    fontWeight: "normal",
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  quoteItem: {
    fontFamily: 'Inter',
    fontWeight: "normal",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  leftRow: {
    fontFamily: 'Inter',
    fontWeight: "normal",
    display: "flex",
    flexDirection: "row",
    marginVertical: 3
  }
});

// Create Document Component
const MyDocument = ({ options }) => (

    <Page>
      <View style={[styles.leftSection, { backgroundColor: options.color }]}>
        <View style={styles.leftRow}>
          {options.businessDetails?.logo && <Image src={options.businessDetails.logo} style={{ width: 100, height: 100, marginRight: 20 }} />}
          <View>
            <Text style={{ paddingVertical: 2, fontFamily: "Inter", fontWeight: 'bold', marginBottom: 10 }}>{options.businessDetails?.name}</Text>
            <Text style={{ paddingVertical: 2 }}>{`${options.businessDetails?.street_number} ${options.businessDetails?.street}, ${options.businessDetails?.suburb}`}</Text>
            <Text style={{ paddingVertical: 2 }}>{`${options.businessDetails?.state}, ${options.businessDetails?.postcode}`}</Text>
            <Text style={{ paddingVertical: 2, marginTop: 10 }}>{`${options.businessDetails?.phone}`}</Text>
          </View>
        </View>
      </View>
      <View style={styles.header}>
        <Text>QUOTE</Text>
      </View>
      <View style={styles.mainSection}>
        <Text style={{ marginBottom: 10 }}>{`${formatDatestring(options.date)}`}</Text>
        {options.project && <Text style={{  fontFamily: "Inter",fontWeight: 'bold', marginVertical: 5 }}>Project: {options.project}</Text>}
        {options.client && <Text style={{ fontFamily: "Inter",fontWeight: 'bold' }}>For: {options.client}</Text>}
      </View>
      <View style={[styles.description, {backgroundColor: options.color}]}>
        <Text>{options.description || ""}</Text>
      </View>
      <View style={[styles.description, {backgroundColor: options.color}]}>
        <View style={[styles.quoteItem, { fontFamily: "Inter",fontWeight: 'bold' }]}>
          <Text style={{ width: "50%" }}>ITEM</Text>
          <Text style={{ width: "15%" }}>QTY</Text>
          <Text style={{ width: "25%" }}>UNIT COST</Text>
          <Text style={{ width: "20%" }}>TOTAL</Text>
        </View>
        {options.items?.map((item, idx) => (
          <View style={styles.quoteItem} key={idx}>
            <Text style={{ width: "50%", fontFamily: "Inter",fontWeight: 'bold' }}>{item[0] || "no description"}</Text>
            <Text style={{ width: "15%" }}>{item[1] || 0}</Text>
            <Text style={{ width: "25%" }}>${item[2] || 0}</Text>
            <Text style={{ width: "20%" }}>${item[3] || 0}</Text>
          </View>
        ))}
      </View>
      <View style={styles.total}>
        <Text>TOTAL: ${options.total || 0}</Text>
      </View>
      {/* <View style={styles.disclaimer}>
        <Text>*Please note this is an estimate only</Text>
      </View> */}

    </Page>
);
export default MyDocument