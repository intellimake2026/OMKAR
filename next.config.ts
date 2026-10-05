import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() { return [{ source: "/process-library", destination: "/processes", permanent: true }]; },
};

export default nextConfig;
