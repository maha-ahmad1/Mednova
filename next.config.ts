import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "demoapplication.jawebhom.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
