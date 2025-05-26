import IonIcon from "@reacticons/ionicons";
import EditMenu from "../EditMenu";
import { useState } from "react";
import DeletePopup from "../DeletePopup";
import ErrorLabel from "../ErrorLabel";
import React from "react";
import { FFErrorSelector } from "../../assets/Types";
import { ClientsPopupType } from "./CLIENT_DATA";
import { clientOptions } from "../Projects/DATA";

/**
 * Handles client editing and creation operations
 */
export default function ClientsPopup({
  active,
  setActive,
  id,
  name,
  nickName,
  phone,
  email,
  removeClient,
  updateAttribute,
  onSubmit,
}: ClientsPopupType) {
  const [loading, setLoading] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);

  const [validator, setValidator] = useState<FFErrorSelector>({
    field: null,
    value: null,
  });

  async function submitForm(f) {
    f.preventDefault();
    const phoneNum = phone?.replace(/\D/g, "");

    // Perform basic validation
    if (!name || name == "") {
      setValidator({ field: "name", value: "Enter a valid name" });
      return;
    } else if (phoneNum?.toString()?.length > 20) {
      setValidator({
        field: "phone",
        value: "Number must be less than 20 digits",
      });
      return;
    }

    setLoading(true);
    await onSubmit(id, name, nickName, phoneNum, email);
    closePopup();
  }

  function closePopup() {
    setLoading(false);
    setValidator({ field: null, value: null });
    setActive(false);
  }

  async function handleDelete() {
    removeClient();
    closePopup();
  }

  return (
    <div>
      <DeletePopup
        active={deleteActive}
        onDelete={handleDelete}
        onCancel={() => setDeleteActive(false)}
        type="Client"
      />
      <EditMenu
        isActive={active}
        setIsActive={closePopup}
        width={250}
        height={200}
        isLoading={loading}
      >
        <div className="row middle">
          <div className="leftRow middle">
            <IonIcon
              name="person-circle"
              style={{ height: "2em", width: "2em" }}
            />
            <h2>{id ? "Edit" : "Add"} Client</h2>
          </div>
          {id && (
            <div className="">
              <button
                className=" dangerButton ml1 p1"
                onClick={() => setDeleteActive(true)}
              >
                <IonIcon
                  name="trash-sharp"
                  style={{ width: 20, height: 20 }}
                />
              </button>
            </div>
          )}
        </div>

        <form onSubmit={submitForm}>
          <div className="leftRow middle m0 ml2">
            <IonIcon
              name={clientOptions.legalName.icon}
              className="basicIcon mr2"
            />
            <label className="m0">
              {clientOptions.legalName.label}
            </label>
          </div>
          <div className="m2 pr2">
            <input
              type="text"
              value={name || ""}
              onChange={(e) =>
                updateAttribute("name", e.target.value)
              }
              placeholder="The Client's full name"
            />
          </div>
          <ErrorLabel
            active={validator.field == "name"}
            text={validator.value}
            color="var(--dangerColor)"
          />

          <div className="leftRow middle m0 ml2">
            <IonIcon
              name={clientOptions.nickname.icon}
              className="basicIcon mr2"
            />
            <label className="m0">
              {clientOptions.nickname.label}
            </label>
          </div>
          <div className="m2 pr2">
            <input
              type="text"
              value={nickName || ""}
              onChange={(e) =>
                updateAttribute("nickname", e.target.value)
              }
              placeholder="The short version"
            />
          </div>

          <div className="leftRow middle m0 ml2 pt2">
            <IonIcon
              name={clientOptions.phone.icon}
              className="basicIcon mr2"
            />
            <label className="m0">
              {clientOptions.phone.label}
            </label>
          </div>
          <div className="m2 pr2">
            <input
              type="tel"
              value={phone || ""}
              onChange={(e) =>
                updateAttribute("phone", e.target.value)
              }
              placeholder="Client's phone number"
            />
          </div>
          <ErrorLabel
            active={validator.field == "phone"}
            text={validator.value}
            color="var(--dangerColor)"
          />

            <div className="leftRow middle m0 ml2">
            <IonIcon
              name={clientOptions.email.icon}
              className="basicIcon mr2"
            />
            <label className="m0">
              {clientOptions.email.label}
            </label>
          </div>
          <div className="m2 pr2">
            <input
              type="email"
              value={email || ""}
              onChange={(e) =>
                updateAttribute("email", e.target.value)
              }
              placeholder="Client's email address"
            />
          </div>
          <div className="leftRow hundred m0">
            {id ? (
              <button
                type="submit"
                className="accentButton hundred centerRow"
              >
                <IonIcon
                  name="sync-sharp"
                  className="basicIcon mr1"
                />
                <p className="m0">Update</p>
              </button>
            ) : (
              <button type="submit" className="accentButton hundred">
                + Create
              </button>
            )}
            <button
              type="button"
              className="hundred centerRow"
              style={{ marginRight: 0 }}
              onClick={closePopup}
            >
              <IonIcon name="close" className="basicIcon mr1" />
              <p className="m0">Cancel</p>
            </button>
          </div>
        </form>
      </EditMenu>
    </div>
  );
}
