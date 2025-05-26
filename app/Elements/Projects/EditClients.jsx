import { useState } from "react";
import EditMenu from "../EditMenu";
export default function EditClients({
  isActive,
  setIsActive,
  clientSearch,
  setClientSearch,
  allClients,
  originalClient,
  insertClient,
  updateClient,
  isLoading,
}) {
  const [submitVal, setSubmitVal] = useState({
    type: null,
    value: null,
  });

  function submitForm(e) {
    e.preventDefault();

    if (submitVal.type == "insert" && !submitVal.value) {
      return;
    }

    if (submitVal.type == "update") {
      updateClient(submitVal.value);
      return;
    }

    insertClient(submitVal.value);
    return;
  }

  return (
    <EditMenu
      isActive={isActive}
      setIsActive={setIsActive}
      width={200}
      isLoading={isLoading}
    >
      <form onSubmit={submitForm}>
        <h2>Client</h2>
        <div className="m2 pr3">
          <input
            autoFocus
            value={clientSearch || ""}
            onChange={(e) => setClientSearch(e.target.value || "")}
          />
        </div>
        <div className="leftContainer">
          {originalClient != clientSearch && clientSearch?.trim() && (
            <button
              className="lightButton"
              onClick={(e) =>
                setSubmitVal({ type: "insert", value: clientSearch })
              }
            >
              Create '{clientSearch}'
            </button>
          )}
          <div className="pr3">
            <button
              className="dangerButton hundred"
              onClick={() =>
                setSubmitVal({ type: "update", value: null })
              }
            >
              No Client
            </button>
          </div>
          {allClients
            ?.filter((cli) =>
              cli.name
                .toLowerCase()
                .includes(clientSearch?.toLowerCase())
            )
            .map((cli) => (
              <button
                type="submit"
                key={cli.id}
                onClick={() =>
                  setSubmitVal({ type: "update", value: cli.id })
                }
              >
                {cli.name}
              </button>
            ))}
        </div>
      </form>
    </EditMenu>
  );
}
