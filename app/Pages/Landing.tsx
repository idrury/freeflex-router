import React, { useEffect, useState } from "react";
import { reRouteTo } from "../Functions/commonFunctions";
import { LIMITS } from "../assets/data";

export default function Landing({ currentJob, width }) {

  return (
    <div style={{ margin: 0 }}>
      <div
        style={{
          margin: `${
            width < 1200
              ? "150px 20px 40px 20px"
              : "100px 20px 40px 20px"
          }`,
        }}
      >
        <h1
          className="hundred center m2"
          style={{
            fontWeight: 700,
            fontSize: `${width < 600 ? "60px" : "100px"}`,
            textTransform: "none",
            color: "var(--primaryColor)",
            textShadow: "0 0 20px #ebc27344",
          }}
        >
          FreeFlex
        </h1>
        <div
          style={{
            fontWeight: 300,
            fontSize: `${width < 600 ? "20px" : "30px"}`,
            marginLeft: `${width < 600 ? "0" : "20%"}`,
            marginRight: `${width < 600 ? "0" : "20%"}`,
            marginTop: 50,
            marginBottom: 50,
          }}
        >
          <span
            style={{
              lineHeight: 1.3,
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              display: "block",
            }}
          >
            <span>Helping Aussie</span>
            <span
              style={{
                backgroundColor: "#ebc273",
                borderRadius: 5,
                padding: "2px 5px 2px 5px",
                margin: 5,
                color: "var(--background)",
                fontWeight: 700,
                boxShadow: "0 0 20px #ebc27344",
              }}
            >
              {currentJob}
            </span>
            <span>
              run more effective businesses by streamlining your
              admin.
            </span>
          </span>
        </div>
        <div
          className="center middle"
          style={{ minHeight: `${width < 600 ? "200px" : "400px"}` }}
        >
          <img
            alt="image of freeflex budget page"
            src="https://img.playbook.com/BRkonWIQaogil3VrN_x8ZCQfhO2zfEqSlGW7llo7h5M/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzU0Mjc3MGYz/LTBkMjEtNDhkNi1h/MjEyLTc1ODI5YWFk/MTdkZQ"
            className="center textCenter displayImage"
            style={{ borderRadius: 10 }}
            width={`${width < 600 ? "100%" : "80%"}`}
          />
        </div>
        <div style={{ margin: "50px 0 30px 0" }}>
          <div className="hundred m2">
            <div className="pr3 center">
              <button
                onClick={() => reRouteTo("/login?status=register")}
                style={{
                  boxShadow: "0 0 10px #ebc27344",
                  fontWeight: 600,
                  fontSize: `${width < 600 ? "13px" : "22px"}`,
                  margin: "50px 0 10px 0",
                }}
                className="accentButton thirty"
              >
                Get Started Free!
              </button>
            </div>
          </div>
          <p className="textCenter">(No credit card required)</p>
        </div>
        <a
          className="centerRow textCenter"
          href="https://www.freeflex.com.au/help/privacy-policy"
        >
          Privacy policy
        </a>
      </div>

      <div className="m2">
        <div style={{ margin: "80px 0 30px 0" }}>
          <h1
            className="center"
            style={{
              fontWeight: 700,
              fontSize: `${width < 600 ? "40px" : "70px"}`,
              textTransform: "none",
              color: "var(--text)",
              textShadow: "0 0 10px #ffffff33",
            }}
          >
            Features
          </h1>
        </div>

        <div
          style={{
            margin: `${
              width < 600
                ? "30px 0px 30px 0px"
                : "30px 20px 30px 20px"
            }`,
          }}
        >
          <div
            className="projectRow boxedDark boxedOutline rightRow p2"
            style={{ margin: "30px 10px 30px 10px" }}
          >
            <div
              className="thirty"
              style={{
                margin: `${
                  width < 1200 ? "10px" : "10px 50px 10px 10px"
                }`,
              }}
            >
              <h1
                className="hundred p0 m0"
                style={{
                  fontWeight: 560,
                  fontSize: `${width < 600 ? "30px" : "40px"}`,
                  textTransform: "none",
                  color: "var(--text)",
                  textAlign: "end",
                  marginBottom: 10,
                }}
              >
                At A Glance project overviews
              </h1>
              <p
                className="p0 m0"
                style={{
                  fontSize: `${width < 600 ? "15px" : "25px"}`,
                  fontWeight: 300,
                  textAlign: "end",
                }}
              >
                View active projects and easily stay on top of due
                dates and priorities
              </p>
            </div>
            <div
              className="p2 fifty"
              style={{
                minHeight: `${width < 600 ? "150px" : "300px"}`,
              }}
            >
              <img
                alt="image of freeflex projects"
                src="https://img.playbook.com/rJo-fZKsT1asglhT027f2tePkSENSDKk2OiDGSua4NY/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzEwYWUwZDc2/LWM0MTEtNDdjOC1i/NWNiLTlkZmM4MTU5/MzcwNg"
                style={{ borderRadius: 10 }}
                className="displayImage"
                width={"100%"}
              />
            </div>
          </div>

          <div
            className="projectRow boxedDark boxedOutline leftRow p2"
            style={{ margin: "30px 10px 30px 10px" }}
          >
            <div
              className="p2 fifty"
              style={{
                minHeight: `${width < 600 ? "150px" : "300px"}`,
              }}
            >
              <img
                alt="image of freeflex budgeting page"
                src="https://img.playbook.com/B6_XBkLzcuUuTdAhXoIwb7Hg4MNCUhfSybW7w_rCC8c/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzIxY2IzNzI1/LWE0MTUtNDk4MS05/YWMxLThhNzRhOTRm/M2RlMA"
                style={{ borderRadius: 10 }}
                className="displayImage"
                width={"100%"}
              />
            </div>
            <div
              className="thirty"
              style={{
                margin: `${
                  width < 1200 ? "10px" : "10px 10px 10px 50px"
                }`,
              }}
            >
              <h1
                className="hundred m2 p0"
                style={{
                  fontWeight: 560,
                  fontSize: `${width < 600 ? "30px" : "40px"}`,
                  textTransform: "none",
                  color: "var(--text)",
                }}
              >
                Streamlined Business Budgeting
              </h1>
              <p
                style={{
                  fontSize: `${width < 600 ? "15px" : "25px"}`,
                  fontWeight: 300,
                }}
              >
                Understand your financial situation with clear
                spending and earning metrics
              </p>
            </div>
          </div>
          <div
            className="projectRow boxedDark boxedOutline rightRow p2"
            style={{ margin: "30px 10px 30px 10px" }}
          >
            <div
              className="thirty"
              style={{
                margin: `${
                  width < 1200 ? "10px" : "10px 50px 10px 10px"
                }`,
              }}
            >
              <h1
                className="hundred p0 m0"
                style={{
                  fontWeight: 560,
                  fontSize: `${width < 600 ? "30px" : "40px"}`,
                  textTransform: "none",
                  color: "var(--text)",
                  textAlign: "end",
                  marginBottom: 10,
                }}
              >
                Invoices & Quotes made easy
              </h1>
              <p
                className="p0 m0"
                style={{
                  fontSize: `${width < 600 ? "15px" : "25px"}`,
                  fontWeight: 300,
                  textAlign: "end",
                }}
              >
                Save time by instantly importing key Client and
                Project information
              </p>
            </div>
            <div
              className="p2 fifty"
              style={{
                minHeight: `${width < 600 ? "150px" : "300px"}`,
              }}
            >
              <img
                alt="image of freeflex invoices page"
                src="https://img.playbook.com/7Bf1r7oxa7fYvF4vf5htxskQzvf9I61tPoxucjlx5f4/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2JmMmJmODUx/LThjNDgtNDJlYS04/NmMxLTQ5YzAwOTE1/MTZjZg"
                style={{ borderRadius: 10 }}
                className="displayImage"
                width={"100%"}
              />
            </div>
          </div>

          <div
            className="projectRow boxedDark boxedOutline leftRow p2"
            style={{ margin: "30px 10px 30px 10px" }}
          >
            <div
              className="p2 fifty"
              style={{
                minHeight: `${width < 600 ? "150px" : "300px"}`,
              }}
            >
              <img
                alt="image of freeflex Clients page"
                src="https://img.playbook.com/kyajqo0tY1mU2Qwq63TS2dNkddW85l5VzT4AQz4N2pY/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzI3ZGUyNmM0/LWUzNjgtNGE4Ni05/NDYzLWY2OWY3M2Qw/N2UxMQ"
                style={{ borderRadius: 10 }}
                className="displayImage"
                width={"100%"}
              />
            </div>
            <div
              className="thirty"
              style={{
                margin: `${
                  width < 1200 ? "10px" : "10px 10px 10px 50px"
                }`,
              }}
            >
              <h1
                className="hundred m2 p0"
                style={{
                  fontWeight: 560,
                  fontSize: `${width < 600 ? "30px" : "40px"}`,
                  textTransform: "none",
                  color: "var(--text)",
                }}
              >
                Simple CRM
              </h1>
              <p
                style={{
                  fontSize: `${width < 600 ? "15px" : "25px"}`,
                  fontWeight: 300,
                }}
              >
                Keep track of client details in one easy place
              </p>
            </div>
          </div>
        </div>

        <div>
          <div style={{ margin: "80px 0 50px 0" }}>
            <h1
              className="center"
              style={{
                fontWeight: 700,
                fontSize: `${width < 600 ? "40px" : "70px"}`,
                textTransform: "none",
                color: "var(--text)",
                textShadow: "0 0 10px #ffffff33",
              }}
            >
              Pricing
            </h1>
            <p className="textCenter" style={{ fontSize: 25 }}>
              {`FreeFlex is completely free for your first ${LIMITS.projects} projects, then just $10 per month.`}
            </p>
          </div>
        </div>
        <div style={{ margin: "50px 10px 100px 10px" }}>
          <div className="hundred m2">
            <div className="pr3 center">
              <button
                onClick={() => reRouteTo("/login?status=register")}
                style={{
                  boxShadow: "0 0 10px #ebc27344",
                  fontWeight: 600,
                  fontSize: `${width < 600 ? "13px" : "22px"}`,
                  margin: "50px 0 10px 0",
                }}
                className="accentButton thirty"
              >
                Get Started Free!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
