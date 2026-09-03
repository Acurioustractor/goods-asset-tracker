'use client';

/**
 * One model drawing on the page: the SVG inline, a caption, and two downloads (SVG, PNG at 2x) so
 * the slide is the same drawing. The Pencil frame it feeds shows only on the working copy. The SVG
 * string arrives from the server, rendered by `lib/diagrams`; this component only shows it and
 * hands it over.
 */
import { useCallback, useRef } from 'react';

interface Props {
  id: string;
  title: string;
  caption: string;
  /** The Pencil frame. Omitted on the public surface. */
  slide?: string;
  svg: string;
}

export function DiagramFigure({ id, title, caption, slide, svg }: Props) {
  const host = useRef<HTMLDivElement>(null);

  /** The file as a viewer will see it: page fonts named outright, the CSS variable dropped. */
  const fileSvg = useCallback(
    () => svg.replace(/var\(--font-display, 'Playfair Display'\)/g, "'Playfair Display'").replace(/var\(--font-inter, Inter\)/g, 'Inter'),
    [svg],
  );

  const download = useCallback((blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, []);

  const saveSvg = useCallback(() => {
    download(new Blob([fileSvg()], { type: 'image/svg+xml' }), `goods-model-${id}.svg`);
  }, [download, fileSvg, id]);

  const savePng = useCallback(() => {
    const blob = new Blob([fileSvg()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 3200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((png) => {
        if (png) download(png, `goods-model-${id}.png`);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }, [download, fileSvg, id]);

  return (
    <figure id={`diagram-${id}`} className="my-8 scroll-mt-24">
      <div ref={host} className="overflow-hidden rounded-md border border-goods-grid bg-[#FBF8F1] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm text-goods-sub">
        <span className="font-semibold text-goods-ink">{title}.</span>
        <span>{caption}</span>
        <span className="ml-auto flex items-center gap-2 print:hidden">
          {slide && <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-sub">Deck: {slide}</span>}
          <button type="button" onClick={saveSvg} className="border border-goods-grid px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-ink hover:border-goods-terracotta">
            SVG
          </button>
          <button type="button" onClick={savePng} className="border border-goods-grid px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-ink hover:border-goods-terracotta">
            PNG
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
