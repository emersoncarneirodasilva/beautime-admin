import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "via.placeholder.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "images.pexels.com",
      // },
      {
        // A nível de teste
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
