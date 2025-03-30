/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  webpack: (config) => {
    config.externals.push({
      'canvas': 'canvas',
      'jsdom': 'jsdom',
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
}

module.exports = nextConfig; 