'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  // Walk through the markdown, replacing the Nth [PHOTO: ...] line with the
  // Nth EL photo (modulo length). Other placeholders left as-is — they're
  // useful reminders during editing.
  const processed = useMemo(() => {
    let photoIdx = 0;
    return markdown.replace(/^\s*\[PHOTO:([^\]]*)\]\s*$/gm, (_, desc) => {
      const photo = photos[photoIdx++ % Math.max(photos.length, 1)];
      if (!photo) return `<!-- no EL photo available for: ${desc.trim()} -->`;
      const caption = [photo.bedId, photo.community].filter(Boolean).join(' · ');
      return `![${desc.trim() || caption}](${photo.url})\n\n*<small>${caption}</small>*`;
    });
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{processed}</ReactMarkdown>
      </div>
    </>
  );
}
