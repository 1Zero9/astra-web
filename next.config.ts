import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
<<<<<<< HEAD
  reactCompiler: true,
  // @ts-ignore - turbopack.root is valid but not in type definitions yet
  turbopack: {
    root: process.cwd(),
  },
=======
  // Disable experimental React Compiler - it can cause hot reload issues
  reactCompiler: false,
  
  // Add empty turbopack config to silence webpack warning
  turbopack: {},
>>>>>>> 999ccf5840640f4deab783856e5db09d11d33d03
};

export default nextConfig;
