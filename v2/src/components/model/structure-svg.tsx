'use client';

/**
 * The QBE Q3 structure and funding-flow diagram as one SVG, with SVG, PNG and
 * PDF downloads. The markup comes from @/lib/model/structure-svg, the same
 * function the render script and the guards use. The PDF is the browser's
 * print of a single A4 landscape page carrying only the sheet.
 */

import { useMemo, useState } from 'react';
import { STRUCTURE_H, STRUCTURE_W } from '@/lib/data/structure-diagram';
import { renderStructureSvg } from '@/lib/model/structure-svg';

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function StructureSvg() {
  const svg = useMemo(() => renderStructureSvg({ standalone: false }), []);
  return (
    <div
      style={{ width: '100%', aspectRatio: `${STRUCTURE_W} / ${STRUCTURE_H}`, lineHeight: 0 }}
      // One <svg> string from the renderer; nothing user-supplied is in it.
      dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ') }}
    />
  );
}

export function StructureSvgFrame() {
  const [busy, setBusy] = useState(false);
  const standalone = () => renderStructureSvg({ standalone: true });

  const saveSvg = () => download('Goods-structure-and-funding-flow.svg', new Blob([standalone()], { type: 'image/svg+xml' }));

  const savePng = async () => {
    setBusy(true);
    try {
      const scale = 2;
      const svg = standalone();
      const img = new window.Image();
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('The SVG did not load into an image'));
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = STRUCTURE_W * scale;
      canvas.height = STRUCTURE_H * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => b && download('Goods-structure-and-funding-flow@2x.png', b), 'image/png');
    } finally {
      setBusy(false);
    }
  };

  /** Opens one A4 landscape page holding only the sheet and asks the browser to print it. Save as PDF from the dialog. */
  const savePdf = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><title>Goods-structure-and-funding-flow</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;600&display=swap"><style>@page{size:A4 landscape;margin:0}html,body{margin:0;background:#FBF8F1}svg{display:block;width:100vw;height:auto}</style></head><body>${standalone()}</body></html>`,
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
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
        <button type="button" onClick={savePdf} disabled={busy} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50">
          Print to PDF
        </button>
        <span className="self-center text-xs text-muted-foreground">One A4 landscape page. In the print dialog choose Save as PDF.</span>
      </div>
      <div className="rounded-xl border bg-[#FBF8F1] p-2">
        <StructureSvg />
      </div>
    </div>
  );
}
