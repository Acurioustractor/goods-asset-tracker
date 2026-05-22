'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { DeckPhoto } from './page';

/**
 * Render the deck markdown with print-friendly styling. [PHOTO: ...]
 * placeholder lines (alone on a line, possibly with leading whitespace)
 * become real img tags pulled from EL in tag order. [VIDEO: ...] and
 * [QUOTE: ...] placeholders are styled as soft inline reminders.
 *
 * Each H2 starts a new slide-style block with a forced page break before
 * it (for PDF print). H1 is the cover.
 */
export function DeckRenderer({ markdown, photos }: { markdown: string; photos: DeckPhoto[] }) {
  // Walk the markdown and resolve every placeholder:
  //   [PHOTO: desc]          → next still photo from EL set, modulo
  //   [VIDEO: tag]            → first EL video with `use:tag` (or any video
  //                            if tag matches `use:*`), rendered inline
  //   [VIDEO_OVERLAY: text]   → first EL video with `use:overlay-bg`,
  //                            full-bleed bg + headline text on top
  //
  // Other placeholder forms ([QUOTE: ...], [MAP: ...]) are left as soft
  // reminders during editing.
  const processed = useMemo(() => {
    const stillPhotos = photos.filter((p) => !p.isVideo);
    const videos = photos.filter((p) => p.isVideo);
    let photoIdx = 0;

    let out = markdown;

    // [VIDEO_OVERLAY: headline text] — full-bleed bg video with text on top.
    // Picks the first video tagged use:overlay-bg if available, else first
    // video, else falls back to a still hero.
    out = out.replace(/^\s*\[VIDEO_OVERLAY:([^\]]*)\]\s*$/gm, (_, headline) => {
      const overlayVid = videos.find((v) => v.use === 'overlay-bg') || videos[0];
      const text = headline.trim() || 'Goods on Country';
      if (overlayVid?.videoUrl) {
        return `<div class="video-overlay">
  <video autoplay muted loop playsinline poster="${overlayVid.url}">
    <source src="${overlayVid.videoUrl}" type="video/mp4" />
  </video>
  <div class="video-overlay-text"><h1>${text}</h1></div>
</div>`;
      }
      const stillFallback = stillPhotos[0];
      if (stillFallback) {
        return `<div class="video-overlay">
  <img src="${stillFallback.url}" alt="${text}" />
  <div class="video-overlay-text"><h1>${text}</h1></div>
</div>`;
      }
      return `<!-- no overlay media available for: ${text} -->`;
    });

    // [VIDEO: use-tag-or-desc] — inline embedded video at this spot.
    // If arg looks like a use tag (e.g. "testimonial"), pick by use. Else
    // just take the next video in the set.
    let videoIdx = 0;
    out = out.replace(/^\s*\[VIDEO:([^\]]*)\]\s*$/gm, (_, raw) => {
      const arg = raw.trim();
      let vid: DeckPhoto | undefined;
      if (arg && videos.some((v) => v.use === arg)) {
        vid = videos.find((v) => v.use === arg);
      } else {
        vid = videos[videoIdx++ % Math.max(videos.length, 1)];
      }
      if (!vid?.videoUrl) {
        return `<!-- no EL video available for: ${arg} -->`;
      }
      const caption = [vid.bedId, vid.community, vid.use ? `use:${vid.use}` : null].filter(Boolean).join(' · ');
      return `<video controls poster="${vid.url}" preload="metadata" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0 4px;">
  <source src="${vid.videoUrl}" type="video/mp4" />
</video>

*<small>${caption || vid.title}</small>*`;
    });

    // [PHOTO: desc] — still images (skip if no still photos)
    out = out.replace(/^\s*\[PHOTO:([^\]]*)\]\s*$/gm, (_, desc) => {
      if (stillPhotos.length === 0) return `<!-- no still photos available for: ${desc.trim()} -->`;
      const photo = stillPhotos[photoIdx++ % stillPhotos.length];
      const caption = [photo.bedId, photo.community].filter(Boolean).join(' · ');
      return `![${desc.trim() || caption}](${photo.url})\n\n*<small>${caption}</small>*`;
    });

    return out;
  }, [markdown, photos]);

  return (
    <>
      <style>{`
        .deck-print {
          background: white;
          color: #1c1917;
          font-family: -apple-system, system-ui, sans-serif;
          line-height: 1.6;
          max-width: 920px;
          margin: 0 auto;
          padding: 32px;
          font-size: 15px;
        }
        .deck-print h1 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 16px;
          color: #1c1917;
          border-bottom: 3px solid #b45309;
          padding-bottom: 12px;
        }
        .deck-print h2 {
          font-size: 24px;
          font-weight: 700;
          color: #b45309;
          margin: 48px 0 16px;
          padding-top: 12px;
        }
        .deck-print h2::before {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background: #b45309;
          margin-bottom: 12px;
          border-radius: 2px;
        }
        .deck-print h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 24px 0 8px;
        }
        .deck-print img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .deck-print blockquote {
          border-left: 4px solid #b45309;
          padding: 8px 16px;
          margin: 16px 0;
          background: #fef9e7;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: #78350f;
        }
        .deck-print blockquote p { margin: 4px 0; }
        .deck-print table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 13px;
        }
        .deck-print th, .deck-print td {
          border: 1px solid #e7d9c4;
          padding: 8px 10px;
          text-align: left;
          vertical-align: top;
        }
        .deck-print th {
          background: #fef3c7;
          font-weight: 700;
        }
        .deck-print code {
          background: #f5f0e8;
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 90%;
          color: #78350f;
        }
        .deck-print pre {
          background: #1c1917;
          color: #fef3c7;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 12px;
          line-height: 1.5;
        }
        .deck-print pre code { background: none; color: inherit; padding: 0; }
        .deck-print hr {
          border: none;
          border-top: 1px solid #e7d9c4;
          margin: 32px 0;
        }
        .deck-print ul, .deck-print ol { padding-left: 24px; }
        .deck-print li { margin: 4px 0; }
        .deck-print small { color: #78716c; font-size: 12px; }

        /* Video overlay — full-bleed bg media with title text on top.
           Behaves like a hero slide. Print-friendly: video frame becomes
           the poster image for PDF export. */
        .deck-print .video-overlay {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 12px;
          margin: 24px 0;
          background: #1c1917;
        }
        .deck-print .video-overlay video,
        .deck-print .video-overlay img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .deck-print .video-overlay-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 32px;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 50%);
        }
        .deck-print .video-overlay-text h1 {
          color: white;
          font-size: 36px;
          margin: 0;
          text-shadow: 0 2px 12px rgba(0,0,0,0.45);
          border-bottom: none;
          padding-bottom: 0;
          max-width: 70%;
        }

        /* Inline videos — keep them aligned with image styling */
        .deck-print video {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0 4px;
          background: #1c1917;
        }

        @media print {
          .deck-print {
            padding: 0;
            max-width: none;
          }
          .deck-print h2 {
            page-break-before: always;
            margin-top: 0;
          }
          .deck-print h1 { page-break-before: avoid; }
          .deck-print img { page-break-inside: avoid; }
          .deck-print table { page-break-inside: avoid; }
          .deck-print blockquote { page-break-inside: avoid; }
          /* Hide the admin shell when printing */
          aside, header, nav, .admin-sidebar { display: none !important; }
          main { padding: 0 !important; }
        }
      `}</style>
      <div className="deck-print">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{processed}</ReactMarkdown>
      </div>
    </>
  );
}
