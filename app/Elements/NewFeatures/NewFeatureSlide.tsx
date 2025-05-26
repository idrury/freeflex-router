import React from "react";
import { FeatureSlideType } from "./FEATURE_DATA";

type NewFeatureSlideProps = {
  data: FeatureSlideType | undefined;
};

export default function NewFeatureSlide({
  data,
}: NewFeatureSlideProps) {
  if (!data) return;

  return (
    <div className="p2">
      <h2 className="m2">{data.header}</h2>
      <div
        className="boxedOutline m0 p0"
        style={{ width: "100%", height: 250, overflow: "hidden" }}
      >
        {data.img && (
          <img
            style={{ width: 560 }}
            className=" m0 p0"
            src={data.img}
          />
        )}
      </div>

      <h3 className="textCenter">{data.body}</h3>
    </div>
  );
}
