import React, { useEffect, useState } from "react";
import BasicMenu from "../BasicMenu";
import {
  FFActiveComponent,
  FFBulkImport,
  popSavedModalFn,
} from "../../assets/Types";
import {
  deleteItemsFromBulkImport,
  fetchImportHistory,
  updateBulkImportAttribute,
} from "../../Functions/DBAccess";
import { formatDatestring } from "../../Functions/Dates";
import IonIcon from "@reacticons/ionicons";
import DeletePopup from "../DeletePopup";
import { deleteBulkExpenses, deleteBulkInvoices } from "./ImportBL";

export interface ImportHistoryProps extends FFActiveComponent {
  popSavedModal: popSavedModalFn;
}

export default function ImportHistory({
  active,
  onClose,
  popSavedModal,
}: ImportHistoryProps) {
  const [importHistory, setImportHistory] =
    useState<FFBulkImport[]>();
  const [deletePopupActive, setDeletePopupActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FFBulkImport>();
  useEffect(() => {
    getImportHistory();
  }, []);

  /*******************************
   * Fetch all user bulk imports
   */
  async function getImportHistory() {
    try {
      setImportHistory(await fetchImportHistory());
    } catch (error) {
      if (popSavedModal)
        popSavedModal(
          "Could not fetch import history",
          "Refresh the page and try again",
          true
        );
    }
  }

  /****************************************
   * Delete all items from a bulk import and
   * update the item to is_deleted=true
   */
  async function deleteBulkImportItems() {
    let numDeleted = 0;
    try {
      if (!selectedItem)
        throw { code: 0, message: "An unknown error occured" };
      if (selectedItem.import_type == "expense")
        numDeleted = await deleteBulkExpenses(selectedItem.id);
      else if (selectedItem.import_type == "invoice")
        numDeleted = await deleteBulkInvoices(selectedItem.id);
      await updateBulkImportAttribute(
        selectedItem.id,
        "is_deleted",
        true
      );
      popSavedModal &&
        popSavedModal(
          `${selectedItem.import_type}s deleted`
        );
      updateItemDeletedState(selectedItem.id);
    } catch (error) {
      popSavedModal &&
        popSavedModal(
          "An error while attempting to delete items",
          "Refresh the page and try again",
          true
        );
    }
  }

  /*********************************
   * Pop delete modal
   * @param id The id of the clicked bulkItem
   */
  function onDeleteClick(id: number) {
    setSelectedItem(importHistory?.find((item) => item.id == id));
    setDeletePopupActive(true);
  }

  /******************************
   * Update an item to show deleted is true
   * @param id The id to delete
   */
  function updateItemDeletedState(id) {
    if (!importHistory) return;

    const localHistory = [...importHistory];
    localHistory.forEach((item) => {
      if (item.id == id) {
        item.is_deleted = true;
        return;
      }
    });

    setImportHistory(localHistory);
  }
  if (importHistory)
    return (
      <div>
        <DeletePopup
          active={deletePopupActive}
          onCancel={() => setDeletePopupActive(false)}
          onDelete={deleteBulkImportItems}
          type="bulk import"
        />
        {importHistory.length > 0 && (
          <div>
            {active && (
              <div style={{ height: 400, overflow: "auto" }}>
                {importHistory.map((item) => (
                  <div
                    className="row boxed boxedOutline middle m1 p1"
                    key={item.id}
                  >
                    <div className="leftRow m0 middle">
                      <IonIcon
                        name="cloud-upload"
                        className="basicIcon mr2 ml1"
                        style={{
                          color: `${
                            item.success
                              ? "var(--safeColor)"
                              : "var(--dangerColor)"
                          }`,
                        }}
                      />
                      <h3>
                        {formatDatestring(new Date(item.created_at))}
                      </h3>
                    </div>
                    <p>
                      {item.num_rows} {item.import_type}
                      {item.num_rows != 1 && "s"}
                    </p>
                    {item.is_deleted == false ? (
                      <button
                        className="m0 dangerButton row"
                        onClick={() => onDeleteClick(item.id)}
                      >
                        <IonIcon
                          name="trash"
                          className="basicIcon mr2"
                        />
                        <p className="m0">Delete</p>
                      </button>
                    ) : (
                      <button className="centerRow m0" disabled>
                        <IonIcon
                          name="close"
                          className="basicIcon mr2"
                        />
                        <p className="m0">Deleted</p>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
}
