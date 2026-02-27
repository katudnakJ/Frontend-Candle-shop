import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "goerhyygukxfkphuyrnw.supabase.co",
        pathname: "/**", // ต้องใส่ pathname เพื่ออนุญาตทุกโฟลเดอร์ใน supabase
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
