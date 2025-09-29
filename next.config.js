/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com", "i.ibb.co"],
  },
  experimental: {
    turbo: {
      enabled: false,
    },
  },
};

module.exports = nextConfig; 
