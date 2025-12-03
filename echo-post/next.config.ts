import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"]
  }
};

export default nextConfig;
