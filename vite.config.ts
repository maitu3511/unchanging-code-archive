// Base config already includes TanStack Start, React, Tailwind, tsconfig paths and Nitro.
// Do not add those plugins manually. Extra options can be passed via defineConfig({ vite: { ... } }).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// STATIC_BUILD=true -> fully static output for shared hosting (Hostinger etc.)
const isStatic = process.env.STATIC_BUILD === "true";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isStatic
      ? {
          // Every page is listed explicitly so each gets its own index.html.
          pages: [
            "/",
            "/about",
            "/portfolio",
            "/pricing",
            "/process",
            "/training",
            "/careers",
            "/blog",
            "/contact",
            "/areas-we-serve",
            "/terms",
            "/privacy",
            "/services",
            ...[
              "seo",
              "digital-marketing",
              "google-ads",
              "web-development",
              "social-media-marketing",
              "shopify-development",
            ].map((s) => `/services/${s}`),
          ].map((path) => ({ path })),
          prerender: {
            enabled: true,
            crawlLinks: true,
            autoSubfolderIndex: true,
            failOnError: false,
          },
        }
      : {}),
  },
  // On Netlify (NETLIFY=true is set automatically during Netlify builds), emit a
  // Netlify-compatible output (dist + .netlify/functions-internal) instead of Cloudflare.
  ...(process.env.NETLIFY ? { nitro: { preset: "netlify" } } : {}),
});
