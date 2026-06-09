'use client';

import { useState } from 'react';

export interface RoadmapCard {
  id: string;
  title: string;
  note: string | null;
  status: string;
  position: number;
}

const COLUMNS: { key: string; heading: string }[] = [
  { key: 'up-next', heading: 'Up next' },
  { key: 'in-progress', heading: 'In progress' },
  { key: 'done', heading: 'Done' },
];

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

export function RoadmapBoard({ initialItems }: { initialItems: RoadmapCard[] }) {
  const [items, setItems] = useState<RoadmapCard[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const colItems = (status: string) =>
    items.filter((i) => i.status === status).sort((a, b) => a.position - b.position);

  async function persist(id: string, status: string, position: number) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/roadmap/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, position }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Save failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
      setItems(initialItems); // revert optimistic move
    } finally {
      setSaving(false);
    }
  }

  function move(draggedId: string, targetStatus: string, beforeId: string | null) {
    const dragged = items.find((i) => i.id === draggedId);
    if (!dragged || dragged.id === beforeId) return;
    const col = items
      .filter((i) => i.status === targetStatus && i.id !== draggedId)
      .sort((a, b) => a.position - b.position);
    let newPos: number;
    if (beforeId) {
      const idx = col.findIndex((i) => i.id === beforeId);
      const prev = col[idx - 1];
      const next = col[idx];
      newPos = prev ? (prev.position + next.position) / 2 : next ? next.position - 5 : 10;
    } else {
      const last = col[col.length - 1];
      newPos = last ? last.position + 10 : 10;
    }
    if (dragged.status === targetStatus && dragged.position === newPos) return;
    setItems((prev) =>
      prev.map((i) => (i.id === draggedId ? { ...i, status: targetStatus, position: newPos } : i)),
    );
    persist(draggedId, targetStatus, newPos);
  }

  const onCardDrop = (e: React.DragEvent, targetStatus: string, beforeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOverCol(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) move(id, targetStatus, beforeId);
  };
  const onColDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setOverCol(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) move(id, status, null);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 h-5">
        {saving ? <span className="text-xs" style={{ color: SAGE }}>Saving…</span> : null}
        {error ? <span className="text-xs" style={{ color: RUST }}>{error} (reverted)</span> : null}
      </div>
      <div className="grid md:grid-cols-3 gap-4 items-start">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(col.key);
            }}
            onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
            onDrop={(e) => onColDrop(e, col.key)}
            className="rounded-lg p-4 min-h-[160px] transition-colors"
            style={{
              backgroundColor: overCol === col.key ? '#F6ECE2' : CREAM,
              border: `1px solid ${overCol === col.key ? RUST : '#E8DED4'}`,
            }}
          >
            <p className="text-sm font-semibold uppercase mb-4 flex items-center justify-between" style={{ color: SAGE }}>
              {col.heading}
              <span className="text-xs font-normal" style={{ color: `${CHARCOAL}80` }}>{colItems(col.key).length}</span>
            </p>
            <div className="space-y-3">
              {colItems(col.key).map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', item.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onCardDrop(e, col.key, item.id)}
                  className="rounded-md p-3 cursor-move bg-white shadow-sm"
                  style={{ border: '1px solid #E8DED4' }}
                >
                  <p className="text-sm font-medium leading-snug" style={{ color: CHARCOAL }}>{item.title}</p>
                  {item.note ? <p className="text-xs mt-1" style={{ color: `${CHARCOAL}99` }}>{item.note}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-5" style={{ color: `${CHARCOAL}80` }}>
        Drag cards between columns or reorder within a column. Changes save to the live roadmap and show on the partner dashboards.
      </p>
    </div>
  );
}
