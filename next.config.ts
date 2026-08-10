import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IPs for mobile testing & HMR route navigation
  allowedDevOrigins: [
    "192.168.1.112",
    "192.168.1.109",
    "192.168.60.48",
    "localhost:3000",
  ],
  devIndicators: {
    // Moves the dev badge to top-right so it never blocks elements!
    position: "top-right",
  },
};

export default nextConfig;