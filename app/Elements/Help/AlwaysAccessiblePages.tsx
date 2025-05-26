import React, { useEffect, useState } from "react";
import MarkdownPage from "./MarkdownPage";
import { ALWAYS_ACCESSIBLE_PAGES } from "./MdData";
import { getUrlPage } from "./HelpBL";
import { FFPage } from "../../assets/Types";
import HelpPage from "./HelpPage";
import Footer from "../Footer";
import AuthHeaderBar from "../Auth/AuthHeaderBar";

interface AlwaysAccessiblePagesProps {
  page: string;
  width: number;
  authorized: boolean;
}

export default function AlwaysAccessiblePages({
  page,
width,
authorized
}: AlwaysAccessiblePagesProps) {
  const [renderPage, setRenderPage] = useState<FFPage>();

  useEffect(() => {
    getRenderPage();
  }, []);

  /*****************************************
   * Get the page to render based on the URL
   */
  function getRenderPage() {
    ALWAYS_ACCESSIBLE_PAGES.forEach((page_obj) => {
      if (page_obj.url == getUrlPage(page)) {
        setRenderPage(page_obj);
        return;
      }
    });
  }

  return (
    <div>
      <div style={{ minHeight: "100vh" }}>
        <AuthHeaderBar width={width} authorized={authorized} />
        {renderPage ? (
          <MarkdownPage
            markdown={renderPage.markdown}
            title={renderPage.title}
          />
        ) : (
          <HelpPage />
        )}
      </div>
      <Footer menuVisible={false} />
    </div>
  );
}
