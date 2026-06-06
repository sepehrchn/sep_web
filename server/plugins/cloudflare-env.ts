import { defineNitroPlugin } from "nitropack/runtime";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    // Store env in event context for access in handlers
    if (event.node?.req && typeof event.node.req === "object") {
      const env = (event.node.req as any).env || (event.node.req as any).__CF_PAGES_ENV__;
      if (env) {
        event.context.env = env;
        event.context.DB = env.DB;
      }
    }
  });
});
