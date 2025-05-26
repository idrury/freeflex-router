import { Link, Text } from "@react-pdf/renderer";
import {
  getLineTypeFromDeltaAttributes,
  getStylesFromDeltaAttributes,
} from "./DeltaBL";
import React from "react";

/**
 * Part of a DeltaLine in the pdf
 */
export default function DeltaLineSection({ insert, attributes }) {
  const lineType = getLineTypeFromDeltaAttributes(attributes);
  const styles = getStylesFromDeltaAttributes(attributes, false);

  if (lineType?.key == "link") {
    return <Link style={styles}>{insert}</Link>;
  } else return <Text style={styles}>{insert}</Text>;
}
