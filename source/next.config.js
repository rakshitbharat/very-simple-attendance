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
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  // Optimize for Bun
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
