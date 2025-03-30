/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ahadjcesozgwlgreioxf.supabase.co'],
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
}

export default nextConfig; 