import Stripe from "stripe";
import { insertError } from "./DBAccess";

/*@ts-ignore*/
const stripeApi = new Stripe(import.meta.env.VITE_STRIPE_API_KEY);

export async function cancelStripeSubscription(
  id,
  feedback,
  comment
) {
  try {
    await stripeApi.subscriptions.update(id, {
      cancel_at_period_end: true,
      cancellation_details: {
        feedback: feedback,
        comment: comment,
      },
    });
    return true;
  } catch (error) {
    throw await insertError(
      error,
      "StripeAccess >> CancelSubscription",
      { id },
      null
    );
  }
}

export async function getStripeSubscription(id) {
  try {
    return stripeApi.subscriptions.retrieve(id, {
      expand: ["discounts"],
    });
  } catch (error) {
    throw await insertError(
      error,
      "StripeAccess >> getStripeSubscriptions",
      { id },
      null
    );
  }
}

export async function getStripeCustomer(userId) {
  try {
    return await stripeApi.customers.retrieve(userId);
  } catch (error) {
    throw await insertError(
      error,
      "StripeAccess >> getStripeCustomer",
      { userId },
      null
    );
  }
}

export async function createStripeCustomer(customerDetails) {
  try {
    await stripeApi.customers.create(customerDetails);
    return true;
  } catch (error) {
    throw await insertError(
      error,
      "createCustomer",
      { customerDetails },
      null
    );
  }
}

export async function updateStripeCustomer(id, email, name) {
  try {
    await stripeApi.customers.update(id, {
      email: email,
      name: name,
    });
  } catch (error) {
    throw await insertError(
      error,
      "createCustomer",
      { id, email, name },
      null
    );
  }
}

export async function createStripeSubscription(subscription) {
  try {
    let newSubscription = await stripeApi.subscriptions.create(
      subscription
    );
    return ((newSubscription?.latest_invoice as Stripe.Invoice)?.payment_intent as Stripe.PaymentIntent)
      ?.client_secret;
  } catch (error) {
    throw await insertError(
      error,
      "StripeAccess ->> createStripeSubscription",
      subscription,
      null,
      true
    );
  }
}

export async function getStripeCoupon(code) {
  try {
    return await stripeApi.coupons.retrieve(code);
  } catch (error) {
    throw await insertError(
      error,
      "getStripeCouponCode not found",
      { code },
      null
    );
  }
}

export async function cancelStripeSubscriptionImmediately(
  id,
  feedback,
  comment
) {
  try {
    await await stripeApi.subscriptions.cancel(id);
    return true;
  } catch (error) {
    throw await insertError(
      error,
      "StripeAccess >> CancelSubscriptionImmediately",
      { id },
      null
    );
  }
}


export async function retrieveStripeInvoice(id) {
  try {
    return await stripeApi.invoices.retrieve(id);
  } catch (error) {
    throw await insertError(
      error,
      "StripeAccess >> CancelSubscriptionImmediately",
      { id },
      null
    );
  }
}
