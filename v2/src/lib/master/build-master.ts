/**
 * THE MASTER: one page, ten screens, built from the repo data so nothing on it is retyped.
 *
 * Screens: start here, about us, the model, the deck, the QBE application, the other grants, the
 * questions, the numbers, the blockers, the register. The output is one self-contained HTML file
 * (deliverables/master/goods-master.html) published as a Claude artifact. Rebuild it whenever a
 * data module changes: MASTER_BUILD=1 npx vitest run src/lib/master/build-master.test.ts
 *
 * Sources it reads at build time: the QBE answers text (deliverables/master/sources/
 * qbe-answers-2026-09-10.md, revised 12 September) and the placemat export
 * (deliverables/master/placemat-2026-09-14.png). Everything else is a typed module.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { REGISTER, type Verdict } from '@/lib/data/artifact-register';
import { BLOCKERS } from '@/lib/data/blockers';
import { DECK, DECK_FILE, DECK_OPEN, DECK_UPDATED } from '@/lib/data/deck-master';
import { deckSlides } from '@/lib/data/deck';
import { goodsBoard } from '@/lib/data/goods-board';
import { FACILITATION_RULING, FUNDING_LINES, LADDER, MONEY_POSITION } from '@/lib/data/grants';
import { BED, PANELS, RAISE, SHEET, aud, audRange } from '@/lib/data/model-placemat';
import { DECISIVE_QUESTIONS, FORM_GROUPS, FORM_STATE_LABEL, FORM_WORK_LEFT, QBE_CLOSES, QBE_KEY_DATES, type FormState } from '@/lib/data/qbe-form';
import { PAID_BEDS, QUESTIONS, QUESTIONS_OPEN_COUNT } from '@/lib/data/story-questions';
import { DEFY_PANEL_INVOICES, PANELS_BOUGHT, PANELS_EX_GST_AUD, PANELS_INC_GST_AUD, PANEL_NET_UNIT_AUD, SHRED_NOTE } from '@/lib/data/supply-buys';
import { CHAPTERS, GATES, MAKE_STEPS, MODEL_STEPS, MONEY_LANES, PROBLEM_FIGURES, REQUEST, STORY_UPDATED, chapter } from '@/lib/data/story-spine';
import { TWO_LOOPS_SVG } from './drawings';

export const MASTER_BUILT = '2026-09-14';
/** Five invoices, four organisations, settled (demand-and-buyers.ts on the finance branch, read 11 September). */
export const PAID_TRADE_AUD = 273_966;

const ROOT = path.resolve(process.cwd(), '..');
const SOURCES = path.join(ROOT, 'deliverables', 'master', 'sources');

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

/** A small markdown renderer: headings, paragraphs, tables, lists, quotes, bold, code. Enough for the answers. */
export function md(src: string): string {
  const lines = src.replace(/\r/g, '').split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: { kind: 'ul' | 'ol'; items: string[] } | null = null;
  let table: string[][] | null = null;
  let quote: string[] = [];
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.kind}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.kind}>`);
    list = null;
  };
  const flushTable = () => {
    if (table && table.length) {
      const [head, ...rows] = table;
      out.push(
        `<div class="tblwrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td class="${/^[\s$0-9,.%kgt]+$/.test(c) && c.trim() ? 'n' : ''}">${inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table></div>`,
      );
    }
    table = null;
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushTable();
    flushQuote();
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*$/.test(line)) {
      flushAll();
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushAll();
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushAll();
      const level = Math.min(h[1].length + 2, 5);
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }
    if (line.startsWith('|')) {
      flushPara();
      flushList();
      flushQuote();
      if (/^\|\s*-+/.test(line)) continue;
      const cells = line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim());
      (table ??= []).push(cells);
      continue;
    }
    if (line.startsWith('> ')) {
      flushPara();
      flushList();
      flushTable();
      quote.push(line.slice(2));
      continue;
    }
    const li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      flushPara();
      flushTable();
      flushQuote();
      const kind = /\d/.test(li[2]) ? 'ol' : 'ul';
      if (!list || list.kind !== kind) {
        flushList();
        list = { kind, items: [] };
      }
      list.items.push(li[3]);
      continue;
    }
    if (list && /^\s{2,}\S/.test(raw)) {
      list.items[list.items.length - 1] += ' ' + line.trim();
      continue;
    }
    flushList();
    flushTable();
    flushQuote();
    para.push(line.trim());
  }
  flushAll();
  return out.join('\n');
}

/** The answer text for one form question, sliced from the answers file by its heading. */
export function answerFor(key: string, text: string): string | null {
  const re = new RegExp(`^## ${key}\\. [^\\n]*\\n`, 'm');
  const m = re.exec(text);
  if (!m) return null;
  const start = m.index + m[0].length;
  const rest = text.slice(start);
  const next = rest.search(/^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).replace(/\n-{3,}\s*$/m, '').trim();
}

/**
 * The answers file still says Witta in five places. The maker is The Harvest Plant on every
 * surface (ruling, 13 September), so the master reads it that way and says so. The sweep of the
 * source file itself is on the work list.
 */
export function harvestNaming(text: string): string {
  return text.replace(/\bour Witta facility\b/g, 'our facility at The Harvest Plant').replace(/\bat Witta\b/g, 'at The Harvest Plant').replace(/\bWitta\b/g, 'The Harvest Plant');
}

function readSource(name: string): string {
  const p = path.join(SOURCES, name);
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
}

function placematDataUri(): string | null {
  const p = path.join(ROOT, 'deliverables', 'master', 'placemat-2026-09-14.png');
  if (!existsSync(p)) return null;
  return `data:image/png;base64,${readFileSync(p).toString('base64')}`;
}

const STATE_CLASS: Record<FormState, string> = {
  written: 'ok',
  'ready-pending-check': 'ready',
  'document-owed': 'doc',
  person: 'person',
  blocked: 'bad',
};

function chip(cls: string, label: string): string {
  return `<span class="chip ${cls}">${esc(label)}</span>`;
}

function n(x: number): string {
  return x.toLocaleString('en-AU');
}

// ---------------------------------------------------------------------------
// Screens

function screenStart(): string {
  const crux = chapter('crux');
  const counts = FORM_GROUPS.reduce<Record<FormState, number>>(
    (acc, g) => ((acc[g.state] += 1), acc),
    { written: 0, 'ready-pending-check': 0, 'document-owed': 0, person: 0, blocked: 0 },
  );
  return `
  <header class="mast">
    <p class="eyebrow">Goods on Country · the master · built ${MASTER_BUILT}</p>
    <h1>${esc(crux.title)}</h1>
    <p class="stand">${esc(crux.lines[0])}</p>
  </header>

  <div class="grid g2">
    <div class="card">
      <h2>What is true today, and checkable</h2>
      <table class="kv">
        <tr><td>Beds deployed</td><td class="n">${n(CANONICAL_ASSETS.bedsDeployed)} across ${CANONICAL_ASSETS.communitiesServed} communities</td></tr>
        <tr><td>Beds bought and paid for</td><td class="n">${n(PAID_BEDS)} by four organisations, ${aud(PAID_TRADE_AUD)}</td></tr>
        <tr><td>Made end to end at our own facility</td><td class="n">40, pressed at The Harvest and assembled at Gamardi</td></tr>
        <tr><td>Washing machines in community</td><td class="n">${CANONICAL_ASSETS.washersInCommunity}</td></tr>
        <tr><td>Community enterprises trading</td><td class="n"><strong>0.</strong> That is what this year changes</td></tr>
        <tr><td>Signed</td><td class="n"><strong>${aud(RAISE.signedAud)}</strong></td></tr>
      </table>
      <p class="small">Every bed figure is from the register (asset-canonical.ts); the paid trade is five invoices to four organisations. We do not have a demand number and do not claim one.</p>
    </div>
    <div class="card">
      <h2>The raise, in one line each</h2>
      <table class="kv">
        ${FUNDING_LINES.map((f) => `<tr><td><strong>${esc(f.funder)}</strong><br><span class="small">${esc(f.due)}</span></td><td class="n">${esc(f.amount)}<br><span class="small">${esc(f.instrument)}</span></td></tr>`).join('')}
      </table>
      <p class="small">QBE buys plants. Tim Fairfax buys the organisation. Brian M. Davis buys beds. SEFA lends. One funder is never counted against two jobs. ${esc(FACILITATION_RULING)}</p>
    </div>
  </div>

  <div class="grid g3">
    <div class="card">
      <h2>The QBE form</h2>
      <p class="big">${counts.written} <span class="small">written and checker-clean of 21 groups</span></p>
      <p class="small">${counts['ready-pending-check']} ready pending a check · ${counts['document-owed']} owed a document · ${counts.person} only a person can answer · ${counts.blocked} blocked. Closes ${esc(QBE_CLOSES)}.</p>
      <p><a href="#qbe">Open the application →</a></p>
    </div>
    <div class="card">
      <h2>The money position</h2>
      <p class="big">${aud(MONEY_POSITION.securedAud)} <span class="small">secured</span></p>
      <p class="small">Core year-one lines ${aud(MONEY_POSITION.coreLinesAud)}; ${aud(MONEY_POSITION.withSnowAud)} with the unsent Snow option. Legacy year cost ${aud(MONEY_POSITION.yearNeedsAud)}; legacy gap ${aud(MONEY_POSITION.gapSnowOffAud)} with Snow off, ${aud(MONEY_POSITION.gapSnowOnAud)} on. Recalculate on the flat-pack route before using as evidence.</p>
      <p><a href="#numbers">The numbers →</a></p>
    </div>
    <div class="card">
      <h2>What is blocking what</h2>
      <p class="big">${BLOCKERS.length} <span class="small">blockers with an owner</span></p>
      <p class="small">The accountant’s letter, Butterfly’s constitution and the entity transition sit at the top. ${FORM_WORK_LEFT.length} QBE items left, in the order they unblock the most.</p>
      <p><a href="#blockers">The blockers →</a></p>
    </div>
  </div>

  <div class="card">
    <h2>The places to come back to</h2>
    <ul class="links">
      ${REGISTER.filter((r) => r.verdict === 'living')
        .map((r) => `<li><strong>${esc(r.title)}</strong>${r.url ? ` · <a href="${esc(r.url)}" target="_blank" rel="noreferrer">open</a>` : ''}<br><span class="small">${esc(r.job)}</span></li>`)
        .join('')}
    </ul>
  </div>`;
}

function screenAbout(): string {
  const method = chapter('method');
  const road = deckSlides.filter((s) => s.kind === 'stop');
  return `
  <h1>About us</h1>
  <div class="grid g2">
    <div class="card">
      <h2>The entity</h2>
      <p><strong>The Butterfly Movement Ltd, trading as Goods on Country.</strong> ABN 22 155 132 684, ACN 155 132 684. A registered charity since 2012 with deductible gift status. Since 28 August 2026 everything sits there: the products, the IP, the contracts, the making, the sales, the money and the evidence (ruling X). It applies and receives (ruling AA, 5 September). On 12 September Ben ruled one entity, with the name changing to Goods on Country; filings and the asset transfer are open.</p>
      <p>A Curious Tractor Pty Ltd is related through the founders, was the operating home for parts of the work, and does the research and development. A Kind Tractor Ltd is dormant. Part of the trading history sits in a founder’s sole-trader ledger, being carved out by Standard Ledger. Community partners are independent organisations with their own boards, never part of the charity.</p>
      <p><strong>Team.</strong> Nic Marchesi runs production, supply and the plant build. Ben Knight runs the model, the money and the funder relationships.</p>
    </div>
    <div class="card">
      <h2>How Goods works</h2>
      <p class="lead">${esc(method.title)}</p>
      <p>${esc(method.lines[0])}</p>
      <h3>Who holds the work</h3>
      <ul class="plain">
        ${goodsBoard.map((d) => `<li><strong>${esc(d.name)}</strong>, ${esc(d.role)} · ${esc(d.country)}<br><span class="small">${esc(d.goods)}</span></li>`).join('')}
      </ul>
      <p class="small">The board handover is in progress and no chair is appointed. Ownership of the making is a pathway, tested at month six by four questions: who holds the keys, who runs the payroll, who invoices the buyer, and whether the community decides what gets made and who works on it.</p>
    </div>
  </div>
  <div class="card">
    <h2>The road</h2>
    <p class="lead">${esc(chapter('road').title)}</p>
    <ol class="stops">
      ${road.map((s) => `<li><strong>${esc(s.headline)}</strong><br><span class="small">${esc(s.place ?? '')}</span></li>`).join('')}
    </ol>
  </div>
  <div class="card">
    <h2>What we make</h2>
    <p class="lead">${esc(chapter('make').title)}</p>
    <p>${esc(chapter('make').lines[0])}</p>
    <ol class="inline">${MAKE_STEPS.map((s) => `<li>${esc(s.title)}</li>`).join('')}</ol>
    <p class="small">The Stretch Bed is the only product for direct sale. Pakkimjalki Kari, the washing machine named in Warumungu by Elder Dianne Stokes, is at prototype stage. The Basket Bed is discontinued and its design is being open-sourced.</p>
  </div>`;
}

function screenModel(png: string | null): string {
  return `
  <h1>The model</h1>
  <p class="lead">${esc(SHEET.subtitle)}</p>
  ${png ? `<figure class="sheet"><img src="${png}" alt="The whole model on one sheet: the raise, the trade around one dark centre, the four panels and the support band"><figcaption>The placemat, exported ${MASTER_BUILT} from /admin/model. Feeds deck slide S13. The words are Ben’s eight lines, awaiting his markup.</figcaption></figure>` : '<p class="warn">Placemat export missing.</p>'}
  <div class="grid g2">
    <div class="card">
      <h2>The eight lines</h2>
      <ol class="plain">${MODEL_STEPS.map((s) => `<li><strong>${esc(s.title)}</strong>${s.line ? ` <span class="small">${esc(s.line)}</span>` : ''}</li>`).join('')}</ol>
      <p class="small">Centre of the loop: “${esc(SHEET.centre)}”, unconfirmed as the title.</p>
    </div>
    <div class="card">
      <h2>What every bed carries, and how it is measured</h2>
      <ul class="plain">${PANELS.map((p) => `<li><strong>${esc(p.title)}.</strong> ${esc(p.line)}</li>`).join('')}</ul>
      <p class="small">One of four is counted today (a person off the floor, from the register). Paid making and plastic are modelled; money kept in community is a settled rule with no enterprise trading against it yet. Health carries no number, deliberately.</p>
    </div>
  </div>
  <div class="card">
    <h2>Where the money stops</h2>
    <p class="small">Two loops, and they never join. Beds cross one way; money does not cross back. Figures are the 11 September money, legacy pending the flat-pack route costing.</p>
    <div class="fig">${TWO_LOOPS_SVG}</div>
  </div>
  <div class="card">
    <h2>Capital has three jobs</h2>
    <p>Plants, first stock, the organisation. QBE’s ${aud(RAISE.qbeAud)} builds two plants and nothing else. Other philanthropy buys the first ${RAISE.bedsYearOne} beds at the bed price, and ${esc(FACILITATION_RULING.toLowerCase().replace(/^every/, 'every'))} Tim Fairfax’s invitation runs the organisation and never buys beds. Buyer receipts stay with the community organisation and never return to Goods.</p>
    <p class="small">The capital drawing from The Model artifact is not carried here: it drew facilitation as a separate A$40,000 line, which the 14 September ruling folds into the bed price, and its year arithmetic is legacy pending the flat-pack route costing. The three-year making drawing was withdrawn with the 12 September route.</p>
  </div>
  <div class="card">
    <h2>What never appears on a Goods surface</h2>
    <ul class="plain">
      <li>A drawn bed, a drawn person, an icon glyph, a house, a truck, a coin, a heart, a tractor. Photographs carry people and the bed; the only drawing is the kit container.</li>
      <li>A demand total. Demand is presented as acts: paid, money named, an organisation asked, a person asked, raised in a meeting.</li>
      <li>A health outcome. Scabies and rheumatic heart disease are the reason, never a claimed result.</li>
      <li>Community receipts flowing back to Goods, or matching, doubling or guaranteeing language about any grant.</li>
      <li>Witta. The maker is The Harvest Plant.</li>
    </ul>
  </div>`;
}

function screenDeck(): string {
  return `
  <h1>The deck</h1>
  <p class="lead">Nineteen slides in the deck master’s order, ${DECK_UPDATED}. ${esc(DECK_FILE)}.</p>
  <div class="tblwrap"><table class="deck">
    <thead><tr><th>Slide</th><th>Say it simply</th><th>Visual</th><th>Story chapter</th><th>On the pitch</th><th>QBE answers it carries</th></tr></thead>
    <tbody>
    ${DECK.map((s) => {
      const ch = CHAPTERS.find((c) => c.slides.includes(s.id));
      const qs = FORM_GROUPS.filter((g) => g.slides.includes(s.id)).map((g) => g.id);
      return `<tr>
        <td><strong>${s.id}</strong> · ${esc(s.name)}<br><span class="small">${esc(s.job)}</span><br><span class="small">Now: “${esc(s.currentTitle)}”</span></td>
        <td>${esc(s.say)}${s.note ? `<br><span class="small">${esc(s.note)}</span>` : ''}${s.voices ? `<br><span class="small">Voices: ${esc(s.voices)}</span>` : ''}</td>
        <td class="small">${esc(s.visual)}</td>
        <td class="small">${ch ? `${ch.number} · ${esc(ch.label)}` : ''}</td>
        <td class="small"><a href="http://localhost:3007/pitch${esc(s.home)}">${esc(s.home)}</a></td>
        <td class="small">${qs.join(', ')}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div>
  <div class="card">
    <h2>Three decisions still open on the deck</h2>
    <ul class="plain">${DECK_OPEN.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    <p class="small">Slides get built one at a time, copy first in Notion, Pencil second, with every figure graded before it prints. Slides 13 to 19 are cut from the story chapters.</p>
  </div>`;
}

function screenQbe(answers: string, drafts: string): string {
  return `
  <h1>The QBE application</h1>
  <p class="lead">Twenty-five questions in twenty-one groups, as the opportunity record states them on 13 September. Closes ${esc(QBE_CLOSES)}. The applicant is The Butterfly Movement Ltd, trading as Goods on Country.</p>
  <div class="grid g3">
    <div class="card"><h2>Decisive</h2><p class="small">The program’s own weighting: ${DECISIVE_QUESTIONS.join(', ')} carry most of the decision. Leverage is answered as a sequence with a condition on every link, never as a multiplier.</p></div>
    <div class="card"><h2>Key dates</h2><table class="kv">${QBE_KEY_DATES.map((d) => `<tr><td>${esc(d.when)}</td><td>${esc(d.what)}</td></tr>`).join('')}</table></div>
    <div class="card"><h2>What is left, in order</h2><ol class="plain small">${FORM_WORK_LEFT.map((w) => `<li><strong>${esc(w.what)}</strong> · ${esc(w.who)} · unblocks ${esc(w.unblocks)}</li>`).join('')}</ol></div>
  </div>
  <p class="small">Written answers are the file deliverables/master/sources/qbe-answers-2026-09-10.md, revised 12 September, rendered as written, with one substitution: where that file says Witta this page says The Harvest Plant, per the 13 September ruling. The groups that had no text on 13 September carry drafts from qbe-answers-drafts-2026-09-14.md, marked as drafts. Working notes for Ben and Nic are not on this page.</p>
  <div class="idx">${FORM_GROUPS.map((g) => `<a href="#q-${g.id}"><span class="q">${g.id}</span> ${esc(g.asks)} ${chip(STATE_CLASS[g.state], FORM_STATE_LABEL[g.state])}</a>`).join('')}</div>
  ${FORM_GROUPS.map((g) => {
    const raw = g.answerKey ? answerFor(g.answerKey, answers) : null;
    const draft = raw ? null : answerFor(g.id, drafts);
    const text = raw ? harvestNaming(raw) : draft;
    const draftNote = raw
      ? g.answerIsDraft
        ? '<p class="warn">Draft, owner Nic. Not ready to submit.</p>'
        : ''
      : draft
        ? '<p class="warn">Drafted 14 September from the rulings and the opportunity record, for Ben to read aloud. Bracketed items are his, Eloise’s or Nic’s to supply.</p>'
        : '';
    return `<article class="q" id="q-${g.id}">
      <header>
        <span class="qn">${g.id}</span>
        <h2>${esc(g.asks)}</h2>
        ${chip(STATE_CLASS[g.state], FORM_STATE_LABEL[g.state])}
        <span class="small">Owner: ${esc(g.owner)}${g.slides.length ? ` · Slides: ${g.slides.join(', ')}` : ''}</span>
      </header>
      <div class="qbody">
        <div class="answer">
          <p class="small"><strong>Really testing.</strong> ${esc(g.reallyTesting)}</p>
          ${g.stands ? `<p class="small"><strong>Where it stands.</strong> ${esc(g.stands)}</p>` : ''}
          ${text ? `<div class="md">${draftNote}${md(text)}</div>` : '<p class="notwritten">No answer text yet. The state above says what has to happen first.</p>'}
        </div>
        <aside>
          ${g.files.length ? `<h3>Files it needs</h3><ul class="plain small">${g.files.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        </aside>
      </div>
    </article>`;
  }).join('')}`;
}

function screenGrants(): string {
  return `
  <h1>The other grants, and how they fit</h1>
  <p class="lead">They are not interchangeable. QBE buys plants. Tim Fairfax buys the organisation. Brian M. Davis buys beds. SEFA lends. Treating them as one pool is what produced a $99,500 double count in September.</p>
  <p class="warn">${esc(FACILITATION_RULING)} The finance model, the live sheet and the Brian M. Davis budget still carry a separate A$40,000 facilitation line across four communities; they are re-cut to the ruling.</p>
  ${FUNDING_LINES.map((f) => `<article class="card">
    <h2>${esc(f.funder)} <span class="chip ready">${esc(f.instrument)}</span></h2>
    <table class="kv">
      <tr><td>Amount</td><td>${esc(f.amount)}</td></tr>
      <tr><td>Buys</td><td>${esc(f.buys)}</td></tr>
      <tr><td>Due</td><td>${esc(f.due)}</td></tr>
      <tr><td>State</td><td>${esc(f.state)}</td></tr>
      ${f.condition ? `<tr><td>Condition</td><td>${esc(f.condition)}</td></tr>` : ''}
      ${f.decides ? `<tr><td>Decides</td><td>${esc(f.decides)}</td></tr>` : ''}
      <tr><td>Needs</td><td>${f.needs.map(esc).join(' · ')}</td></tr>
      <tr><td>Reuses</td><td>${f.reuses.map(esc).join(' · ')}</td></tr>
      <tr><td>Owner</td><td>${esc(f.owner)}${f.notion ? ` · <a href="https://app.notion.com/p/${f.notion}" target="_blank" rel="noreferrer">Notion page</a>` : ''}${f.artifact ? ` · <a href="${esc(f.artifact)}" target="_blank" rel="noreferrer">artifact</a>` : ''}</td></tr>
    </table>
  </article>`).join('')}
  <div class="card">
    <h2>The ladder, for a funder we have not met</h2>
    <p class="small">Every rung is a real unit with a real price. Nothing is a share of a total.</p>
    <ol class="inline">${LADDER.map((l) => `<li><strong>${esc(l.amount)}</strong> ${esc(l.buys)}</li>`).join('')}</ol>
  </div>`;
}

function screenQuestions(): string {
  return `
  <h1>Questions people ask us</h1>
  <p class="lead">${esc(chapter('questions').lines[0])} ${QUESTIONS.length} questions, ${QUESTIONS_OPEN_COUNT} open or partly answered. Ben reads these aloud before they ship.</p>
  <dl class="faq">
    ${QUESTIONS.map((q) => `<div class="faqi"><dt>${esc(q.question)} ${q.status !== 'answered' ? chip(q.status === 'open' ? 'bad' : 'doc', q.status) : ''}</dt><dd>${q.answer ? esc(q.answer) : '<span class="warn">Open. We do not yet have an answer we would say out loud.</span>'}<br><span class="small">Asked by ${esc(q.askedBy)}, ${esc(q.asked)}. Source: ${esc(q.source)}.${q.since ? ` Since 14 September: ${esc(q.since)}` : ''}</span></dd></div>`).join('')}
  </dl>`;
}

function screenNumbers(): string {
  return `
  <h1>The numbers</h1>
  <div class="grid g2">
    <div class="card">
      <h2>The raise</h2>
      <table class="kv">
        <tr><td>QBE</td><td class="n">${aud(RAISE.qbeAud)} · ${esc(RAISE.qbeFor)}</td></tr>
        <tr><td>Other philanthropy</td><td class="n">${audRange(RAISE.otherLowAud, RAISE.otherHighAud)} · ${esc(RAISE.otherFor)}</td></tr>
        <tr><td>Total</td><td class="n">${audRange(RAISE.totalLowAud, RAISE.totalHighAud)}</td></tr>
        <tr><td>Signed</td><td class="n">${aud(RAISE.signedAud)}</td></tr>
        <tr><td>First stock</td><td class="n">${RAISE.bedsYearOne} beds, ${RAISE.bedsEach} to each of ${RAISE.communityOrganisations} community organisations</td></tr>
      </table>
    </div>
    <div class="card">
      <h2>One bed, the price model</h2>
      <table class="kv">
        <tr><td>Sells for</td><td class="n">${aud(BED.priceAud)}</td></tr>
        <tr><td>Costs to make</td><td class="n">${aud(BED.makeAud)}${BED.makeIsProvisional ? ' provisional' : ''}</td></tr>
        <tr><td>Stays with the community organisation</td><td class="n">${aud(BED.staysAud)}, freight paid by the buyer</td></tr>
        <tr><td>Freight, shown beside the bed</td><td class="n">${aud(BED.freightAud)}</td></tr>
        <tr><td>Paid making inside the make cost</td><td class="n">$80, about two hours, modelled</td></tr>
      </table>
      <p class="small">A price model, never cost-plus. The make cost is provisional on the flat-pack route until the bought leg-panel yield is confirmed. Never print a gap that includes running costs, and never divide the organisation by beds alone. ${esc(FACILITATION_RULING)} What that does to the ${aud(BED.staysAud)} on a first-stock bed is for the finance model to recompute.</p>
    </div>
  </div>
  <div class="grid g2">
    <div class="card">
      <h2>The register and the trade</h2>
      <table class="kv">
        <tr><td>Beds deployed</td><td class="n">${n(CANONICAL_ASSETS.bedsDeployed)} · ${CANONICAL_ASSETS.stretchBedsDeployed} Stretch, ${CANONICAL_ASSETS.basketBedsDeployed} Basket</td></tr>
        <tr><td>Communities</td><td class="n">${CANONICAL_ASSETS.communitiesServed}</td></tr>
        <tr><td>Washing machines</td><td class="n">${CANONICAL_ASSETS.washersInCommunity}</td></tr>
        <tr><td>Plastic diverted</td><td class="n">${n(CANONICAL_ASSETS.plasticKg)} kg, 20 kg a bed, modelled</td></tr>
        <tr><td>Paid trade</td><td class="n">${PAID_BEDS} beds, five invoices, four organisations, ${aud(PAID_TRADE_AUD)}</td></tr>
        <tr><td>Centrecorp</td><td class="n">167 bought and paid for, 147 in households, 20 waiting (ruling AC). Never counted as demand.</td></tr>
      </table>
    </div>
    <div class="card">
      <h2>The line at The Harvest, flat-pack route</h2>
      <table class="kv">
        <tr><td>Kits a day</td><td class="n">6, tab-press-limited, modelled</td></tr>
        <tr><td>Kits a month</td><td class="n">96 on sixteen run days, modelled</td></tr>
        <tr><td>Kits a year</td><td class="n">1,152, modelled</td></tr>
        <tr><td>The first 400</td><td class="n">about four months and 6.0 tonnes of tab shred</td></tr>
        <tr><td>On the floor, 9 September</td><td class="n">81 cut plastic bed sets, provisional</td></tr>
      </table>
      <p class="small">Ben’s route ruling of 12 September, figures from the Q19 answer. The production log opened with no entries; the availability allowance is a planning assumption until it fills.</p>
    </div>
  </div>
  <div class="card">
    <h2>Leg panels bought, the press-against-panels decision closed</h2>
    <table class="kv">
      <tr><td>Panels</td><td class="n">${PANELS_BOUGHT} sheets of 19 mm recycled HDPE, 1200 × 2400 mm, cut to 800 × 1200</td></tr>
      <tr><td>Net sheet price</td><td class="n">${aud(PANEL_NET_UNIT_AUD)} after the 20% scale discount, before cutting and palletising</td></tr>
      <tr><td>Spent</td><td class="n">${aud(PANELS_EX_GST_AUD)} ex GST · ${aud(PANELS_INC_GST_AUD)} inc GST · both invoices paid</td></tr>
      ${DEFY_PANEL_INVOICES.map((inv) => `<tr><td>${esc(inv.id)}</td><td class="n">${inv.lines[0].qty} panels · issued ${esc(inv.issued)} · ${aud(inv.totalAud)} inc GST · paid ${esc(inv.paid)} · invoiced to ${esc(inv.invoicedTo)}</td></tr>`).join('')}
    </table>
    <p class="small">Opened at source 14 September: the two Defy PDFs. The quotes QU0494 and QU0495 are superseded. ${esc(SHRED_NOTE)} Still open: the leg-set yield per bought panel, which Nic holds and which fixes the A$276.</p>
  </div>
  <div class="card">
    <h2>The money position, ${esc(MONEY_POSITION.asAt)}</h2>
    <table class="kv">
      <tr><td>Legacy year cost</td><td class="n">${aud(MONEY_POSITION.yearNeedsAud)}</td></tr>
      <tr><td>Core year-one application and invitation lines</td><td class="n">${aud(MONEY_POSITION.coreLinesAud)}; ${aud(MONEY_POSITION.withSnowAud)} including the unsent Snow option</td></tr>
      <tr><td>Secured</td><td class="n">${aud(MONEY_POSITION.securedAud)}</td></tr>
      <tr><td>Legacy fixed-scope gap</td><td class="n">${aud(MONEY_POSITION.gapSnowOffAud)} with Snow off; ${aud(MONEY_POSITION.gapSnowOnAud)} with Snow on</td></tr>
      <tr><td>Beds of first stock unfunded</td><td class="n">${MONEY_POSITION.bedsUnfunded} if Snow funds 133; 320 otherwise</td></tr>
    </table>
    <p class="warn">${esc(MONEY_POSITION.caveat)}</p>
  </div>
  <div class="card">
    <h2>The four figures on slide 03</h2>
    <div class="grid g4">
      ${PROBLEM_FIGURES.map((f) => `<div><p class="small">${esc(f.area)}</p><p class="big">${esc(f.value)}</p><p class="small">${esc(f.what)}${f.note ? ` ${esc(f.note)}` : ''}</p><p class="small"><a href="${esc(f.sourceUrl)}" target="_blank" rel="noreferrer">${esc(f.source)}</a> · ${esc(f.asAt)} · ${f.grade}</p></div>`).join('')}
    </div>
    <p class="small">Context, not results. None of these is an outcome of Goods’ work.</p>
  </div>
  <div class="card">
    <h2>The money, the lanes and the gates</h2>
    <ul class="plain">${MONEY_LANES.map((l) => `<li><strong>${esc(l.title)}.</strong> ${esc(l.line)}</li>`).join('')}</ul>
    <p><strong>${esc(REQUEST.headline)}</strong> ${esc(REQUEST.note)}</p>
    <ol class="inline">${GATES.map((g) => `<li>${esc(g)}</li>`).join('')}</ol>
  </div>`;
}

function screenBlockers(): string {
  return `
  <h1>What is blocking what</h1>
  <p class="lead">Every open action lives on the Notion work list with an owner and a due date. This is the summary, as the front door states it.</p>
  <div class="tblwrap"><table>
    <thead><tr><th>#</th><th>Blocker</th><th>Who</th><th>Blocks</th></tr></thead>
    <tbody>${BLOCKERS.map((b) => `<tr><td class="n">${b.n}</td><td><strong>${esc(b.what)}</strong></td><td>${esc(b.who)}</td><td>${esc(b.blocks)}</td></tr>`).join('')}</tbody>
  </table></div>
  <div class="card">
    <h2>The QBE work left, in the order it unblocks the most</h2>
    <ol class="plain">${FORM_WORK_LEFT.map((w) => `<li><strong>${esc(w.what)}</strong> · ${esc(w.who)} · unblocks ${esc(w.unblocks)}</li>`).join('')}</ol>
  </div>
  <div class="card">
    <h2>The one thing that would change the most</h2>
    <p>Jay’s steer for QBE 2026: capital, whether debt or equity, will be looked at more favourably than philanthropy; this year they want to prove that corporate philanthropy can unlock impact investment. Our lines are philanthropy. The useful next step is a lender review of the charity’s financials, transition and repayment case, then the SEFA expression of interest. A draft, an invitation and a lender commitment remain different states.</p>
  </div>`;
}

function screenRegister(): string {
  const groups: { verdict: Verdict; title: string; blurb: string }[] = [
    { verdict: 'living', title: 'Living: the places to come back to', blurb: 'One job, one audience, one source of figures each.' },
    { verdict: 'absorbed', title: 'Absorbed into this master', blurb: 'What they held is here, with the 13 and 14 September states. Do not update them separately.' },
    { verdict: 'reference', title: 'Kept for reference', blurb: 'Rules and records, not surfaces to send.' },
    { verdict: 'retired', title: 'Retired', blurb: 'Superseded figures or a retired lever. Send nobody these.' },
    { verdict: 'other project', title: 'Other projects', blurb: 'In the artifact list, not in the raise.' },
  ];
  return `
  <h1>The register</h1>
  <p class="lead">Every surface the raise has produced, read on 14 September, with a verdict. The rule from the reconciliation stands: every artifact reads figures from canon.ts or the sheet’s Canon tab, and no artifact carries its own number.</p>
  ${groups.map((g) => `<div class="card">
    <h2>${esc(g.title)}</h2>
    <p class="small">${esc(g.blurb)}</p>
    <ul class="plain">${REGISTER.filter((r) => r.verdict === g.verdict)
      .map((r) => `<li><strong>${esc(r.title)}</strong> <span class="small">${esc(r.kind)} · ${esc(r.date)}</span>${r.url ? ` · <a href="${esc(r.url)}" target="_blank" rel="noreferrer">open</a>` : ''}<br><span class="small">${esc(r.job)}${r.note ? ` ${esc(r.note)}` : ''}</span></li>`)
      .join('')}</ul>
  </div>`).join('')}`;
}

// ---------------------------------------------------------------------------
// The page

const SCREENS: { id: string; label: string }[] = [
  { id: 'start', label: 'Start here' },
  { id: 'about', label: 'About us' },
  { id: 'model', label: 'The model' },
  { id: 'deck', label: 'The deck' },
  { id: 'qbe', label: 'QBE application' },
  { id: 'grants', label: 'Other grants' },
  { id: 'questions', label: 'Questions' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'blockers', label: 'Blockers' },
  { id: 'register', label: 'Register' },
];

const CSS = `
:root{--paper:#fbf8f1;--surface:#fffdf9;--surface-2:#f1ece4;--rail:#e6dfd1;--ink:#2b2a26;--ink-2:#4a4741;--ink-3:#7a7363;--terracotta:#c45c3e;--clay:#a8643f;--sage:#8b9d77;--green:#5e7a4c;--goods:#a8643f;--community:#3f7a6a;--gold:#9c7c2b;--bad:#a33c22;--plum:#79506b;--display:"Playfair Display",Georgia,serif;--sans:"Inter",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#15130f;--surface:#1d1a15;--surface-2:#262119;--rail:#3b3428;--ink:#f1eadc;--ink-2:#c5bca9;--ink-3:#8f8574;--goods:#d08a5e;--community:#6fb3a0;--gold:#cca84f;--bad:#de7a5c;--plum:#b892aa;--terracotta:#e2836a;--clay:#ce8a62;--green:#8fb176}}
:root[data-theme="dark"]{--paper:#15130f;--surface:#1d1a15;--surface-2:#262119;--rail:#3b3428;--ink:#f1eadc;--ink-2:#c5bca9;--ink-3:#8f8574;--goods:#d08a5e;--community:#6fb3a0;--gold:#cca84f;--bad:#de7a5c;--plum:#b892aa;--terracotta:#e2836a;--clay:#ce8a62;--green:#8fb176}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:var(--clay)}
h1,h2,h3,h4,h5{font-family:var(--display);font-weight:600;margin:0;text-wrap:balance}
h1{font-size:clamp(30px,4.6vw,46px);line-height:1.03;letter-spacing:-.015em;margin:26px 0 10px}
h2{font-size:22px;margin:0 0 8px}
h3{font-size:17px;margin:14px 0 6px}
h4{font-size:15px;margin:14px 0 4px;font-family:var(--sans);font-weight:600}
h5{font-size:14px;margin:10px 0 4px;font-family:var(--sans);font-weight:600;color:var(--ink-2)}
p{margin:0 0 10px}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px 120px}
nav.tabs{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--paper) 92%,transparent);backdrop-filter:blur(6px);border-bottom:1px solid var(--rail);margin:0 -20px;padding:10px 20px;display:flex;gap:6px;overflow-x:auto;white-space:nowrap}
nav.tabs a{font-size:13px;font-weight:600;color:var(--ink-2);text-decoration:none;padding:6px 10px;border-radius:999px;border:1px solid transparent}
nav.tabs a.on{background:var(--surface);border-color:var(--rail);color:var(--terracotta)}
nav.tabs .brand{font-family:var(--display);font-weight:700;color:var(--ink);padding-right:10px;align-self:center}
.screen{display:none}.screen.on{display:block}
body.all .screen{display:block;border-top:2px solid var(--ink);margin-top:40px;padding-top:10px}
.mast{padding:36px 0 18px;border-bottom:2px solid var(--ink);margin-bottom:22px}
.eyebrow{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);font-weight:600;margin:0}
.stand{font-size:18px;color:var(--ink-2);max-width:66ch}
.lead{font-size:17px;color:var(--ink-2);max-width:70ch}
.small{font-size:12.5px;color:var(--ink-3)}
.big{font-family:var(--display);font-size:34px;line-height:1;margin:6px 0 8px}
.warn{border-left:3px solid var(--bad);padding:6px 10px;background:var(--surface);font-size:13.5px;color:var(--ink-2)}
.card{background:var(--surface);border:1px solid var(--rail);border-radius:14px;padding:18px 20px;margin:0 0 16px}
.grid{display:grid;gap:16px;margin:0 0 16px}
@media(min-width:820px){.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}}
.grid .card{margin:0}
table{border-collapse:collapse;width:100%;font-size:13.5px}
th{text-align:left;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:700;padding:8px 10px;background:var(--surface-2);border-bottom:1px solid var(--rail)}
td{padding:8px 10px;border-bottom:1px solid color-mix(in srgb,var(--rail) 60%,transparent);vertical-align:top}
td.n{font-variant-numeric:tabular-nums}
table.kv td:first-child{color:var(--ink-3);width:38%}
.tblwrap{overflow-x:auto;border:1px solid var(--rail);border-radius:10px;background:var(--surface);margin:0 0 16px}
table.deck td{font-size:13px}
ul.plain,ol.plain{margin:0;padding-left:18px}
ul.plain li,ol.plain li{margin:0 0 7px}
ul.links{list-style:none;margin:0;padding:0}
ul.links li{padding:8px 0;border-bottom:1px solid color-mix(in srgb,var(--rail) 60%,transparent)}
ol.stops{margin:0;padding-left:22px;columns:2;column-gap:28px}
ol.stops li{margin:0 0 10px;break-inside:avoid}
ol.inline{display:flex;flex-wrap:wrap;gap:8px 18px;margin:8px 0;padding:0;list-style:none}
ol.inline li{background:var(--surface-2);border-radius:999px;padding:4px 12px;font-size:13px}
figure.sheet{margin:0 0 18px;border:1px solid var(--rail);border-radius:14px;background:var(--surface);padding:10px}
figure.sheet img{display:block;width:100%;height:auto;border-radius:8px}
figure.sheet figcaption{font-size:12.5px;color:var(--ink-3);padding:8px 4px 0}
.fig svg{display:block;width:100%;height:auto;min-width:640px}
.fig{overflow-x:auto}
.chip{display:inline-block;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;font-weight:700;padding:3px 8px;border-radius:999px;border:1px solid;vertical-align:middle}
.chip.ok{color:var(--green);border-color:var(--green)}.chip.ready{color:var(--gold);border-color:var(--gold)}.chip.doc{color:var(--clay);border-color:var(--clay)}.chip.person{color:var(--community);border-color:var(--community)}.chip.bad{color:var(--bad);border-color:var(--bad)}
.idx{display:grid;gap:1px;background:var(--rail);border:1px solid var(--rail);border-radius:10px;overflow:hidden;margin:0 0 20px}
.idx a{display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:var(--surface);padding:8px 12px;color:var(--ink);text-decoration:none;font-size:13.5px}
.idx a:hover{background:var(--surface-2)}
.idx .q{font-family:var(--mono);font-size:12px;color:var(--clay);min-width:64px}
article.q{margin:36px 0 0;scroll-margin-top:70px}
article.q header{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline;border-bottom:1px solid var(--rail);padding-bottom:10px}
article.q header .qn{font-family:var(--mono);color:var(--clay);font-size:13px}
article.q header h2{flex:1 1 320px;margin:0}
.qbody{display:grid;gap:22px;margin-top:16px}
@media(min-width:960px){.qbody{grid-template-columns:minmax(0,1fr) 280px}}
.answer{min-width:0}
.md p{max-width:70ch}.md blockquote{margin:0 0 12px;padding:8px 14px;border-left:3px solid var(--rail);background:var(--surface);color:var(--ink-2)}
.md code{font-family:var(--mono);font-size:.9em;background:var(--surface-2);padding:1px 5px;border-radius:4px}
.md table{min-width:520px}.md ul,.md ol{padding-left:20px}
.notwritten{border:1px dashed var(--rail);padding:12px 14px;color:var(--ink-3);border-radius:10px}
dl.faq{margin:0}
.faqi{border-top:1px solid var(--rail);padding:14px 0}
dt{font-family:var(--display);font-size:19px;font-weight:600;margin:0 0 6px}
dd{margin:0;max-width:78ch}
footer{margin-top:60px;padding-top:16px;border-top:1px solid var(--rail);font-size:12px;color:var(--ink-3)}
.themebtn{position:fixed;bottom:14px;right:14px;z-index:20;font-size:11px;font-weight:600;padding:6px 10px;border:1px solid var(--rail);background:var(--surface);color:var(--ink-2);border-radius:999px;cursor:pointer}
@media print{nav.tabs,.themebtn{display:none}.screen{display:block!important}body{background:#fff}}
`;

const JS = `
(function(){
  var ids=${JSON.stringify(SCREENS.map((s) => s.id))};
  function show(){
    var h=(location.hash||'#start').slice(1);
    var q=h.indexOf('q-')===0?'qbe':h;
    if(q==='all'){document.body.classList.add('all');}else{document.body.classList.remove('all');}
    ids.forEach(function(id){
      var el=document.getElementById('s-'+id);var tab=document.getElementById('t-'+id);
      var on=(id===q);
      if(el)el.classList.toggle('on',on);
      if(tab)tab.classList.toggle('on',on);
    });
    if(!ids.includes(q)&&q!=='all'){document.getElementById('s-start').classList.add('on');document.getElementById('t-start').classList.add('on');}
    if(h.indexOf('q-')===0){var t=document.getElementById(h);if(t)setTimeout(function(){t.scrollIntoView({block:'start'});},0);}
    else{window.scrollTo(0,0);}
  }
  window.addEventListener('hashchange',show);show();
  var b=document.getElementById('themebtn');if(b)b.addEventListener('click',function(){var c=document.documentElement.getAttribute('data-theme');var d=c?c==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'light':'dark');});
})();
`;

export function buildMaster(): string {
  const answers = readSource('qbe-answers-2026-09-10.md');
  const drafts = readSource('qbe-answers-drafts-2026-09-14.md');
  const png = placematDataUri();
  const screens: Record<string, string> = {
    start: screenStart(),
    about: screenAbout(),
    model: screenModel(png),
    deck: screenDeck(),
    qbe: screenQbe(answers, drafts),
    grants: screenGrants(),
    questions: screenQuestions(),
    numbers: screenNumbers(),
    blockers: screenBlockers(),
    register: screenRegister(),
  };
  return `<title>Goods on Country · The master</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap">
<style>${CSS}</style>
<div class="wrap">
  <nav class="tabs" aria-label="Screens">
    <span class="brand">Goods on Country</span>
    ${SCREENS.map((s) => `<a id="t-${s.id}" href="#${s.id}">${esc(s.label)}</a>`).join('')}
    <a id="t-all" href="#all">Everything</a>
  </nav>
  ${SCREENS.map((s) => `<section class="screen" id="s-${s.id}" aria-label="${esc(s.label)}">${screens[s.id]}</section>`).join('\n')}
  <footer>Built ${MASTER_BUILT} from the repo data: story-spine, story-questions, model-placemat, qbe-form, deck-master, grants, blockers, artifact-register, goods-board, supply-context, asset-canonical, deck. Answers from qbe-answers-2026-09-10.md, revised 12 September. Story words ${STORY_UPDATED}. Rebuild with MASTER_BUILD=1 npx vitest run src/lib/master/build-master.test.ts, then republish to the same artifact.</footer>
</div>
<button class="themebtn" id="themebtn" type="button">theme</button>
<script>${JS}</script>`;
}
