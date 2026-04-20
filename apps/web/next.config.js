/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@devflow/ui", "@devflow/core"],
  output: 'standalone',
};

export default nextConfig;
