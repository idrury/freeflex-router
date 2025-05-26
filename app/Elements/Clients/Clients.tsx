import { useEffect, useState } from "react";
import {
  deleteClient,
  fetchClients,
  insertClient,
  updateClient,
} from "../../Functions/DBAccess";
import ErrorPopup from "../ErrorPopup";
import spinners from "react-spinners";
import IonIcon from "@reacticons/ionicons";
import ClientsPopup from "./ClientsPopup";
import {
  FFClient,
  LimitReachedType,
  SavedModalType,
} from "../../assets/Types";
import React from "react";
import SavedModal from "../SavedModal";
import ClientsList from "./ClientsList";
import PageHeader from "../PageHeader";
import LimitReachedPopup from "../LimitReachedPopup";
import { LIMITS } from "../../assets/data";
import FixedRow from "../FixedRow";

export default function Clients({ role, menuVisible, inShrink }) {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<FFClient[] | undefined>(
    undefined
  );
  const [activeClientId, setActiveClientId] = useState<
    number | null
  >();
  const [name, setName] = useState<string | null>();
  const [nickName, setNickname] = useState<string | null>();
  const [phone, setPhone] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();

  const [clientSearch, setClientSearch] = useState(null);
  const [filteredClients, setFilteredClients] =
    useState<FFClient[]>();

  const [editPopupActive, setEditPopupActive] = useState(false);

  const [savedPopup, setSavedPopup] = useState<SavedModalType>();
  const [errorPopupText, setErrorPopupText] = useState(null);
  const [errorHeadingText, setErrorHeadingText] = useState(null);
  const [errorPopupActive, setErrorPopupActive] = useState(false);
  const [LimitReachedModal, setLimitReachedModal] =
    useState<LimitReachedType>({ isActive: false, body: "" });

  useEffect(() => {
    getClients();
  }, []);

  /******************************************
   * Fetch the clients from the database
   */
  async function getClients() {
    try {
      let tempClients = await fetchClients();
      setClients(tempClients);
    } catch (error) {
      popSavedModal(
        "An unknown issue occured.",
        "Refresh the page and try again!",
        "fail"
      );
    }
    setLoading(false);
  }

  /***********************************************
   * Insert or update a client
   * @param id The id of the client to update (or insert if null)
   */
  async function handleClientOperation(
    id: number | undefined,
    name: string,
    nickName: string,
    phoneNum: string,
    email: string
  ) {
    // Update the client if a valid id is given
    if (id) {
      try {
        await updateClient(id, name, nickName, phoneNum, email);
        await getClients();
        return;
      } catch (error) {
        popSavedModal(
          "Something went wrong",
          "Refresh the page and try again.",
          "fail"
        );
      }
    }

    // Users can only create 10 clients
    if (role == "free" && clients && clients?.length >= LIMITS.clients) {
      setLimitReachedModal({
        isActive: true,
        body: `You can only create ${LIMITS.clients} clients on the free plan.`,
      });
      return;
    }

    // Create a new client if no id is given
    else {
      try {
        await insertClient(name, nickName, phoneNum, email);
        await getClients();
        return;
      } catch (error) {
        alert(
          "An error occured creating this client. Try again later."
        );
      }
    }
  }

  /**
   * Handle the process of deleting a client from the database
   * @returns
   */
  async function removeClient() {
    let clientId = activeClientId;

    if (!clientId) {
      alert("An error occurred while deleting client");
      return;
    }

    try {
      await deleteClient(clientId);
      popSavedModal("Client removed");
      getClients();
    } catch (error) {
      if (error.code == 23503) {
        popSavedModal(
          "This client is attached to a project",
          "You must remove the client from all projects before deleting them!",
          "fail"
        );
      } else {
        popSavedModal(
          "An unknown issue occured",
          "Try again in a few moments!",
          "fail"
        );
      }
    }
    return;
  }

  /************************************************************
   * Display the client editor pane when a client is clicked on
   * @param id The ID of the client to edit, or null to create a new one
   * @returns
   */
  function handleClientClick(id: number | null) {
    if (!id) {
      setActiveClientId(null);
      setName(null);
      setNickname(null);
      setEmail(null);
      setPhone(null);
    } else {
      const localClient =
        clients?.find((cli) => cli.id == id) || null;

      if (!localClient) return;

      setActiveClientId(id);
      setName(localClient.name);
      setNickname(localClient.nickname);
      setEmail(localClient.email);
      setPhone(localClient.phone);
    }

    setEditPopupActive(true);
  }

  function updateClientAttribute(field, value) {
    if (field == "name") setName(value);
    else if (field == "nickname") setNickname(value);
    else if (field == "email") setEmail(value);
    else if (field == "phone") setPhone(value);
  }

  function searchClients(val) {
    setClientSearch(val);

    if (!clients || clients.length <= 0) return;

    let localFilteredClients = clients.filter((cli) => {
      return (
        cli.name.toLowerCase().includes(val.toLowerCase()) ||
        cli.nickname?.toLowerCase().includes(val.toLowerCase())
      );
    });

    setFilteredClients(localFilteredClients);
  }

  /**************************************
   * Show the saved modal
   */
  function popSavedModal(
    header,
    body?,
    state: "success" | "fail" = "success"
  ) {
    setSavedPopup({ visible: true, header, body, state });
  }

  return (
    <div className="centerContainer">
      <ClientsPopup
        active={editPopupActive}
        id={activeClientId}
        name={name}
        nickName={nickName}
        phone={phone}
        email={email}
        setActive={setEditPopupActive}
        removeClient={removeClient}
        onSubmit={handleClientOperation}
        updateAttribute={updateClientAttribute}
      />
      <SavedModal
        visible={savedPopup?.visible}
        header={savedPopup?.header}
        body={savedPopup?.body}
        state={savedPopup?.state || "success"}
        setVisible={() => setSavedPopup(undefined)}
      />
      <LimitReachedPopup
        isActive={LimitReachedModal.isActive}
        onClose={() =>
          setLimitReachedModal({ isActive: false, body: "" })
        }
        message={LimitReachedModal.body}
      />
      {loading ? (
        <div className="loadingContainer">
          <spinners.ClimbingBoxLoader color="var(--primaryColor)" />
        </div>
      ) : (
        <div className="mediumFade">
          <FixedRow menuVisible={menuVisible}>
            <div className="row m0 p0 middle w100">
              <PageHeader
                text="Clients"
                icon="people-sharp"
                menuVisible={true}
                inShrink={inShrink}
              />
              <div className="m2 pr3 fifty">
                <input
                  className=""
                  placeholder="Search Clients"
                  onChange={(e) => searchClients(e.target.value)}
                  value={clientSearch || ""}
                />
              </div>
              <div className="pr3 ten">
                <button
                  className="accentButton hundred"
                  onClick={() => handleClientClick(null)}
                >
                  + Client
                </button>
              </div>
            </div>
          </FixedRow>

          {clients && clients?.length <= 0 ? (
           <div className="middleContainer">
              <IonIcon name="person-circle" style={{height: 200, width: 200, color: "var(--smallAccent)"}}/>
              <p className="pb2">
                Looks like you haven't created any clients yet!
              </p>
              <button className="accentButton m0" onClick={()=> setEditPopupActive(true)}>
                <p className="m0">
                  Create a new client to get started
                </p>
              </button>
            </div>
          ) : (
            <ClientsList
              clients={filteredClients || clients}
              onClick={handleClientClick}
              clientSearch={clientSearch}
            />
          )}
          <ErrorPopup
            text={errorPopupText}
            headerText={errorHeadingText}
            active={errorPopupActive}
            setActive={setErrorPopupActive}
            hideOops
          />
        </div>
      )}
    </div>
  );
}
