import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { JURISDICTIONS, MODEL_GAPS, QLD_NOTES, SA_NOTES, WA_BOARD_TEST } from '@/lib/data/procurement-model';
import {
  BUYER_CHANNELS, IPP_COMPLIANCE, NT_ABE_PREFERENCE, NT_BENCHMARKS, NT_CONTACTS,
  NT_DEPARTMENTS, NT_HEALTHY_LIVING, NT_PROGRAM, NT_TIER_NOTE, NT_TIERS, NT_UNSOURCED,
  PROCUREMENT_RULES, PROCUREMENT_STATE, REPEAT_BUYERS, SELLER_PATHWAY,
} from '@/lib/data/procurement';

/**
 * WHERE WE ARE WITH PROCUREMENT. Admin, internal.
 *
 * Ben, 16 September 2026: review where we are at with counting the procurement, lean into
 * Indigenous procurement, and work out how the community does the selling.
 *
 * The page leads on the blocker, because the blocker is the finding: every Indigenous procurement channel tests the entity that SELLS, and the entity
 * that sells is A Curious Tractor Pty Ltd. Until that changes, or until a community
 * organisation is the seller, the set-aside and the three per cent targets are somebody
 * else's advantage.
 */

export const metadata: Metadata = {
  title: 'Procurement | Goods admin',
  robots: { index: false, follow: false },
};

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;
const audShort = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : aud(n));

/**
 * The evidence pull, written by scripts/pull-procurement.mjs. Read from disk, because it
 * comes from another project's database and an admin page that breaks when a different team
 * rotates a key is worse than one showing a dated number.
 */
interface Pull {
  readAt: string;
  stateTenders?: {
    matching: number; withRemoteOrIndigenousSignal: number; states: string[];
    buyers: { buyer: string; valueAud: number }[]; verdict: string;
  };
  totals: { contracts: number; buyers: number; communitiesTagged: number; contractsTaggedToCommunity: number };
  buyers: { buyer: string; contracts: number; valueAud: number; products: string[]; communities: string[]; sampleTitle: string | null }[];
  communities: { community: string; contracts: number; valueAud: number; products: string[]; topBuyer: string | null }[];
}

interface NtPull {
  readAt: string; source: string;
  totals: { allContracts: number; housingRelated: number; housingValueAud: number; infraAgencyValueAud: number; territoryEnterpriseContracts: number };
  contractors: { name: string; known: string | null; contracts: number; valueAud: number; roomToBreathe: number; beddingMentions: number; territoryEnterprise: boolean; topPlaces: string[]; topAgency: string | null; sample: string | null }[];
  places: { place: string; contracts: number; valueAud: number; topContractor: string }[];
  furnishingGap?: {
    furnitureOrWhitegoodsContracts: number; onceRoadsideRemoved: number; forARemoteCommunity: number;
    housingAgencyContracts: number; housingAgencyValueAud: number; housingAgencyFurnitureContracts: number;
    verdict: string;
  };
}

interface Intel {
  readAt: string;
  quality: { overcrowding: string; population: string; employment: string; recycling: string; health: string };
  communities: {
    community: string; state: string | null; population: number | null; populationReliable: boolean;
    personsPerDwelling: number | null; overcrowdedPct: number | null; overcrowdedDwellings: number | null;
    jobseekerRegional: number | null; healthServices: number | null; plasticWasteTpa: number | null;
  }[];
}

async function readIntel(): Promise<Intel | null> {
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'data/community-intel.json'), 'utf8')) as Intel;
  } catch {
    return null;
  }
}

async function readNt(): Promise<NtPull | null> {
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'data/nt-housing-contractors.json'), 'utf8')) as NtPull;
  } catch {
    return null;
  }
}

async function readPull(): Promise<Pull | null> {
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'data/procurement-buyers.json'), 'utf8')) as Pull;
  } catch {
    return null;
  }
}

/** Places Goods already works, so the table can say which of these we are already inside. */
const OURS = new Set(['Tennant Creek', 'Maningrida', 'Alice Springs', 'Utopia', 'Palm Island', 'Katherine', 'Kalgoorlie']);

export default async function ProcurementPage() {
  const pull = await readPull();
  const nt = await readNt();
  const intel = await readIntel();
  const crowded = intel ? intel.communities.filter((c) => c.overcrowdedPct !== null) : [];
  const ntKnown = nt ? nt.contractors.filter((c) => c.known) : [];
  const ntRtb = nt ? nt.contractors.filter((c) => c.roomToBreathe > 0).sort((a, b) => b.valueAud - a.valueAud).slice(0, 8) : [];
  const dipl = pull ? pull.buyers.filter((b) => b.buyer.startsWith('NT Department of Infrastructure')) : [];
  const diplValue = dipl.reduce((n, b) => n + b.valueAud, 0);
  const diplContracts = dipl.reduce((n, b) => n + b.contracts, 0);
  const diplCommunities = new Set(dipl.flatMap((b) => b.communities)).size;
  const coverage = Math.round((PROCUREMENT_STATE.withProcurementContact / PROCUREMENT_STATE.communities) * 100);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin &middot; internal</p>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Procurement</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Who can buy a bed, what obliges them to look at an Aboriginal supplier first, and why that supplier should
        be a community organisation. Read {PROCUREMENT_STATE.readAt}.
      </p>

      {/* The blocker, first. */}
      <section className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-destructive">The blocker</p>
        <h2 className="mt-2 font-display text-xl leading-snug">
          Every Indigenous procurement channel tests the entity that sells. That entity is {PROCUREMENT_STATE.sellerEntity}.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Ruling J, 25 July 2026: Aboriginal directors on the charity is not 51 per cent First Nations ownership of
          the selling entity, which is what Supply Nation, the Indigenous Procurement Policy, IBA and FAC all test.
          Supply Nation status today: {PROCUREMENT_STATE.supplyNationStatus}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed">
          The community organisations we already work with do meet that test. So beds handed to a community
          organisation as stock they own are not a donation. They are what makes that organisation a supplier into a
          channel Goods cannot reach, and the margin stays there.
        </p>
      </section>

      {/* Counting. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">What we have actually counted</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-5">
            <p className="font-display text-3xl leading-none">{PROCUREMENT_STATE.withProcurementContact} of {PROCUREMENT_STATE.communities}</p>
            <p className="mt-2 text-xs text-muted-foreground">Communities with a procurement contact recorded. {coverage} per cent.</p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="font-display text-3xl leading-none">{PROCUREMENT_STATE.withKeyPeople}</p>
            <p className="mt-2 text-xs text-muted-foreground">Communities with any key person recorded at all.</p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="font-display text-3xl leading-none">4</p>
            <p className="mt-2 text-xs text-muted-foreground">Buyers who have ever paid. Every other number on this page is a target.</p>
          </div>
        </div>
        <table className="mt-5 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Community</th>
              <th className="py-2 pr-4 font-semibold">Organisation</th>
              <th className="py-2 font-semibold">Already</th>
            </tr>
          </thead>
          <tbody>
            {PROCUREMENT_STATE.contacts.map((c) => (
              <tr key={c.community} className="border-b last:border-0">
                <td className="py-2.5 pr-4 font-medium">{c.community}</td>
                <td className="py-2.5 pr-4">{c.org}</td>
                <td className="py-2.5 text-muted-foreground">{c.already}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          Two of the four already hold or have bought product. That is the pattern to grow, and the other
          twenty-seven communities have nobody recorded at all.
        </p>
      </section>

      {/* The rules. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">What obliges a buyer to look at an Aboriginal supplier</h2>
        <div className="mt-4 space-y-3">
          {PROCUREMENT_RULES.map((r) => (
            <div key={r.id} className="rounded-lg border p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{r.jurisdiction}</span>
                <p className="font-semibold">{r.name}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed">&ldquo;{r.rule}&rdquo;</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.soWhat}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">Source: {r.sourceDetail}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-dashed p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">How well any of this is complied with</p>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>{IPP_COMPLIANCE.exemptedShare}</li>
            <li>{IPP_COMPLIANCE.otherCategory}</li>
            <li>{IPP_COMPLIANCE.worstPortfolios}</li>
            <li>{IPP_COMPLIANCE.bestPortfolios}</li>
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">Source: {IPP_COMPLIANCE.source}.</p>
        </div>
      </section>

      {/* Channels. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">The channels</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Six routes with a real path for a bed. Three are proven by an invoice; three are not.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {BUYER_CHANNELS.map((c) => (
            <div key={c.id} className="rounded-lg border p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold leading-snug">{c.label}</p>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={c.proven ? { backgroundColor: '#E6EDDD', color: '#4F6138' } : { backgroundColor: '#EEE9E3', color: '#6A5E54' }}
                >
                  {c.proven ? 'sold one' : 'never sold'}
                </span>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">Buys by {c.method}</p>
              <p className="mt-2 text-sm leading-relaxed">{c.what}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.examples}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The evidence pull. */}
      {pull && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Who is actually buying this, and where</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {pull.totals.contracts.toLocaleString('en-AU')} awarded federal contracts mention a bed, mattress,
            washing machine, laundry, whitegood or linen, across {pull.totals.buyers} buyers.{' '}
            {pull.totals.contractsTaggedToCommunity} of them name a community we can identify, covering{' '}
            {pull.totals.communitiesTagged} places. Pulled {pull.readAt} by{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px]">scripts/pull-procurement.mjs</code>.
          </p>

          {dipl.length > 0 && (
            <div className="mt-4 rounded-lg border-2 p-6" style={{ borderColor: '#C45C3E' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>The finding</p>
              <h3 className="mt-2 font-display text-xl leading-snug">
                One buyer family spends {audShort(diplValue)} on this, in {diplCommunities} of the{' '}
                {pull.totals.communitiesTagged} communities.
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                The NT Department of Infrastructure, Planning and Logistics appears under {dipl.length} names across{' '}
                {diplContracts} contracts. It is the top buyer in every community below, including all five where
                Goods already works. Remote-area procurement carries the mandatory set-aside at any value, so every
                one of these had to be tested against Aboriginal and Torres Strait Islander business capability
                first.
              </p>
            </div>
          )}

          <table className="mt-5 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Community</th>
                <th className="py-2 pr-3 text-right font-semibold">Contracts</th>
                <th className="py-2 pr-3 text-right font-semibold">Value</th>
                <th className="py-2 pr-3 font-semibold">Products named</th>
                <th className="py-2 font-semibold">Top buyer</th>
              </tr>
            </thead>
            <tbody>
              {pull.communities.slice(0, 20).map((c) => (
                <tr key={c.community} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-3 font-medium">
                    {c.community}
                    {OURS.has(c.community) && (
                      <span className="ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#E6EDDD', color: '#4F6138' }}>
                        we are here
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{c.contracts}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{audShort(c.valueAud)}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{c.products.length > 0 ? c.products.join(', ') : 'not specified in the title'}</td>
                  <td className="py-2 text-muted-foreground">{c.topBuyer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            Contract values are for the whole contract, and most of that is construction or maintenance. The figure
            says where the money and the obligation sit, never what a bed order would be worth.
          </p>
        </section>
      )}

      {/* The NT workbook: who is actually building the rooms. */}
      {nt && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Northern Territory: who is already building the rooms</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {nt.totals.allContracts.toLocaleString('en-AU')} awarded NT contracts, parsed from a workbook that has
            been sitting in the grantscope repo since March and was never loaded anywhere.{' '}
            {nt.totals.housingRelated.toLocaleString('en-AU')} are housing or fit-out related, worth{' '}
            {audShort(nt.totals.housingValueAud)}, and {nt.totals.territoryEnterpriseContracts.toLocaleString('en-AU')}{' '}
            of them went to a Territory Enterprise. Read {nt.readAt} by{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px]">scripts/pull-nt-contracts.py</code>.
          </p>

          {nt.furnishingGap && (
            <div className="mt-4 rounded-lg border-2 p-6" style={{ borderColor: '#C45C3E' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>The finding, and it is a negative one</p>
              <h3 className="mt-2 font-display text-xl leading-snug">
                Nobody buys a bed for a remote community house. The house is built and handed over empty.
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                The NT housing agencies spent {audShort(nt.furnishingGap.housingAgencyValueAud)} across{' '}
                {nt.furnishingGap.housingAgencyContracts.toLocaleString('en-AU')} contracts.{' '}
                {nt.furnishingGap.housingAgencyFurnitureContracts} of those mention furniture, and they are office
                chairs in Darwin and removalists. Across all {nt.totals.allContracts.toLocaleString('en-AU')}{' '}
                contracts, {nt.furnishingGap.furnitureOrWhitegoodsContracts} mention furniture or whitegoods,{' '}
                {nt.furnishingGap.onceRoadsideRemoved} once roadside furniture is removed, and{' '}
                <strong>{nt.furnishingGap.forARemoteCommunity}</strong> are for a remote community.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed">
                So the construction scope stops at the building. There is {audShort(nt.totals.housingValueAud)} of
                remote housing work here and no procurement channel at all for the thing that goes in the bedroom,
                which means the tenant buys it. That is the problem Goods exists for, stated in the government&rsquo;s
                own contract record.
              </p>
            </div>
          )}

          <div className="mt-4 rounded-lg border p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#4F6138' }}>Who is building, and where they could still be a customer</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              The head contractors are Aboriginal corporations, and we already know six of them. Bukmak is building
              87 dwellings at Galiwin&rsquo;ku under Room to Breathe, a program whose stated purpose is reducing
              overcrowding by adding sleeping space. Binjari is at Bulman, Weemol and Beswick. Bawinanga is at
              Maningrida. They are already Aboriginal-owned and already hold the contract.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed">
              A bed is not in their build scope. Where it could be is their <strong>maintenance and tenancy</strong>{' '}
              contracts, where replacing a failed appliance is in scope: Bukmak holds remote housing maintenance at
              Galiwinku, Milingimbi and Gapuwiyak, and Binjari holds remote tenancy management at Binjari. Smaller
              than the build, and a conversation with a real scope behind it.
            </p>
          </div>

          <h3 className="mt-6 text-sm font-semibold">Organisations we already have a relationship with</h3>
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Organisation</th>
                <th className="py-2 pr-3 text-right font-semibold">Contracts</th>
                <th className="py-2 pr-3 text-right font-semibold">Value</th>
                <th className="py-2 pr-3 text-right font-semibold">Room to Breathe</th>
                <th className="py-2 font-semibold">Where</th>
              </tr>
            </thead>
            <tbody>
              {ntKnown.map((c) => (
                <tr key={c.name} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-3 font-medium">{c.known}<span className="block text-[11px] font-normal text-muted-foreground">as {c.name}</span></td>
                  <td className="py-2 pr-3 text-right tabular-nums">{c.contracts}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{audShort(c.valueAud)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{c.roomToBreathe || 'none'}</td>
                  <td className="py-2 text-muted-foreground">{c.topPlaces.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">
            Bawinanga appears twice because the workbook carries two spellings of its name. Left as found.
          </p>

          <h3 className="mt-6 text-sm font-semibold">The biggest Room to Breathe contractors</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {ntRtb.map((c) => (
              <li key={c.name} className="flex gap-3">
                <span className="w-24 shrink-0 text-right tabular-nums">{audShort(c.valueAud)}</span>
                <span className={c.known ? 'font-semibold' : ''}>{c.name}</span>
                {c.known && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#E6EDDD', color: '#4F6138' }}>we know them</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* The state pull, and why it is a dead end for now. */}
      {pull?.stateTenders && (
        <section className="mt-8 rounded-lg border border-dashed p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            State tenders: checked, and currently a dead end
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {pull.stateTenders.matching} state rows mention something Goods makes, and{' '}
            <strong>{pull.stateTenders.withRemoteOrIndigenousSignal}</strong> of them carry any remote or Indigenous
            signal. {pull.stateTenders.verdict} The buyers are{' '}
            {pull.stateTenders.buyers.slice(0, 4).map((b) => b.buyer).join(', ')}: institutional bedding for prisons,
            schools and youth detention.
          </p>
          <p className="mt-2 max-w-3xl text-xs text-muted-foreground">
            The pull runs against it every time anyway, so this stays a checked number. It starts being useful the
            day somebody loads the NT contract data that is already sitting in the grantscope repo.
          </p>
        </section>
      )}

      {/* Named targets. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">Agencies that already buy beds</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          From a scan of 823,620 federal contracts: 10,626 matched the things Goods makes, across 366 buyers. These
          are the top of the shortlist with a housing, community or First Nations remit. Contracts awarded, not
          opportunities open, and nobody here has been approached.
        </p>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Agency</th>
              <th className="py-2 pr-4 text-right font-semibold">Contracts</th>
              <th className="py-2 pr-4 text-right font-semibold">Value</th>
              <th className="py-2 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {REPEAT_BUYERS.map((b) => (
              <tr key={b.name} className="border-b last:border-0 align-top">
                <td className="py-2.5 pr-4 font-medium">{b.name}<span className="block text-[11px] font-normal text-muted-foreground">{b.years}</span></td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{b.contracts}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{aud(b.valueAud)}</td>
                <td className="py-2.5 text-muted-foreground">{b.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* The model, jurisdiction by jurisdiction. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">The model, jurisdiction by jurisdiction</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Every jurisdiction answers the same six questions. The one that matters most is the threshold below which
          somebody can simply buy, so it is shown in beds. A jurisdiction we have not researched says so.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {JURISDICTIONS.map((j) => (
            <div key={j.id} className="rounded-lg border p-5" style={{ borderColor: j.status === 'done' ? '#4F6138' : '#E8DED4' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg leading-snug">{j.name}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{j.communities} of our communities</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={j.status === 'done' ? { backgroundColor: '#E6EDDD', color: '#4F6138' } : { backgroundColor: '#EEE9E3', color: '#6A5E54' }}
                >
                  {j.status === 'done' ? 'researched' : 'pending'}
                </span>
              </div>

              {j.directPurchase ? (
                <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: '#F6E4DE' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9A4023' }}>Buy without a tender</p>
                  <p className="mt-1 font-display text-3xl leading-none" style={{ color: '#9A4023' }}>
                    {j.directPurchase.beds > 0 ? `${j.directPurchase.beds} beds` : 'No cap'}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: '#9A4023' }}>
                    {j.directPurchase.beds > 0 ? `up to ${aud(j.directPurchase.limitAud)}` : 'no dollar limit on the exception'}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: '#6A5E54' }}>{j.directPurchase.rule}</p>
                </div>
              ) : (
                <p className="mt-4 rounded-lg p-4 text-xs" style={{ backgroundColor: '#EEE9E3', color: '#6A5E54' }}>
                  Threshold not yet established.
                </p>
              )}

              <dl className="mt-4 space-y-2 text-xs">
                {j.buyer && <div><dt className="font-semibold">Who holds the money</dt><dd className="text-muted-foreground">{j.buyer}</dd></div>}
                {j.preference && <div><dt className="font-semibold">The preference</dt><dd className="text-muted-foreground">{j.preference}</dd></div>}
                {j.register && <div><dt className="font-semibold">Register</dt><dd className="text-muted-foreground">{j.register}</dd></div>}
                {j.portal && <div><dt className="font-semibold">Portal</dt><dd className="text-muted-foreground">{j.portal}</dd></div>}
                {j.door && <div><dt className="font-semibold">The door</dt><dd className="text-muted-foreground">{j.door}</dd></div>}
              </dl>
              <p className="mt-3 text-xs leading-relaxed">{j.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border-2 p-6" style={{ borderColor: '#BBA255' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#8A6A2F' }}>
            A WA finding that may undo the blocker at the top of this page. Not established.
          </p>
          <h3 className="mt-2 font-display text-xl leading-snug">
            The register that unlocks the uncapped rule tests the board. Ownership never comes into it.
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed">&ldquo;{WA_BOARD_TEST.rule}&rdquo;</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{WA_BOARD_TEST.whyItMatters}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">What is not established, which is most of it</p>
          <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-muted-foreground">
            {WA_BOARD_TEST.unresolved.map((u) => <li key={u}>{u}</li>)}
          </ul>
          <p className="mt-3 text-sm font-semibold">{WA_BOARD_TEST.ask}</p>
        </div>

        <h3 className="mt-6 text-sm font-semibold">Queensland, which writes the answer into the policy</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {QLD_NOTES.map((n) => (
            <div key={n.title} className="rounded-lg border p-4">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{n.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold">South Australia, the parts that do not fit the shape</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {SA_NOTES.map((n) => (
            <div key={n.title} className="rounded-lg border p-4">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{n.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-dashed p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">The same gap in every jurisdiction</p>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {MODEL_GAPS.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </section>

      {/* Community intelligence. */}
      {intel && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">The communities, and what the census says about them</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Overcrowding is ABS Census 2021, Indigenous Profile table I16, per Indigenous Location, on the Canadian
            National Occupancy Standard: households needing one or more extra bedrooms. {crowded.length} of our
            communities have it. Read {intel.readAt} by{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px]">scripts/pull-community-intel.py</code>.
          </p>

          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Community</th>
                <th className="py-2 pr-3 font-semibold">State</th>
                <th className="py-2 pr-3 text-right font-semibold">Needing a bedroom</th>
                <th className="py-2 pr-3 text-right font-semibold">People per dwelling</th>
                <th className="py-2 text-right font-semibold">Dwellings</th>
              </tr>
            </thead>
            <tbody>
              {crowded.map((c) => (
                <tr key={c.community} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium">
                    {c.community}
                    {OURS.has(c.community) && (
                      <span className="ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#E6EDDD', color: '#4F6138' }}>we are here</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">{c.state}</td>
                  <td className="py-2 pr-3 text-right">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2 rounded-full"
                        style={{ width: `${Math.max(4, (c.overcrowdedPct ?? 0))}px`, backgroundColor: (c.overcrowdedPct ?? 0) >= 50 ? '#C45C3E' : '#BBA255' }}
                      />
                      <span className="tabular-nums font-semibold">{c.overcrowdedPct?.toFixed(0)}%</span>
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{c.personsPerDwelling?.toFixed(1) ?? 'not held'}</td>
                  <td className="py-2 text-right tabular-nums text-muted-foreground">{c.overcrowdedDwellings ?? 'not held'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 rounded-lg border border-dashed p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">What this data cannot do</p>
            <dl className="mt-2 space-y-2 text-sm">
              <div><dt className="inline font-semibold">Population. </dt><dd className="inline text-muted-foreground">{intel.quality.population}</dd></div>
              <div><dt className="inline font-semibold">Employment. </dt><dd className="inline text-muted-foreground">{intel.quality.employment}</dd></div>
              <div><dt className="inline font-semibold">Recycling. </dt><dd className="inline text-muted-foreground">{intel.quality.recycling}</dd></div>
              <div><dt className="inline font-semibold">Health. </dt><dd className="inline text-muted-foreground">{intel.quality.health}</dd></div>
              <div><dt className="inline font-semibold">Town camps. </dt><dd className="inline text-muted-foreground">Several Indigenous Locations explicitly exclude town camps, which is why Tennant Creek reads 10 per cent and Kalgoorlie 2. Those are not low-crowding places; the measure is looking past the part that matters.</dd></div>
            </dl>
          </div>
        </section>
      )}

      {/* The NT, specifically. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">The Northern Territory, and the door that is actually open</h2>

        <div className="mt-4 rounded-lg border p-5" style={{ borderColor: '#C45C3E' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>Correction</p>
          <p className="mt-2 text-sm leading-relaxed">
            The buyer on those 261 federal contracts, <strong>{NT_DEPARTMENTS.wasCalled}</strong>, no longer exists.
            It became <strong>{NT_DEPARTMENTS.nowCalled}</strong> in {NT_DEPARTMENTS.renamed}, and remote housing
            moved out of it to the <strong>{NT_DEPARTMENTS.housingMovedTo}</strong>.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{NT_DEPARTMENTS.whoOwnsWhat}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{NT_DEPARTMENTS.ministers}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{NT_DEPARTMENTS.vacancy}</p>
        </div>

        <div className="mt-4 rounded-lg border-2 p-6" style={{ borderColor: '#4F6138' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#4F6138' }}>The most useful fact on this page</p>
          <h3 className="mt-2 font-display text-xl leading-snug">
            Since 1 October 2025, an NT buyer can direct-purchase 66 beds from a Territory enterprise with no quote
            process at all.
          </h3>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Tier</th>
                <th className="py-2 pr-3 text-right font-semibold">Up to</th>
                <th className="py-2 pr-3 text-right font-semibold">Beds at $750</th>
                <th className="py-2 font-semibold">Process</th>
              </tr>
            </thead>
            <tbody>
              {NT_TIERS.map((t) => (
                <tr key={t.tier} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-3 font-medium">{t.tier}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{aud(t.upToAud)}</td>
                  <td className="py-2 pr-3 text-right font-semibold tabular-nums">{t.beds.toLocaleString('en-AU')}</td>
                  <td className="py-2 text-muted-foreground">{t.process}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">{NT_TIER_NOTE}</p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#4F6138' }}>The set-aside that applies here</p>
            <p className="mt-2 text-sm text-muted-foreground">Under {NT_ABE_PREFERENCE.program}, procurement is prioritised in this order:</p>
            <ol className="mt-2 space-y-1.5 text-sm">
              {NT_ABE_PREFERENCE.order.map((o, i) => (
                <li key={o} className="flex gap-2">
                  <span className="shrink-0 font-semibold" style={{ color: '#C45C3E' }}>{i + 1}</span>
                  <span className={i === 0 ? 'font-semibold' : 'text-muted-foreground'}>{o}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm leading-relaxed">{NT_ABE_PREFERENCE.employment}</p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9A4023' }}>{NT_ABE_PREFERENCE.shortfall}</p>
            <p className="mt-2 text-xs text-muted-foreground">{NT_ABE_PREFERENCE.ownership}</p>
          </div>

          <div className="rounded-lg border p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#4F6138' }}>Their doctrine names our two products, in order</p>
            <ol className="mt-3 space-y-2">
              <li className="flex gap-3"><span className="font-display text-2xl leading-none" style={{ color: '#C45C3E' }}>1</span><span className="font-semibold">{NT_HEALTHY_LIVING.first}</span></li>
              <li className="flex gap-3"><span className="font-display text-2xl leading-none" style={{ color: '#C45C3E' }}>2</span><span className="font-semibold">{NT_HEALTHY_LIVING.second}</span></li>
            </ol>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{NT_HEALTHY_LIVING.note}</p>
            <p className="mt-4 text-sm leading-relaxed"><strong>{NT_PROGRAM.headline}</strong> {NT_PROGRAM.target}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{NT_PROGRAM.progress}</p>
            <p className="mt-2 text-sm leading-relaxed">{NT_PROGRAM.addressable}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{NT_PROGRAM.dispute}</p>
          </div>
        </div>

        <h3 className="mt-6 text-sm font-semibold">What is already being bought, and by whom</h3>
        <div className="mt-2 space-y-3">
          {NT_BENCHMARKS.map((b) => (
            <div key={b.what} className="rounded-lg border p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{b.what}</p>
                {b.aboriginalOwned !== null && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={b.aboriginalOwned ? { backgroundColor: '#E6EDDD', color: '#4F6138' } : { backgroundColor: '#EEE9E3', color: '#6A5E54' }}
                  >
                    {b.aboriginalOwned ? 'Aboriginal enterprise' : 'not Aboriginal owned'}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.detail}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{b.source}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold">Who to call. Nobody here has been approached.</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {NT_CONTACTS.map((c) => (
            <div key={c.who} className="rounded-lg border p-5">
              <p className="font-semibold">{c.who}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.role}</p>
              <p className="mt-2 text-sm font-medium">{c.contact}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.why}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-destructive">A claim we use that could not be sourced</p>
          <p className="mt-2 text-sm leading-relaxed">&ldquo;{NT_UNSOURCED.claim}&rdquo;</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">In {NT_UNSOURCED.where} {NT_UNSOURCED.finding}</p>
          <p className="mt-2 text-sm font-semibold">{NT_UNSOURCED.action}</p>
        </div>
      </section>

      {/* The pathway. */}
      <section className="mt-10 mb-16">
        <h2 className="font-display text-2xl">What has to be true for a community organisation to sell one</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {SELLER_PATHWAY.map((s, i) => (
            <div key={s.step} className="rounded-lg border p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={s.state === 'started' ? { backgroundColor: '#F6E4DE', color: '#9A4023' } : { backgroundColor: '#EEE9E3', color: '#6A5E54' }}
                >
                  {s.state === 'started' ? 'started' : 'nothing yet'}
                </span>
              </div>
              <p className="mt-2 font-semibold leading-snug">{s.step}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
