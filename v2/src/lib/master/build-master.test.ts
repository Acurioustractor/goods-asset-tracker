/**
 * Guards for the master, and its build. With MASTER_BUILD=1 the test also writes
 * deliverables/master/goods-master.html, which is what gets published as the artifact.
 */

import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DECK } from '@/lib/data/deck-master';
import { FORM_GROUPS } from '@/lib/data/qbe-form';
import { FUNDING_LINES } from '@/lib/data/grants';
import { CHAPTERS } from '@/lib/data/story-spine';
import { REGISTER } from '@/lib/data/artifact-register';
import { answerFor, buildMaster, harvestNaming, md } from './build-master';

describe('the form groups', () => {
  it('cover all 25 questions once', () => {
    const all = FORM_GROUPS.flatMap((g) => g.questions).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
    expect(all).toEqual(Array.from({ length: 25 }, (_, i) => `Q${i + 1}`));
  });
  it('name only deck slides that exist', () => {
    const ids = new Set(DECK.map((s) => s.id));
    for (const g of FORM_GROUPS) for (const s of g.slides) expect(ids.has(s), `${g.id} → ${s}`).toBe(true);
  });
  it('carry an answer heading only for written or draft answers', () => {
    for (const g of FORM_GROUPS) {
      if (g.answerKey) expect(['written', 'document-owed'].includes(g.state), g.id).toBe(true);
      if (g.state === 'written') expect(g.answerKey, g.id).toBeTruthy();
    }
  });
});

describe('the deck and the chapters', () => {
  it('every slide is fed by exactly one chapter', () => {
    for (const s of DECK) {
      const feeders = CHAPTERS.filter((c) => c.slides.includes(s.id));
      expect(feeders.length, s.id).toBe(1);
    }
  });
});

describe('the funding lines and the register', () => {
  it('never say Witta, and never count one funder against two jobs', () => {
    for (const f of FUNDING_LINES) {
      expect(`${f.buys} ${f.state} ${f.condition ?? ''}`).not.toMatch(/witta/i);
    }
    const jobs = FUNDING_LINES.map((f) => f.buys.toLowerCase());
    expect(jobs.filter((j) => j.includes('organisation: operating')).length).toBe(0);
    expect(jobs.filter((j) => j.includes('133 beds')).length).toBeGreaterThanOrEqual(3);
  });
  it('give every surface a verdict and every living one a job', () => {
    for (const r of REGISTER) {
      expect(['living', 'absorbed', 'reference', 'retired', 'other project']).toContain(r.verdict);
      if (r.verdict === 'living') expect(r.job.length).toBeGreaterThan(20);
    }
  });
});

describe('the renderer', () => {
  it('turns a small markdown answer into paragraphs, tables and lists', () => {
    const html = md('Line one.\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- one\n- two\n\n**bold** and `code`');
    expect(html).toContain('<p>Line one.</p>');
    expect(html).toContain('<table>');
    expect(html).toContain('<ul><li>one</li><li>two</li></ul>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<code>code</code>');
  });
  it('slices an answer by its heading and stops at the next', () => {
    const text = '## Q5. Amount\n\n`300000`\n\n---\n\n## Q6. Use\n\nText.\n';
    expect(answerFor('Q5', text)).toBe('`300000`');
    expect(answerFor('Q6', text)).toBe('Text.');
    expect(answerFor('Q7', text)).toBeNull();
  });
});

describe('the master', () => {
  it('reads Witta as The Harvest Plant', () => {
    expect(harvestNaming('pressed at Witta and our Witta facility, Witta.')).toBe('pressed at The Harvest Plant and our facility at The Harvest Plant, The Harvest Plant.');
  });
  it('builds every written answer into the page, and the answers never say Witta', () => {
    const html = buildMaster();
    expect(html.length).toBeGreaterThan(80_000);
    const qbeScreen = html.slice(html.indexOf('id="s-qbe"'), html.indexOf('id="s-grants"'));
    expect(qbeScreen).not.toMatch(/\bWitta\b(?! this page says)/);
    for (const g of FORM_GROUPS.filter((x) => x.state === 'written')) {
      expect(html, g.id).toContain(`id="q-${g.id}"`);
      expect(html, g.id).not.toContain(`No answer text yet. The state above says what has to happen first.</p>\n        </div>\n        <aside>\n          <h3>Files it needs</h3><ul class="plain small"><li>${g.files[0] ?? '__none__'}`);
    }
    if (process.env.MASTER_BUILD) {
      const dir = path.resolve(process.cwd(), '..', 'deliverables', 'master');
      mkdirSync(dir, { recursive: true });
      const out = path.join(dir, 'goods-master.html');
      writeFileSync(out, html);
      console.log(`master written: ${out} (${(html.length / 1024).toFixed(0)} KB)`);
    }
  });
});
