import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  // Allow static file serving for images with spaces
  async rewrites() {
    return [];
  },
};

export default nextConfig;
