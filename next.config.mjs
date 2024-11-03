/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      unoptimized: true, // Allows all images but disables Next.js image optimization
      domains: [], // Empty array for unrestricted domains
  },
};

export default nextConfig;
