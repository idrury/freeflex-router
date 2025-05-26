import React, { useEffect, useState } from "react";
import PageNavigationMenu from "../PageNavigationMenu";
import { reRouteTo } from "../../Functions/commonFunctions";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./HelpPage.css";
import IonIcon from "@reacticons/ionicons";
import {buildMarkdownFromSections, parseMarkdownToSections } from "../CsvImport/ImportBL";

export default function MarkdownPage({markdown, title}) {
  const [sections, setSections] = useState<string[]>();
  const [markdownText, setMarkdownText] = useState<string>();

  useEffect(() => {
    const secs = parseMarkdownToSections(markdown, "##")
    setSections(secs);
    setMarkdownText(buildMarkdownFromSections(secs))
  }, []);


  if(!sections) return;
  return (
    <div className="mediumFade">
      <div
        style={{ margin: "20px 10px", padding: "30px 20px" }}
        className="boxed boxedOutline centerRow middle"
      >
        <IonIcon
          name="help-circle"
          style={{ width: 50, height: 50 }}
        />
        <h1 className="textCenter">
          {title}
        </h1>
      </div>
      <div
        className="leftRow"
        style={{ maxWidth: 1400, marginTop: -40 }}
      >
        <PageNavigationMenu
          sections={sections}
          width={250}
          onTagClick={(sec) => reRouteTo(sec)}
        />
        <div className="m2 p2">
          <div className="ff-markdown">
            <ReactMarkdown
              children={markdownText}
              rehypePlugins={[rehypeRaw]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
