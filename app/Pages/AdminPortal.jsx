import { act, useEffect, useState } from "react";
import {
  fetchErrors,
  fetchFeedback,
  fetchLogs,
  updateErrorAttribute,
} from "../Functions/DBAccess";
import { formatDatestring } from "../Functions/Dates";
import { DateTime } from "luxon";
import FourOFour from "./FourOFour";
import EditMenu from "../Elements/EditMenu";
import IonIcon from "@reacticons/ionicons";
import TypeInput from "../Elements/TypeInput";

const RANGE_OPTIONS = [
  {
    label: "1 day",
    value: {
      start: DateTime.now(),
      end: DateTime.now().minus({ days: 1 }),
    },
  },
  {
    label: "1 week",
    value: {
      start: DateTime.now(),
      end: DateTime.now().minus({ weeks: 1 }),
    },
  },
  {
    label: "2 weeks",
    value: {
      start: DateTime.now(),
      end: DateTime.now().minus({ weeks: 2 }),
    },
  },
  {
    label: "1 month",
    value: {
      start: DateTime.now(),
      end: DateTime.now().minus({ months: 1 }),
    },
  },
  {
    label: "6 months",
    value: {
      start: DateTime.now(),
      end: DateTime.now().minus({ months: 6 }),
    },
  },
];

export default function AdminPortal({ role }) {
  if (role != "admin") return <FourOFour />;

  const [feedback, setFeedback] = useState(null);

  const [errors, setErrors] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: DateTime.now(),
    end: DateTime.now().minus({ months: 1 }),
  });
  const [errorLimit, setErrorLimit] = useState(100);
  const [activeError, setActiveError] = useState(null);
  const [errorClosed, setErrorClosed] = useState(false);
  const [errorFlagged, setErrorFlagged] = useState(false);

  const [logs, setLogs] = useState(null);
  const [logRange, setLogRange] = useState({
    start: DateTime.now(),
    end: DateTime.now().minus({ months: 1 }),
  });
  const [logLimit, setLogLimit] = useState(100);

  const [window, setWindow] = useState(0);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    await getProjects();
    await getErrors(errorLimit, dateRange, false);
    await getLogs(logLimit, logRange);
  }

  async function getProjects() {
    let feedback = await fetchFeedback();
    setFeedback(feedback);
  }

  async function getErrors(limit, dateRange, showClosed) {
    const errors = await fetchErrors(
      limit,
      { start: dateRange.start.toISO(), end: dateRange.end.toISO() },
      showClosed
    );
    setErrors(errors);
  }

  async function getLogs(limit, range) {
    try {
      let logs = await fetchLogs(limit, {
        start: range.start.toISO(),
        end: range.end.toISO(),
      });
      setLogs(logs);
    } catch (error) {
      alert("an error has occured getting your logs");
    }
  }

  async function closeErrorPanel() {
    await getErrors(errorLimit, dateRange, false);
    setActiveError(null);
  }

  function openErrorPanel(eId) {
    let error = errors.find((err) => err.id == eId);

    if (!error) {
      alert("an issue occured loading this error");
      return;
    }

    setActiveError(error);
    setErrorClosed(error.is_closed);
    setErrorFlagged(error.is_flagged);
  }

  async function handleUpdateErrorAttribute(attr, val) {
    try {
      await updateErrorAttribute(activeError?.id, attr, val);

      if (attr == "is_flagged") setErrorFlagged(val);
      else if (attr == "is_closed") {
        setErrorClosed(true);
        await closeErrorPanel();
      }
    } catch (error) {
      alert("an error occured updating the attribute", error);
    }
  }

  async function updateRange(range) {
    setDateRange(range);
    getErrors(errorLimit, range, false);
  }

  if (role == "admin") {
    return (
      <div>
        <EditMenu
          isActive={activeError}
          setIsActive={() => closeErrorPanel()}
          width={500}
        >
          <div className="m2 p2" style={{ maxWidth: 500 }}>
            <div>
              <div className="row p0">
                <h2 className="textLeft p2">
                  Error #{activeError?.id}
                </h2>
                <div className="rightRow">
                  <button
                    onClick={() =>
                      handleUpdateErrorAttribute(
                        "is_flagged",
                        !errorFlagged
                      )
                    }
                    className={`${
                      errorFlagged && "accentButton"
                    } middle center`}
                  >
                    <IonIcon
                      name="flag"
                      size="large"
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateErrorAttribute("is_closed", true)
                    }
                    className="dangerButton middle center"
                  >
                    <IonIcon
                      name="remove"
                      size="large"
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                </div>
              </div>
              <p>
                {DateTime.fromISO(activeError?.created_at)?.toFormat(
                  "HH:mm | d MMM yy"
                )}
              </p>
            </div>
            <div>
              <div className="boxed" style={{ margin: "30px 0" }}>
                <p>{activeError?.message || "-"}</p>
                <p style={{ fontWeight: "600" }}>
                  {activeError?.details || "No other details"}
                </p>
                {activeError?.hint && <p>{activeError?.hint}</p>}
              </div>

              <div className="row m0">
                <div className="">
                  <label>Code</label>
                  <p>{activeError?.code || "-"}</p>
                </div>
                <div>
                  <label>User</label>
                  <p>{activeError?.user_id || "-"}</p>
                </div>
              </div>
              {activeError?.data && (
                <div className="boxed">
                  <p className="m2">
                    {" "}
                    {JSON.stringify(activeError?.data)}
                  </p>
                </div>
              )}
              <div className="boxed">
                <p>{JSON.stringify(activeError?.data) || ""}</p>
                <p>{activeError?.function}</p>
              </div>
            </div>
          </div>
        </EditMenu>

        <h1>FreeFlex Admin</h1>

        <div className="leftRow m2">
          <button
            className={`${window == 0 ? "accentButton" : undefined}`}
            onClick={() => setWindow(0)}
          >
            Feedback ({feedback?.length || 0})
          </button>
          <button
            className={`${window == 1 ? "accentButton" : undefined}`}
            onClick={() => setWindow(1)}
          >
            Errors ({errors?.length || 0})
          </button>
          <button
            className={`${window == 2 ? "accentButton" : undefined}`}
            onClick={() => setWindow(2)}
          >
            Logs ({logs?.length || 0})
          </button>
        </div>

        {window == 0 && <Feedback feedback={feedback} />}
        {window == 1 && (
          <Errors
            data={errors}
            onClick={openErrorPanel}
            setRange={updateRange}
            range={dateRange}
            closeIssue={(id) =>
              updateErrorAttribute(id, "is_closed", true)
            }
          />
        )}
        {window == 2 && <Logs data={logs} range={logRange} />}
      </div>
    );
  } else {
    return <FourOFour />;
  }
}

function Feedback({ feedback }) {
  return (
    <div className="m2 mediumFade">
      <h2 className="textLeft m2">Feedback</h2>
      <div className="pr3">
        <div className="leftRow m2">
          <p className="ten">Date</p>
          <p className="ten">Type</p>
          <p className="fifty">Comment</p>
          <p className="ten">id</p>
        </div>
        {feedback?.map((fb) => (
          <div key={fb.id} className="projectRow hundred">
            <p className="ten">{formatDatestring(fb.created_at)}</p>
            <p className="ten">{fb.category || "none"}</p>
            <p className="fifty">{fb.value}</p>
            <p className="ten">{fb.user_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Errors({ data, range, setRange, onClick, closeIssue }) {
  const [filteredData, setFilteredData] = useState(null);
  const [showFlagged, setShowFlagged] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  function closeError(e, id) {
    e.preventDefault();
    e.stopPropagation();

    closeIssue(id);
  }

  function showFlaggedErrors() {
    setShowFlagged(!showFlagged);

    if (!showFlagged == true) {
      setFilteredData(data.filter((err) => err.is_flagged == true));
    } else setFilteredData(data);
  }

  function filterErrors(search) {
    search = search.toLowerCase();

    let tempData = data.filter((err) => {
      if (
        err.message?.toLowerCase().includes(search) ||
        err.description?.toLowerCase().includes(search) ||
        err.code?.toLowerCase().includes(search) ||
        err.user_id?.toLowerCase().includes(search) ||
        err.id?.toString()?.toLowerCase().includes(search) ||
        err.function?.toLowerCase().includes(search)
      )
        return err;
    });

    setFilteredData(tempData);
    setSearchText(search);
  }

  return (
    <div className="m2 pr3 mediumFade">
      <div className="row">
        <h2 className="textLeft m2 middle">Errors</h2>

        <div className="middle fifty center">
          <input
            placeholder="search errors"
            onChange={(e) => filterErrors(e.target.value)}
            value={searchText || ""}
          />
        </div>

        <div className="rightRow m0 fifty">
          <div className="rightRow hundred">
            <div className="fifty">
              <TypeInput
                options={RANGE_OPTIONS}
                onChange={setRange}
              />
            </div>
            <button
              onClick={() => showFlaggedErrors(true)}
              className={`${
                showFlagged && "accentButton"
              } middle center`}
            >
              <IonIcon
                name="flag"
                size="large"
                style={{ width: 20, height: 20 }}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="middle">
        {searchText?.length > 0 && (
          <p>
            Showing {filteredData?.length} errors for '{searchText}'
          </p>
        )}
      </div>

      {filteredData?.length > 0 ? (
        filteredData.map((err) => (
          <div
            key={err.id}
            className="projectRow hundred"
            onClick={() => onClick(err.id)}
          >
            <div className="hundred pr3">
              <div className="row m2 hundred">
                <div className="row seventyFive middle">
                  <p>{err.id}</p>
                  <p>{err.user_id || "-"}</p>
                  <p>
                    {DateTime.fromISO(err.created_at)?.toFormat(
                      "d MMM yy - HH:mm"
                    )}
                  </p>
                  <p>{err.code || "-"}</p>
                </div>
                <div className="row ten middle">
                  {err.is_flagged ? (
                    <IonIcon
                      name="flag"
                      style={{ color: "var(--primaryColor)" }}
                    />
                  ) : (
                    <div />
                  )}
                  {err.is_closed == false && (
                    <IonIcon
                      name="close"
                      style={{
                        color: "var(--primaryColor)",
                        width: 25,
                        height: 25,
                      }}
                      onClick={(e) => closeError(e, err.id)}
                    />
                  )}
                </div>
              </div>
              <div className="m2">
                <h3 className="m2">{err.message || "-"}</h3>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="m2">
          <p>No errors for this range</p>
        </div>
      )}
    </div>
  );
}

function Logs({ data, range }) {
  return (
    <div>
      <h2 className="textLeft m2">Logs</h2>
      <div>
        {data?.length > 0 ? (
          data.map((log) => (
            <div key={log.id} className="projectRow p2">
              <h3 className="ten">{log.id}</h3>
              <p className="ten">
                {DateTime.fromISO(log.created_at)?.toFormat(
                  "d MMM yy | HH:mm"
                )}
              </p>
              <p className="ten">{log.type}</p>
              <p>{log.details}</p>
              {log.json && (
                <p className="ten">{JSON.stringify(log.json)}</p>
              )}
            </div>
          ))
        ) : (
          <div className="m2">
            <p>No Logs</p>
          </div>
        )}
      </div>
    </div>
  );
}
