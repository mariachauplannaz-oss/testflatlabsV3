import { neon } from "@netlify/neon";

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export default async function handler(req, context) {
  try {
    await sql`
      CREATE INDEX IF NOT EXISTS idx_downloads_ip_tier_date
      ON downloads(ip_hash, tier, created_at)
      WHERE ip_hash IS NOT NULL
    `;

    return new Response(JSON.stringify({ ok: true, message: "Index created (or already existed)" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("add-free-download-index error:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  path: "/api/add-free-download-index",
};
