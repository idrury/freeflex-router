import React, { useState } from "react";
import { ALWAYS_ACCESSIBLE_PAGES } from "./MdData";
import IonIcon from "@reacticons/ionicons";

export default function HelpPage() {
  const [filterText, setFilterText] = useState<string>();

  return (
    <div className="w100">
      <div className="boxedAccent m0">
        <div className="m2 center middle">
          <IonIcon
            name="help-circle"
            className="basicIcon"
            style={{ height: 50, width: 50 }}
          />
          <h1 className="centerRow">Need some help?</h1>
        </div>
        <div className="center">
          <h3 className="textCenter">
            On this page you'll find all of our documents about how to
            use FreeFlex. We know it can be confusing sometimes!
          </h3>
        </div>
        <div
          className="centerRow w100 mt2 m0 "
          style={{ margin: "30px 0px" }}
        >
          <div className="w25">
            <div className="pr3">
              <input
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="search for articles"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 40 }} />

      {filterText ? (
        <div className="leftRow wrap">
          {ALWAYS_ACCESSIBLE_PAGES.filter((page) => {
            return (
              page.url.includes(filterText) ||
              page.title.toLowerCase().includes(filterText) ||
              page.description.toLowerCase().includes(filterText)
            );
          }).map((page) => (
            <button
              key={page.url}
              className="leftRow p2 m2 w33 middle"
              onClick={() =>
                window.open(`/help/${page.url}`, "_blank")
              }
            >
              <IonIcon
                name="document-text-sharp"
                className="basicIcon mr2"
                style={{ width: 60, height: 60 }}
              />
              <div>
                <h3
                  style={{ fontSize: "15pt" }}
                  className="textLeft p0 mb1"
                >
                  {page.title}
                </h3>
                <p
                  style={{ lineHeight: 2, fontWeight: 400 }}
                  className="textLeft m0"
                >
                  {page.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h2 className="m2 p2 textLeft">Our policies</h2>
          <div className="leftRow wrap">
            {ALWAYS_ACCESSIBLE_PAGES.filter((page) =>
              page.url.includes("policy")
            ).map((page) => (
              <button
                key={page.url}
                className="leftRow p2 m2 w33 middle"
                onClick={() =>
                  window.open(`/help/${page.url}`, "_blank")
                }
              >
                <IonIcon
                  name="document-text-sharp"
                  className="basicIcon mr2"
                  style={{ width: 60, height: 60 }}
                />
                <div>
                  <h3
                    style={{ fontSize: "15pt" }}
                    className="textLeft p0 mb1"
                  >
                    {page.title}
                  </h3>
                  <p
                    style={{ lineHeight: 2, fontWeight: 400 }}
                    className="textLeft m0"
                  >
                    {page.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div style={{ height: 50 }} />

          <h2 className="m2 p2 textLeft">Other helpful Articles</h2>
          <div className="leftRow wrap">
            {ALWAYS_ACCESSIBLE_PAGES.map((page) => (
              <button
                key={page.url}
                className="leftRow p2 m2 w33 middle"
                onClick={() =>
                  window.open(`/help/${page.url}`, "_blank")
                }
              >
                <IonIcon
                  name="document-text-sharp"
                  className="basicIcon mr2"
                  style={{ width: 60, height: 60 }}
                />
                <div>
                  <h3
                    style={{ fontSize: "15pt" }}
                    className="textLeft p0 mb1"
                  >
                    {page.title}
                  </h3>
                  <p
                    style={{ lineHeight: 2, fontWeight: 400 }}
                    className="textLeft m0"
                  >
                    {page.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
