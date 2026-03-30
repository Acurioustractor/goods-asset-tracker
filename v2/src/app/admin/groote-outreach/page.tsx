import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from './copy-button';

export const metadata = {
  title: 'Groote Outreach — Draft Email | Goods on Country',
};

// ---------------------------------------------------------------------------
// Email content
// ---------------------------------------------------------------------------

const EMAIL_TO = 'Simone Grimmond (WHSAC)';
const EMAIL_SUBJECT =
  'Groote Archipelago — Community Health Hardware Proposal ($337K freight savings)';

const EMAIL_BODY = `Hi Simone,

I'm reaching out from Goods on Country — we're a social enterprise delivering washable, flat-packable beds and commercial washing machines to remote Indigenous communities across Australia.

We've put together a proposal specifically for the Groote Archipelago that addresses two challenges we keep hearing about from island communities: freight costs and health hardware durability.

The short version:
- 500 Stretch Beds @ $560/unit — flat-pack (26kg), washable canvas, recycled HDPE plastic legs, 200kg capacity, no tools needed
- 300 Commercial Washing Machines @ $4,950/unit — Speed Queen heavy-duty, tested across remote NT and QLD communities
- Estimated freight savings of $337K vs standard mattresses (5x more beds per pallet)

Why it matters for Groote:
The washable canvas surface is a direct scabies/RHD prevention pathway — something we've been working on with Anyinginyi Health and Miwatj Health in East Arnhem. And because the beds flat-pack to 26kg, you get 60 beds per pallet instead of 12 mattresses.

We've deployed 412+ beds across 7 communities including Palm Island (141 beds), Tennant Creek (139 beds), and Alice Homelands (60 beds). Happy to share outcomes data from any of these.

The full proposal is ready to share — covers pricing, freight economics, production timeline (18 weeks), and community impact projections.

Would a 30-minute call work to walk through it? I can also arrange a site visit if that's helpful.

Best,

Nicholas Marchesi OAM
Founder/CEO, Goods on Country
nicholas@act.place
www.goodsoncountry.com`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GrooteOutreachPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            &larr; Admin
          </Link>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-stone-800 md:text-4xl">
            Groote Outreach
          </h1>
          <p className="mt-2 text-stone-600">
            Draft outreach email for the Groote Archipelago proposal. Copy and
            send via your email client.
          </p>
        </div>

        {/* Context card */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-stone-700">
              <span className="font-medium text-stone-800">Recipient:</span>{' '}
              Simone Grimmond, WHSAC (Workforce, Health, Safety and Community)
              <br />
              <span className="font-medium text-stone-800">Proposal:</span>{' '}
              500 beds + 300 washers = $1.765M
            </div>
            <Link
              href="/admin/groote-proposal"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              View full proposal &rarr;
            </Link>
          </CardContent>
        </Card>

        {/* Email card */}
        <Card className="border-stone-200">
          <CardContent>
            <div className="divide-y divide-stone-100">
              {/* To field */}
              <div className="flex gap-3 py-3">
                <span className="w-16 shrink-0 text-sm font-medium text-stone-500">
                  To:
                </span>
                <span className="text-sm text-stone-800">{EMAIL_TO}</span>
              </div>

              {/* Subject field */}
              <div className="flex gap-3 py-3">
                <span className="w-16 shrink-0 text-sm font-medium text-stone-500">
                  Subject:
                </span>
                <span className="text-sm font-medium text-stone-800">
                  {EMAIL_SUBJECT}
                </span>
              </div>

              {/* Body */}
              <div className="pt-5">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                  {EMAIL_BODY}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-4">
          <CopyButton text={EMAIL_BODY} />
          <Link
            href="/admin/groote-proposal"
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            View full proposal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
