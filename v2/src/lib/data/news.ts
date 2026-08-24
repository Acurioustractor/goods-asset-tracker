/**
 * THE NEWSLETTER — a monthly assembly, not a writing job (Ben, 2026-08-06).
 *
 * Each issue GATHERS what already exists and cleared elsewhere: published field notes and
 * case studies (From community), cleared voices stepping up (People), the road's progress
 * told WITHOUT dollar figures (the one-money-surface rule holds here: /news is a public
 * surface, so money is one sentence and a link), and the three doors.
 *
 * Nothing in an issue may be its first public appearance. If a story is not already on a
 * consent-cleared public surface, it does not go in the newsletter — the issue links, it
 * does not launch. That is what keeps a monthly cadence safe to sustain.
 */

export interface NewsItem {
  title: string;
  line: string;
  href: string;
  photo?: { src: string; alt: string };
}

export interface NewsIssue {
  slug: string;
  title: string;
  month: string;
  standfirst: string;
  fromCommunity: NewsItem[];
  /** Cleared voices only; every name must hold tier `external` in the storyteller registry. */
  people: NewsItem[];
  /** The road section: qualitative progress, NO dollar figures (guard-enforced). */
  road: string[];
  published: boolean;
}

export const NEWS_ISSUES: NewsIssue[] = [
  {
    slug: '2026-08',
    title: 'The making is proven',
    month: 'August 2026',
    standfirst:
      'Forty beds pressed at our own facility and assembled in Maningrida by young people. A record for every community, now public. And the road to community ownership, laid out plainly for the first time.',
    fromCommunity: [
      {
        title: 'Case study: the Maningrida run',
        line: 'A community-controlled organisation asked; the parts were pressed at the farm; young people assembled every bed in community. How it worked, step by step, for any community asking "could this work where we are".',
        href: '/case-studies/maningrida',
        photo: { src: '/images/community/maningrida/whole-run-at-sunset.jpg', alt: 'The Maningrida run at sunset' },
      },
      {
        title: 'Field note: Alice Springs to Utopia',
        line: 'Three days across Alice Springs, Utopia, Arawerr and Ampilatwatja. Young people built beds with Oonchiumpa; local teams led the deliveries to the homelands.',
        href: '/field-notes/utopia-may-2026',
        photo: { src: '/images/utopia/utopia-01.jpg', alt: 'Delivery across the Utopia homelands' },
      },
    ],
    people: [
      {
        title: 'Mykel, Palm Island',
        line: 'Seven beds built by the end of his second day. "Yeah, I\'ll be rocking up every day to make them."',
        href: '/storytellers',
      },
      {
        title: 'Shayne Bloomfield, Oonchiumpa',
        line: '"This partnership could go a long way. I feel it\'s got a long, long path ahead."',
        href: '/case-studies/maningrida',
      },
    ],
    road: [
      'The deck was rebuilt to be read in five minutes: the road, the places, and the money in five numbers.',
      'Nothing is signed yet, and we say so first. The gate we set ourselves is 31 August.',
      'The next thing the money buys is a measured fifty-bed run: timed, costed, with receipts.',
    ],
    published: true,
  },
];

export function newsIssue(slug: string): NewsIssue | null {
  return NEWS_ISSUES.find((i) => i.slug === slug && i.published) ?? null;
}
