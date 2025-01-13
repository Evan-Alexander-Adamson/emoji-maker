/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/emoji-maker',
  images: {
    unoptimized: true,
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
