import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: '', 
      //   port: '',
      //   pathname: '/**',
      // },
       {
        protocol: 'https',
        hostname: 'localhost', 
        port: '',
        pathname: '/**',
      },
    ],
  },
};;

export default nextConfig;
