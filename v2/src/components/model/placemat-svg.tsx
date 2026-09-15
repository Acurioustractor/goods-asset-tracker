'use client';

/**
 * The placemat as one SVG with the four photographs inside its panels, and
 * two download buttons. The SVG markup comes from @/lib/model/placemat-svg, the
 * same function the render script and the guards use, so the page, the catalog
 * file and the test all show one sheet. On the page the photographs are
 * referenced by URL; for the downloads they are fetched and inlined as data
 * URIs, as is the container drawing, so the file stands alone.
 */

import { useEffect, useMemo, useState } from 'react';
import { LOGOS, PANELS, SHEET_H, SHEET_W } from '@/lib/data/model-placemat';
import { renderPlacematSvg, type PanelId } from '@/lib/model/placemat-svg';

const DRAWING_SRC = '/images/model/harvest-container.svg';

/** Loads the container drawing so it is inlined and the downloaded SVG carries it. */
function useInlineDrawing(): string | undefined {
  const [inner, setInner] = useState<string | undefined>(undefined);
  useEffect(() => {
    let live = true;
    fetch(DRAWING_SRC)
      .then((r) => (r.ok ? r.text() : ''))
      .then((t) => {
        if (!live || !t) return;
        const m = t.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (m) setInner(m[1]);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);
  return inner;
}

/** The photographs by URL, for the page. */
function photoUrls(): Partial<Record<PanelId, string>> {
  return Object.fromEntries(PANELS.map((p) => [p.id, p.photo.src])) as Partial<Record<PanelId, string>>;
}

async function toDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${url}`));
    reader.readAsDataURL(blob);
  });
}

/** The photographs as data URIs, for a file that stands alone. */
async function photoDataUris(): Promise<Partial<Record<PanelId, string>>> {
  const pairs = await Promise.all(PANELS.map(async (p) => [p.id, await toDataUri(p.photo.src)] as const));
  return Object.fromEntries(pairs) as Partial<Record<PanelId, string>>;
}

export function PlacematSvg({ inlineDrawing }: { inlineDrawing?: string }) {
  const svg = useMemo(() => renderPlacematSvg({ inlineDrawing, photoHrefs: photoUrls(), logoHrefs: { goods: LOGOS.goods.src, qbe: LOGOS.qbe.src }, standalone: false }), [inlineDrawing]);
  return (
    <div
      style={{ width: '100%', aspectRatio: `${SHEET_W} / ${SHEET_H}`, lineHeight: 0 }}
      // One <svg> string from the renderer; nothing user-supplied is in it.
      dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ') }}
    />
  );
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The sheet with SVG and PNG downloads. */
export function PlacematSvgFrame() {
  const inlineDrawing = useInlineDrawing();
  const [busy, setBusy] = useState(false);

  const standalone = async () => {
    const photoHrefs = await photoDataUris();
    const logoHrefs = { goods: await toDataUri(LOGOS.goods.src), qbe: await toDataUri(LOGOS.qbe.src) };
    return renderPlacematSvg({ inlineDrawing, photoHrefs, logoHrefs, standalone: true });
  };

  const saveSvg = async () => {
    setBusy(true);
    try {
      download('goods-placemat.svg', new Blob([await standalone()], { type: 'image/svg+xml' }));
    } finally {
      setBusy(false);
    }
  };

  const savePng = async () => {
    setBusy(true);
    try {
      const scale = 2;
      const svg = await standalone();
      const img = new window.Image();
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('The SVG did not load into an image'));
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = SHEET_W * scale;
      canvas.height = SHEET_H * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => b && download('goods-placemat@2x.png', b), 'image/png');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={saveSvg} disabled={busy} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50">
          Download SVG
        </button>
        <button type="button" onClick={savePng} disabled={busy} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50">
          Download PNG (2x)
        </button>
        <span className="self-center text-xs text-muted-foreground">
          Photographs and the drawing are embedded in the download. Fonts follow what the viewer has installed: Playfair Display and Inter,
          else Georgia and the system face.
        </span>
      </div>
      <div className="rounded-xl border bg-[#FBF8F1] p-2">
        <PlacematSvg inlineDrawing={inlineDrawing} />
      </div>
    </div>
  );
}
