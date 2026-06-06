/**
 * Nitro middleware plugin to expose Cloudflare env to route handlers
 */
export default defineEventHandler((event) => {
  // Try to get env from the request runtime
  const runtime = event.node?.req?.runtime || (event as any).request?.runtime;
  
  if (runtime?.cloudflare?.env) {
    // Store in event context and globalThis
    event.context.cloudflareEnv = runtime.cloudflare.env;
    (globalThis as any).__CF_PAGES_ENV__ = runtime.cloudflare.env;
    (globalThis as any).__CF_ENV__ = runtime.cloudflare.env;
    (globalThis as any).DB = runtime.cloudflare.env.DB;
    
    console.log("[Nitro] Cloudflare env injected:", !!runtime.cloudflare.env.DB);
  }
});
