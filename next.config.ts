import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // markdown twins for LLMs and agents: /x.md, /en/x.md, /index.md
        { source: "/:path(.*\\.md)", destination: "/md/:path" },
        // content negotiation: Accept: text/markdown on any page URL
        {
          source: "/:path((?!_next/|api/|md/|cmssy-edit).*)",
          has: [{ type: "header", key: "accept", value: "(.*text/markdown.*)" }],
          destination: "/md/:path",
        },
        { source: "/:locale([a-z]{2})/llms.txt", destination: "/llms.txt/:locale" },
        { source: "/:locale([a-z]{2})/llms-full.txt", destination: "/llms-full.txt/:locale" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  experimental: {
    // Vercel restores .next/cache between builds and the Turbopack build cache
    // then served stale global CSS (new rules in globals.css never reached prod).
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cmssy/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
