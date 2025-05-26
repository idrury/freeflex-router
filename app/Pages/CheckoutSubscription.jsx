import {
  useElements,
  useStripe,
  Elements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import {
  fetchActiveUserSubscriptions,
  fetchUserBusiness,
  insertError,
  logEvent,
} from "../Functions/DBAccess";
import { useParams, useSearchParams } from "react-router-dom";
import spinners from "react-spinners";
import BasicMenu from "../Elements/BasicMenu";
import {
  createStripeCustomer,
  createStripeSubscription,
  getStripeCoupon,
  getStripeCustomer,
  updateStripeCustomer,
} from "../Functions/StripeAccess";
import { reRouteTo } from "../Functions/commonFunctions";
import {
  stripe_live_public,
  stripe_test_public,
  SUB_OPTIONS,
} from "../Elements/Checkout/CHECKOUT_DATA";
import IonIcon from "@reacticons/ionicons";

const stripePromise = loadStripe(
 stripe_live_public
);

export default function CheckoutSubscription({ userId, email }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [subOption, setSubOption] = useState({});
  const [loading, setLoading] = useState(true);

  const [menuActive, setMenuActive] = useState(false);
  const [menuTitle, setMenuTitle] = useState(null);
  const [menuBody, setMenuBody] = useState(null);
  const [menuRoute, setMenuRoute] = useState(null);

  let options = {
    mode: "subscription",
    amount: 1500,
    currency: "aud",
  };

  useEffect(() => {
    loadPage();
  }, []);

  // Throw error if userId doesn't exist
  if (!userId) {
    insertError(
      new Error(
        "An unauthenticated user has attempted to access the subscriptions page"
      ),
      "CheckoutForm",
      { userId },
      "404",
      true
    );
    reRouteTo("/Error");
    return;
  }

  async function loadPage() {
    //Check user has no active subscriptions already
    try {
      let activeSubscriptions = await fetchActiveUserSubscriptions(
        userId
      );

      if (activeSubscriptions?.length > 0) {
        showMenu(
          "You already have a subscription!",
          "You don't have to pay us twice!"
        );
        await insertError(
          new Error("the user already has an active subscription"),
          "CheckoutSubscription --> fetchActiveUserSubscriptions",
          { activeSubscriptions },
          null,
          true
        );
        return;
      }
    } catch (error) {
      reRouteTo("/Error");
      return;
    }

    // Set up the customer and plan details
    getCustomer();
    getUser();
    getPlan();
    setLoading(false);
  }

  async function getCustomer() {
    // Check if user exists in stripe
    let customer = null;
    try {
      customer = await getStripeCustomer(userId);
    } catch (error) {
      console.log("creating new customer");

      // Create new customer if none exists
      try {
        await createCustomer();
      } catch (error) {
        reRouteTo("/Error");
      }
    }

    try {
      customer = await getStripeCustomer(userId);
    } catch (error) {
      reRouteTo("/Error");
    }

    // Don't create new customer if one alrady exists
    if (customer?.id != null) {
      setLoading(false);
      return;
    }

    // Create a new customer if none exists

    setLoading(false);
    return;
  }

  async function createCustomer() {
    // Set the user name if it exists
    let name = "";

    if (user?.profiles?.first_name && user?.profiles?.last_name) {
      name =
        user?.profiles?.first_name + " " + user?.profiles?.last_name;
    }

    // Create a new customer
    const localCustomer = {
      id: userId,
      email: user?.profiles?.email || "",
      name: name,
    };

    try {
      await createStripeCustomer(localCustomer);
    } catch (error) {
      throw error;
    }
  }

  async function getUser() {
    try {
      setUser(await fetchUserBusiness(userId));
      return true;
    } catch (error) {
      console.log("business not found");
      return false;
    }
  }

  function showMenu(title, body, route = null) {
    setMenuActive(true);
    setMenuTitle(title);
    setMenuBody(body);
    setMenuRoute(route);
  }

  function hideMenu() {
    setMenuActive(false);
    setMenuTitle(null);
    setMenuBody(null);
  }

  //Load the plan from the array by id
  function getPlan() {
    const plan = searchParams.get("plan");
    const planDetails = SUB_OPTIONS.find((opt) => opt.id == plan);
    setSubOption(planDetails || null);
  }

  return (
    <div className="centerContainer">
      <BasicMenu isActive={menuActive} setIsActive={hideMenu}>
        <div>
          <h2>{menuTitle}</h2>
          <p style={{ textAlign: "center" }}>{menuBody}</p>
          <div className="centerRow">
            <button
              className="fifty accentButton boldLabel centerRow"
              onClick={() => {
                menuRoute ? reRouteTo(menuRoute) : hideMenu();
              }}
            >
              close
            </button>
          </div>
        </div>
      </BasicMenu>
      {loading ? (
        <div className="loadingContainer mediumFade">
          {" "}
          <spinners.ClimbingBoxLoader color="var(--primaryColor)" />
        </div>
      ) : (
        <div className="hundred mediumFade">
          <div style={{ margin: 50 }}>
            <h3
              style={{
                fontSize: "3em",
                textAlign: "center",
                padding: "0 10%",
              }}
            >
              {subOption?.name || "nothing"}
            </h3>
          </div>
          <div>
            <Elements stripe={stripePromise} options={options}>
              <PaymentInput
                userId={userId}
                email={email}
                planObject={subOption}
                showMenu={showMenu}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- THE PAYMENT INPUT ---*/
function PaymentInput({ userId, email, planObject, showMenu }) {
  const stripe = useStripe();
  const stripeElements = useElements();

  const [plan, setPlan] = useState(planObject);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [couponText, setCouponText] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");
  const [addedCoupons, setAddedCoupons] = useState(null);
  const [couponsLoading, setCouponsLoading] = useState(false);

  const [totalCost, setTotalCost] = useState(planObject.cost);

  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "au",
  });
  const [name, setName] = useState("");

  const addressOptions = {
    mode: "billing",
    defaultValues: {
      name: name,
      address: address,
    },
  };

  const paymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };

  if (!plan) {
    return null;
  }

  async function createSubscription() {
    //Catch errors
    if (!plan) {
      insertError(
        new Error("The plan could not be retrieved"),
        "createSubscription",
        { userId },
        "404",
        true
      );
      return false;
    }

    //Update the customer
    try {
      await updateStripeCustomer(userId, email, name);
    } catch (error) {
      throw error;
    }

    let subscription = {
      customer: userId,
      items: plan.items,
      discounts: plan.discounts,
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    };

    return await createStripeSubscription(subscription);
  }

  /************************************************
   * Run when the payment form is submitted
   * @param {*} e
   * @returns
   */
  async function handleSubmit(e) {
    setLoadingSubmit(true);
    e.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setLoadingSubmit(false);
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await stripeElements.submit();

    if (submitError) {
      setLoadingSubmit(false);
      return;
    }

    let clientSecret = null;

    try {
      clientSecret = await createSubscription();

      if (totalCost == 0) {
        reRouteTo(`/plans/orderComplete`);
        return true;
      }
    } catch (error) {
      insertError(
        error,
        "CheckoutSubscription --> handleSubmit",
        {},
        null,
        true
      );
      showMenu(
        "sorry! We've encountered an issue with the payment.",
        "Refresh the page and try again!"
      );
      setLoadingSubmit(false);
      return null;
    }

 
    try {
      let result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements: stripeElements,
        clientSecret,
        confirmParams: {
          return_url: `${
            process.env.NODE_ENV == "development"
              ? "http://localhost:5173"
              : "https://freeflex.com.au"
          }/plans/orderComplete`,
        },
      });

      if (result.error) {
        if (result.error.code == "card_declined") {
          showMenu(
            "Sorry, that card declined!",
            "Double check your details and try again."
          );
        } else {
          showMenu(
            "We've encountered an issue with the payment.",
            "Refresh the page and try again."
          );
        }
        throw result.error;
      }
    } catch (error) {
      insertError(
        error,
        "CheckoutSubscription ->> confirmPayment",
        null,
        null,
        true
      );
      showMenu(
        "sorry! We've encountered an issue with the payment.",
        "Refresh the page and try again."
      );
    }
    setLoadingSubmit(false);
    return;
  }

  async function getCouponCode(e, code) {
    e.preventDefault();
    setCouponsLoading(true);
    let coupon = null;

    try {
      coupon = await getStripeCoupon(code);
    } catch (error) {
      insertError(
        new Error("that coupon doesn't exist"),
        "get coupon code",
        code,
        null,
        true
      );
    }

    if (!coupon) {
      setCouponFeedback("That coupon doesn't exist!");
      setCouponsLoading(false);
      return false;
    }

    //Add the coupon to the plan if valid
    if (coupon) {
      // Check coupon is valid
      if (
        (coupon.max_redemptions != null &&
          coupon.times_redeemed >= coupon.max_redemptions) ||
        coupon.valid == false
      ) {
        setCouponFeedback("Sorry! that coupon is invalid");
        setCouponsLoading(false);
        return false;
      }

      // Add the coupon to the plan if successful
      let tempPlan = plan;
      tempPlan.discounts = [{ coupon: coupon.id }];
      setPlan(tempPlan);
      setAddedCoupons({
        value: coupon.id,
        percent_off: coupon.percent_off,
      });
      setCouponFeedback(
        coupon.percent_off.toString().concat("% discount added!")
      );
      setCouponText("");
      setCouponsLoading(false);
      updateTotal(coupon.percent_off);
      return true;
    }

    setCouponsLoading(false);
    return false;
  }

  function updateTotal(percentOff) {
    const percentNum = parseInt(percentOff);

    let tempCost = plan.cost - plan.cost * (percentNum / 100);

    if (tempCost < 0) {
      setTotalCost(0);
      return;
    }

    return setTotalCost(tempCost);
  }

  function handleStripeChange(v) {
    setName(v.name);
    setAddress(v.address);
  }

  return (
    <div className="row dynamicRow hundred">
      <div className="hundred">
        <CouponElement
          onSubmit={getCouponCode}
          couponText={couponText}
          setCouponText={setCouponText}
          feedbackText={couponFeedback}
          addedCoupons={addedCoupons}
          loading={couponsLoading}
        />

        <div className="boxedOutline" style={{ margin: 0 }}>
          <div className="leftRow middle">
            <IonIcon name="card-sharp" className="mr1" style={{height: "20pt", width: "20pt"}}/>
            <h2 style={{ margin: "10px 0" }} className="leftRow">
              SUMMARY
            </h2>
          </div>
          <label>{plan?.name || "nothing"}</label>

          <h3 style={{ margin: 10 }}>COST</h3>
          <div className="boxed" style={{ margin: 10 }}>
            <div className="mediumFade leftRow" style={{ margin: 0 }}>
              <label style={{ margin: "0 5px" }}>${plan.cost}</label>
              <label style={{ margin: 0 }}>{plan.frequency}</label>
            </div>
          </div>
          {addedCoupons && (
            <div>
              <h3 style={{ margin: 10 }}>DISCOUNTS</h3>
              <div
                className="boxed mediumFade row"
                style={{ padding: 0 }}
              >
                <label>-{addedCoupons.percent_off}%</label>
                <label>{addedCoupons.value}</label>
              </div>
            </div>
          )}
          <h3 style={{ margin: 10 }}>TOTAL</h3>
          <div className="boxed">
            <h2 className="leftRow" style={{ margin: 0 }}>
              ${totalCost}
            </h2>
          </div>
        </div>
        <br />
      </div>

      <div className="hundred boxedOutline">
        <form onSubmit={handleSubmit}>
          <AddressElement
            onChange={(e) => handleStripeChange(e.value)}
            options={addressOptions}
          />
          <br />
          <br />
          <PaymentElement options={paymentElementOptions} />
          <br />
          <br />
          <button
            type="submit"
            className="hundred accentButton m0"
            style={{ textAlign: "center" }}
          >
            {loadingSubmit ? (
              <spinners.BeatLoader color="var(--background)" size={10} />
            ) : (
              <div className="centerRow">
                <IonIcon name="card-sharp" className="basicIcon mr1"/> 
                <h3 className="m0">Pay now</h3>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* --- THE COUPON ELEMENT --- */
function CouponElement({
  couponText,
  setCouponText,
  loading,
  onSubmit,
  feedbackText,
  addedCoupons,
}) {
  return (
    <div className="boxedOutline m0 mt2 mb2">
      <form onSubmit={(e) => onSubmit(e, couponText)}>
        <div className="middle leftRow m0 ml2">
          <IonIcon name="pricetag-sharp" className="basicIcon mr2"/>
          <h3>Enter coupon code</h3></div>
        <div className="m2 pr3">
          <input
            onChange={(e) => setCouponText(e.target.value)}
            value={couponText}
            className="hundred"
          />
        </div>
        {feedbackText && (
          <label className="mediumFade">{feedbackText}</label>
        )}

        <div style={{ paddingRight: "20px" }}>
          <button
            type="submit"
            disabled={loading}
            className="hundred accentButton"
          >
            {loading ? (
              <spinners.BeatLoader color="var(--background)" size={10} />
            ) : (
              <p className="m0">+ Add code</p>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
