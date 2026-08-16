import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
