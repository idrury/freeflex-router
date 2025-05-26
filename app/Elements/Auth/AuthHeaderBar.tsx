import { useEffect } from "react";
import { reRouteTo } from "../../Functions/commonFunctions";
import {IoMdHome, IoMdLogIn, IoMdPersonAdd} from "react-icons/io"

interface AuthHeaderBarProps {
  width: number;
  authorized?: boolean;
}

export default function AuthorizationHeaderBar({
  width,
  authorized,
}: AuthHeaderBarProps) {

  useEffect(() => {}, [])

  return (
    <div
      className="row middle"
      style={{
        position: "sticky",
        left: 0,
        top: 0,
        zIndex: 0,
        width: "100%",
        backgroundColor: "var(--background)",
        boxShadow: "0 0 50px 10px #33333399",
      }}
    >
      <div className="m2">
        <img
          src={
            width < 600
              ? "https://img.playbook.com/IR8ld9DMC6GajY155YEiPfyNabJU8k7bKFiOsk_t7sQ/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzU3NjdiOGQ0/LTgzMTQtNDliMC1h/OGYwLTNkMGI2YTVl/MTE3Zg"
              : "https://img.playbook.com/er7GlNhfNA8YuB-WPxcDZHSk7qAFLhNmk2yLebKjJpA/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2I5ZWIwNGY2/LTNhNmYtNDRjOC04/MDRjLThlZDlhNGVm/ZmE5Mw"
          }
          height={width < 1200 ? "100px" : "50px"}
          onClick={() => reRouteTo("/")}
          className="clickable"
        />
      </div>
      <div className="ten"></div>
      {authorized ? (
        <div className="thirty p1 rightRow">
          <button
            onClick={() => reRouteTo(`/`)}
            className="thirty middle centerRow"
          >
              <IoMdHome
                className="basicIcon smallIcon mr2"
              />
            Home
          </button>
        </div>
      ) : (
        <div className="thirty p1 rightRow">
          <button
            onClick={() => reRouteTo("/login?status=login")}
            className="thirty middle centerRow"
          >
              <IoMdLogIn
                name="log-in-outline"
                className="basicIcon mr2"
              />
            Login
          </button>
          <button
            onClick={() => reRouteTo("/login?status=register")}
            className="accentButton thirty centerRow middle"
          >
            <IoMdPersonAdd
              name="person-add-sharp"
              className="basicIcon mr2"
            />
            Register
          </button>
        </div>
      )}
    </div>
  );
}
