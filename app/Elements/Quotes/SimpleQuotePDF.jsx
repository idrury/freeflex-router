import React from 'react';
import { Page, Text, View, Document, StyleSheet,Font, Image } from '@react-pdf/renderer';
import { formatDatestring } from '../../Functions/Dates';

Font.register({ 
  family: 'Inter',
  fonts: [
      {
          src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
      },
      {
          src: "https://fonts.gstatic.com/s/figtree/v6/_Xmz-HUzqDCFdgfMsYiV_F7wfS-Bs_dNQF5ewkEU4HTy.ttf",
          fontWeight: 'bold',
      },
      {
          src: "https://fonts.gstatic.com/s/figtree/v6/_Xmz-HUzqDCFdgfMsYiV_F7wfS-Bs_dNQF5ewkEU4HTy.ttf",
          fontWeight: 'black',
      }
  ]})

// Create styles
const styles = StyleSheet.create({
  page: {
    margin: 20,
    fontFamily: 'Inter'
  },
  header: {
    fontWeight: 'bold',
    fontSize: 45,
    marginHorizontal: 25,
    paddingHorizontal: 10,
    marginTop: 30
  },

  header2: {
    fontWeight: 'bold',
    fontSize: 25,
    marginHorizontal: 25,
    paddingHorizontal: 10,
  },

  leftSection: {
    fontSize: 12,
    paddingHorizontal: 35,
    paddingVertical: 20,
    backgroundColor: '#dddddd'
  },

  mainSection: {
    fontSize: 12,
    marginHorizontal: 25,
    padding: 10,
    
  },
  description: {
    fontSize: 12,
    marginHorizontal: 35,
    marginVertical: 10,
    backgroundColor: '#dddddd',
    borderRadius: 5,

    padding: 25
  },
  item: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  itemsSection: {
    fontSize: 12,
    margin: 35,
    backgroundColor: '#dddddd',
    borderRadius: 5,

    padding: 25
  },
  total: {
    fontWeight: 'bold',
    fontSize: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    marginVertical: 20
  },
  disclaimer: {
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  quoteItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  leftRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 3
  }
});

// Create Document Component
const MyDocument = ({ 
    businessDetails,
    date, 
    client,
    project,
    description, 
    total, 
    quoteItems,
    loading}) => (
        

    <Page>
    <View style={styles.leftSection}>
        <View style={styles.leftRow}>
            {businessDetails?.logo && <Image src={businessDetails.logo} style={{width: 100, height: 100, marginRight: 20}}/>}
            <View>
            <Text style={{paddingVertical: 2, fontWeight: 'bold', marginBottom: 10}}>{businessDetails?.name}</Text>
            <Text style={{paddingVertical: 2}}>{`${businessDetails?.street_number} ${businessDetails?.street}, ${businessDetails?.suburb}`}</Text>
            <Text style={{paddingVertical: 2}}>{`${businessDetails?.state}, ${businessDetails?.postcode}`}</Text>
            <Text style={{paddingVertical: 2, marginTop: 10}}>{`${businessDetails?.phone}`}</Text>
            </View>
          </View>
      </View>
      <View style={styles.header}>
        <Text>VIDEO QUOTE</Text>
      </View>
      <View style={styles.mainSection}>
        <Text style={{marginBottom: 10}}>{`${formatDatestring(date)}`}</Text>
        {project && <Text style={{fontWeight: 'bold', marginVertical: 5}}>Project {project}</Text>}
        {client && <Text style={{fontWeight: 'bold'}}>for {client}</Text>}
      </View>
      <View style={styles.description}>
        <Text>{description || ""}</Text>
      </View>
      <View style={styles.description}>
      <View style={[styles.quoteItem, {fontWeight: 'bold'}]}>
            <Text style={{width: "50%"}}>ITEM</Text>
            <Text style={{width: "15%"}}>QTY</Text>
            <Text style={{width: "25%"}}>UNIT COST</Text>
            <Text style={{width: "20%"}}>TOTAL</Text>
        </View>
      {quoteItems?.map((item, idx) => (
          <View style={styles.quoteItem} key={idx}>
            <Text style={{width: "50%", fontWeight: 'bold'}}>{item[0] || "no description"}</Text>
            <Text style={{width: "15%"}}>{item[1] || 0}</Text>
            <Text style={{width: "25%"}}>${item[2] || 0}</Text>
            <Text style={{width: "20%"}}>${item[3] || 0}</Text>
          </View>
                ))}
        </View>
      <View style={styles.total}>
        <Text>TOTAL: ${total || 0}</Text>
      </View>
      {/* <View style={styles.disclaimer}>
        <Text>*Please note this is an estimate only</Text>
      </View>
      */}
    </Page>

);
export default MyDocument