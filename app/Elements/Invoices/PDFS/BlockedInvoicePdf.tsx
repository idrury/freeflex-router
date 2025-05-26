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
import { InvoiceOptionsProps } from "../Types";
import { formatDatestring } from "../../../Functions/Dates";
import { BlockedPdfStyles as styles } from "./Data";

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
const BlockedInvoicePdf: FC<InvoiceOptionsProps> = ({ options }) => (
    <Page style={styles.page} wrap={false}>
      <View
        style={[
          styles.p2,
          styles.m2,
          styles.leftRow,
          styles.middle,
          { backgroundColor: options.color },
        ]}
      >
        {options.businessDetails?.logo && (
          <Image
            src={options.businessDetails.logo}
            style={{ width: 60, height: 60, marginRight: 10 }}
          />
        )}
        <Text style={styles.header}>
          {options?.gst?.show && options.isInvoice && "TAX "}
          {options.isInvoice ? "INVOICE" : "QUOTE"}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.m2, { width: "50%" }]}>
          <Text style={{ fontWeight: "medium" }}>
            Services provided by {options.businessDetails.name}
          </Text>
          {options.client && (
            <View style={styles.leftRow}>
              <Text style={{ fontWeight: "bold", width: 60 }}>
                Name
              </Text>
              <Text>{options.client.name}</Text>
            </View>
          )}

          {options.project && (
            <View style={styles.leftRow}>
              <Text style={{ fontWeight: "bold", width: 60 }}>
                Project
              </Text>
              <Text>{options.project.name}</Text>
            </View>
          )}

          {options.settings.show_client_details && (
            <View>
              {options.client?.phone && (
                <View style={styles.leftRow}>
                  <Text style={{ fontWeight: "bold", width: 60 }}>
                    Phone
                  </Text>
                  <Text>{options.client.phone}</Text>
                </View>
              )}
              {options.client?.email && (
                <View style={styles.leftRow}>
                  <Text style={{ fontWeight: "bold", width: 60 }}>
                    Email
                  </Text>
                  <Text>{options.client.email}</Text>
                </View>
              )}
            </View>
          )}

          {options.location && (
            <View style={styles.leftRow}>
              <Text style={{ fontWeight: "bold", width: 60 }}>
                Location
              </Text>
              <Text>{options.location}</Text>
            </View>
          )}
        </View>

        <View style={[styles.m2]}>
          {options.isInvoice && (
            <Text style={styles.header3}>
              Invoice {options.invoiceNumber}
            </Text>
          )}

          <View
            style={[
              styles.p2,
              { backgroundColor: options.color, width: 230 },
            ]}
          >
            <View style={styles.row}>
              <Text style={styles.bold}>Issued</Text>
              <Text>{formatDatestring(options.date)}</Text>
            </View>

            {options.dueDate && (
              <View style={styles.row}>
                <Text style={styles.bold}>Due</Text>
                <Text>{formatDatestring(options.dueDate)}</Text>
              </View>
            )}

            <View style={styles.m2}></View>

            {options.totalPaid && (
              <View style={styles.row}>
                <Text style={styles.bold}>Total paid</Text>
                <Text>${options.totalPaid}</Text>
              </View>
            )}

            {options.outstandingBalance && (
              <View style={styles.row}>
                <Text style={styles.bold}>Outstanding balance</Text>
                <Text>${options.outstandingBalance}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.m2]}>
        {options.description && (
          <View>
            <View
              style={[
                styles.leftRow,
                styles.p2,
                { backgroundColor: options.color },
              ]}
            >
              <Text>{options.description}</Text>
            </View>
          </View>
        )}

        <View
          style={[
            styles.bold,
            styles.leftRow,
            { paddingHorizontal: 10, paddingTop: 20 },
          ]}
        >
          <Text style={{ width: 245 }}>Service</Text>
          <Text style={{ width: 70 }}>Qty</Text>
          <Text style={{ width: 70 }}>Unit price</Text>
          <Text style={{ width: 70 }}>Total price</Text>
        </View>
        <View style={[styles.p2, { backgroundColor: options.color }]}>
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
        </View>

        <View style={[styles.row, { marginVertical: 10 }]}>
          <View>
            <View>
              <Text style={styles.header3}>
                {options.businessDetails?.name}
              </Text>
              {options.businessDetails.abn && (
                <View style={styles.leftRow}>
                  <Text style={[styles.bold, { width: 70 }]}>
                    ABN
                  </Text>
                  <Text>{options.businessDetails?.abn}</Text>
                </View>
              )}
              {options.businessDetails.phone && (
                <View style={styles.leftRow}>
                  <Text style={[styles.bold, { width: 70 }]}>
                    Mobile
                  </Text>
                  <Text>{options.businessDetails?.phone}</Text>
                </View>
              )}

              {options.businessDetails?.email && (
                <View style={styles.leftRow}>
                  <Text style={[styles.bold, { width: 70 }]}>
                    Email
                  </Text>
                  <Text>{options.businessDetails.email}</Text>
                </View>
              )}

              <View style={styles.leftRow}>
                <Text style={[styles.bold, { width: 70 }]}>
                  Address
                </Text>
                <View>
                  <Text
                    style={{ width: 250 }}
                  >{`${options.businessDetails?.street_number} ${options.businessDetails?.street}, ${options.businessDetails?.suburb}, ${options.businessDetails?.state}, ${options.businessDetails?.postcode}`}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ width: 250 }}>
            <View
              style={[
                styles.row,
                {
                  borderTopStyle: "solid",
                  borderTopWidth: 0.5,
                  borderTopColor: "#222222",
                  paddingTop: 5,
                },
              ]}
            >
              <Text style={{ fontWeight: "medium" }}>Subtotal</Text>
              <Text>${options.subTotal}</Text>
            </View>
            {options.invoiceDiscounts.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text>
                  {item.description}{" "}
                  {item.discount_type == "%" &&
                    `(${item.unit_cost}%)`}
                </Text>
                <Text>-${item.total}</Text>
              </View>
            ))}
            {options.gst.show && (
              <View style={styles.row}>
                <Text style={{ fontWeight: "medium" }}>
                  GST (10%)
                </Text>
                <Text>${options.gst.value}</Text>
              </View>
            )}
            <View style={{ paddingBottom: 5 }} />
            <View
              style={[
                styles.row,
                {
                  borderTopStyle: "solid",
                  borderTopWidth: 0.5,
                  borderTopColor: "#222222",
                  paddingVertical: 5,
                },
              ]}
            >
              <Text style={[styles.header3]}>Total</Text>
              <Text style={styles.header3}>${options.total}</Text>
            </View>
          </View>
        </View>
      </View>

      {options.isInvoice && (
        <View style={[styles.m2, { width: 300 }]}>
          <Text style={styles.header3}>Payment Information</Text>
          <View style={styles.leftRow}>
            <Text style={{ fontWeight: "bold", width: 100 }}>
              Name
            </Text>
            <Text>{options.businessDetails?.account_name}</Text>
          </View>
          <View style={styles.leftRow}>
            <Text style={{ fontWeight: "bold", width: 100 }}>
              BSB
            </Text>
            <Text>{options.businessDetails?.bsb_num}</Text>
          </View>
          <View style={styles.leftRow}>
            <Text style={{ fontWeight: "bold", width: 100 }}>
              Account No.
            </Text>
            <Text>{options.businessDetails?.account_num}</Text>
          </View>
          <View style={styles.leftRow}>
            <Text style={{ fontWeight: "bold", width: 100 }}>
              PayID
            </Text>
            <Text>{options.businessDetails?.pay_id || "-"}</Text>
          </View>
        </View>
      )}

      <View style={[styles.leftRow, styles.m2]}>
        <Text>{options.message}</Text>
      </View>
      <View style={[styles.m2]} />
    </Page>
);
export default BlockedInvoicePdf;
