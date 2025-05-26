import IonIcon from "@reacticons/ionicons";
import { LIMITS } from "../../assets/data";
import { reRouteTo } from "../../Functions/commonFunctions";
import SubscriptionTable from "./SubscriptionTable";

export default function CheckoutForm() {
  async function loadPaymentItem(id) {
    reRouteTo(`plans/checkout?plan=${id}`);
  }

  return (
    <div className="">
      <PurchaseItemsList onClick={loadPaymentItem} />
    </div>
  );
}

function PurchaseItem({
  title,
  description,
  amount,
  freq,
  url,
  onClick,
  percentOff = null,
  included,
}) {
  return (
    <button
      onClick={onClick}
      className="w100 boxedOutline"
      style={{ padding: "20px 8px 0 8px" }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <IonIcon
            name="card-sharp"
            style={{ height: 50, width: 50 }}
          />
          <h2>{title}</h2>
          {percentOff && (
            <p className="boxedAccent p1 r2">SAVE {percentOff}%</p>
          )}

          <br />
        </div>

        <div
          className="boxedAccent hundred"
          style={{ margin: "0 20px" }}
        >
          <div
            className="centerRow"
            style={{ margin: 0, alignItems: "end" }}
          >
            <h1 style={{ margin: "0" }}>${amount}</h1>
            <p className="small label m0 mb1 ml1"> {freq}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function PurchaseItemsList({ onClick }) {
  return (
    <div className="w100 center">
      <div className="w75">
        <div className="row w100">
          <PurchaseItem
            onClick={() => onClick(1)}
            title="Monthly Subscription"
            description="Pay per month."
            amount={12}
            freq="per month"
            url="https://buy.stripe.com/test_fZeg1DcNwccj9s4289"
            included={[
              "Unlimited clients",
              "Unlimited projects",
              "Unlimited invoices & quotes in a project",
              "Unlimited contracts",
            ]}
          />
          <PurchaseItem
            onClick={() => onClick(0)}
            title="Annual Subscription"
            description="Pay by year"
            amount={120}
            freq="per year"
            url="https://buy.stripe.com/test_fZeg1DcNwccj9s4289"
            percentOff={20}
            included={[
              "Unlimited clients",
              "Unlimited projects",
              "Unlimited invoices & quotes in a project",
            ]}
          />
        </div>
            <SubscriptionTable/>
       
      </div>
    </div>
  );
}
