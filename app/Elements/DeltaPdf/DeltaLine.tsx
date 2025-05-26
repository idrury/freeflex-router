import { AttributeMap, Op } from "quill";
import {
  getLineTypeFromDeltaAttributes,
  getStylesFromDeltaAttributes,
  romanize,
} from "./DeltaBL";
import { DELTA_STYLES as styles } from "./DATA";
import { Text, View } from "@react-pdf/renderer";
import React from "react";
import DeltaLineSection from "./DeltaLineSection";

/**
 * A paragraph
 */
export function DeltaLine({
  elements,
  increaseOrder,
  resetCount,
}: {
  elements: Op[];
  increaseOrder;
  orderCount: number[];
  resetCount: any;
}) {
  let lineAttrs: AttributeMap | undefined =
    elements[elements.length - 1]?.attributes;
  const lineType = getLineTypeFromDeltaAttributes(lineAttrs);

  /**
   * Return a number, letter or roman numeral
   * based on the indent level of a list
   * @param indent The level of indent of the list. 0=number, 1=letter, 2=roman, 3(+)=number
   * @returns
   */
  function getCountNumber(indent) {
    let num = increaseOrder(indent);

    if (indent == 1)
      return String.fromCharCode(96 + num).concat("."); // 1.
    else if (indent == 2)
      return romanize(num).toString().concat("."); // a.
    else if (indent > 2) return num.toString(); //i.
    else return num.toString().concat(".");
  }

  if (lineType?.key != "ordered") resetCount();

  return (
    <View style={getStylesFromDeltaAttributes(lineAttrs, true)}>
      {lineType?.key == "bullet" && (
        <Text style={styles.listItem}>{`\x95`}</Text>
      )}
      {lineType?.key == "ordered" && (
        <Text style={styles.listItem}>{`${getCountNumber(
          lineType.attrs?.indent
        )}`}</Text>
      )}
      {elements.map((e, i) => {
        if (e.insert && i < elements.length - 1)
          return (
            <DeltaLineSection
              key={i}
              insert={e.insert}
              attributes={e.attributes}
            />
          );
      })}
    </View>
  );
}
