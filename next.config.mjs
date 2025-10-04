/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // コンテンツブロッカー対策
  assetPrefix: process.env.NODE_ENV === 'production' ? '/app-assets' : '',
  
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
  
  // 既存の設定
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  },
  
  // ビルドIDを予測可能にする（キャッシュ対策）
  generateBuildId: async () => {
    return 'vocalpage-build'
  }
};

export default nextConfig;