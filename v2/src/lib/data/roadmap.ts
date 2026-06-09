/**
 * Roadmap reader. Pulls the shared Goods roadmap live from `roadmap_items`
 * (Supabase) and shapes it into the kanban + timeline the partner dashboard
 * renders. Returns null on any error / empty table so the caller can fall back
 * to the static config during the switch-over.
 */
import { createClient } from '@/lib/supabase/server';
import type { KanbanColumn, TimelineItem } from './partner-dashboards';

interface RoadmapRow {
  title: string;
  note: string | null;
  status: string;
  position: number;
  event_date: string | null;
  date_label: string | null;
  show_in_kanban: boolean;
  show_in_timeline: boolean;
}

const STATUS_ORDER: { key: string; heading: string }[] = [
  { key: 'up-next', heading: 'Up next' },
  { key: 'in-progress', heading: 'In progress' },
  { key: 'done', heading: 'Done' },
];

export async function getRoadmap(): Promise<{ kanban: KanbanColumn[]; timeline: TimelineItem[] } | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('title, note, status, position, event_date, date_label, show_in_kanban, show_in_timeline')
      .eq('is_public', true);
    if (error || !data || data.length === 0) return null;
    const rows = data as unknown as RoadmapRow[];

    const kanban: KanbanColumn[] = STATUS_ORDER.map(({ key, heading }) => ({
      heading,
      items: rows
        .filter((r) => r.show_in_kanban && r.status === key)
        .sort((a, b) => a.position - b.position)
        .map((r) => ({ title: r.title, note: r.note ?? undefined })),
    })).filter((col) => col.items.length > 0);

    const timeline: TimelineItem[] = rows
      .filter((r) => r.show_in_timeline)
      .sort((a, b) => {
        if (a.event_date && b.event_date) {
          return a.event_date < b.event_date ? -1 : a.event_date > b.event_date ? 1 : a.position - b.position;
        }
        if (a.event_date) return -1; // dated before undated
        if (b.event_date) return 1;
        return a.position - b.position;
      })
      .map((r) => ({ date: r.date_label ?? r.event_date ?? '', title: r.title, detail: r.note ?? undefined }));

    if (kanban.length === 0 && timeline.length === 0) return null;
    return { kanban, timeline };
  } catch {
    return null;
  }
}
