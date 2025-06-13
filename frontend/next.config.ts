/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['src', 'app', 'pages'],
    ignoreDuringBuilds: true,
  },
  env: {},
  experimental: {
    esmExternals: true,
  },
  crossOrigin: 'anonymous',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
