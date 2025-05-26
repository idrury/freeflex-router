import { useEffect, useState } from "react";
import spinners from "react-spinners";
import {
  fetchActiveUserSubscriptions,
  getStripePaymentIntents,
} from "../../Functions/DBAccess";
import { formatDatestring } from "../../Functions/Dates";
import EditMenu from "../EditMenu";
import BasicMenu from "../BasicMenu";
import {
  cancelStripeSubscription,
  retrieveStripeInvoice,
} from "../../Functions/StripeAccess";
import { Link } from "react-router-dom";
import { reRouteTo } from "../../Functions/commonFunctions";
import React from "react";
import SubscriptionTable from "../Stripe/SubscriptionTable";
import IonIcon from "@reacticons/ionicons";
import { SavedModalType } from "../../assets/Types";
import { FEEDBACK_OPTIONS } from "./ACCOUNT_DATA";
import { PaymentIntent } from "@stripe/stripe-js";

export default function RatesDetails({ userId, expand }) {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>();

  const [editMenuActive, setEditMenuActive] = useState(false);
  const [editMenuLoading, setEditMenuLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(true);

  const [infoMenuActive, setInfoMenuActive] = useState(false);
  const [infoMenuText, setInfoMenuText] = useState<SavedModalType>({
    visible: false,
    header: undefined,
    body: undefined,
  });

  const [commentError, setCommentError] = useState<string>();

  const [cancellationFeedback, setcancellationFeedback] =
    useState("other");
  const [cancellationComment, setCancellationComment] =
    useState(null);

  const [totalDiscount, setTotalDiscount] = useState(null);

  const [showPreviousPayments, setShowPreviousPayments] =
    useState(false);
  const [allPaymentsLoading, setAllPaymentsLoading] = useState(false);

  useEffect(() => {
    getSubscriptionDetails();
    if (expand == "true") {
      showAllPayments();
    }
  }, []);

  async function getSubscriptionDetails() {
    // Get the user's subscriptions
    try {
      let subscriptions = await fetchActiveUserSubscriptions(userId);

      if (subscriptions?.length > 0) {
        setSubscription(subscriptions[0]);
        setIsCancelled(subscriptions[0]?.attrs?.cancel_at_period_end);
        setTotalDiscount(
          subscriptions[0].attrs.discount?.coupon?.percent_off
        );
      }
    } catch (error) {
      showMenu(
        "Sorry! An error has occured",
        "We can't get your subscription details right now.\nRefresh the page and try again."
      );
    }
    setLoading(false);
  }

  async function cancelUserSubscription(id) {
    setEditMenuLoading(true);

    if (!cancellationComment) {
      setCommentError("Please let us know what we can improve!");
      setEditMenuLoading(false);
      return;
    }

    //Feedback must be one of too_expensive, missing_features, switched_service, unused, customer_service, too_complex, low_quality, or other
    try {
      await cancelStripeSubscription(
        id,
        cancellationFeedback,
        cancellationComment
      );
    } catch (error) {
      alert(
        "Sorry. An unexpected error occured while processing your request. Refresh the page and try again."
      );
      setEditMenuLoading(false);
      setEditMenuActive(false);
      return false;
    }

    showMenu(
      "Sorry to see you go!",
      "Your subscription has been cancelled successfully"
    );

    setEditMenuLoading(false);
    setEditMenuActive(false);
    return true;
  }

  function showMenu(menuTitle: string, menuBody: string) {
    setInfoMenuActive(true);
    setInfoMenuText({
      visible: true,
      header: menuTitle,
      body: menuBody,
    });
  }

  function hideMenu() {
    setInfoMenuActive(false);
    reRouteTo("/Account?SEC=2&EII=true");
  }

  function showAllPayments() {
    setAllPaymentsLoading(true);
    setShowPreviousPayments(true);
  }

  return (
    <div className="hundred">
      <BasicMenu
        width={300}
        isActive={infoMenuActive}
        setIsActive={setInfoMenuActive}
      >
        <div>
          <h2>{infoMenuText.header}</h2>
          <p style={{ textAlign: "center" }}>{infoMenuText.body}</p>
          <div className="centerRow">
            <button
              className="fifty accentButton boldLabel centerRow"
              onClick={() => hideMenu()}
            >
              close
            </button>
          </div>
        </div>
      </BasicMenu>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          <spinners.HashLoader
            className="loader mediumFade"
            color="var(--primaryColor)"
          />
        </div>
      ) : (
        <div className="mediumFade">
          {subscription ? (
            <div className="ml1">
              <CancelSubscriptionPanel
                active={editMenuActive}
                setActive={setEditMenuActive}
                loading={editMenuLoading}
                id={subscription?.id}
                cancelSubscription={cancelUserSubscription}
                feedback={cancellationFeedback}
                setFeedback={setcancellationFeedback}
                comment={cancellationComment}
                setComment={setCancellationComment}
                commentError={commentError}
              />

              <br />
              <div className="leftRow middle m0 ml2">
                <IonIcon
                  name="wallet-sharp"
                  className="basicIcon mr1"
                  style={{ width: "20pt", height: "20pt" }}
                />
                <h2 className="textLeft m0">Subscription Details</h2>
              </div>

              {isCancelled && (
                <div
                  className="boxedAccent"
                  style={{ margin: "20px 0", textAlign: "center" }}
                >
                  <h3>This subscription has been cancelled</h3>
                </div>
              )}
              <div className="m2">
                <SpreadRow
                  heading="Plan"
                  body={subscription.attrs.plan?.nickname}
                />
                <SpreadRow
                  heading="Status"
                  body={
                    isCancelled
                      ? `active (until ${formatDatestring(
                          subscription.current_period_end
                        )})`
                      : subscription.attrs.status
                  }
                />
                <SpreadRow
                  heading="Cost"
                  body={`$${
                    subscription.attrs.plan?.amount
                      ? subscription.attrs.plan.amount / 100
                      : null
                  }`}
                />
                <SpreadRow
                  heading="Frequency"
                  body={subscription.attrs.amount}
                />
                <SpreadRow
                  heading="Discount"
                  body={`${totalDiscount || 0}%`}
                />
                <SpreadRow
                  heading="Last successful payment"
                  body={formatDatestring(
                    subscription.current_period_start
                  )}
                />
                {isCancelled == false && (
                  <SpreadRow
                    heading="Renewal date"
                    body={formatDatestring(
                      subscription.current_period_end
                    )}
                  />
                )}
              </div>
              {isCancelled == false && (
                <div className="pr3">
                  <button
                    className="hundred accentButton centerRow middle"
                    disabled={loading}
                    onClick={() => setEditMenuActive(true)}
                  >
                    <IonIcon
                      name="close-circle"
                      className="basicIcon smallIcon mr1"
                    />
                    <p className="m0">Cancel my subscription</p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="leftRow middle">
                <IonIcon
                  name="wallet-sharp"
                  className="basicIcon mr1"
                  style={{ width: "20pt", height: "20pt" }}
                />
                <h2 className="leftRow m0">
                  You're on the free plan
                </h2>
              </div>
              <div className="m0 w100 pr3">
                <a href="/Plans">
                  <button className="accentButton leftRow m0 ml2">
                    <IonIcon
                      name="card-sharp"
                      className="basicIcon mr1"
                    />
                    <p className="m0">Subscribe for more features!</p>
                  </button>
                </a>
              </div>
              <div className="divider ml2" style={{ height: 20 }} />
              <SubscriptionTable />
            </div>
          )}
          <div className="m2 pl1">
            {showPreviousPayments || (
              <button
                disabled={showPreviousPayments}
                className="hundred mv2"
                onClick={showAllPayments}
              >
                {allPaymentsLoading ? (
                  <spinners.BeatLoader size={10} color="var(--primaryColor)" />
                ) : (
                  <div className="centerRow m0">
                    <IonIcon
                      name="caret-down"
                      className="smallIcon mr1"
                    />
                    <p className="m0">Show all invoices</p>
                  </div>
                )}
              </button>
            )}
          </div>
          {showPreviousPayments && (
            <PreviousPayments
              userId={userId}
              loading={allPaymentsLoading}
              setLoading={setAllPaymentsLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SpreadRow({ heading, body }) {
  if (!heading || !body) {
    return <div></div>;
  }

  return (
    <div className="row">
      <h3>{heading}</h3>
      <p>{body || "None"}</p>
    </div>
  );
}

function CancelSubscriptionPanel({
  active,
  setActive,
  loading,
  id,
  cancelSubscription,
  feedback,
  setFeedback,
  comment,
  setComment,
  commentError,
}) {
  return (
    <EditMenu
    height={200}
      isActive={active}
      setIsActive={setActive}
      width={200}
      isLoading={loading}
    >
      <div style={{ width: 300 }}>
        <h2 style={{ textAlign: "start" }}>Cancel Subscription</h2>
        <p style={{ margin: 10 }}>
          We're sorry to see you go! Can you tell us a bit about why
          you made this descision so we can improve FreeFlex?
        </p>
        <div style={{ width: "95%" }}>
          <br />

          <select
            className="hundred"
            onChange={(e) => setFeedback(e.target.value)}
          >
            {FEEDBACK_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.value}>
                {opt.text}
              </option>
            ))}
          </select>

          <br />
          <div className="m2">
            <textarea
              onChange={(e) => setComment(e.target.value)}
              className="hundred"
            />
            {commentError && <label>{commentError}</label>}
          </div>
          <br />
        </div>
        <div className="pr2">
          <button
            onClick={() => cancelSubscription(id)}
            className="hundred"
          >
            {loading ? (
              <spinners.BeatLoader size={10} color="var(--primaryColor)" />
            ) : (
              <h3 style={{ margin: 0 }}>Cancel subscription</h3>
            )}
          </button>
          <button
            onClick={() => setActive(false)}
            className="hundred accentButton"
          >
            Back
          </button>
        </div>
      </div>
    </EditMenu>
  );
}

/* ----- GET INVOICES ------ */
function PreviousPayments({ userId, loading, setLoading }) {
  const [intents, setIntents] = useState<any[]>();
  const [error, setError] = useState(null);

  useEffect(() => {
    getIntents();
  }, []);

  async function getIntents() {
    try {
      let intents = await getStripePaymentIntents(userId);
      setIntents(intents);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function getStripeInvoiceUrl(id) {
    try {
      let invoice = await retrieveStripeInvoice(id);
      if(!invoice || !invoice.hosted_invoice_url) return;
      window.open(invoice.hosted_invoice_url);
    } catch (error) {
      alert(
        "Sorry! there was an issue loading that invoice. Refresh the page and try again."
      );
    }
  }

  return (
    <div className="m2 p0 pr2">
      {loading ? (
        <div style={{ display: "flex", marginTop: "50px" }}>
          <spinners.HashLoader
            className="loader mediumFade"
            color="var(--primaryColor)"
          />
        </div>
      ) : (
        <div className="hundred mediumFade m2">
          <h2
            className="textLeft"
            style={{ marginTop: 30, padding: "10px 0 10px 0" }}
          >
            Previous invoices
          </h2>
          {intents && intents?.length > 0 ? (
            <div>
              {intents?.map((intent) => (
                <div
                  key={intent.id}
                  className="projectRow row hundred mediumFade p0"
                  style={{ margin: "10px 0 10px 0" }}
                >
                  <div
                    className="leftRow"
                    style={{ margin: "0 10px" }}
                  >
                    <p>{formatDatestring(intent.created)}</p>
                    <p>${intent.amount / 100}</p>
                  </div>
                  <button
                    className="accentButton"
                    onClick={() =>
                      getStripeInvoiceUrl(intent.attrs.invoice)
                    }
                  >
                    DOWNLOAD
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="leftRow m0">
              {error ? (
                <p>{error}</p>
              ) : (
                <p className="m0 boxed">
                  Looks like you've never had a subscription! Why not
                  <Link to="/Plans">start now?</Link>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
