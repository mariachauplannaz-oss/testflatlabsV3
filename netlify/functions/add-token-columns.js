import { neon } from "@netlify/neon";

export default async function handler(req, context) {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    // Add download_token column (unique, nullable until generated)
    await sql`
      ALTER TABLE downloads 
      ADD COLUMN IF NOT EXISTS download_token TEXT UNIQUE
    `;

    // Add used_at to mark when token was consumed
    await sql`
      ALTER TABLE downloads 
      ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ
    `;

    // Index for fast token lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_downloads_token 
      ON downloads(download_token) 
      WHERE download_token IS NOT NULL
    `;

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Token columns added successfully" 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
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
  path: "/api/add-token-columns"
};
