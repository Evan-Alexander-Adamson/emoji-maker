/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
