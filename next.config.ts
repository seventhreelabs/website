import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
