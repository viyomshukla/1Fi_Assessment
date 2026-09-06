import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Product imagery is generated SVG served from /public. Allowed because
     * every file is produced by this repo; the CSP below keeps the optimizer
     * from executing anything inside them.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
