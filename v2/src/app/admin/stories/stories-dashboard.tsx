'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EmpathyLedgerStory } from '@/lib/empathy-ledger/types';
import type { ELGallery, ELGalleryPhoto } from '@/lib/empathy-ledger/types';
import type { SyndicationStoryteller } from '@/lib/empathy-ledger/types';

const EL_ADMIN_URL = 'https://empathy-ledger-v2.vercel.app';
const EL_PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

type ViewMode = 'cards' | 'list' | 'table';

interface StoriesDashboardProps {
  storytellers: SyndicationStoryteller[];
  videoStories: EmpathyLedgerStory[];
  textStories: EmpathyLedgerStory[];
  galleries: ELGallery[];
  uncategorizedPhotos: ELGalleryPhoto[];
  resolvedAuthors: Record<string, string>;
}

// View mode toggle component
function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const modes: { key: ViewMode; label: string }[] = [
    { key: 'cards', label: 'Cards' },
    { key: 'list', label: 'List' },
    { key: 'table', label: 'Table' },
  ];
  return (
    <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`px-2.5 py-1 transition-colors ${
            value === m.key
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

// Gallery folder card
function GalleryFolder({
  gallery,
  onClick,
}: {
  gallery: ELGallery;
  onClick: () => void;
}) {
  const coverPhoto = gallery.photos.find((p) => p.isCoverImage) || gallery.photos[0];
  const coverUrl = coverPhoto?.thumbnailUrl || coverPhoto?.url || gallery.coverImage;

  return (
    <button
      onClick={onClick}
      className="text-left group rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all bg-white"
    >
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={gallery.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">No photos yet</p>
            </div>
          </div>
        )}
        {gallery.photoCount > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            {gallery.photoCount}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {gallery.title}
        </p>
        {gallery.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{gallery.description}</p>
        )}
      </div>
    </button>
  );
}

// Gallery expanded view
function GalleryExpanded({
  gallery,
  onClose,
}: {
  gallery: ELGallery;
  onClose: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onClose}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Galleries
        </button>
        <span className="text-gray-300">|</span>
        <h3 className="text-sm font-semibold text-gray-800">{gallery.title}</h3>
        <span className="text-xs text-gray-400">{gallery.photos.length} photos</span>
      </div>
      {gallery.photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {gallery.photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.altText || photo.caption || photo.title || 'Community photo'}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
              {(photo.caption || photo.title) && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">
                      {photo.caption || photo.title}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center">
          <p className="text-sm text-gray-400">No photos in this gallery yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add photos via{' '}
            <a
              href={`${EL_ADMIN_URL}/admin/galleries`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Empathy Ledger
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

// Video stories section with view modes
function VideoSection({
  stories,
  authors,
}: {
  stories: EmpathyLedgerStory[];
  authors: Record<string, string>;
}) {
  const [view, setView] = useState<ViewMode>('table');

  if (stories.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-gray-400">
          <p className="text-sm">No video stories yet</p>
        </CardContent>
      </Card>
    );
  }

  if (view === 'table') {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div />
          <ViewToggle value={view} onChange={setView} />
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Storyteller</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stories.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <a
                      href={`${EL_ADMIN_URL}/admin/stories/${v.id}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-blue-700"
                    >
                      {v.title}
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{authors[v.id] || 'Goods on Country'}</td>
                  <td className="px-4 py-2.5">
                    {v.videoLink && (
                      <a
                        href={v.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Watch
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (view === 'list') {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div />
          <ViewToggle value={view} onChange={setView} />
        </div>
        <div className="space-y-2">
          {stories.map((v) => (
            <a
              key={v.id}
              href={`${EL_ADMIN_URL}/admin/stories/${v.id}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-md flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                  {v.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{authors[v.id] || 'Goods on Country'}</p>
              </div>
            </a>
          ))}
        </div>
      </>
    );
  }

  // Cards view (default)
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div />
        <ViewToggle value={view} onChange={setView} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((v) => (
          <a
            key={v.id}
            href={`${EL_ADMIN_URL}/admin/stories/${v.id}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={v.videoLink!}
                  className="w-full h-full pointer-events-none"
                  allow="autoplay; fullscreen"
                  tabIndex={-1}
                />
              </div>
              <CardContent className="py-3">
                <p className="text-sm font-semibold group-hover:text-blue-700 transition-colors">
                  {v.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{authors[v.id] || 'Goods on Country'}</p>
                {v.excerpt && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{v.excerpt}</p>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </>
  );
}

// Storyteller section with view modes
function StorytellerSection({
  storytellers,
}: {
  storytellers: SyndicationStoryteller[];
}) {
  const [view, setView] = useState<ViewMode>('table');

  if (storytellers.length === 0) return null;

  if (view === 'table') {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div />
          <ViewToggle value={view} onChange={setView} />
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Location</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Recordings</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Quotes</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Themes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {storytellers.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {st.avatarUrl ? (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={st.avatarUrl} alt={st.name} fill className="object-cover" sizes="28px" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-orange-600">{st.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{st.name}</span>
                      {st.isElder && (
                        <Badge className="bg-amber-100 text-amber-800 text-[10px]">Elder</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{st.location || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-500">{st.transcriptCount}</td>
                  <td className="px-4 py-2.5 text-gray-500">{st.quotes.length}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {st.themes.slice(0, 3).map((t) => (
                        <Badge key={t.name} variant="outline" className="text-[10px]">
                          {t.displayName}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (view === 'list') {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div />
          <ViewToggle value={view} onChange={setView} />
        </div>
        <div className="space-y-2">
          {storytellers.map((st) => (
            <div
              key={st.id}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              {st.avatarUrl ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={st.avatarUrl} alt={st.name} fill className="object-cover" sizes="40px" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">{st.name.charAt(0)}</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{st.name}</p>
                  {st.isElder && <Badge className="bg-amber-100 text-amber-800 text-[10px]">Elder</Badge>}
                </div>
                <p className="text-xs text-gray-500">
                  {st.location || 'Location unknown'} · {st.transcriptCount} recording{st.transcriptCount !== 1 ? 's' : ''} · {st.quotes.length} quote{st.quotes.length !== 1 ? 's' : ''}
                </p>
              </div>
              {st.quotes.length > 0 && (
                <p className="text-xs text-gray-500 italic max-w-xs truncate hidden lg:block">
                  &ldquo;{st.quotes[0].text}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  // Cards view
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div />
        <ViewToggle value={view} onChange={setView} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storytellers.map((st) => (
          <Card key={st.id}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                {st.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={st.avatarUrl} alt={st.name} fill className="object-cover" sizes="48px" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-orange-600">{st.name.charAt(0)}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold">{st.name}</p>
                  {st.location && <p className="text-xs text-gray-500">{st.location}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    {st.isElder && (
                      <Badge className="bg-amber-100 text-amber-800 text-[10px]">Elder</Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {st.transcriptCount > 0
                        ? `${st.transcriptCount} recording${st.transcriptCount !== 1 ? 's' : ''}`
                        : 'No recordings yet'}
                    </span>
                  </div>
                </div>
              </div>
              {st.quotes.length > 0 && (
                <p className="text-sm text-gray-700 italic leading-relaxed mt-3 line-clamp-3">
                  &ldquo;{st.quotes[0].text}&rdquo;
                </p>
              )}
              {st.themes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {st.themes.slice(0, 4).map((t) => (
                    <Badge key={t.name} variant="outline" className="text-[10px]">
                      {t.displayName}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export function StoriesDashboard({
  storytellers,
  videoStories,
  textStories,
  galleries,
  uncategorizedPhotos,
  resolvedAuthors,
}: StoriesDashboardProps) {
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);

  const galleryPhotoCount = galleries.reduce((sum, g) => sum + g.photos.length, 0);
  const totalPhotos = galleryPhotoCount + uncategorizedPhotos.length;
  const openGallery = openGalleryId ? galleries.find((g) => g.id === openGalleryId) : null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stories & Community Voices</h1>
        <p className="text-gray-500 mt-1">
          Content managed in{' '}
          <a
            href={`${EL_ADMIN_URL}/admin/projects/${EL_PROJECT_ID}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Empathy Ledger
          </a>
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Storytellers', value: storytellers.length },
          { label: 'Stories', value: textStories.length },
          { label: 'Videos', value: videoStories.length },
          { label: 'Photos', value: totalPhotos },
          { label: 'Galleries', value: galleries.length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-4 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Stories */}
      <section>
        <div className="mb-1">
          <h2 className="text-lg font-semibold">Video Stories</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {videoStories.length} video{videoStories.length !== 1 ? 's' : ''} from community recordings
          </p>
        </div>
        <VideoSection stories={videoStories} authors={resolvedAuthors} />
      </section>

      {/* Published Stories */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Published Stories</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {textStories.length} published stor{textStories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        {textStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {textStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-5">
                  {story.featuredImageUrl && (
                    <a href={`/stories/${story.id}`} className="block">
                      <div className="relative aspect-video rounded-md overflow-hidden mb-3 bg-gray-100">
                        <Image
                          src={story.featuredImageUrl}
                          alt={story.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </a>
                  )}
                  <a href={`/stories/${story.id}`} className="group">
                    <h4 className="text-sm font-semibold group-hover:text-blue-700 transition-colors">
                      {story.title}
                    </h4>
                  </a>
                  {story.excerpt && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{story.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">{resolvedAuthors[story.id] || 'Unknown'}</p>
                    <div className="flex items-center gap-2">
                      {story.elderApproved && (
                        <Badge className="bg-amber-100 text-amber-800 text-[10px]">Elder approved</Badge>
                      )}
                      <a
                        href={`${EL_ADMIN_URL}/admin/stories/${story.id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-gray-400">
              <p className="text-sm">No published stories yet</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Photo Galleries */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Photo Galleries</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {galleries.length} galleries{totalPhotos > 0 ? ` — ${totalPhotos} photos` : ''}
          </p>
        </div>

        {openGallery ? (
          <GalleryExpanded gallery={openGallery} onClose={() => setOpenGalleryId(null)} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {galleries.map((gallery) => (
                <GalleryFolder
                  key={gallery.id}
                  gallery={gallery}
                  onClick={() => setOpenGalleryId(gallery.id)}
                />
              ))}
            </div>

            {/* Uncategorized photos */}
            {uncategorizedPhotos.length > 0 && (
              <div>
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Uncategorized Photos</h3>
                  <p className="text-xs text-gray-500">{uncategorizedPhotos.length} photos not in a gallery</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {uncategorizedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                    >
                      <Image
                        src={photo.thumbnailUrl || photo.url}
                        alt={photo.altText || photo.title || 'Photo'}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {galleries.length === 0 && uncategorizedPhotos.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-gray-400">
              <p className="text-sm">No photos yet</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Storytellers */}
      <section>
        <div className="mb-1">
          <h2 className="text-lg font-semibold">Storytellers</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {storytellers.length} from Empathy Ledger · {storytellers.filter((s) => s.quotes.length > 0).length} with quotes · {storytellers.filter((s) => s.transcriptCount === 0).length} awaiting recordings
          </p>
        </div>
        <StorytellerSection storytellers={storytellers} />
      </section>
    </div>
  );
}
