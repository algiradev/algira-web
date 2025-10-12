import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    //local
    // remotePatterns: [
    //   {
    //     protocol: "http",
    //     hostname: "localhost",
    //     port: "1337",
    //     pathname: "/uploads/**",
    //   },
    // ],

    //Producción
    //https://algira-dev.onrender.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "algira-dev.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
