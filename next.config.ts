import type { NextConfig } from "next";
import path from "node:path";

const naechsteKonfiguration: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  experimental: {
    optimizePackageImports: ["swr"]
  }
};

export default naechsteKonfiguration;
