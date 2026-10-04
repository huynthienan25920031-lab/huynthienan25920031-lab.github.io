import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/anhuynh-engineer',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
