/** @type {import('next').NextConfig} */
import path from 'path';
import removeImports from 'next-remove-imports';

const dirname = path.dirname(new URL(import.meta.url).pathname);

const nextConfig = removeImports({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  sassOptions: {
    includePaths: [path.join(dirname, 'styles')],
    prependData: `@import "src/styles/_variables.scss"; @import "src/styles/_mixins.scss";`,
  },
});

export default nextConfig;
