/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure these ESM-only packages get transpiled correctly on Vercel's build env
  transpilePackages: [
    "@privy-io/react-auth",
    "@privy-io/wagmi",
    "@rainbow-me/rainbowkit",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

export default nextConfig;
