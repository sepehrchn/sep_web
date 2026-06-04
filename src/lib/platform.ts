import type { D1Database } from "./db/client";

let devDb: D1Database | null = null;

export async function getDevEnv(): Promise<{ DB: D1Database }> {
  if (devDb) {
    return { DB: devDb };
  }

  // In dev, use miniflare/wrangler's local D1
  const { getPlatformProxy } = await import("wrangler");
  const { env } = await getPlatformProxy();
  devDb = env.DB;
  
  return { DB: devDb };
}
