/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
<<<<<<< HEAD
=======
      {
        protocol: 'https',
        hostname: 'i.imgur.com',  // ← これを追加
      },
>>>>>>> 33cd570790c7487b54a1a6a1def65b2e2202e219
    ],
  },
};
export default nextConfig;
