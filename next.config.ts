import type { NextConfig } from "next";
import path from "node:path";

const naechsteKonfiguration: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com"
      },
      {
        protocol: "https",
        hostname: "crests.football-data.org"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ["swr"]
  }
};

export default naechsteKonfiguration;
