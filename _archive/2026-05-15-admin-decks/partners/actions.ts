'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { CrmContact, CrmNote, ContactRole } from '@/lib/types/database';

// ============================================================================
// CONTACTS
// ============================================================================

export async function getContacts(): Promise<CrmContact[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('name', { ascending: true });
  if (error) {
    console.error('[CRM] Failed to fetch contacts:', error.message);
    return [];
  }
  return (data || []) as CrmContact[];
}

export async function getContact(id: string): Promise<CrmContact | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as CrmContact;
}

export async function createContact(formData: FormData) {
  const supabase = await createClient();

  const rolesRaw = formData.get('roles') as string;
  const roles = rolesRaw ? rolesRaw.split(',').map((r) => r.trim()).filter(Boolean) : ['prospect'];
  const tagsRaw = formData.get('tags') as string;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const { error } = await supabase.from('crm_contacts').insert({
    name: formData.get('name') as string,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    organization: (formData.get('organization') as string) || null,
    job_title: (formData.get('job_title') as string) || null,
    location: (formData.get('location') as string) || null,
    roles,
    status: (formData.get('status') as string) || 'active',
    relationship_status: (formData.get('relationship_status') as string) || 'prospect',
    bio: (formData.get('bio') as string) || null,
    website: (formData.get('website') as string) || null,
    tags,
    is_elder: formData.get('is_elder') === 'true',
    cultural_background: (formData.get('cultural_background') as string) || null,
    first_contact_date: (formData.get('first_contact_date') as string) || null,
    metadata: {},
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/partners');
  return { success: true };
}

export async function updateContact(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;

  const rolesRaw = formData.get('roles') as string;
  const roles = rolesRaw ? rolesRaw.split(',').map((r) => r.trim()).filter(Boolean) : [];
  const tagsRaw = formData.get('tags') as string;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const { error } = await supabase
    .from('crm_contacts')
    .update({
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      organization: (formData.get('organization') as string) || null,
      job_title: (formData.get('job_title') as string) || null,
      location: (formData.get('location') as string) || null,
      roles,
      status: (formData.get('status') as string) || 'active',
      relationship_status: (formData.get('relationship_status') as string) || 'prospect',
      bio: (formData.get('bio') as string) || null,
      website: (formData.get('website') as string) || null,
      tags,
      is_elder: formData.get('is_elder') === 'true',
      cultural_background: (formData.get('cultural_background') as string) || null,
      next_follow_up: (formData.get('next_follow_up') as string) || null,
      assigned_to: (formData.get('assigned_to') as string) || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/partners');
  return { success: true };
}

// ============================================================================
// NOTES
// ============================================================================

export async function getContactNotes(contactId: string): Promise<CrmNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_notes')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data || []) as CrmNote[];
}

export async function addNote(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('crm_notes').insert({
    contact_id: formData.get('contact_id') as string,
    note_type: (formData.get('note_type') as string) || 'note',
    title: (formData.get('title') as string) || null,
    content: formData.get('content') as string,
    created_by: (formData.get('created_by') as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/partners');
  return { success: true };
}

// ============================================================================
// LEGACY — keep old partner/inquiry functions for backward compat
// ============================================================================

export async function getPartners() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partnership_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
