import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    devIndicators: false,
  // Allow local network IPs for mobile testing & HMR route navigation
  allowedDevOrigins: [
    "192.168.1.112",
    "192.168.1.109",
    "192.168.60.48",
    "localhost:3000",
    "192.168.1.106",
  ],
};

export default nextConfig;