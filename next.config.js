/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.utahrealestate.com', 'cdn.utahrealestate.com'],
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
    // Allow all external images as fallback (some MLS domains vary)
    unoptimized: false,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
