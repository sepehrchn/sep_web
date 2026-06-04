import type { D1Database } from "./db/client";

let cachedEnv: { DB: D1Database } | null = null;

export async function getDevEnv(): Promise<{ DB: D1Database }> {
  if (cachedEnv) {
    return cachedEnv;
  }

  // In Cloudflare Workers/Pages with Nitro, bindings are available via process.env
  // @ts-expect-error - DB binding injected by Cloudflare
  if (typeof process !== 'undefined' && process.env?.DB) {
    // @ts-expect-error - DB binding injected by Cloudflare
    cachedEnv = { DB: process.env.DB };
    return cachedEnv;
  }

  // Try wrangler (dev mode)
  try {
    const { getPlatformProxy } = await import("wrangler");
    const { env } = await getPlatformProxy();
    cachedEnv = { DB: env.DB };
    return cachedEnv;
  } catch (error) {
    throw new Error("Database connection not available");
  }
}
