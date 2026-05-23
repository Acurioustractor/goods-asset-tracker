'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStory } from './actions';

interface CommunityOpt { label: string; slug: string }
interface StorytellerOpt { id: string; displayName: string; slug: string }

const COMMON_THEMES = [
  'family', 'health', 'gratitude', 'design', 'culture', 'youth',
  'plastic-diversion', 'partnership', 'scale', 'self-determination',
];

export function CreateStoryForm({
  communities,
  storytellers,
}: {
  communities: CommunityOpt[];
  storytellers: StorytellerOpt[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [storytellerId, setStorytellerId] = useState('');
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [community, setCommunity] = useState('');
  const [trip, setTrip] = useState('trip-may-2026');
  const [participant, setParticipant] = useState('');
  const [themes, setThemes] = useState<Set<string>>(new Set());
  const [syndicate, setSyndicate] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [permLevel, setPermLevel] = useState<'public' | 'community' | 'private'>('community');

  function toggleTheme(t: string) {
    setThemes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }

  // When storyteller is picked, auto-fill participant slug as a convenience
  function onPickStoryteller(id: string) {
    setStorytellerId(id);
    const t = storytellers.find((s) => s.id === id);
    if (t && !participant) setParticipant(t.slug);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await createStory({
        title,
        content,
        excerpt: excerpt || undefined,
        storytellerId: storytellerId || undefined,
        storyImageUrl: storyImageUrl || undefined,
        community: community || undefined,
        trip: trip || undefined,
        participant: participant || undefined,
        themes: [...themes],
        syndicateGoodsLongform: syndicate,
        hasExplicitConsent: hasConsent,
        isPublic,
        culturalPermissionLevel: permLevel,
      });
      if (res.ok) {
        setResult({
          ok: true,
          message: res.publicUrl
            ? `Story published. View at ${res.publicUrl}`
            : `Story created as draft (consent pending). EL story id: ${res.id?.slice(0, 8)}…`,
        });
        setTimeout(() => router.push('/admin/el-stories'), 2500);
      } else {
        setResult({ ok: false, message: res.error || 'Unknown error' });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border bg-white p-6">
      <Section title="Story">
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Sentence case. Verbatim quotes OK. No em dashes."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Content" required sub="Markdown OK. Paragraphs separated by blank lines.">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-serif"
            placeholder="The body of the story…"
          />
        </Field>
        <Field label="Excerpt (optional)" sub="First ~200 chars. Auto-derived from content if blank.">
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Hero image URL (optional)" sub="Use EL story-images bucket or any public URL. EL Storage upload not yet built here.">
          <input
            type="url"
            value={storyImageUrl}
            onChange={(e) => setStoryImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
      </Section>

      <Section title="Attribution">
        <Field label="Storyteller" sub="Pick from existing EL storytellers. Add new via /admin/el-storytellers/new.">
          <select
            value={storytellerId}
            onChange={(e) => onPickStoryteller(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">— Goods on Country team (fallback) —</option>
            {storytellers.map((t) => (
              <option key={t.id} value={t.id}>{t.displayName}</option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Tags — canonical taxonomy">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Community" sub="Slug, auto-prefixed with 'community:'">
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">— No community tag —</option>
              {communities.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Trip slug" sub="Auto-prefixed with 'trip:'">
            <input
              type="text"
              value={trip}
              onChange={(e) => setTrip(e.target.value)}
              placeholder="trip-may-2026"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </Field>
        </div>
        <Field label="Participant slug" sub="Auto-prefixed with 'participant:'. Auto-filled when you pick a storyteller.">
          <input
            type="text"
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            placeholder="ray-nelson"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
          />
        </Field>
        <Field label="Themes" sub="Click to toggle. Auto-prefixed with 'theme:'.">
          <div className="flex flex-wrap gap-1.5">
            {COMMON_THEMES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => toggleTheme(t)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${themes.has(t) ? 'border-amber-500 bg-amber-100 text-amber-900' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
              >
                {themes.has(t) ? '✓ ' : ''}{t}
              </button>
            ))}
          </div>
        </Field>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={syndicate} onChange={(e) => setSyndicate(e.target.checked)} />
          Tag <code className="rounded bg-gray-100 px-1">syndicate:goods-longform</code> (featured in /stories index)
        </label>
      </Section>

      <Section title="Consent + visibility">
        <Field label="Cultural permission level" sub="How widely this story can travel.">
          <select
            value={permLevel}
            onChange={(e) => setPermLevel(e.target.value as 'public' | 'community' | 'private')}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="community">Community (default — internal + partner orgs)</option>
            <option value="public">Public</option>
            <option value="private">Private (Goods team only)</option>
          </select>
        </Field>
        <div className="space-y-2 rounded border border-amber-200 bg-amber-50/60 p-3 text-xs">
          <label className="inline-flex items-start gap-2">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <strong>I have captured explicit consent</strong> per{' '}
              <code className="rounded bg-white px-1">CONSENT_PROCESS.md</code>. Without this,
              the story stays as <code className="rounded bg-white px-1">draft</code> /{' '}
              <code className="rounded bg-white px-1">requires_elder_review=true</code>.
            </span>
          </label>
          <label className="inline-flex items-start gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={!hasConsent}
              className="mt-0.5"
            />
            <span>
              <strong>Publish immediately</strong> (requires consent above). Unchecked is the safer
              default — flips public later via EL admin when leadership approves.
            </span>
          </label>
        </div>
      </Section>

      {result && (
        <div className={`rounded border p-3 text-sm ${result.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-900'}`}>
          {result.ok ? '✓' : '✗'} {result.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? 'Saving…' : isPublic ? 'Create + publish' : 'Save as draft'}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, sub, required, children }: { label: string; sub?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {children}
      {sub && <p className="mt-1 text-[11px] text-gray-500">{sub}</p>}
    </label>
  );
}
