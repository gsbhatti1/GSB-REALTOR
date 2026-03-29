/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.utahrealestate.com' },
      { protocol: 'https', hostname: 'resoapi.utahrealestate.com' },
    ],
  },
  // Prevent static generation errors during build
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
