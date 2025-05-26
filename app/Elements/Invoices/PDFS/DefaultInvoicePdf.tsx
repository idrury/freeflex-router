import React, { FC } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { formatDatestring } from "../../../Functions/Dates";
import { DefaultPdfStyles as styles } from "./Data";
import { InvoiceOptionsProps } from "../Types";

//From: https://webfonts.googleapis.com/v1/webfonts?family=Montserrat&sort=ALPHA&key=AIzaSyD1G6_aR2QBcaxiKvydy14GOP6cXSIvSt0

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
  ],
});

// Create Document Component
const DefaultInvoicePdf: FC<InvoiceOptionsProps> = ({ options }) => (
    <Page style={styles.page} wrap={false}>
      <View
        style={[
          styles.leftSection,
          { backgroundColor: options.color },
        ]}
      >
        <View style={styles.leftRow}>
          {options.businessDetails?.logo && (
            <Image
              src={options.businessDetails.logo}
              style={{ width: 100, height: 100, marginRight: 20 }}
            />
          )}
          <View>
            <Text
              style={{ paddingVertical: 2, fontWeight: "medium" }}
            >
              {options.businessDetails?.name}
            </Text>
            {options.businessDetails.abn && (
              <Text style={{ paddingVertical: 2, marginBottom: 10 }}>
                {options.businessDetails?.abn}
              </Text>
            )}

            <Text
              style={{ paddingVertical: 2 }}
            >{`${options.businessDetails?.street_number} ${options.businessDetails?.street}, ${options.businessDetails?.suburb}, ${options.businessDetails?.state}, ${options.businessDetails?.postcode}`}</Text>
            {options.businessDetails.email && (
              <Text style={{ paddingVertical: 2, marginTop: 5 }}>
                {options.businessDetails?.email}
              </Text>
            )}
            {options.businessDetails.phone && (
              <Text style={{ paddingVertical: 2 }}>
                {options.businessDetails?.phone}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text>
          {(options?.gst?.show && options.isInvoice) && "TAX "}
          {options.isInvoice ? "INVOICE" : "QUOTE"}
        </Text>
      </View>

      <View style={styles.mainSection}>
        {options.isInvoice && (
          <Text style={{ fontWeight: "medium", marginRight: 4 }}>
            Invoice {options.invoiceNumber}
          </Text>
        )}
        <View style={styles.leftRow}>
          <View style={styles.leftRow}>
            {options.project && (
              <Text style={{ fontWeight: "medium", marginRight: 3 }}>
                {options.project?.name} |
              </Text>
            )}
            {options.client && (
              <Text style={{ fontWeight: "medium" }}>
                {options.client?.name}{" "}
                {options.settings.show_client_details &&
                  options.client.email &&
                  `(${options.client.email})`}
              </Text>
            )}
          </View>
        </View>
        <View>
          <Text style={{ marginBottom: 10 }}>
            Submitted on {formatDatestring(options.date)}
          </Text>
          {options.dueDate && (
            <Text style={{ fontWeight: "medium", marginBottom: 10 }}>
              Payment due by {formatDatestring(options.dueDate)}
            </Text>
          )}
        </View>
      </View>

      {options.description && (
        <View style={styles.mainSection}>
          <Text style={{ fontWeight: "medium" }}>Description</Text>
          <Text>{options.description}</Text>
        </View>
      )}

      {options.location && (
        <View style={styles.mainSection}>
          <Text style={{ fontWeight: "medium" }}>Location</Text>
          <Text>{options.location}</Text>
        </View>
      )}

      <View style={[styles.leftRow, styles.leftSection]}>
        {options.totalPaid && (
          <View style={{ width: "40%" }}>
            <Text style={{ fontWeight: "medium" }}>Total paid</Text>
            <Text>${options.totalPaid}</Text>
          </View>
        )}

        {options.outstandingBalance && (
          <View>
            <Text style={{ fontWeight: "medium" }}>Outstanding balance</Text>
            <Text>${options.outstandingBalance}</Text>
          </View>
        )}
      </View>


        <View
          style={[
            styles.itemsSection,
            { backgroundColor: options.color },
          ]}
        >
          <View style={styles.leftRowHeader}>
            <Text style={{ width: 245 }}>Description</Text>
            <Text style={{ width: 70 }}>Qty</Text>
            <Text style={{ width: 70 }}>Unit price</Text>
            <Text style={{ width: 70 }}>Total price</Text>
          </View>
          {options.invoiceItems?.map((item, i) => (
            <View key={i} style={styles.leftRow}>
              <Text style={{ width: 250, fontWeight: "medium" }}>
                {item.description}
              </Text>
              <Text style={{ width: 70 }}>{item.quantity}</Text>
              <Text style={{ width: 70 }}>${item.unit_cost}</Text>
              <Text style={{ width: 70 }}>${item.total}</Text>
            </View>
          ))}
          <View
            style={[
              styles.leftRow,
              {
                borderTopStyle: "solid",
                borderTopWidth: 0.5,
                borderTopColor: "#222222",
                paddingTop: 10,
              },
            ]}
          >
            <Text style={{ width: 390, fontWeight: "medium" }}>
              Subtotal
            </Text>
            <Text style={{ width: 70 }}>${options.subTotal}</Text>
          </View>
          {options.invoiceDiscounts.map((item, i) => (
            <View key={i} style={styles.leftRow}>
              <Text style={{ width: 390 }}>
                {item.description}{" "}
                {item.discount_type == "%" && `(${item.unit_cost}%)`}
              </Text>
              <Text style={{ width: 70 }}>-${item.total}</Text>
            </View>
          ))}
          {options.gst.show && (
            <View style={styles.leftRow}>
              <Text style={{ width: 390, fontWeight: "medium" }}>
                GST (10%)
              </Text>
              <Text style={{ width: 70 }}>${options.gst.value}</Text>
            </View>
          )}
          <View
            style={[
              styles.leftRow,
              {
                borderTopStyle: "solid",
                borderTopWidth: 0.5,
                borderTopColor: "#222222",
              },
            ]}
          >
            <Text style={[styles.header3, { width: 392 }]}>
              Total
            </Text>
            <Text style={styles.header3}>${options.total}</Text>
          </View>
        </View>
      
        {options.isInvoice &&
      <View
        style={[
          styles.description,
          { backgroundColor: options.color },
        ]}
      >
        <View style={styles.header3}>
          <Text>Payable to {options.businessDetails?.name}</Text>
        </View>

        <View style={styles.leftRow}>
          <Text style={{ marginRight: "50pt", fontWeight: "medium" }}>
            Name
          </Text>
          <Text>{options.businessDetails?.account_name}</Text>
        </View>
        <View style={styles.leftRow}>
          <Text style={{ marginRight: "60pt", fontWeight: "medium" }}>
            BSB
          </Text>
          <Text>{options.businessDetails?.bsb_num}</Text>
        </View>
        <View style={styles.leftRow}>
          <Text style={{ marginRight: "12pt", fontWeight: "medium" }}>
            Account No.
          </Text>
          <Text>{options.businessDetails?.account_num}</Text>
        </View>
        <View style={styles.leftRow}>
          <Text style={{ marginRight: "50pt", fontWeight: "medium" }}>
            PayID
          </Text>
          <Text>{options.businessDetails?.pay_id || "-"}</Text>
        </View>
      </View>
}
      <View style={styles.mainSection}>
        <Text>{options.message}</Text>
      </View>
    </Page>
);
export default DefaultInvoicePdf;
