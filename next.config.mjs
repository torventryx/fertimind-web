/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_STATIC ? { output: 'export' } : { output: 'standalone' }),
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
};
export default nextConfig;
