/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  // Use standalone output for Docker, but not for Vercel
  output: process.env.VERCEL ? undefined : 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    // Vercel-specific image optimization
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack configuration for module resolution
  webpack: (config, { isServer }) => {
    // Add path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };

    // Ensure proper module resolution for ioredis
    if (isServer) {
      config.externals = config.externals || [];
      // Don't externalize ioredis - let webpack bundle it
      config.externals = config.externals.filter(
        (external) => typeof external !== 'string' || !external.includes('ioredis')
      );
    }
    return config;
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Cache-Control', 
            value: 'public, s-maxage=10, stale-while-revalidate=59' 
          }
        ],
      },
    ];
  },
};
export default nextConfig;
