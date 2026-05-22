'use server';

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { revalidatePath } from 'next/cache';
import { jsonFundersPath, defaultSectionsFor } from '@/lib/funders/registry';
import type { FunderConfig } from '@/lib/funders/types';

interface AddFunderForm {
  displayName: string;
  slug: string;
  contactName: string;
  xeroProjectCode?: string;
  totalAud: number;
  totalUnits?: number;
  unitLabel?: string;
  paidToDateAud?: number;
  toBePaidAud?: number;
  grantReference?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  photoTagsCsv: string;          // comma-separated, parsed into string[]
  community?: string;            // optional canonical community label
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function addFunder(form: AddFunderForm): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const slug = slugify(form.slug || form.displayName);
  if (!slug) return { ok: false, error: 'slug or displayName required' };
  if (!form.displayName) return { ok: false, error: 'displayName required' };
  if (!form.contactName) return { ok: false, error: 'contactName (matches Xero contact_name) required' };
  if (!form.totalAud || form.totalAud <= 0) return { ok: false, error: 'totalAud must be > 0' };

  const photoTags = form.photoTagsCsv
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  // JSON funder shape — matches Omit<FunderConfig, 'reportTitle' | 'preparedBy'>
  const entry: Omit<FunderConfig, 'reportTitle' | 'preparedBy'> & {
    reportTitle?: string;
    preparedBy?: string;
  } = {
    slug,
    displayName: form.displayName,
    contactName: form.contactName,
    xeroProjectCode: form.xeroProjectCode || 'ACT-GD',
    tone: form.totalAud >= 100000 ? 'evidence-and-named' : 'short-and-visual',
    sections: defaultSectionsFor(form.totalAud),
    photoTags: photoTags.length > 0 ? photoTags : [`${slug}-funded`],
    commitment: {
      totalAud: form.totalAud,
      ...(form.totalUnits ? { totalUnits: form.totalUnits } : {}),
      ...(form.unitLabel ? { unitLabel: form.unitLabel } : {}),
      ...(form.paidToDateAud !== undefined ? { paidToDateAud: form.paidToDateAud } : {}),
      ...(form.toBePaidAud !== undefined ? { toBePaidAud: form.toBePaidAud } : {}),
      ...(form.grantReference ? { grantReference: form.grantReference } : {}),
    },
    ...(form.community ? { community: form.community } : {}),
    ...(form.contactPersonName
      ? {
          funderContact: {
            name: form.contactPersonName,
            ...(form.contactPersonEmail ? { email: form.contactPersonEmail } : {}),
            ...(form.contactPersonPhone ? { phone: form.contactPersonPhone } : {}),
          },
        }
      : {}),
  };

  // Read existing JSON funders, append, write back. Built-in TS funders
  // (centrecorp / snow) live in code, not in this file.
  const path = jsonFundersPath();
  let existing: Array<typeof entry> = [];
  try {
    const raw = await readFile(path, 'utf-8');
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }
  if (existing.some((e) => e.slug === slug)) {
    return { ok: false, error: `Funder slug "${slug}" already exists` };
  }
  existing.push(entry);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(existing, null, 2), 'utf-8');

  revalidatePath('/admin/funders');
  revalidatePath('/admin/reports');
  return { ok: true, slug };
}

export async function listJsonFunders(): Promise<Array<{ slug: string; displayName: string; totalAud: number; community?: string }>> {
  try {
    const raw = await readFile(jsonFundersPath(), 'utf-8');
    const arr = JSON.parse(raw) as Array<{ slug: string; displayName: string; commitment: { totalAud: number }; community?: string }>;
    return arr.map((j) => ({ slug: j.slug, displayName: j.displayName, totalAud: j.commitment.totalAud, community: j.community }));
  } catch {
    return [];
  }
}
