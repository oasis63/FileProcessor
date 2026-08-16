import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "https://fileprocessor-cav6.onrender.com/api/v1";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
