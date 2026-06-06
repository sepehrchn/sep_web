import type { D1Database } from "./db/client";

// Return the runtime env provided to request handlers (DB, RATE_LIMIT, etc.).
// Previously this helper returned only `{ DB }` which caused callers that
// expect other bindings (e.g. `RATE_LIMIT`) to receive `undefined`.
export async function getDevEnv(): Promise<any> {
  // Try Nitro/h3 event context first (available during request handling)
  try {
    const { useEvent } = await import("h3");
    const event = useEvent();
    const env = event.context?.cloudflare?.env || (event.context as any)?.env || (event.context as any)?.cloudflare?.env || (event.context as any)?.DB ? event.context : null;
    if (env) return env;
  } catch (_) {
    // not available
  }

  // Fallbacks: globalThis bindings that Workers/Pages may expose
  const globalEnv = (globalThis as any).__CF_PAGES_ENV__ || (globalThis as any).__CF_ENV__ || (globalThis as any).__CONTEXT__?.env || (globalThis as any).env || (globalThis as any);
  if (globalEnv) return globalEnv;

  // Local dev via wrangler proxy
  try {
    const { getPlatformProxy } = await import("wrangler");
    const { env } = await getPlatformProxy();
    if (env) return env;
  } catch (_) {
    // ignore
  }

  throw new Error("Runtime env not found. Ensure bindings (DB, RATE_LIMIT) are available in the Pages/Worker runtime.");
}
