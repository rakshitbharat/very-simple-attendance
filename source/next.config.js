/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript during builds
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
