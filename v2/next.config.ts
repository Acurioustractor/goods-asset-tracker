import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1MB ceiling on Server Action bodies is too small for
      // video uploads via /admin/upload + /admin/videos/new. Bump to
      // 500MB to match the form's max file size.
      bodySizeLimit: '500mb',
    },
  },
  images: {
    // Next 16 enforces a fixed quality allowlist; default is just [75].
    // The field-notes before-after split uses quality:90 for sharper
    // landscape framing — keep both available.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cwsyhpiuepvdjtxaozwf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'yvnuayzslukamizrlhwb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
        pathname: '/public.notion-static.com/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/media', destination: '/press', permanent: true },
      { source: '/brand', destination: '/press#brand-system', permanent: true },
    ];
  },
};

export default nextConfig;
