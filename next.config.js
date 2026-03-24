/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ae01.alicdn.com', 'i.aliimg.com', 'img.alicdn.com', 'ae-pic-a1.aliexpress-media.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
