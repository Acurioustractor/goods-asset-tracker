import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { WizardForm } from './wizard-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// The 8 beds caught up from the 2026-05-21 Alice Springs trip. Stored as a
// constant so the wizard always shows the same set regardless of who's been
// filled in - that way you can re-run it and just edit the blanks.
const ALICE_BED_IDS = [
  'GB0-156-102',
  'GB0-156-103',
  'GB0-156-1',
  'GB0-156-2',
  'GB0-156-3',
  'GB0-156-4',
  'GB0-156-5',
  'GB0-156-6',
];

export default async function AliceFillPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('assets')
    .select('unique_id, display_name, recipient_name, place, notes')
    .in('unique_id', ALICE_BED_IDS);

  // Preserve the wizard's intended order (102, 103, 1-6) rather than DB order.
  const byId = new Map((data || []).map((r) => [r.unique_id, r]));
  const rows = ALICE_BED_IDS
    .map((id) => byId.get(id))
    .filter(Boolean) as Array<{
      unique_id: string;
      display_name: string | null;
      recipient_name: string | null;
      place: string | null;
      notes: string | null;
    }>;

  const filledCount = rows.filter((r) => r.recipient_name).length;

  return (
    <div className="space-y-6 pb-16">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Alice Springs trip — fill in recipients</h1>
        <p className="mt-1 text-sm text-gray-500">
          One-time wizard for the 8 beds delivered 2026-05-21 without QR-photo capture.
          Fill in what you remember and hit Save. You can come back and edit later.
        </p>
        <p className="mt-2 text-xs">
          <Link href="/admin/scans" className="text-blue-700 hover:underline">← back to /admin/scans</Link>
        </p>
      </header>

      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="space-y-1 p-4 text-sm text-amber-900">
          <p>
            <strong>Context:</strong> Mykel + 4 young girls + 3 other young people received beds on the Alice Springs trip.
            8 IDs were assigned to the deployments: 2 confirmed via scan tracker (102, 103), 6 from next-available inventory (1-6).
          </p>
          <p className="text-xs text-amber-800">
            <strong>{filledCount}/{rows.length}</strong> recipient names already on file.
          </p>
        </CardContent>
      </Card>

      <WizardForm rows={rows} />
    </div>
  );
}
