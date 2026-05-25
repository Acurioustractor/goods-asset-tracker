// Recommended long-form reads for journalists, funders, and partners
// covering Goods on Country. Curated topics linked to reputable sources.
//
// To add or edit: open this file, fill URLs verified by hand. Don't auto-link
// fabricated URLs — verify in browser first, then commit.
//
// Sections render on /press → Sharing → Recommended reads.

export interface PressRead {
  id: string;
  title: string;
  source: string;            // Publication / org name
  summary: string;           // 1-2 sentences explaining why this is useful background
  url: string;               // Empty string = "URL pending" placeholder
  topic: 'health' | 'housing' | 'manufacturing' | 'self-determination' | 'social-enterprise';
}

export const pressReads: PressRead[] = [
  // ── Health: the bedding → scabies → RHD pathway ──────────────────────────
  {
    id: 'end-rhd',
    title: 'END RHD National Strategy',
    source: 'Australian Government / NHMRC',
    summary:
      'The federal Rheumatic Heart Disease elimination strategy. Sets out the prevention pathway and why environmental health hardware is part of the response.',
    url: '',
    topic: 'health',
  },
  {
    id: 'rhdaustralia',
    title: 'RHDAustralia',
    source: 'Menzies School of Health Research',
    summary:
      'Clinical and population-health research on Rheumatic Heart Disease in First Nations communities. Best place to verify the scabies → strep → rheumatic fever → RHD pathway Goods cites.',
    url: '',
    topic: 'health',
  },

  // ── Housing on Country ───────────────────────────────────────────────────
  {
    id: 'wilya-janta',
    title: 'Wilya Janta',
    source: 'Tennant Creek, NT',
    summary:
      'Norman Frank Jupurrurla and Dr Simon Quilty\'s healthy-homes advocacy. Goods partner. Shows the housing context the Stretch Bed lands inside.',
    url: 'https://wilyajanta.org/',
    topic: 'housing',
  },
  {
    id: 'healthabitat',
    title: 'Healthabitat / Housing for Health',
    source: 'Paul Pholeros\' work, 30+ years',
    summary:
      'The seminal Australian work on the link between housing infrastructure and Indigenous health outcomes. Methodology that underpins everything Goods does.',
    url: '',
    topic: 'housing',
  },

  // ── Self-determination & community ownership ─────────────────────────────
  {
    id: 'first-australians-capital',
    title: 'First Australians Capital',
    source: 'FAC',
    summary:
      'Investment in Indigenous-owned enterprise. Explains why community-owned manufacturing is the destination, not a nice-to-have.',
    url: '',
    topic: 'self-determination',
  },
  {
    id: 'supply-nation',
    title: 'Supply Nation',
    source: 'Indigenous business directory',
    summary:
      'Procurement pathway for First Nations businesses. Relevant when journalists ask about the transfer-to-community-ownership goal.',
    url: '',
    topic: 'self-determination',
  },

  // ── Circular manufacturing ───────────────────────────────────────────────
  {
    id: 'apco-circular',
    title: 'Australian Packaging Covenant — Plastics',
    source: 'APCO',
    summary:
      'Australian context on recycled HDPE. Why diverting plastic into durable goods (not landfill or low-grade products) matters.',
    url: '',
    topic: 'manufacturing',
  },

  // ── Social enterprise ────────────────────────────────────────────────────
  {
    id: 'a-curious-tractor',
    title: 'A Curious Tractor',
    source: 'ACT, the parent organisation',
    summary:
      'Background on the social enterprise behind Goods. Curiosity-driven problem solving applied to entrenched disadvantage.',
    url: 'https://acuriosutractor.com/',
    topic: 'social-enterprise',
  },
];

// External press coverage of Goods on Country. Empty until populated with
// real URLs from Ben. Don't auto-add.
export interface PressCoverage {
  id: string;
  outlet: string;
  title: string;
  date: string;      // ISO yyyy-mm-dd
  url: string;
  format: 'article' | 'podcast' | 'broadcast';
}

export const pressCoverage: PressCoverage[] = [
  // To add: { id, outlet, title, date, url, format }. Send Ben a list, drop in here.
];
