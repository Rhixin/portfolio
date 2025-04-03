import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similar to ESLint, this ignores TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
