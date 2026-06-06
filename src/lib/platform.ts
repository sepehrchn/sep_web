import type { D1Database } from "./db/client";

let cachedEnv: { DB: D1Database } | null = null;

export async function getDevEnv(): Promise<{ DB: D1Database }> {
  if (cachedEnv) {
    return cachedEnv;
  }

  // Try multiple methods to access DB binding
  
  // Method 1: Direct process.env (Cloudflare Workers/Pages with Nitro)
  // @ts-expect-error - DB binding injected by Cloudflare
  if (typeof process !== 'undefined' && process.env?.DB) {
    // @ts-expect-error - DB binding injected by Cloudflare
    cachedEnv = { DB: process.env.DB };
    return cachedEnv;
  }

  // Method 2: globalThis (alternative Cloudflare binding location)
  // @ts-expect-error - DB binding might be on globalThis
  if (typeof globalThis !== 'undefined' && globalThis.DB) {
    // @ts-expect-error - DB binding might be on globalThis
    cachedEnv = { DB: globalThis.DB };
    return cachedEnv;
  }

  // Method 3: Try wrangler (local dev mode)
  try {
    const { getPlatformProxy } = await import("wrangler");
    const { env } = await getPlatformProxy();
    cachedEnv = { DB: env.DB };
    return cachedEnv;
  } catch (error) {
    // Wrangler not available, continue
  }

  throw new Error("Database connection not available. DB binding not found in process.env, globalThis, or wrangler.");
}
