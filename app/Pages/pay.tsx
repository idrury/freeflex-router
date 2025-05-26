import React from "react";
import CheckoutForm from "../Elements/Stripe/CheckoutForm";

export default function Pay() {
  return (
    <div className="centerContainer">
      <div className="centerRow" style={{marginTop: 50}}>
        <img
          src="https://img.playbook.com/er7GlNhfNA8YuB-WPxcDZHSk7qAFLhNmk2yLebKjJpA/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2I5ZWIwNGY2/LTNhNmYtNDRjOC04/MDRjLThlZDlhNGVm/ZmE5Mw"
          style={{ margin: "10px 20px", maxWidth: 300 }}
        />
      </div>
      <div className="w100 center">
        <h3 className="w75"
          style={{
            fontSize: "2em",
            textAlign: "center",
          }}
        >
          Optimize your project management to the max with a subscription!
        </h3>
      </div>
      <CheckoutForm />
    </div>
  );
}
