import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompassionUploadForm } from './compassion-upload-form';

interface SearchParams {
  page?: string;
}

export default async function AdminCompassionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = createServiceClient();
  const page = parseInt(params.page || '1', 10);
  const pageSize = 20;

  // Get compassion content
  const { data: content, count, error } = await supabase
    .from('compassion_content')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching compassion content:', error);
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  // Get assets for the dropdown
  const { data: assets } = await supabase
    .from('assets')
    .select('unique_id, product, community')
    .order('unique_id');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Compassion Content</h1>
          <p className="text-gray-500 mt-1">
            Photos and videos for recipients • {count || 0} total
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <CompassionUploadForm assets={assets || []} />
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent>
          {!content || content.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No content uploaded yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {page > 1 && (
                <Link href={`/admin/compassion?page=${page - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/admin/compassion?page=${page + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface CompassionContent {
  id: string;
  asset_id: string;
  content_type: 'photo' | 'video' | 'message';
  media_url: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
}

function ContentCard({ content }: { content: CompassionContent }) {
  const typeIcon =
    content.content_type === 'photo'
      ? '📸'
      : content.content_type === 'video'
      ? '🎥'
      : '💬';

  return (
    <div className="border rounded-lg overflow-hidden">
      {content.media_url ? (
        <div className="aspect-video bg-gray-100 relative">
          {content.content_type === 'photo' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.media_url}
              alt={content.caption || 'Compassion content'}
              className="w-full h-full object-cover"
            />
          ) : content.content_type === 'video' ? (
            <video
              src={content.media_url}
              poster={content.thumbnail_url || undefined}
              className="w-full h-full object-cover"
              controls
            />
          ) : null}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">{typeIcon}</Badge>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">{typeIcon}</span>
        </div>
      )}

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium">{content.asset_id}</span>
          <div className="flex gap-1">
            {content.sent_at && (
              <Badge variant="outline" className="text-xs">
                Sent
              </Badge>
            )}
            {content.viewed_at && (
              <Badge variant="outline" className="text-xs bg-green-50">
                Viewed
              </Badge>
            )}
          </div>
        </div>

        {content.caption && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {content.caption}
          </p>
        )}

        <div className="text-xs text-gray-400">
          {new Date(content.created_at).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          {content.created_by && ` by ${content.created_by}`}
        </div>
      </div>
    </div>
  );
}
