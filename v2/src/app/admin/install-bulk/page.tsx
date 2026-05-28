import { createServiceClient } from '@/lib/supabase/server';
import { BulkInstallClient } from './bulk-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BulkInstallPage() {
  const supabase = createServiceClient();
  const { data: communities } = await supabase
    .from('communities')
    .select('id, name, state, status')
    .order('status', { ascending: true })
    .order('name', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk install from photos</h1>
        <p className="mt-1 text-sm text-gray-600">
          Drop the photos you took on country. We&apos;ll read the QR sticker and GPS from each
          photo, group them by bed, and let you set community + recipient names in one go.
        </p>
        <details className="mt-3 text-sm text-gray-700" open>
          <summary className="cursor-pointer font-medium text-gray-900">
            Field workflow (zero-app, offline)
          </summary>
          <ol className="mt-2 ml-5 list-decimal space-y-1">
            <li>
              <strong>Set up your iPhone once</strong> before the trip:
              <ul className="ml-5 list-disc">
                <li>Settings → Privacy → Location Services → Camera = <strong>While Using</strong></li>
                <li>Settings → Camera → Formats → <strong>Most Compatible</strong> (saves as JPEG — strongly recommended, see HEIC note below)</li>
              </ul>
            </li>
            <li>
              <strong>At each bed</strong> (offline is fine):
              <ol className="ml-5 list-decimal">
                <li>Stick the QR sticker on the bed leg</li>
                <li>Take ONE photo showing the QR + the bed/room in the same frame</li>
                <li><strong>Add a caption with the recipient name.</strong> In Photos → tap the photo → swipe up → &quot;Add a Caption&quot; → dictate or type the name (e.g. &quot;Frank family&quot;, &quot;Mary T&quot;)</li>
                <li>Move on. No browser. No form-fill.</li>
              </ol>
            </li>
            <li>
              <strong>Back at base</strong>: AirDrop the photos to your laptop (this preserves captions + GPS), then drop them here.
              The recipient name auto-populates from your caption. Confirm community + place, hit Save.
            </li>
          </ol>
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>iPhone 17 Pro HDR HEIC files:</strong> these can&apos;t be decoded in the browser (Apple-proprietary HEVC).
            Convert to JPEG before dropping in:
            <ol className="mt-1 ml-5 list-decimal">
              <li>In Finder, select all your HEIC photos</li>
              <li>Right-click → Quick Actions → <strong>Convert Image</strong> → Format: JPEG → Image Size: Actual → Convert</li>
              <li>Drop the converted JPEGs here</li>
            </ol>
            Or in Terminal: <code className="bg-white px-1 rounded">cd ~/Downloads &amp;&amp; for f in *.HEIC; do sips -s format jpeg &quot;$f&quot; --out &quot;${'{f%.HEIC}'}.jpg&quot;; done</code>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Photos without a readable QR get a manual &quot;bed ID&quot; input so you can still match them.
            Photos without a caption: just type the name in the field. No caption ≠ broken.
          </p>
        </details>
      </header>

      <BulkInstallClient communities={communities || []} />
    </div>
  );
}
