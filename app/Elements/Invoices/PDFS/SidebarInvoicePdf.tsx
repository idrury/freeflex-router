import React, { FC } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Font,
  Image,
} from "@react-pdf/renderer";
import { InvoiceOptionsProps } from "../Types";
import { formatDatestring } from "../../../Functions/Dates";
import { SidebarPdfStyles as styles } from "./Data";

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
const SidebarInvoicePdf: FC<InvoiceOptionsProps> = ({ options }) => (
    <Page style={styles.page} wrap={false}>
      <View style={[styles.leftRow, { marginVertical: 0 }]}>
        <View
          style={[
            styles.boxed,
            styles.verticalRow,
            {
              height: "100vh",
              maxWidth: 200,
              backgroundColor: options.color,
            },
          ]}
        >
          <View>
            {options.businessDetails?.logo && (
              <Image
                src={options.businessDetails.logo}
                style={{ width: 80, height: 80, marginRight: 30 }}
              />
            )}
            <View>
              <Text
                style={{
                  paddingVertical: 2,
                  fontFamily: "Inter",
                  fontWeight: "medium",
                  marginBottom: 10,
                }}
              >
                {options.businessDetails?.name}
              </Text>
              <Text
                style={{
                  paddingVertical: 2,
                  flexWrap: "wrap",
                  textOverflow: "ellipsis",
                }}
              >{`${options.businessDetails?.street_number} ${options.businessDetails?.street}, ${options.businessDetails?.suburb}, ${options.businessDetails?.state}, ${options.businessDetails?.postcode}`}</Text>
              <Text
                style={{ paddingVertical: 2, marginTop: 10 }}
              >{`${options.businessDetails?.email}`}</Text>
              <Text
                style={{ paddingVertical: 2 }}
              >{`${options.businessDetails?.phone}`}</Text>
            </View>
          </View>
          {options.settings.show_client_details == true && (
            <View>
              <Text style={{ fontWeight: "medium" }}>
                {options.client?.name || "-"}
              </Text>
              <Text>{options.client?.email}</Text>
              <Text>{options.client?.phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.container}>
          <View style={styles.header}>
            <Text>
              {options.isInvoice && options?.gst?.show && "TAX "}
              {options.isInvoice ? "INVOICE" : "QUOTE"}
            </Text>
          </View>

          <View>
            <Text
              style={{ fontFamily: "Inter", fontWeight: "medium" }}
            >
              Submitted on {formatDatestring(options.date)}
            </Text>
            {options.dueDate && (
              <Text
                style={{ fontFamily: "Inter", fontWeight: "medium" }}
              >
                Payment due on {formatDatestring(options.dueDate)}
              </Text>
            )}
            <View style={[styles.leftRow]}>
              <View style={{ width: "50%", flexWrap: "wrap" }}>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "medium",
                    marginVertical: 5,
                  }}
                >
                  for{" "}
                </Text>
                <Text
                  style={{ fontFamily: "Inter", marginBottom: 10 }}
                >
                  {options.client?.name}
                </Text>
              </View>

              {options.isInvoice && <View>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "medium",
                    marginVertical: 5,
                  }}
                >
                  Invoice
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  {options?.invoiceNumber}
                </Text>
              </View>}
            </View>

            <View style={styles.leftRow}>
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "medium",
                    marginVertical: 5,
                  }}
                >
                  Project
                </Text>
                <Text style={{ marginBottom: 10, flexWrap: "wrap" }}>
                  {options.project?.name}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "medium",
                    marginVertical: 5,
                  }}
                >
                  {options.businessDetails?.name}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  {options.businessDetails?.abn}
                </Text>
              </View>
            </View>

            <View style={styles.leftRow}>
              {options.location && (
                <View style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "medium",
                      marginVertical: 5,
                    }}
                  >
                    Location
                  </Text>
                  <Text style={{ marginBottom: 10 }}>
                    {options.location}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {options.description && (
            <View
              style={{
                width: 360,
                marginVertical: 10,
                borderTop: "1px solid #222222",
                borderBottom: "1px solid #222222",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{ flexWrap: "wrap", fontWeight: "medium" }}
              >
                {options.description}
              </Text>
            </View>
          )}

          <View style={styles.leftRow}>
            {options.totalPaid && (
              <View style={{ width: "40%" }}>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "medium",
                    marginVertical: 5,
                  }}
                >
                  Amount Paid
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  ${options.totalPaid}
                </Text>
              </View>
            )}

            {options.outstandingBalance && (
              <View>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "medium",
                    marginVertical: 5,
                  }}
                >
                  Outstanding Balance
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  ${options.outstandingBalance}
                </Text>
              </View>
            )}
          </View>

          <View>
            <View style={styles.leftRowHeader}>
              <Text style={{ width: 180 }}>Description</Text>
              <Text style={{ width: 55 }}>Qty</Text>
              <Text style={{ width: 55 }}>Unit price</Text>
              <Text style={{ width: 55 }}>Total price</Text>
            </View>
            {options.invoiceItems?.map((item, i) => (
              <View key={i} style={styles.leftRow}>
                <Text style={{ width: 180, fontWeight: "medium" }}>
                  {item.description}
                </Text>
                <Text style={{ width: 55 }}>{item.quantity}</Text>
                <Text style={{ width: 55 }}>${item.unit_cost}</Text>
                <Text style={{ width: 55 }}>${item.total}</Text>
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
                  marginTop: 10,
                },
              ]}
            >
              <Text style={{ fontWeight: "medium", width: 290 }}>
                Subtotal
              </Text>
              <Text style={{ fontWeight: "medium" }}>
                ${options.subTotal}
              </Text>
            </View>

            {options.invoiceDiscounts.map((item, i) => (
              <View key={i} style={styles.leftRow}>
                <Text style={{ width: 290 }}>
                  {item.description}{" "}
                  {item.discount_type == "%" &&
                    `(${item.unit_cost}%)`}
                </Text>
                <Text>-${item.total}</Text>
              </View>
            ))}

            {options.gst?.show && (
              <View style={styles.leftRow}>
                <Text style={{ width: 290, fontWeight: "medium" }}>
                  GST (10%)
                </Text>
                <Text style={{ width: 55 }}>
                  ${options.gst.value}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.leftRow,
                {
                  borderTopStyle: "solid",
                  borderTopWidth: 0.5,
                  borderTopColor: "#222222",
                  paddingVertical: 5,
                  marginTop: 5,
                },
              ]}
            >
              <Text style={{ fontWeight: "medium", width: 290 }}>
                Total
              </Text>
              <Text style={{ fontWeight: "medium" }}>
                ${options.total || 0}
              </Text>
            </View>
          </View>

         {options.isInvoice && <View style={{ marginTop: 5 }}>
            <View style={styles.header3}>
              <Text>Payable to {options.businessDetails?.name}</Text>
            </View>
            <View style={styles.leftRow}>
              <Text style={{ width: "100", fontWeight: "medium" }}>
                Name
              </Text>
              <Text>{options.businessDetails?.account_name}</Text>
            </View>
            <View style={styles.leftRow}>
              <Text style={{ width: "100", fontWeight: "medium" }}>
                BSB
              </Text>
              <Text>{options.businessDetails?.bsb_num}</Text>
            </View>
            <View style={styles.leftRow}>
              <Text style={{ width: "100", fontWeight: "medium" }}>
                Account No.
              </Text>
              <Text>{options.businessDetails?.account_num}</Text>
            </View>
            <View style={styles.leftRow}>
              <Text style={{ width: "100", fontWeight: "medium" }}>
                PayID
              </Text>
              <Text>{options.businessDetails?.pay_id || "-"}</Text>
            </View>
          </View>}

          {options.message && (
            <View style={{ width: 360, marginVertical: 20 }}>
              <Text style={{ flexWrap: "wrap" }}>
                {options.message}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Page>
);
export default SidebarInvoicePdf;
