import React, { useEffect, useState } from "react";
import { reRouteTo } from "../../Functions/commonFunctions";
import {
  FFDocument,
  FFProject,
  popSavedModalFn,
} from "../../assets/Types";
import IonIcon from "@reacticons/ionicons";
import { handleUpdateDocuments } from "./ProjectsBL";
import { parseString } from "../CsvImport/ImportBL";
import { deleteExpense } from "../../Functions/DBAccess";

interface ProjectDocumentsProps {
  documents: FFDocument[];
  project: FFProject;
  onError: popSavedModalFn;
}

export default function ProjectDocuments({
  project,
  documents,
  onError,
}: ProjectDocumentsProps) {
  const [addDocName, setAddDocName] = useState<string>();
  const [addDocUrl, setAddDocUrl] = useState<string>();
  const [documentsList, setDocumentsList] =
    useState<FFDocument[]>(documents);
  const [inEditMode, setInEditMode] = useState(false);

  async function addDocument() {

    if (!addDocName || !addDocUrl) {
      onError("Please fill out both fields", undefined, true);
      return;
    }

    let url = addDocUrl;
    let name = addDocName;

    if (!addDocUrl.startsWith("https://")) {
      url = "https://" + url;
    }
    const originalList = structuredClone(documentsList);
    documentsList.push({ name: name, url: url });
    setAddDocName(undefined);
    setAddDocUrl(undefined);



    try {
    
      await handleUpdateDocuments(project, documentsList);
       onError(
       `${name} added`,
      );
    } catch (error) {
        setDocumentsList(originalList);
      onError(
        "An error occured adding the document",
        "Refresh the page and try again",
        true
      );
    }

    return;
  }

  async function deleteDocument(name, url) {
    const originalList = structuredClone(documentsList);
    const newDocuments = documentsList.filter(
      (doc) => doc.name !== name && doc.url !== url
    );
    setDocumentsList(newDocuments);

    try {
      await handleUpdateDocuments(project, newDocuments);
       onError(
       `${name} deleted`,
      );
    } catch (error) {
        setDocumentsList(originalList);
      onError(
        "An error occured deleting the document",
        "Refresh the page and try again",
        true
      );
    }
  }

  return (
    <div className="boxed dynamicSize hundred m0 mt2 boxedOutline">
      <div className="row middle m0 p0">
        <div className="leftRow middle pb2">
          <IonIcon name="document-sharp" className="basicIcon mr2" />
          <h3 className="row m0">Project Documents</h3>
        </div>
        <button
          className={`m0 p1  ${inEditMode && "accentButton"}`}
          onClick={() => setInEditMode(!inEditMode)}
        >
          <IonIcon name="pencil-sharp" className="basicIcon" />
        </button>
      </div>
      <form
        action="submit"
        onSubmit={(f) => {
          f.preventDefault();
          addDocument();
        }}
      >
        {!inEditMode && (
          <div className="row">
            <input
              value={addDocName || ""}
              onChange={(e) => setAddDocName(e.target.value)}
              placeholder="Name"
              className="m0 m2"
            />
            <input
              value={addDocUrl || ""}
              onChange={(e) => setAddDocUrl(e.target.value)}
              placeholder="https://www.site.com"
              className="m0 mt2 mb2"
            />
            <button
              disabled={
                project?.is_complete || !addDocName || !addDocUrl
              }
              className="middle dark"
              type="submit"
            >
              +
            </button>
          </div>
        )}
      </form>
      <div>
        {documentsList.map((doc, i) => (
          <div key={i} style={{ marginRight: "20px" }}>
            <a
              className="hundred dark row middle boxedOutline m2 p0"
              href={inEditMode ? undefined : doc.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="leftRow m0 p0 middle mt2 mb2 ml2">
                <IonIcon
                  name={"document-text-sharp"}
                  className="smallIcon mr2"
                />
                <p className="m0">{doc.name}</p>
              </div>
              {inEditMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDocument(doc.name, doc.url);
                  }}
                  className="dangerButton centeRow p0"
                >
                  <IonIcon name="trash-sharp" className="m1" />
                </button>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
