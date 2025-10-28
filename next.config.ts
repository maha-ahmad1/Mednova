import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     domains: ['via.placeholder.com'],
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
