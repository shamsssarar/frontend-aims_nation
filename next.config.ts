import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://aims-nation-backend.vercel.app/api/:path*", // Your live backend URL!
      },
    ];
  },
};

export default nextConfig;
