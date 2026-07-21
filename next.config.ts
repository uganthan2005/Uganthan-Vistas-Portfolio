import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    localPatterns: [
      {
        pathname: "/wallpaper.png",
      },
      {
        pathname: "/icons/**",
      },
      {
        pathname: "/profile-picture.jpg",
      },
    ],
  },
};

export default nextConfig;
