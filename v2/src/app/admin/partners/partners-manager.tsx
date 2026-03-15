'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addPartner, updatePartner, updateInquiryStatus } from './actions';
import type { Partner, PartnershipInquiry } from '@/lib/types/database';

const PARTNERSHIP_TYPES = [
  'corporate_sponsor',
  'retail_partner',
  'community_partner',
  'media_partner',
  'government',
  'ngo',
  'other',
] as const;

const TIERS = ['founding', 'major', 'supporting', 'community'] as const;

const INQUIRY_STATUSES = ['new', 'contacted', 'in_discussion', 'approved', 'declined', 'inactive'] as const;

const INQUIRY_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  in_discussion: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export default function PartnersManager({
  partners,
  inquiries,
}: {
  partners: Partner[];
  inquiries: PartnershipInquiry[];
}) {
  const [tab, setTab] = useState<'partners' | 'inquiries'>('partners');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addPartner(formData);
      if (result?.error) setError(result.error);
      else setShowAddForm(false);
    });
  }

  function handleUpdate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updatePartner(formData);
      if (result?.error) setError(result.error);
      else setEditingId(null);
    });
  }

  function handleInquiryStatus(id: string, status: string) {
    startTransition(async () => {
      await updateInquiryStatus(id, status);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Partners & Inquiries</h1>
          <p className="text-gray-500 mt-1">
            {partners.length} partners, {inquiries.length} inquiries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={tab === 'partners' ? 'default' : 'outline'}
            onClick={() => setTab('partners')}
          >
            Partners
          </Button>
          <Button
            variant={tab === 'inquiries' ? 'default' : 'outline'}
            onClick={() => setTab('inquiries')}
          >
            Inquiries
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {tab === 'partners' && (
        <>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add Partner'}
          </Button>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Partner</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input name="name" required />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select name="partnership_type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                      {PARTNERSHIP_TYPES.map((t) => (
                        <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Tier</Label>
                    <select name="partnership_tier" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                      <option value="">None</option>
                      {TIERS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Contact Name</Label>
                    <Input name="primary_contact_name" />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input name="primary_contact_email" type="email" />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input name="website" type="url" />
                  </div>
                  <div>
                    <Label>Sponsored Beds</Label>
                    <Input name="total_sponsored_beds" type="number" defaultValue="0" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea name="description" rows={2} />
                  </div>
                  <div className="md:col-span-3">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? 'Adding...' : 'Add Partner'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Tier</th>
                  <th className="pb-2 font-medium text-right">Beds</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No partners yet
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3 text-gray-600">{p.partnership_type.replace(/_/g, ' ')}</td>
                      <td className="py-3">
                        {p.partnership_tier && (
                          <Badge variant="secondary">{p.partnership_tier}</Badge>
                        )}
                      </td>
                      <td className="py-3 text-right font-medium">{p.total_sponsored_beds}</td>
                      <td className="py-3">
                        <Badge className={p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                        >
                          {editingId === p.id ? 'Close' : 'Edit'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Inline edit form */}
          {editingId && (() => {
            const p = partners.find((p) => p.id === editingId);
            if (!p) return null;
            return (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Edit: {p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="hidden" name="id" value={p.id} />
                    <div>
                      <Label>Name</Label>
                      <Input name="name" defaultValue={p.name} required />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select name="partnership_type" defaultValue={p.partnership_type} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        {PARTNERSHIP_TYPES.map((t) => (
                          <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Tier</Label>
                      <select name="partnership_tier" defaultValue={p.partnership_tier || ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <option value="">None</option>
                        {TIERS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Contact Name</Label>
                      <Input name="primary_contact_name" defaultValue={p.primary_contact_name || ''} />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input name="primary_contact_email" defaultValue={p.primary_contact_email || ''} />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input name="website" defaultValue={p.website || ''} />
                    </div>
                    <div>
                      <Label>Sponsored Beds</Label>
                      <Input name="total_sponsored_beds" type="number" defaultValue={p.total_sponsored_beds} />
                    </div>
                    <div>
                      <Label>Active</Label>
                      <select name="is_active" defaultValue={String(p.is_active)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <Label>Show on Website</Label>
                      <select name="show_on_website" defaultValue={String(p.show_on_website)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <Label>Description</Label>
                      <Textarea name="description" defaultValue={p.description || ''} rows={2} />
                    </div>
                    <div className="md:col-span-3">
                      <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            );
          })()}
        </>
      )}

      {tab === 'inquiries' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Organization</th>
                <th className="pb-2 font-medium">Contact</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No inquiries yet
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{inq.organization_name}</td>
                    <td className="py-3">
                      <div>{inq.contact_name}</div>
                      <div className="text-xs text-gray-500">{inq.contact_email}</div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {inq.partnership_type?.replace(/_/g, ' ') || '—'}
                    </td>
                    <td className="py-3">
                      <Badge className={INQUIRY_COLORS[inq.status] || 'bg-gray-100 text-gray-800'}>
                        {inq.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(inq.created_at).toLocaleDateString('en-AU')}
                    </td>
                    <td className="py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-xs"
                        disabled={isPending}
                      >
                        {INQUIRY_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
