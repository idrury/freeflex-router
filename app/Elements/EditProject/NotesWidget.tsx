import React, { useEffect, useRef, useState } from "react";
import NoteItem from "./NoteItem";
import IonIcon from "@reacticons/ionicons";
import { FFNote, NotesWidgetType } from "../../assets/Types";
import { isMobileBrowser } from "../../Functions/commonFunctions";

export default function NotesWidget({
  notes,
  setNotes,
  saved,
  setSaved,
  disableFocus,
  setDisableFocus,
  logHistory,
}: NotesWidgetType) {
  const inputRef = useRef<HTMLSpanElement[]>([]);
  const isMobile = isMobileBrowser();
  const [focus, setFocus] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    updateNoteValues(notes);
    updateCursorPoint(focus[0], focus[1]);
  }, [notes, focus]);

  function updateNoteValues(notes: FFNote[]) {
    // Update values of all inputs
    for (let i = 0; i < inputRef.current.length; i++) {
      if (notes[i])
        inputRef.current[i].innerText = notes[i].value || "";
    }
  }

  // Update the value of a note item
  function editNoteItem(idx, e) {
    if (saved) setSaved(false);

    let allNotes = [...notes];
    let key = e.target.innerText;
    let newOffset = focus[1] + 1;
    const originalValue = allNotes[idx].value;

    if (key.startsWith("-")) {
      allNotes = transformNoteInto(idx, "dotPoint");
      newOffset = focus[1];
    } else if (key.startsWith("/h1")) {
      allNotes = transformNoteInto(idx, "h1");
      allNotes[idx].value = key.split("/h1")[1];
      newOffset = 0;
    } else if (key.startsWith("/h2")) {
      allNotes = transformNoteInto(idx, "h2");
      allNotes[idx].value = key.split("/h2")[1];
      newOffset = 0;
    } else {
      // Update checked value if target is a checkbox
      if (e.target.type == "checkbox") {
        allNotes[idx].checked = e.target.checked || false;
      } else {
        allNotes[idx].value = key.trimStart();
        newOffset = focus[1] - (originalValue.length - key?.length);
      }
    }
    setNotes(allNotes);
    updateFocusNode(idx, newOffset);
    return true;
  }

  function splitNote(notes) {
    let wholeArray = [...notes];
    const type = wholeArray[focus[0]].type;

    let currentNote = wholeArray[focus[0]].value;
    let parsedNote = [
      currentNote.substring(0, focus[1]),
      currentNote.substring(focus[1], currentNote.length),
    ];

    wholeArray = wholeArray
      .slice(0, focus[0])
      .concat(wholeArray.slice(focus[0] + 1));
    wholeArray = insertNote(
      focus[0] - 1,
      wholeArray,
      type,
      parsedNote[0]
    );
    wholeArray = insertNote(
      focus[0],
      wholeArray,
      type,
      parsedNote[1]
    );

    return wholeArray;
  }

  // Insert a new note
  function insertNote(idx, notes, type = "", value = null) {
    let noteType = type || "";
    let tempNotes = [...notes];

    if (saved) setSaved(false);

    tempNotes.push({ type: "", value: "" });
    //inputRef.current.push({});

    if (!noteType) {
      if (notes[idx]?.type == "h1" || notes[idx]?.type == "h2") {
        noteType = "";
      } else {
        noteType = tempNotes[idx]?.type || "";
      }
    }

    for (let i = idx; i < notes.length; i++) {
      tempNotes[i + 1] = notes[i];
    }

    tempNotes[idx + 1] = { type: noteType, value: value || "" };
    logHistory(tempNotes);

    return tempNotes;
  }

  // Remove a note block
  function removeNote(
    idx: number,
    notes: FFNote[]
  ): { isRemoved: boolean; newArray: FFNote[] } {
    let update = false;
    let wholeArray = [...notes];
    let firstHalf = notes.slice(0, idx);
    let secondHalf: any[] = [];
    let isRemoved = false;
    const valueLength = notes[idx].value.length;

    if (saved) setSaved(false);

    //Turn dotPoint note into normal
    if (
      notes[idx].type == "dotPoint" ||
      notes[idx].type == "checkbox" ||
      notes[idx].type?.startsWith("h")
    ) {
      return { isRemoved, newArray: transformNoteInto(idx, "") };
    }
    // Do nothing if cursor is on first note
    if (idx == 0) {
      return { isRemoved, newArray: wholeArray };
    }
    // Combine two notes lines
    if (valueLength != 0 && idx != 0) {
      wholeArray[idx - 1].value = wholeArray[idx - 1].value.concat(
        wholeArray[idx].value.trim()
      );
    }

    // Remove a whole note block
    if (notes.length > idx) {
      secondHalf = notes.slice(idx + 1);
      isRemoved = true;
      update = true;
    }

    wholeArray = firstHalf.concat(secondHalf);

    if (update == true) logHistory(wholeArray);

    return { isRemoved, newArray: wholeArray };
  }

  function addNewNoteType(type) {
    setNotes(insertNote(focus[0], notes, type));
    updateFocusNode(focus[0] + 1, 0);
  }

  function transformNote(type) {
    setNotes(transformNoteInto(focus[0], type));
  }

  function removeWholeNote(idx) {
    let tempNotes = [...notes];
    if (notes[idx].value.length > 0) {
      tempNotes[idx].value = "";
    }

    setNotes(removeNote(idx, tempNotes).newArray);
    updateFocusNode(idx <= 0 ? 0 : idx - 1, 0);
  }

  function transformNoteInto(idx, type) {
    let allNotes = [...notes];
    allNotes[idx].type = type || "";

    if (type == "dotPoint") {
      allNotes[idx].value = notes[idx].value;
    } else if (type == "checkbox") {
      allNotes[idx].value = notes[idx].value;
      allNotes[idx].checked = false;
    }

    logHistory(allNotes);
    return allNotes;
  }

  function keyPress(keyCode) {
    const key = keyCode.code;

    if (key == "ArrowUp") {
      keyCode.preventDefault();
      updateFocusNode(focus[0] - 1, focus[1]);
    } else if (key == "ArrowDown") {
      keyCode.preventDefault();
      if (notes[focus[0] + 1])
        updateFocusNode(focus[0] + 1, focus[1]);
    } else if (key == "ArrowLeft") {
      keyCode.preventDefault();
      if (focus[1] == 0 && notes[focus[0] - 1])
        updateFocusNode(
          focus[0] - 1,
          notes[focus[0] - 1].value.length
        );
      else updateFocusNode(focus[0], focus[1] - 1);
    } else if (key == "ArrowRight") {
      keyCode.preventDefault();
      if (
        focus[1] == notes[focus[0]]?.value.length - 1 &&
        notes[focus[0] + 1]
      )
        updateFocusNode(focus[0] + 1, 0);
      else updateFocusNode(focus[0], focus[1] + 1);
    } else if (key == "Backspace") {
      if (focus[1] <= 0) {
        keyCode.preventDefault();

        const length = notes[focus[0] - 1]?.value.length || 0;
        const result = removeNote(focus[0], notes);

        if (result.isRemoved == true)
          updateFocusNode(focus[0] - 1, length);
        else updateFocusNode(focus[0], 0);

        setNotes(result.newArray);
      }
    } else if (key == "Delete") {
      keyCode.preventDefault();
      handleDelKeyPress();
    } else if (key == "Enter") {
      keyCode.preventDefault();
      if (focus[1] == notes[focus[0]].value.length) {
        const newNotes = insertNote(focus[0], notes);
        setNotes(newNotes);
        updateFocusNode(focus[0] + 1, 0, newNotes);
      } else {
        keyCode.preventDefault();
        const newNotes = splitNote(notes);
        setNotes(newNotes);
        updateFocusNode(focus[0] + 1, 0, newNotes);
      }
    }
  }

  /**
   * Update the state focus value and refresh the component
   * @param idx The note item to focus on
   * @param offset The cursor point
   * @param newNotes Pass an updated notes array to the function
   */
  function updateFocusNode(idx, offset, newNotes?) {
    if (!idx || idx < 0) idx = 0;

    const localNotes = newNotes || notes;
    const noteToFocus = localNotes[idx];
    const length = noteToFocus?.value.length;

    if (!offset || offset < 0) offset = 0;
    else if (offset > length) offset = length;

    setFocus([idx, offset]);
  }

  /**
   * Move the cursor to a specified point on a node
   * @param fIndex The note item to focus on
   * @param offset The offset
   * @returns
   */
  function updateCursorPoint(fIndex, offset) {
    const focusedObject = inputRef?.current[fIndex];
    focusedObject?.focus();
    const selection = window.getSelection();
    const range = [];

    if (!focusedObject || !selection) return;

    // Set cursor point
    try {
      if (focusedObject?.childNodes?.length > 0) {
        range.setStart(
          inputRef.current[fIndex].childNodes[0],
          offset
        );
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (error) {
      console.warn("Error setting focus");
    }
  }

  function handleDelKeyPress() {
    const noteItem = notes[focus[0]];
    const noteValue = noteItem.value;
    const newNotes = [...notes];

    if (
      notes[focus[0] + 1] &&
      focus[1] == notes[focus[0]].value.length
    ) {
      setNotes(removeNote(focus[0] + 1, notes).newArray);
    } else {
      newNotes[focus[0]] = {
        type: noteItem.type,
        checked: noteItem.checked,
        value: noteValue
          .substring(0, focus[1])
          .concat(
            noteValue.substring(focus[1] + 1, noteValue.length)
          ),
      };
      setNotes(newNotes);
    }
  }

  function handlePaste(e) {
    e.preventDefault();

    let pasteText = e.clipboardData.getData("Text");
    let pasteArray = pasteText.split(/;?\r\n|;?\n|;?\r/);

    let tempNotes = [...notes];

    for (let i = pasteArray.length - 1; i >= 0; i--) {
      let noteObject = transformNoteTypeFromValue(pasteArray[i]);
      tempNotes = insertNote(
        focus[0],
        tempNotes,
        noteObject.type,
        noteObject.value
      );
    }

    setNotes(tempNotes);
    updateFocusNode(0, 0);
  }

  function transformNoteTypeFromValue(val) {
    if (val.startsWith("- "))
      return { type: "dotPoint", value: val.split("- ")[1] };
    else if (val == "") return { type: "a", value: val };
    else return { type: "", value: val };
  }

  function onSpanClick(e, idx) {
    e.stopPropagation();

    setFocus([idx, window.getSelection()?.focusOffset || 0]);
  }

  return (
    <div className="hundred boxedOutline" style={{ padding: 0 }}>
      <div
        className="centerRow dynamicRow boxed middle"
        style={{ margin: "0 0 10px 0" }}
      >
        <button
          className="headingButton dark boxedOutline"
          onClick={() => transformNote("")}
          style={{ margin: "0 10px" }}
        >
          <p>NORMAL</p>
        </button>
        <button
          className="headingButton dark boxedOutline p0"
          onClick={() => transformNote("h1")}
          style={{ margin: "0 10px" }}
        >
          <p
            style={{
              fontFamily: "montserrat, sans-serif",
              fontSize: "32px",
            }}
          >
            H1
          </p>
        </button>
        <button
          className="headingButton dark boxedOutline p0"
          onClick={() => transformNote("h2")}
          style={{ margin: "0 10px" }}
        >
          <p
            style={{
              fontFamily: "montserrat, sans-serif",
              fontSize: "23px",
              paddingTop: "2px",
            }}
          >
            H2
          </p>
        </button>
        <button
          className="headingButton dark boxedOutline"
          onClick={() => transformNote("checkbox")}
          style={{ margin: "0 10px" }}
        >
          <div className="leftRow middle" style={{ marginTop: 5 }}>
            <input
              className="p2"
              type="checkbox"
              checked={true}
              style={{ width: 10, marginRight: 0 }}
              onChange={() => {
                return;
              }}
            />
            <p>LIST</p>
          </div>
        </button>
        <button
          className="headingButton dark"
          style={{}}
          onClick={() => transformNote("dotPoint")}
        >
          <div className="leftRow middle">
            <IonIcon
              name="ellipse"
              style={{ height: 22, width: 8 }}
            />
            <p style={{ margin: "0 0 0px 5px", width: 20 }}>BULLET</p>
          </div>
        </button>
      </div>
      <div style={{ margin: "0 20px" }}>
        {notes?.map((note, i) => (
          <div key={i}>
            <NoteItem
              type={note.type}
              isChecked={note.checked}
              innerRef={(el) => (inputRef.current[i] = el)}
              setValue={(val) => editNoteItem(i, val)}
              onKeyPress={keyPress}
              onPaste={handlePaste}
              onClick={(e) => onSpanClick(e, i)}
            />
            {isMobile && focus[0] == i && (
              <div>
                <button
                  style={{ width: "50px", margin: 0 }}
                  onClick={() => addNewNoteType(note.type)}
                >
                  +
                </button>
                <button
                  style={{ width: "50px" }}
                  onClick={() => removeWholeNote(i)}
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
