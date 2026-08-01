import { PUBLIC_STAGES, MODULES, STAGE_RULE, MODULE_RULE } from '@/lib/data/pathway-stages';
import { canonFact } from '@/lib/data/canon';
import { COST_CHAPTERS } from '@/lib/data/cost-story';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

/**
 * THE LEAVE-BEHIND · one A4 sheet, printed both sides.
 *
 * "Three artifacts, one model: Notion is the diligence read, the 12-slide deck is the room,
 * the Pathway Board is what gets left on the table." This is that third artifact.
 *
 * Why this is a route and not another hand-built HTML file: six deck artifacts were built in
 * eight days because the model underneath kept moving and every artifact carried its own
 * transcribed copy of it. This page imports the stages, the modules and the figures from their
 * single sources of truth, so it cannot drift from them. Change pathway-stages.ts or canon.ts
 * and re-render; never retype a stage name or a number into this file.
 *
 * Side A is the board and stands on its own if only one side gets printed.
 * Side B is proof, the hinge, the doors and the ask.
 *
 * Render:  cd v2 && npm run dev
 *          NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/render-leave-behind.mjs 3000
 */

const C = {
  paper: '#F5F0E4',
  surface: '#FBF7EE',
  ink: '#26201A',
  soft: '#4A4034',
  mut: '#7C6F5A',
  line: '#E3D7BE',
  ochre: '#B9852F',
  ochreDeep: '#9C6C1C',
  terracotta: '#B0503C',
  teal: '#3F7C77',
  eucalypt: '#5E7350',
  bronze: '#9A6C34',
  amber: '#BE8636',
  highlight: '#F7EAD0',
};

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,system-ui,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,Menlo,Consolas,'Liberation Mono',monospace";

/** Stage accents, in the deck's order. Transfer carries the highlight: it is the centre. */
const STAGE_ACCENT = [C.terracotta, C.amber, C.bronze, C.teal, C.ochreDeep, C.eucalypt];

/** Pull a cost figure by chapter and label rather than retyping it. Throws loudly on drift. */
function costValue(slug: string, label: string): string {
  const chapter = COST_CHAPTERS.find((c) => c.slug === slug);
  const fact = chapter?.facts.find((f) => f.label === label);
  if (!fact) throw new Error(`leave-behind: cost fact not found: ${slug} / ${label}`);
  return fact.value;
}

const CHIP: Record<string, { bg: string; fg: string; letter: string }> = {
  verified: { bg: '#E4EBDD', fg: '#4E7C51', letter: 'V' },
  modelled: { bg: '#F1E6CC', fg: '#BE8636', letter: 'M' },
  target: { bg: '#E4E7EC', fg: '#6B7687', letter: 'T' },
};

function Chip({ claim }: { claim: string }) {
  const c = CHIP[claim] ?? CHIP.target;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: MONO,
        fontSize: 9,
        fontWeight: 700,
        padding: '1px 6px',
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        verticalAlign: 'middle',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
      {c.letter}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: 2,
        color: C.ochreDeep,
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}

function Wordmark({ tag }: { tag: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderTop: `1px solid ${C.line}`,
        paddingTop: 8,
        marginTop: 'auto',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/goods/logos/svg/goods-on-country-grounded-primary.svg"
        alt="Goods on Country"
        style={{ height: 26, width: 'auto', display: 'block' }}
      />
      <div style={{ fontFamily: MONO, fontSize: 8.5, color: C.mut, letterSpacing: 0.6, textAlign: 'right' }}>{tag}</div>
    </div>
  );
}

/** A4 landscape. Fixed box: anything that overflows is silently cropped, so the render script asserts. */
function Sheet({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <section
      id={id}
      className="sheet"
      style={{
        width: '297mm',
        height: '210mm',
        background: C.paper,
        color: C.ink,
        fontFamily: SANS,
        position: 'relative',
        overflow: 'hidden',
        padding: '13mm 14mm 11mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </section>
  );
}

export default function LeaveBehindPage() {
  const beds = canonFact('beds-deployed');
  const washers = canonFact('washers-in-community');
  const communities = canonFact('communities-served');
  const plastic = canonFact('plastic-kg');
  const revenue = canonFact('revenue-carveout');

  const staysToday = costValue('selling', 'Left over per bed — today');
  const staysPressed = costValue('selling', 'Left over per bed — if we press our own legs');
  const fixedBlock = costValue('running', 'Fixed running costs per year');
  const breakEven = costValue('running', 'Break-even — pressing in-house');

  const proof = [
    { fact: beds, big: beds.value.toLocaleString(), sub: 'beds deployed', note: '177 Stretch + 363 Basket' },
    { fact: washers, big: String(washers.value), sub: 'washing machines', note: 'Pakkimjalki Kari' },
    { fact: communities, big: String(communities.value), sub: 'communities served', note: '12 distinct communities touched' },
    { fact: plastic, big: Number(plastic.value).toLocaleString(), sub: 'kg recycled HDPE diverted', note: '177 Stretch × 20kg. Basket counts zero.' },
    { fact: revenue, big: `$${Number(revenue.value).toLocaleString()}`, sub: 'Goods revenue, FY26 YTD', note: 'Goods-only carve-out, workpaper' },
  ];

  const doors = [
    { key: 'GIVE', color: C.eucalypt, name: 'Goods on Country', body: 'The Butterfly Movement Ltd. Subsidised goods where procurement cannot reach, plus training and evidence. Gifts buy time.' },
    { key: 'BUY', color: C.teal, name: 'Goods.', body: 'A Curious Tractor Pty Ltd. Health services, schools, councils and housing programs. Sales carry the middle.' },
    { key: 'LEND', color: C.bronze, name: 'A Curious Tractor', body: 'Repayable loans that bridge large orders, equipment and working capital. Loans bridge orders.' },
    { key: 'OWN', color: C.ochreDeep, name: 'Community entities', body: 'Where all three doors end. Production, repair, local contracts and ownership rights. Site capital finishes the transfer.', highlight: true },
  ];

  return (
    <>
      <style>{`
        @page { size: 297mm 210mm; margin: 0; }
        html, body { background: #33302a; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        .sheet + .sheet { margin-top: 10mm; }
        @media print {
          .sheet + .sheet { margin-top: 0; page-break-before: always; }
        }
      `}</style>

      {/* ══════════════════ SIDE A · THE PATHWAY BOARD ══════════════════ */}
      <Sheet id="sideA">
        <div style={{ position: 'absolute', left: 0, top: 0, width: 8, height: '100%', background: C.ochre }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.ochre, fontWeight: 600 }}>
            Communities choose what they need
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.4, color: C.mut }}>The pathway board</div>
        </div>

        <h1 style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 600, lineHeight: 1.16, letterSpacing: -0.3, marginTop: 9, maxWidth: '68ch' }}>
          The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making.
        </h1>

        <p style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.42, marginTop: 8, maxWidth: '104ch' }}>
          Not a product company with a distribution problem. A menu a community picks from, and a route by which the
          making moves into their hands.
        </p>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 11, marginTop: 10 }}>
          <SectionLabel>
            Six stages · and what the community holds at the end of each
          </SectionLabel>

          <div style={{ display: 'flex', gap: 7, alignItems: 'stretch' }}>
            {PUBLIC_STAGES.map((stage, i) => (
              <div
                key={stage.id}
                style={{
                  flex: 1,
                  background: i === 4 ? C.highlight : C.surface,
                  border: `1px solid ${C.line}`,
                  borderTop: `4px solid ${STAGE_ACCENT[i]}`,
                  borderRadius: 9,
                  padding: '10px 9px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.mut, letterSpacing: 1.6 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.05, marginTop: 4 }}>{stage.label}</div>
                <div style={{ fontSize: 12, color: C.mut, marginTop: 7, lineHeight: 1.34, flex: 1 }}>{stage.line}</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9.5,
                    letterSpacing: 0.9,
                    textTransform: 'uppercase',
                    color: C.ochreDeep,
                    borderTop: `1px solid ${C.line}`,
                    marginTop: 8,
                    paddingTop: 6,
                  }}
                >
                  {stage.holds}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.4, marginTop: 1 }}>
            <b>{STAGE_RULE}</b>
          </p>

          <SectionLabel>Nine modules · take only what you want</SectionLabel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
            {MODULES.map((m) => (
              <div
                key={m.id}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 9,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 11.5, color: C.mut, lineHeight: 1.3 }}>{m.what}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.4 }}>{MODULE_RULE}</p>
        </div>

        <Wordmark tag="source of truth: pathway-stages.ts · turn over for the numbers" />
      </Sheet>

      {/* ══════════════════ SIDE B · PROOF, THE HINGE, THE DOORS, THE ASK ══════════════════ */}
      <Sheet id="sideB">
        <div style={{ position: 'absolute', left: 0, top: 0, width: 8, height: '100%', background: C.bronze }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.bronze, fontWeight: 600 }}>
            What is already true, and what we are asking for
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.4, color: C.mut }}>
            <Chip claim="verified" /> verified &nbsp; <Chip claim="modelled" /> modelled &nbsp; <Chip claim="target" /> target
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
          {/* ---- proof ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {proof.map((p) => (
              <div
                key={p.fact.id}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderTop: `4px solid ${C.teal}`,
                  borderRadius: 9,
                  padding: '9px 11px',
                }}
              >
                <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, lineHeight: 1, letterSpacing: -0.5 }}>
                  {p.big}
                </div>
                <div style={{ fontSize: 11.5, color: C.mut, marginTop: 5 }}>
                  {p.sub} <Chip claim={p.fact.claimLabel} />
                </div>
                <div style={{ fontSize: 10.5, color: C.mut, marginTop: 4, lineHeight: 1.3 }}>{p.note}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.42 }}>
            Every bed carries a QR digital twin: GPS, recipient, delivery date. Standing behind these figures are{' '}
            <b>200 to 350 bed requests we have not filled.</b> These are interest and requests, never signed agreements.
          </p>

          {/* ---- the hinge ---- */}
          <div style={{ display: 'flex', gap: 9, alignItems: 'stretch' }}>
            <div style={{ flex: '0 0 auto', width: '30%' }}>
              <SectionLabel>The hinge</SectionLabel>
              <div style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.2, marginTop: 5 }}>
                Pressing on Country is the whole argument.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'stretch' }}>
              <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderTop: `4px solid ${C.mut}`, borderRadius: 9, padding: '9px 11px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 600, lineHeight: 1, color: C.mut }}>{staysToday}</div>
                <div style={{ fontSize: 11.5, color: C.mut, marginTop: 5, lineHeight: 1.3 }}>stays in community today, legs bought finished</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: C.ochre, fontSize: 20 }}>→</div>
              <div style={{ flex: 1, background: C.highlight, border: `1px solid ${C.line}`, borderTop: `4px solid ${C.ochreDeep}`, borderRadius: 9, padding: '9px 11px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 600, lineHeight: 1, color: C.ochreDeep }}>{staysPressed}</div>
                <div style={{ fontSize: 11.5, color: C.mut, marginTop: 5, lineHeight: 1.3 }}>
                  when pressing happens on Country, of the same $750 bed <Chip claim="modelled" />
                </div>
              </div>
              <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderTop: `4px solid ${C.line}`, borderRadius: 9, padding: '9px 11px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{fixedBlock}<span style={{ fontSize: 11, color: C.mut }}> / yr</span></div>
                <div style={{ fontSize: 11.5, color: C.mut, marginTop: 5, lineHeight: 1.3 }}>what it costs to run Goods before a single bed is made</div>
              </div>
              <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderTop: `4px solid ${C.line}`, borderRadius: 9, padding: '9px 11px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{breakEven}</div>
                <div style={{ fontSize: 11.5, color: C.mut, marginTop: 5, lineHeight: 1.3 }}>break-even once the pressing is ours <Chip claim="modelled" /></div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.42 }}>
            <b>The honest thing:</b> the {staysPressed} is modelled from verified part prices, not yet measured at
            production rate. The first thing your money buys is the measured run that proves it.
          </p>

          {/* ---- the doors ---- */}
          <SectionLabel>Three doors · all three end in the same place</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {doors.map((d) => (
              <div
                key={d.key}
                style={{
                  background: d.highlight ? C.highlight : C.surface,
                  border: `1px solid ${C.line}`,
                  borderTop: `4px solid ${d.color}`,
                  borderRadius: 9,
                  padding: '8px 11px',
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: d.color, fontWeight: 700 }}>{d.key}</div>
                <div style={{ fontFamily: SERIF, fontSize: 15.5, marginTop: 4, lineHeight: 1.1 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: C.mut, marginTop: 5, lineHeight: 1.34 }}>{d.body}</div>
              </div>
            ))}
          </div>

          {/* ---- the ask ---- */}
          <div
            style={{
              background: C.highlight,
              border: `1px solid ${C.line}`,
              borderLeft: `5px solid ${C.bronze}`,
              borderRadius: 9,
              padding: '11px 13px',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ flex: '1 1 52%' }}>
              <SectionLabel>The ask</SectionLabel>
              <div style={{ fontFamily: SERIF, fontSize: 20, lineHeight: 1.18, marginTop: 5, fontWeight: 600 }}>
                AU$400,000 in signed commitments by 31 August. QBE matches it dollar for dollar.
              </div>
              <div style={{ fontSize: 11.5, color: C.soft, marginTop: 6, lineHeight: 1.4 }}>
                An <b>$800,000</b> program that takes Goods to the point it funds itself and stands up the first
                on-Country production sites: the measured run, the per-site plant capital, the
                first on-Country operator roles, and working capital. QBE Catalysing Impact closes late September
                2026, outcomes November.
              </div>
            </div>
            <div style={{ flex: '1 1 48%' }}>
              <SectionLabel>The stack we are asking to sign</SectionLabel>
              <div style={{ fontSize: 12, lineHeight: 1.7, marginTop: 5 }}>
                SEFA <b>$300K</b> <span style={{ color: C.mut, fontSize: 11 }}>repayable</span> &nbsp;·&nbsp; Snow
                Foundation <b>$100K</b> <span style={{ color: C.mut, fontSize: 11 }}>grant</span> &nbsp;·&nbsp;
                Centrecorp <b>$75K</b> <span style={{ color: C.mut, fontSize: 11 }}>grant</span>
                <span style={{ display: 'block', borderTop: `1px solid ${C.line}`, marginTop: 5, paddingTop: 5 }}>
                  Candidate stack <b>$607.5K</b> grants / <b>$710K</b> repayable · signed to date <b style={{ color: C.terracotta }}>$0</b>{' '}
                  <Chip claim="target" /> &nbsp;<span style={{ color: C.mut, fontSize: 11 }}>as at 25 July 2026, and we say so</span>
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: C.mut, marginTop: 6, lineHeight: 1.38 }}>
                Floor is $150K matched. Above $400K the match stops and extra brings the first site forward. REAL sits
                outside this match as a separate vehicle, applied and not secured, at about $2M over 3 years.
              </div>
            </div>
          </div>

          <p style={{ fontFamily: SERIF, fontSize: 14, color: C.ink, lineHeight: 1.28 }}>
            <b>The design principle: nobody funds Goods forever.</b> Equity is not sold. Gifts never fund the company.
            Sit down and ask us, make it with us, and leave the making with us.
          </p>
        </div>

        <Wordmark tag="hi@act.place · figures trace to canon.ts and cost-story.ts · ownership is a pathway, never claimed complete" />
      </Sheet>
    </>
  );
}
