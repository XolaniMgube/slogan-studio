/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: {
    serverActions: {
      bodySizeLimit: '16mb',
    },
  },
  // Pages merged to slim the nav. Permanent redirects so any link already shared
  // (WhatsApp, quotes, search results) still lands somewhere useful instead of a 404.
  async redirects() {
    return [
      { source: '/warranty', destination: '/warranty-shipping', permanent: true },
      { source: '/shipping', destination: '/warranty-shipping', permanent: true },
      { source: '/services', destination: '/about#services', permanent: true },
      // Customer accounts are out of scope — checkout is guest-only.
      { source: '/account', destination: '/track', permanent: false },
    ];
  },
};
export default nextConfig;
