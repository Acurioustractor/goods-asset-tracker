import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const KINDS = {
  manifest: { file: 'manifest.csv', mime: 'text/csv', ext: 'csv' },
  print: { file: 'print_sheet.pdf', mime: 'application/pdf', ext: 'pdf' },
} as const;

type Kind = keyof typeof KINDS;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ batch: string; kind: string }> }
) {
  const { batch, kind } = await params;

  if (!/^[A-Za-z0-9]{1,16}$/.test(batch)) {
    return NextResponse.json({ error: 'invalid batch id' }, { status: 400 });
  }
  if (!(kind in KINDS)) {
    return NextResponse.json({ error: 'unknown kind' }, { status: 404 });
  }
  const k = KINDS[kind as Kind];

  // Resolve repo root from the running Next process. cwd is the v2/ directory in dev/prod.
  const filePath = path.resolve(process.cwd(), '..', 'data', 'new_beds', `batch_${batch}`, k.file);

  try {
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': k.mime,
        'Content-Disposition': `attachment; filename="GB0-${batch}-${k.file}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: 'file not found',
        path: filePath,
        hint: `Re-run: python3 scripts/generate_batch_${batch}.py --artwork-only`,
      },
      { status: 404 }
    );
  }
}
