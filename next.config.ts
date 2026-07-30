import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // Moves the dev badge to top-right so it never blocks your sidebar / logout button!
    position: "top-right",
  },
};

export default nextConfig;