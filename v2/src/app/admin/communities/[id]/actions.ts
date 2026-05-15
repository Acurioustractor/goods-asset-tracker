'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type DemandStatus = 'exploring' | 'requested' | 'approved' | 'allocated' | 'fulfilled' | 'dropped';

const VALID_STATUSES: DemandStatus[] = ['exploring','requested','approved','allocated','fulfilled','dropped'];

function parseValueCents(raw: FormDataEntryValue | null): number | null {
  if (raw === null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  // Accept dollars (e.g. "1500" or "$1,500") -> cents
  const cleaned = s.replace(/[^0-9.-]/g, '');
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

export async function addDemand(formData: FormData) {
  const supabase = await createClient();
  const community_id = String(formData.get('community_id') || '').trim();
  if (!community_id) return { error: 'community_id required' };

  const status = String(formData.get('status') || 'requested') as DemandStatus;
  if (!VALID_STATUSES.includes(status)) return { error: 'invalid status' };

  const qty = Number(formData.get('qty') || 1);
  if (!Number.isFinite(qty) || qty < 1) return { error: 'qty must be >= 1' };

  const { error } = await supabase.from('community_demand').insert({
    community_id,
    requested_by: (formData.get('requested_by') as string) || null,
    product: (formData.get('product') as string) || 'Stretch Bed',
    qty,
    status,
    estimated_value_cents: parseValueCents(formData.get('estimated_value_dollars')),
    source: (formData.get('source') as string) || 'manual',
    notes: (formData.get('notes') as string) || null,
    request_date: (formData.get('request_date') as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/admin/communities/${community_id}`);
  revalidatePath('/admin/communities');
  return { success: true };
}

export async function updateDemand(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') || '');
  const community_id = String(formData.get('community_id') || '');
  if (!id) return { error: 'id required' };

  const status = String(formData.get('status') || 'requested') as DemandStatus;
  if (!VALID_STATUSES.includes(status)) return { error: 'invalid status' };

  const qty = Number(formData.get('qty') || 1);
  if (!Number.isFinite(qty) || qty < 1) return { error: 'qty must be >= 1' };

  const { error } = await supabase
    .from('community_demand')
    .update({
      status,
      qty,
      requested_by: (formData.get('requested_by') as string) || null,
      estimated_value_cents: parseValueCents(formData.get('estimated_value_dollars')),
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  if (community_id) revalidatePath(`/admin/communities/${community_id}`);
  revalidatePath('/admin/communities');
  return { success: true };
}

export async function deleteDemand(id: string, community_id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('community_demand').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/communities/${community_id}`);
  revalidatePath('/admin/communities');
  return { success: true };
}

export async function updateCommunity(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') || '');
  if (!id) return { error: 'id required' };

  const partner = (formData.get('partner') as string) || null;
  const notes = (formData.get('notes') as string) || null;
  const status = (formData.get('status') as string) || 'active';
  const contacts_raw = (formData.get('contacts') as string) || '';
  const contacts = contacts_raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from('communities')
    .update({ partner, notes, status, contacts })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath(`/admin/communities/${id}`);
  revalidatePath('/admin/communities');
  return { success: true };
}
