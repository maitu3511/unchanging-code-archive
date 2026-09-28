// Base config already includes TanStack Start, React, Tailwind, tsconfig paths and Nitro.
// Do not add those plugins manually. Extra options can be passed via defineConfig({ vite: { ... } }).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // On Netlify (NETLIFY=true is set automatically during Netlify builds), emit a
  // Netlify-compatible output (dist + .netlify/functions-internal) instead of Cloudflare.
  ...(process.env.NETLIFY ? { nitro: { preset: "netlify" } } : {}),
});
