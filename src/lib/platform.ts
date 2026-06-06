import type { D1Database } from "./db/client";

let cachedEnv: { DB: D1Database } | null = null;

export async function getDevEnv(): Promise<{ DB: D1Database }> {
  if (cachedEnv) {
    return cachedEnv;
  }

  // For Cloudflare Pages/Workers, DB should be available on globalThis
  // when running in Nitro + Cloudflare Pages preset
  const db = (globalThis as any).DB || (globalThis as any).__CONTEXT__?.env?.DB;
  if (db) {
    cachedEnv = { DB: db };
    return cachedEnv;
  }

  // Try wrangler (local dev)
  try {
    const { getPlatformProxy } = await import("wrangler");
    const { env } = await getPlatformProxy();
    if (env.DB) {
      cachedEnv = { DB: env.DB };
      return cachedEnv;
    }
  } catch (error) {
    // Not in local dev
  }

  throw new Error("DB binding not found on globalThis or wrangler. Ensure D1 is bound in wrangler.toml and properly deployed.");
}
