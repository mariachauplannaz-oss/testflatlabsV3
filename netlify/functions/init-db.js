import { neon } from "@netlify/neon";

export default async function handler(req, context) {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        free_download_used BOOLEAN DEFAULT FALSE,
        free_download_at TIMESTAMPTZ
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tc_versions (
        version TEXT PRIMARY KEY,
        privacy_url TEXT,
        terms_url TEXT,
        effective_from TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
        tier TEXT NOT NULL CHECK (tier IN ('FREE', 'PRO')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        garment_config JSONB,
        tc_version_accepted TEXT NOT NULL REFERENCES tc_versions(version),
        stripe_session_id TEXT,
        ip_hash TEXT
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_downloads_email ON downloads(user_email)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_downloads_created ON downloads(created_at)
    `;

    await sql`
      INSERT INTO tc_versions (version, privacy_url, terms_url)
      VALUES ('1.0', '/legal/privacy.html', '/legal/terms.html')
      ON CONFLICT (version) DO NOTHING
    `;

    return new Response(JSON.stringify({ ok: true, message: "Schema created successfully" }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const config = {
  path: "/api/init-db"
};
