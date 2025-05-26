import { PDFDownloadLink } from "@react-pdf/renderer"
import QuotePDF from "./QuotePDF"

export default function PDFDownload() {
<div>
    <PDFDownloadLink document={<QuotePDF />} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink>
  </div>
}