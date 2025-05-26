import Quill from "quill";
import React, {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type QuillEditorProps = {
  readOnly?: Boolean;
  defaultValue: string;
  onTextChange: () => any;
  onSelectionChange?: () => any;
  toolbar: any[]
}

/****************************************
 * The Quill editor component for contracts
 */
const QuillEditor = forwardRef(
  (
    {
      readOnly,
      defaultValue,
      onTextChange,
      onSelectionChange,
      toolbar
    }: QuillEditorProps,
    ref: ForwardedRef<Quill>
  ) => {
    const containerRef = useRef<any>(undefined);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (ref)
        (ref as MutableRefObject<Quill>).current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        //debug: "info",
        modules: {
          toolbar: toolbar,
          history: {
            delay: 2000,
            maxStack: 100,
            userOnly: true
          },
        },
        placeholder: defaultValue,
      });

      (ref as MutableRefObject<Quill>).current = quill;

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });
      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);



    return <div className="slowFade" ref={containerRef}></div>;
  }
);

QuillEditor.displayName = "Editor";

export default QuillEditor;
