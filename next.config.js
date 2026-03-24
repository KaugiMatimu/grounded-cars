/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.carlogos.org',
      },
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
      },
    ],
  },
}

module.exports = nextConfig
