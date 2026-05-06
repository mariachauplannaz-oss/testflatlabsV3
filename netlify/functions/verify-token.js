import { neon } from "@netlify/neon";

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: "session_id is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Find the download record by Stripe session ID
    const result = await sql`
      SELECT 
        id, 
        user_email, 
        tier, 
        garment_config, 
        download_token,
        used_at
      FROM downloads 
      WHERE stripe_session_id = ${session_id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: "No download found for this session" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const download = result[0];

    // 2. Check if token already used
    if (download.used_at) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: "This download has already been used",
        used_at: download.used_at
      }), {
        status: 410, // Gone
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Mark as used (atomic operation)
    await sql`
      UPDATE downloads 
      SET used_at = NOW() 
      WHERE id = ${download.id} 
      AND used_at IS NULL
    `;

    // 4. Return data needed to generate the PDF
    return new Response(JSON.stringify({ 
      ok: true, 
      tier: download.tier,
      garment_config: download.garment_config,
      email: download.user_email
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("verify-token error:", error);
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
  path: "/api/verify-token"
};
