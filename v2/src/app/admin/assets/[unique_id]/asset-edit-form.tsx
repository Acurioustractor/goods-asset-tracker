'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Plus } from 'lucide-react';

type Asset = {
  unique_id: string;
  name: string | null;
  community: string | null;
  place: string | null;
  status: string | null;
  notes: string | null;
  partner_name: string | null;
  gps: string | null;
};

export function AssetEditForm({
  asset,
  communityOptions,
  statusOptions,
}: {
  asset: Asset;
  communityOptions: string[];
  statusOptions: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Asset>(asset);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    form.name !== asset.name ||
    form.community !== asset.community ||
    form.place !== asset.place ||
    form.status !== asset.status ||
    form.partner_name !== asset.partner_name ||
    form.gps !== asset.gps ||
    newNote.trim().length > 0;

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const patch: Record<string, string | null> = {
        name: form.name,
        community: form.community,
        place: form.place,
        status: form.status,
        partner_name: form.partner_name,
        gps: form.gps,
      };
      if (newNote.trim()) {
        const stamp = new Date().toISOString().slice(0, 10);
        const prefix = (form.notes || '').trim();
        patch.notes = (prefix ? prefix + '\n\n' : '') + `[${stamp}] ${newNote.trim()}`;
      }

      const res = await fetch(`/api/admin/assets/${encodeURIComponent(asset.unique_id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setForm({
        unique_id: body.asset.unique_id,
        name: body.asset.name,
        community: body.asset.community,
        place: body.asset.place,
        status: body.asset.status,
        notes: body.asset.notes,
        partner_name: body.asset.partner_name,
        gps: body.asset.gps,
      });
      setNewNote('');
      setSavedAt(Date.now());
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name / Recipient">
          <Input value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Status">
          <select
            value={form.status ?? ''}
            onChange={(e) => setForm({ ...form, status: e.target.value || null })}
            className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs"
          >
            <option value="">(unset)</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Community">
          <div className="flex gap-2">
            <select
              value={form.community ?? ''}
              onChange={(e) => setForm({ ...form, community: e.target.value || null })}
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs"
            >
              <option value="">(unset)</option>
              {communityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              {form.community && !communityOptions.includes(form.community) && (
                <option value={form.community}>{form.community} (custom)</option>
              )}
            </select>
          </div>
        </Field>
        <Field label="Place (address / household)">
          <Input value={form.place ?? ''} onChange={(e) => setForm({ ...form, place: e.target.value })} />
        </Field>

        <Field label="Partner">
          <Input value={form.partner_name ?? ''} onChange={(e) => setForm({ ...form, partner_name: e.target.value })} />
        </Field>
        <Field label="GPS (lat,lng)">
          <Input
            value={form.gps ?? ''}
            onChange={(e) => setForm({ ...form, gps: e.target.value })}
            placeholder="-19.6498,134.1892"
          />
        </Field>
      </div>

      {/* Existing notes (read-only display) */}
      <Field label="Notes history">
        {form.notes ? (
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 text-xs text-foreground">
            {form.notes}
          </pre>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-muted p-3 text-xs text-muted-foreground">
            No notes yet
          </div>
        )}
      </Field>

      <Field
        label={
          <span className="inline-flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> Add a note
          </span>
        }
      >
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Verified physical install at house 12 Ford Cres; bracket missing, machine still works"
          rows={3}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Saved as a new line, prefixed with today&apos;s date. Existing notes are preserved.
        </p>
      </Field>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={save} disabled={!dirty || saving}>
          {saving ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            'Save changes'
          )}
        </Button>
        {savedAt && !dirty && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
        {dirty && !saving && (
          <span className="text-xs text-amber-600">Unsaved changes</span>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
