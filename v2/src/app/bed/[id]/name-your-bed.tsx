'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  uniqueId: string;
  productNoun: string;
  initialName: string | null;
  initialPublic: boolean;
};

export function NameYourBed({ uniqueId, productNoun, initialName, initialPublic }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName || '');
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const save = () => {
    setSavedAt(null);
    startTransition(async () => {
      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name.trim() || null, public: isPublic }),
      });
      if (res.ok) {
        setSavedAt(Date.now());
        setOpen(false);
        router.refresh();
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 text-sm text-white border border-white/20"
      >
        <span aria-hidden>✏️</span>
        <span>
          {initialName
            ? `Called "${initialName}" — change`
            : `Give this ${productNoun.toLowerCase()} a name`}
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-white/95 dark:bg-stone-900/95 text-foreground p-4 shadow-xl border max-w-md">
      <p className="text-sm font-semibold mb-1">
        What do you call this {productNoun.toLowerCase()}?
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Whatever feels right. A kid&apos;s name, a nickname, in language.
      </p>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 80))}
        maxLength={80}
        placeholder="e.g. Tyson's bed, Pakkimjalki"
        className="w-full rounded-lg border px-3 py-2.5 text-base bg-background mb-2"
      />
      <label className="flex items-start gap-2 text-xs text-muted-foreground mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mt-0.5"
        />
        <span>Show this name on the public bed page (others scanning can see it).</span>
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="flex-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? 'Saving…' : savedAt ? 'Saved ✓' : 'Save name'}
        </button>
      </div>
    </div>
  );
}
