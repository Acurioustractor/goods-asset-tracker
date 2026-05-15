import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getContact, getContactNotes } from '../actions';
import { ContactNotes } from './contact-notes';

export const dynamic = 'force-dynamic';

const ROLE_COLORS: Record<string, string> = {
  storyteller: 'bg-orange-100 text-orange-800',
  partner: 'bg-blue-100 text-blue-800',
  supplier: 'bg-purple-100 text-purple-800',
  staff: 'bg-green-100 text-green-800',
  advisory: 'bg-amber-100 text-amber-800',
  supporter: 'bg-pink-100 text-pink-800',
  inquiry: 'bg-gray-100 text-gray-800',
  buyer: 'bg-cyan-100 text-cyan-800',
  funder: 'bg-emerald-100 text-emerald-800',
  community_leader: 'bg-red-100 text-red-800',
};

const NOTE_ICONS: Record<string, string> = {
  note: '📝',
  milestone: '🏆',
  email: '📧',
  call: '📞',
  meeting: '🤝',
  delivery: '📦',
  follow_up: '🔔',
};

export default async function ContactProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Only CRM contacts have profile pages (UUID format)
  const contact = await getContact(id);
  if (!contact) {
    notFound();
  }

  const notes = await getContactNotes(id);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back link */}
      <Link href="/admin/partners" className="text-sm text-blue-600 hover:underline">
        ← Back to People
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        {contact.avatar_url ? (
          <img
            src={contact.avatar_url}
            alt={contact.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{contact.name}</h1>
            {contact.is_elder && (
              <Badge className="bg-amber-100 text-amber-800">Elder</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            {contact.job_title && <span>{contact.job_title}</span>}
            {contact.job_title && contact.organization && <span>·</span>}
            {contact.organization && <span>{contact.organization}</span>}
          </div>
          {contact.location && (
            <p className="text-sm text-gray-400 mt-0.5">{contact.location}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {contact.roles.map((r) => (
              <Badge key={r} className={`text-xs ${ROLE_COLORS[r] || 'bg-gray-100 text-gray-800'}`}>
                {r.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{contact.email || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span>{contact.phone || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Website</span>
              {contact.website ? (
                <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Relationship</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge variant="outline">{contact.relationship_status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">First contact</span>
              <span>{contact.first_contact_date || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last contact</span>
              <span>{contact.last_contact_date || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Next follow-up</span>
              <span className={contact.next_follow_up ? 'text-blue-600 font-medium' : ''}>
                {contact.next_follow_up || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Assigned to</span>
              <span>{contact.assigned_to || '—'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio */}
      {contact.bio && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bio / Context</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {contact.tags.map((t) => (
            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
          ))}
        </div>
      )}

      {/* External links */}
      <div className="flex gap-2 text-xs">
        {contact.empathy_ledger_id && (
          <Badge variant="outline">EL: {contact.empathy_ledger_id.slice(0, 8)}...</Badge>
        )}
        {contact.grantscope_id && (
          <Badge variant="outline">GS: {contact.grantscope_id.slice(0, 8)}...</Badge>
        )}
        {contact.compendium_partner_id && (
          <Badge variant="outline">Compendium: {contact.compendium_partner_id}</Badge>
        )}
      </div>

      {/* Notes & Activity */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Notes & Activity</h2>
        <ContactNotes contactId={id} initialNotes={notes} />
      </section>
    </div>
  );
}
