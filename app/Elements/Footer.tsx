import React from "react";
import { ALWAYS_ACCESSIBLE_PAGES } from "./Help/MdData";

interface FooterProps {
  menuVisible?: boolean;
}

export default function Footer({ menuVisible }: FooterProps) {
  return (
    <div
      id="footer"
      style={{
        bottom: 0,
        width: "100%",
        height: 70,
        background: "var(--primaryColor)",
      }}
    >
      <div
        className="centerRow middle pl2 pr2 m2 h100"
        style={{ paddingLeft: `${menuVisible ? 300 : 0}px` }}
      >
        <a
          href={`/help/${ALWAYS_ACCESSIBLE_PAGES.find(
            (page) => page.id == 1
          )?.url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#121212" }}
        >
          Privacy Policy
        </a>
        <a
          href={`/help/${ALWAYS_ACCESSIBLE_PAGES.find(
            (page) => page.id == 2
          )?.url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#121212" }}
        >
          Terms of service
        </a>
        <a
          href="mailto:isaac@freeflex.com.au"
          style={{ color: "#121212" }}
        >
          Contact
        </a>
      </div>
    </div>
  );
}
