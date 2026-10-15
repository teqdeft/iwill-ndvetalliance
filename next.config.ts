import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  output: 'export',
  // Emit relative asset URLs (./_next/...) so the exported `out/index.html`
  // can be opened directly from disk via file:// (double-click), not just
  // served from a web-root. A post-build script (scripts/relativize.mjs,
  // run by `npm run build`) rewrites the remaining root-absolute references.
  // Build only: under `next dev` a '.' prefix makes the server expect the HMR
  // socket at /./_next/webpack-hmr, the browser never connects, and the page
  // never hydrates (buttons and the form stop working).
  assetPrefix: phase === PHASE_DEVELOPMENT_SERVER ? undefined : '.',
  images: {
    unoptimized: true,
  },
  // Silence the "multiple lockfiles / inferred workspace root" warning:
  // pin Turbopack's root to this project folder.
  turbopack: {
    root: __dirname,
  },
});

export default nextConfig;
