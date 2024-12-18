import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "boeraqxraijbxhlrtdnn.supabase.co",
      "via.placeholder.com",
      "s3-alpha-sig.figma.com",
    ],
  },
};

export default nextConfig;
