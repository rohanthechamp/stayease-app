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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;