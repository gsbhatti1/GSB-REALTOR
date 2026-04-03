/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // REMOVED: deprecated 'domains' array (use remotePatterns instead)
    remotePatterns: [
      { protocol: 'https', hostname: '*.utahrealestate.com' },
      { protocol: 'https', hostname: 'resoapi.utahrealestate.com' },
      { protocol: 'https', hostname: 'cdn.utahrealestate.com' },
      { protocol: 'https', hostname: 'photos.utahrealestate.com' },
      { protocol: 'https', hostname: 'mlsphotos.utahrealestate.com' },
      { protocol: 'https', hostname: 'assets.utahrealestate.com' },
      { protocol: 'https', hostname: '*.mls.com' },
      { protocol: 'https', hostname: 'images.mls.com' },
      { protocol: 'https', hostname: '*.heygen.ai' },
    ],
    // Prefer WebP format for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Limit sizes to what you actually use
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Compression
  compress: true,
  // Power headers
  poweredByHeader: false,
  // Security + Performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Redirects for SEO (trailing slash normalization)
  async redirects() {
    return [
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
