import spinners from "react-spinners";
import BasicMenu from "./BasicMenu";
import React from "react";
import IonIcon from "@reacticons/ionicons";

export default function DeletePopup({
  active,
  onDelete,
  onCancel,
  loading = false,
  type = "item",
}) {
  return (
    <BasicMenu
      isActive={active}
      setIsActive={onCancel}
      width={400}
      zIndex={30}
    >
      <div className="centerRow">
        <div className="pl1 pr1">
          <div className="centerRow">
            <IonIcon
              style={{
                width: 100,
                height: 100,
                color: "var(--dangerColor)",
              }}
              name="warning"
              className=""
            />
          </div>
          <h3 className="m2 textCenter">
            Are you sure you want to irreversibly delete this {type}?
          </h3>
          <div className="row hundred">
            <button
              className="w100 dangerButton centerRow"
              onClick={() => onDelete()}
            >
              {loading ? (
                <spinners.BeatLoader size={8} color="var(--primaryColor)" />
              ) : (
                <div className="centerRow">
                  <IonIcon name="trash" className="basicIcon mr2" />
                  <p className="m0">Delete</p>
                </div>
              )}
            </button>
            <button className="hundred" onClick={() => onCancel()}>
              <div className="centerRow">
                <IonIcon
                  name="arrow-back"
                  className="basicIcon mr2"
                />
                <p className="m0">Cancel</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </BasicMenu>
  );
}
