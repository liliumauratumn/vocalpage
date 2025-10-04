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
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'ymlfouinjavjahlkxixb.supabase.co',
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
};
export default nextConfig;