/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['framer-motion'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/fashion',
        destination: '/category/fashion',
        permanent: true,
      },
      {
        source: '/home-goods',
        destination: '/category/home-goods',
        permanent: true,
      },
      {
        source: '/support',
        destination: '/faq',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
