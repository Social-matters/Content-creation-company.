import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  /** The old /v2 preview is now the site. Old v1-only pages land somewhere useful. */
  async redirects() {
    return [
      { source: '/v2/creators', destination: '/', permanent: true },
      { source: '/v2/pricing', destination: '/contact#join-the-network', permanent: true },
      { source: '/v2', destination: '/', permanent: true },
      { source: '/v2/:path*', destination: '/:path*', permanent: true },
      { source: '/creators', destination: '/', permanent: true },
      // No public pricing: people ask for it.
      { source: '/pricing', destination: '/contact#join-the-network', permanent: true },
      // No separate application pages: everything lands on the one section.
      { source: '/start-a-campaign', destination: '/contact?apply=brand#join-the-network', permanent: true },
      { source: '/join-as-creator', destination: '/contact#join-the-network', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
