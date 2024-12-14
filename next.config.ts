import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "boeraqxraijbxhlrtdnn.supabase.co",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
