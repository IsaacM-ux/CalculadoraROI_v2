import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      images: {
        unoptimized: true,
      },
      trailingSlash: true,
    }
  : {
      output: "standalone",
    };

export default nextConfig;
