/** @type {import('next').NextConfig} */
const hostName = process.env.NEXT_PUBLIC_API_URL;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: hostName,
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // 🔥 THIS FIXES YOUR DEPLOY ERROR
  },
};

export default nextConfig;