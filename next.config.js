/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  typescript: { ignoreBuildErrors: true,},
  output: 'standalone'
};

module.exports = nextConfig;
