/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    // https://github.com/chartjs/Chart.js/issues/10673#issuecomment-1248543069
  // Desligar o minify resolve o bug do chartjs em build de produção
  // FIXME: a gente tem que achar outro workaround
  swcMinify: false,
  typescript: { ignoreBuildErrors: true,},
  output: 'standalone'
};

module.exports = nextConfig;
