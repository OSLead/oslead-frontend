/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daisyui.com",
        port: "",
      },

      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.geeksforgeeks.org",
        port: "",
      },
    ],
  },
};

export default nextConfig;
