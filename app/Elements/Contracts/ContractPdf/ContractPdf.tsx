import React from "react";
import { Page, Text, View, Font, Image } from "@react-pdf/renderer";
import { CONTRACT_STYLES as styles } from "../../../assets/data";
import { ContractPdfType } from "../../../assets/Types";
import { DateTime } from "luxon";
import DeltaView from "../../DeltaPdf/DeltaView";

//From: https://webfonts.googleapis.com/v1/webfonts?family=Inter&sort=ALPHA&key=AIzaSyD1G6_aR2QBcaxiKvydy14GOP6cXSIvSt0

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
      src: "https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf",
      fontWeight: "heavy",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCM3FwrK3iLTcvneQg7Ca725JhhKnNqk4j1ebLhAm8SrXTch9thjZ-Ek-7MeA.ttf",
      fontStyle: "italic",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCM3FwrK3iLTcvneQg7Ca725JhhKnNqk4j1ebLhAm8SrXTcB9xhjZ-Ek-7MeA.ttf",
      fontStyle: "italic",
      fontWeight: "bold"
    },
  ],
});

/**
 * A react-pdf page which uses the delta 
 * PDF custom library to convert a series
 * of delta ops to a pdf
 * @returns
 */
export default function ContractPdf({
  delta,
  businessDetails,
  color,
}: ContractPdfType) {
  if (!delta) {
    return (
      <Page style={styles.page}>
        <Text>No text given</Text>
      </Page>
    );
  }

  return (
    <Page style={styles.page} wrap>
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={{ marginTop: 10 }}>Contract</Text>
        {businessDetails?.logo && (
          <Image
            src={businessDetails.logo}
            style={{ height: "100%", marginRight: 20 }}
          />
        )}
      </View>
      {delta?.length > 0 && <DeltaView deltaOps={delta} />}
      <View fixed style={[styles.footer, { backgroundColor: color }]}>
        <Text>{businessDetails?.name}</Text>
        <Text>{DateTime.now().toFormat("MMM dd yyyy")}</Text>
      </View>
    </Page>
  );
}
