// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Import via bare specifier thanks to the import_map.json file.
import Stripe from 'https://esm.sh/stripe@17.4.0?target=deno'
import { serve } from "https://deno.land/std@1.45.2/http/server.ts";


const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})
// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider()

console.log("Hello from stripe-webhook!")

serve(async (req) => {
  const signature = request.headers.get("Stripe-Signature");

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await request.text();
  let receivedEvent;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET"),
      undefined,
      cryptoProvider
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
  console.log(receivedEvent);
  return new Response(JSON.stringify({ok: true}), { status: 200 });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
