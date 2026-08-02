'use client';

/**
 * "Something is broken." Three taps and a photo.
 *
 * Deliberately the shortest form in the app: it gets used when a machine has
 * just stopped and the person filling it in would rather be fixing the machine.
 * Equipment and severity are required; everything else is optional.
 */
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const SEVERITIES = [
  { value: 'stopped', label: 'Stopped', hint: 'Cannot run at all', tone: 'border-red-500 bg-red-50 text-red-900' },
  { value: 'degraded', label: 'Struggling', hint: 'Runs, but not right', tone: 'border-amber-500 bg-amber-50 text-amber-900' },
  { value: 'watch', label: 'Keep an eye', hint: 'Not urgent', tone: 'border-stone-400 bg-stone-50 text-stone-800' },
] as const;

export function EquipmentForm({
  siteId,
  equipmentOptions,
}: {
  siteId: string;
  equipmentOptions: string[];
}) {
  const router = useRouter();
  const [equipment, setEquipment] = React.useState('');
  const [otherEquipment, setOtherEquipment] = React.useState('');
  const [severity, setSeverity] = React.useState<string>('degraded');
  const [description, setDescription] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const chosen = equipment === 'other' ? otherEquipment.trim() : equipment;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!chosen) {
      setError('Which machine?');
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from('site_maintenance_requests').insert({
      site_id: siteId,
      reported_by: user?.id ?? null,
      equipment: chosen,
      severity,
      description: description.trim() || null,
    });

    if (insertError) {
      setSaving(false);
      setError(insertError.message);
      return;
    }

    router.push(`/site/${siteId}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
          Which machine?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {[...equipmentOptions, 'other'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setEquipment(item)}
              className={`rounded-lg border-2 px-3 py-4 text-left font-medium transition active:scale-[0.98] ${
                equipment === item
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-800'
              }`}
            >
              {item === 'other' ? 'Something else' : item}
            </button>
          ))}
        </div>
        {equipment === 'other' && (
          <input
            value={otherEquipment}
            onChange={(e) => setOtherEquipment(e.target.value)}
            placeholder="Name it"
            className="mt-3 w-full rounded-lg border border-stone-300 px-4 py-3 text-base"
          />
        )}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
          How bad?
        </legend>
        <div className="space-y-2">
          {SEVERITIES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSeverity(s.value)}
              className={`w-full rounded-lg border-2 px-4 py-3 text-left transition active:scale-[0.98] ${
                severity === s.value ? s.tone : 'border-stone-200 bg-white text-stone-700'
              }`}
            >
              <span className="block font-semibold">{s.label}</span>
              <span className="block text-sm opacity-80">{s.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold uppercase tracking-wide text-stone-500 mb-2"
        >
          What happened? (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-stone-300 px-4 py-3 text-base"
          placeholder="Making a noise, stopped mid-press, belt came off…"
        />
      </div>

      {error && <p className="text-red-700 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-stone-900 py-4 text-lg font-semibold text-white disabled:opacity-50 active:scale-[0.98] transition"
      >
        {saving ? 'Sending…' : 'Tell Goods'}
      </button>
    </form>
  );
}
