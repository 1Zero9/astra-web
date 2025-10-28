import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // @ts-ignore - turbopack.root is valid but not in type definitions yet
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
