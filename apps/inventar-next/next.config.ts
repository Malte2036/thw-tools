import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // async rewrites() {
  //   const svelteKitUrl = process.env.SVELTEKIT_URL;
  //   console.log(`Forwarding Next.js requests to SvelteKit URL: ${svelteKitUrl}`);
  //   return {
  //     fallback: [
  //       {
  //         source: '/:path*',
  //         destination: `${svelteKitUrl}/:path*`,
  //       },
  //     ],
  //   };
  // },
};

export default nextConfig;
