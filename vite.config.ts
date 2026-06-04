// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  nitro: {
    preset: 'cloudflare-pages',
    rollupConfig: {
      external: ['node:*', 'cloudflare:*', 'wrangler', 'workerd', '@cloudflare/workers-types'],
    },
    cloudflare: {
      pages: {
        bindings: {
          DB: {},
          RATE_LIMIT: {},
        },
      },
    },
  },
  vite: {
    plugins: [cloudflare({ viteEnvironment: { name: "ssr" } })],
    ssr: {
      external: ['wrangler', 'workerd'],
      noExternal: true,
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
