import type { D1Database } from "./db/client";

export async function getDevEnv(): Promise<{ DB: D1Database }> {
  // Try Nitro/h3 event context first (available during request handling)
  try {
    const { useEvent } = await import("h3");
    const event = useEvent();
    const db = event.context?.cloudflare?.env?.DB || (event.context as any)?.env?.DB || (event.context as any)?.DB;
    if (db) return { DB: db };
  } catch (_) {
    // not available
  }

  // Fallbacks: globalThis bindings that Workers/Pages may expose
  const globalDb = (globalThis as any).DB || (globalThis as any).__CF_PAGES_ENV__?.DB || (globalThis as any).__CF_ENV__?.DB || (globalThis as any).__CONTEXT__?.env?.DB;
  if (globalDb) return { DB: globalDb };

  // Local dev via wrangler proxy
  try {
    const { getPlatformProxy } = await import("wrangler");
    const { env } = await getPlatformProxy();
    if (env?.DB) return { DB: env.DB };
  } catch (_) {
    // ignore
  }

  throw new Error("DB binding not found. Ensure D1 is bound in wrangler.toml and deployed to Cloudflare Pages.");
}
