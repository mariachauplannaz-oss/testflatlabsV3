import Stripe from "stripe";
import { neon } from "@netlify/neon";
import crypto from "node:crypto";

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  // 1. Verify Stripe signature — critical for security
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ 
      error: `Invalid signature: ${err.message}` 
    }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 2. Only handle the event we care about
  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ 
      received: true, 
      ignored: event.type 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const session = event.data.object;
  const email = session.customer_email;
  const stripeSessionId = session.id;
  const garmentConfig = session.metadata?.garment_config 
    ? JSON.parse(session.metadata.garment_config) 
    : {};
  const tcVersion = session.metadata?.tc_version || "1.0";

  try {
    // 3. Idempotency check — if Stripe retries, don't duplicate
    const existing = await sql`
      SELECT id, download_token FROM downloads 
      WHERE stripe_session_id = ${stripeSessionId}
    `;
    
    if (existing.length > 0) {
      return new Response(JSON.stringify({ 
        received: true, 
        already_processed: true,
        token: existing[0].download_token
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. Upsert user
    await sql`
      INSERT INTO users (email) 
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;

    // 5. Generate secure random download token (32 bytes hex = 64 chars)
    const downloadToken = crypto.randomBytes(32).toString("hex");

    // 6. Insert download record
    await sql`
      INSERT INTO downloads (
        user_email, 
        tier, 
        garment_config, 
        tc_version_accepted, 
        stripe_session_id,
        download_token
      ) VALUES (
        ${email},
        'PRO',
        ${garmentConfig},
        ${tcVersion},
        ${stripeSessionId},
        ${downloadToken}
      )
    `;

    return new Response(JSON.stringify({ 
      received: true, 
      processed: true 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const config = {
  path: "/api/stripe-webhook"
};
