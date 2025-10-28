import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable experimental React Compiler - it can cause hot reload issues
  reactCompiler: false,
  
  // Add empty turbopack config to silence webpack warning
  turbopack: {},
};

export default nextConfig;
