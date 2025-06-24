/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress Supabase Realtime warning
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
      },
    ];
    
    return config;
  },
  serverExternalPackages: ['@supabase/realtime-js'],
}

export default nextConfig
