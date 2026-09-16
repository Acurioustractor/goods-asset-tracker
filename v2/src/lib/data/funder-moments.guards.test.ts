/**
 * Funder moments are a claim about money AND a consent decision, so both are tested.
 *
 * The community `Voice` path gates on tier `external`; this path gates on tier `funder`. Two
 * gates in opposite directions is only safe while nothing can cross between them, which is
 * what the tier tests below assert. Georgina Byron's registry record says she must never
 * appear in the community storyteller set, and a future edit that swapped a slug here for a
 * community one would do exactly that, silently, with a funder's label attached.
 *
 * Photo consent is checked in `content_items` (consent_tier), which these offline tests
 * cannot reach. `snow-tennant-creek-april-2025.jpg` was verified `public` there on
 * 2026-09-16. Any new photo added here needs the same check before it ships.
 */

import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { FUNDER_MOMENTS, grantLineFor } from '@/lib/data/funder-moments';
import { GRANTS_RECEIVED } from '@/lib/data/grants-received';
import { getStorytellerBySlug } from '@/lib/data/storyteller-registry';
import { PARTNER_DASHBOARDS } from '@/lib/data/partner-dashboards';
import { snowConfig } from '@/lib/funders/configs/snow';

/**
 * The graduation story, in the words it actually reaches for. Ben, 2026-09-16.
 * Shared by both tests below so the ruling has one definition, not one per file.
 */
const GRADUATION = /stands? on (its|their) own|no longer needs?|graduat|proven now|we have outgrown/i;
import { storyStops } from '@/lib/data/story-road';

describe('funder moments', () => {
  it('each one names a funder with a line in the books', () => {
    for (const m of FUNDER_MOMENTS) {
      expect(
        GRANTS_RECEIVED.map((g) => g.funder),
        `${m.label} has no line in grants-received.ts, so its money claim has no source`,
      ).toContain(m.grantFunder);
      expect(grantLineFor(m)?.amountAud).toBeGreaterThan(0);
    }
  });

  it('each one attaches to a real road stop', () => {
    const stopIds = new Set(storyStops.map((s) => s.id));
    for (const m of FUNDER_MOMENTS) {
      expect(stopIds, `${m.label} points at a stop that does not exist: ${m.stopId}`).toContain(m.stopId);
    }
  });

  it('never routes a community voice through the funder path', () => {
    for (const m of FUNDER_MOMENTS) {
      if (!m.voice) continue;
      const person = getStorytellerBySlug(m.voice.slug);
      expect(person, `${m.voice.slug} is not in the registry`).toBeTruthy();
      expect(
        person!.tier,
        `${person!.name} is tier ${person!.tier}. Only a funder may render here; a community voice belongs in the Voice component with its own label.`,
      ).toBe('funder');
    }
  });

  it('never routes a funder through the community voice path either', () => {
    // The mirror of the test above. `producedVoice` renders through the community Voice
    // component, which prints "name · role · community". A funder in that slot would be
    // filed among the people Goods serves, which is the exact thing the registry forbids.
    for (const m of FUNDER_MOMENTS) {
      if (!m.producedVoice) continue;
      const person = getStorytellerBySlug(m.producedVoice.slug);
      expect(person, `${m.producedVoice.slug} is not in the registry`).toBeTruthy();
      expect(
        person!.tier,
        `${person!.name} is tier ${person!.tier}. Only an external community voice may render here.`,
      ).toBe('external');

      const matches = person!.quotes.filter((q) => q.text.includes(m.producedVoice!.quoteContains));
      expect(matches, `no quote of ${person!.name} contains "${m.producedVoice.quoteContains}"`).toHaveLength(1);
      expect(['primary', 'approved']).toContain(matches[0].status);
    }
  });

  it('prints an approved quote, matched on its own words', () => {
    for (const m of FUNDER_MOMENTS) {
      if (!m.voice) continue;
      const person = getStorytellerBySlug(m.voice.slug)!;
      const matches = person.quotes.filter((q) => q.text.includes(m.voice!.quoteContains));

      expect(matches, `no quote of ${person.name} contains "${m.voice.quoteContains}"`).toHaveLength(1);
      expect(
        matches[0].status,
        `the quote matched for ${person.name} is status ${matches[0].status}. Only approved prints.`,
      ).toBe('approved');
    }
  });

  it('every photo and logo actually exists', () => {
    for (const m of FUNDER_MOMENTS) {
      for (const rel of [m.logo.src, m.photo?.src].filter(Boolean) as string[]) {
        expect(existsSync(join(process.cwd(), 'public', rel)), `missing asset: ${rel}`).toBe(true);
      }
    }
  });

  it('does not claim philanthropy is finished', () => {
    // Ben, 2026-09-16: catalytic capital and backing the founder, never a graduation story.
    // Snow's most recent invoice is May 2026 and there is an open raise on the same page.
    for (const m of FUNDER_MOMENTS) {
      expect(GRADUATION.test(m.line), `${m.label}'s line retires the funder in the sentence that thanks them`).toBe(false);
    }
  });

  /**
   * The guard above only ever read funder-moments.ts, and on 2026-09-16 the graduation story
   * it bans was sitting untouched two files away, on the gated page Snow themselves read:
   * partner-dashboards.ts said "The idea is proven now" and "built to stand on its own".
   * A rule that checks one file is not a rule, so the ruling is now applied to every surface
   * that speaks to a funder.
   */
  it('no funder-facing surface carries a graduation story', () => {
    const surfaces: { where: string; text: string }[] = [];

    for (const d of PARTNER_DASHBOARDS) {
      if (!d.nextChapter) continue;
      surfaces.push({ where: `${d.slug} nextChapter.intro`, text: d.nextChapter.intro });
      surfaces.push({ where: `${d.slug} nextChapter.invitation.body`, text: d.nextChapter.invitation.body });
      for (const a of d.nextChapter.arc) surfaces.push({ where: `${d.slug} arc "${a.stage}"`, text: a.meaning });
      surfaces.push({ where: `${d.slug} thankYou`, text: JSON.stringify(d.funderImpact ?? {}) });
    }

    for (const cfg of [snowConfig]) {
      surfaces.push({ where: `${cfg.slug} funder report`, text: JSON.stringify(cfg) });
    }

    for (const s of surfaces) {
      const hit = s.text.match(GRADUATION);
      expect(hit?.[0], `${s.where} retires philanthropy: "${hit?.[0] ?? ''}"`).toBeUndefined();
    }
  });
});
