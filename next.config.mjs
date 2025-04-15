/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // Disable source maps in production
  output: 'standalone',
};

export default nextConfig;
  