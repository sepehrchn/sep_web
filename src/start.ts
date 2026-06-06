import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const envMiddleware = createMiddleware().server(async ({ request, next }) => {
  try {
    // Try to extract env from request context and store in globalThis
    // This works with Nitro's Cloudflare Pages integration
    if (typeof request === "object" && request !== null) {
      const req = request as any;
      
      // The env might be attached during Nitro's request augmentation
      if (req.runtime?.cloudflare?.env) {
        (globalThis as any).__CF_PAGES_ENV__ = req.runtime.cloudflare.env;
        (globalThis as any).__CF_ENV__ = req.runtime.cloudflare.env;
        (globalThis as any).DB = req.runtime.cloudflare.env.DB;
      }
    }
    return await next();
  } catch (error) {
    throw error;
  }
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [envMiddleware, errorMiddleware],
}));
