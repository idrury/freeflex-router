import { Op } from "quill";
import { View } from "@react-pdf/renderer";
import { DeltaLine } from "./DeltaLine";
import React from "react";
import { splitDeltaIntoLines } from "./DeltaBL";
import { DELTA_STYLES as styles } from "./DATA";

/**
 * A PDF built from an array of delta operations
 * @param deltaOps The delta.ops to build the pdf from
 */
export default function DeltaView({ deltaOps }: { deltaOps: Op[] }) {
  const deltaLines: [Op[]] = splitDeltaIntoLines(deltaOps);
  let orderCount = [0, 0, 0];

  // Get indent level for undordered list
  function increaseOrderCount(level: number) {
    if (level > orderCount.length - 1) return `\x95`; // dotpoint

    orderCount[level]++;
    return orderCount[level];
  }

  function resetCount() {
    orderCount = [0, 0, 0];
  }

  return (
    <View style={styles.delta}>
      {deltaLines.map((e, i) => (
        <DeltaLine
          key={i}
          elements={e}
          increaseOrder={increaseOrderCount}
          orderCount={orderCount}
          resetCount={resetCount}
        />
      ))}
    </View>
  );
}
