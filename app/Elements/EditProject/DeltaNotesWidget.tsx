import React, { MutableRefObject, useEffect, useRef } from "react";
import QuillEditor from "../QuillEditor/QuillEditor";
import Quill, { Delta, Op } from "quill";
import IonIcon from "@reacticons/ionicons";

type DeltaNotesWidgetProps = {
  onChange: (notes) => any;
  ops: Op[];
  disabled: boolean;
};

export default function DeltaNotesWidget({
  disabled=false,
  onChange,
  ops,
}: DeltaNotesWidgetProps) {
  const quillRef = useRef<Quill>(); // Use a ref to access the quill instance directly

  useEffect(() => {
    quillRef.current?.setContents(new Delta(ops));
  }, []);

  function undo() {
    quillRef.current?.history.undo();
  }

  function redo() {
    quillRef.current?.history.redo();
  }

  return (
    <div id="projectEditor" className="hundred mb2">
      <div
        className="row middle boxed boxedOutline m0 p2 sticky"
        style={{ top: 100, zIndex: 9 }}
      >
        <h2 className="leftRow m0 p0">Notes</h2>
        <div className="rightRow middle">
          <button
            className="middle p0 m0"
            style={{ margin: "0 10px 0 0" }}
            onClick={undo}
          >
            <IonIcon
              name="arrow-undo"
              style={{ width: 20, height: 20, margin: 5 }}
            />
            <p className="hiddenOnShrink">Undo</p>
          </button>
          <button className="middle p0 m0" onClick={redo}>
            <IonIcon
              name="arrow-redo"
              style={{ width: 20, height: 20, margin: 5 }}
            />
            <p className="hiddenOnShrink">redo</p>
          </button>
        </div>
      </div>
      <QuillEditor
      readOnly={disabled}
        ref={quillRef as MutableRefObject<Quill>}
        defaultValue={"Add your notes here..."}
        onTextChange={() =>
          onChange(quillRef.current?.getContents().ops)
        }
        toolbar={[
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { list: "check" },
          ],
          ["clean"],
        ]}
      />
    </div>
  );
}
