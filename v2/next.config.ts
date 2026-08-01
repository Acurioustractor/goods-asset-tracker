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
  // The gated /admin/photo-review/raw route reads a co-located .html at runtime
  // (storyteller consent + GPS tool, kept out of public/). Force-include it in
  // the serverless bundle so the read never 500s on Vercel.
  outputFileTracingIncludes: {
    '/admin/photo-review/raw': ['src/app/admin/photo-review/raw/photo-review.html'],
    // Checkpoint-held review diagrams, admin-gated (kept out of public/).
    '/api/admin/held-asset/[name]': ['src/app/api/admin/held-asset/assets/*'],
  },
  // Public media is served by Vercel as static assets. Do not trace it into
  // serverless functions; large photo/video folders can push admin routes over
  // Vercel's function bundle limit.
  outputFileTracingExcludes: {
    '/*': ['public/**/*'],
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
      {
        // Empathy Ledger media proxy — storyteller avatars. 302-redirects to a
        // signed Supabase URL (next/image follows it server-side and caches the
        // optimised result, so the signed-URL expiry never reaches the browser).
        protocol: 'https',
        hostname: 'www.empathyledger.com',
        pathname: '/api/media/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/media', destination: '/press', permanent: true },
      // /pitch/simple RETIRED 2026-08-02, ruling W. Ruling R kept it for one reason, that it was
      // the PDF pipeline, and the pipeline was broken: the renderer it told you to run,
      // scripts/render-deck.mjs, does not exist in this repo. Nothing had regenerated since
      // 25 July, three deck generations were layered in public/deck-slides so the route served
      // every slide two or three times, and slide 1 still carried the north star retired by
      // rulings D and E. Archived with a restore note at _archive/2026-08-02-pitch-simple/.
      { source: '/pitch/simple', destination: '/pitch/road', permanent: true },
      // The '/brand' -> '/press#brand-system' redirect was REMOVED 2026-07-25. It predated the
      // dedicated /brand page (src/app/brand/page.tsx, the brand kit and guide downloads) and
      // silently shadowed it: the route shipped in PR #160 and was unreachable in production,
      // 308-ing to the press page's brand section instead.
      //
      // CACHING GOTCHA, because the old rule was `permanent: true` and that is a 308: browsers
      // and intermediaries cache it hard, so anyone who has already hit /brand keeps getting
      // redirected until they hard-refresh or clear it. A clean client sees the new page
      // immediately. If you test and still land on /press, that is the cache, not the config.
      //
      // /press#brand-system still exists and is still correct; it is the short version. Do not
      // re-add a redirect here without checking whether src/app/brand/page.tsx is still live.
    ];
  },
};

export default nextConfig;
