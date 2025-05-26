import IonIcon from "@reacticons/ionicons";
import React, { LegacyRef, useState } from "react";
import { useEffect } from "react";

type TitleElementProps = {
  disabled?: boolean;
  setName: (e) => void;
  name: string;
  innerRef;
  setSaved: (saved: boolean) => void;
};

type TitleSpanProps = {
  disabled?: boolean;
  updateName: (e) => void;
  innerRef: LegacyRef<HTMLSpanElement> | undefined;
  name: string;
};


export default function TitleElement({
  disabled = false,
  setName,
  name,
  innerRef,
  setSaved,
}: TitleElementProps) {
  const [renderedPage, setRenderedPage] = useState<Document>();
  useEffect(() => {
    setRenderedPage(document);
    updateName(name);
  }, [name]);

  function updateName(val) {
    let focusedObj = window.getSelection();
    let range = renderedPage?.createRange();
    let rangeOffset = focusedObj?.focusOffset || 0;

    setSaved(false);

    if (innerRef.current) {
      innerRef.current.innerText = val;

      // Set cursor point
      if (innerRef?.current?.childNodes[0]?.length) {
        // Update cursor point if field is blank
        if (innerRef?.current?.childNodes[0]?.length <= 1)
          rangeOffset = 1;

        range.setStart(innerRef.current.childNodes[0], rangeOffset);
        range.collapse(true);

        focusedObj?.removeAllRanges();
        focusedObj?.addRange(range);
      }
    }
    setName(val);
  }

  return (
    <TitleSpan
    disabled={disabled}
      innerRef={innerRef}
      updateName={updateName}
      name={name}
    />
  );
}


function TitleSpan({
  disabled=false,
  updateName,
  innerRef,
  name,
}: TitleSpanProps) {
  return (
    <div className="leftRow m2">
      <div style={{ minWidth: 50 }}>
        <IonIcon
          name="document-sharp"
          size="large"
          style={{ margin: "30px 0 0 0", width: 50 }}
        />
      </div>
      {name != "\n" && name != "" ? (
        <span
          autoFocus
          contentEditable={!disabled}
          ref={innerRef}
          className="inputSpan title noBkg"
          /*@ts-ignore*/
          onInput={(e) => updateName(e.target.innerText)}
        />
      ) : (
        <input
          disabled={disabled}
          autoFocus
          placeholder="Project Name"
          className="inputSpan title noBkg"
          value={name}
          onChange={(e) => updateName(e.target.value)}
        />
      )}
    </div>
  );
}
