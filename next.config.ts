import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    localPatterns: [
      {
        pathname: "/wallpaper.png",
      },
    ],
  },
};

export default nextConfig;
