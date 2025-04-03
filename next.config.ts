import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disables ESLint during build (for production only)
    ignoreDuringBuilds: true,
  },
  // other config options here
};

export default nextConfig;
