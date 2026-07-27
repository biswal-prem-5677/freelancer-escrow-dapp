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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.privy.io https://*.privy.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://gateway.pinata.cloud https://*.ipfs.io https://avatars.githubusercontent.com",
              "connect-src 'self' https://auth.privy.io https://*.privy.io https://rpc-amoy.polygon.technology https://*.alchemy.com https://api.pinata.cloud wss://*.privy.io",
              "frame-src 'self' https://auth.privy.io https://*.privy.io",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
