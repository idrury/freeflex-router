import React, { useEffect, useState } from "react";
import {
  parseMDtoHeaders,
  parseSectionToUrlSection,
} from "./CsvImport/ImportBL";
import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../Functions/commonFunctions";

interface PageNavigationMenuProps {
  sections: string[];
  width: number;
  onTagClick: (sectionNumber: string) => void;
}

/*****************************************
 * Create a navigation menu based on a given page structure
 */
export default function PageNavigationMenu({
  sections,
  width,
  onTagClick,
}: PageNavigationMenuProps) {
  useEffect(() => {}, []);

  const splitData = parseMDtoHeaders(sections);

  return (
    <div
      style={{
        minWidth: width,
        height: "100%",
        minHeight: "95vh",
        position: "sticky",
        top: 10,
        marginTop: 40,
      }}
      className="col boxed boxedOutline m0"
    >
      <button
        className="centerRow p2 m0 mb2 accentButton middle"
        onClick={() => reRouteTo("/help")}
      >
        <IonIcon name="home-sharp" className="mr2 smallIcon" />
        All help
      </button>
      {splitData?.map((section) => (
        <button
          key={section}
          className="p0 pl2 m0 mb2"
          onClick={() =>
            onTagClick(parseSectionToUrlSection(`${section}`))
          }
        >
          <h3 className="textLeft">{`> ${section}`}</h3>
        </button>
      ))}
    </div>
  );
}
