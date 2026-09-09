#!/usr/bin/env node
// Fails on the writing patterns from Wikipedia:Signs of AI writing (WP:AITELLS).
// Ben, 10 Sep 2026: "A complete model, not a product" shipped after the guide was handed over.
// Judgement was the control and judgement failed, so this is the control now.
//
//   node tools/check-ai-tells.mjs <file> [file...]
//   node tools/check-ai-tells.mjs --list          print the rules
//
// Allowlist: tools/ai-tells-allow.txt, one exact phrase per line, "# reason" above it.
// Default deny. A claim ceiling that has to survive goes in the allowlist with its reason,
// so keeping one is a recorded decision instead of an argument in a session.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const AI_VOCAB = [
  'additionally','align with','aligns with','boasts','bolstered','crucial','deep dive','delve',
  'delves','delving','emphasizing','enduring','enhance','enhances','enhancing','foster','fostering',
  'garner','garnered','interplay','intricate','intricacies','meticulous','meticulously','pivotal',
  'robust','showcase','showcases','showcasing','tapestry','testament','underscore','underscores',
  'underscoring','vibrant','multifaceted','holistic','leverage','leveraging','seamless','navigate the',
];

const PUFFERY = [
  'boasts a','vibrant','rich tapestry','profound','groundbreaking','renowned','nestled',
  'in the heart of','commitment to','diverse array','natural beauty','cutting-edge','world-class',
  'transformative','game-chang','unparalleled','revolutioniz',
];

const RULES = [
  // --- negative parallelism, the family that started this ---
  { id:'neg-par-notjust', sev:'ERROR', why:'Negative parallelism: "not just X, but Y"',
    re:/\bnot (?:just|only|merely|simply)\b[^.!?;]{0,80}?\b(?:but|it['’]s|it is|they['’]re)\b/gi },
  { id:'neg-par-notxbuty', sev:'ERROR', why:'Negative parallelism: "it is not X, it is Y"',
    re:/\b(?:it|this|that|the goal|the point|the question|success)\s+(?:is|was|isn['’]t|is not|wasn['’]t|was not)\s+not\b[^.!?;]{0,90}?[.,;]\s*(?:it|this|that)\s+(?:is|was)\b/gi },
  { id:'neg-par-comma', sev:'ERROR', why:'Negative parallelism: a trailing ", not X" flourish',
    re:/,\s*(?:not|never|rather than)\s+(?:a|an|the|just|only|merely)?\s*[a-z][a-z'’-]*(?:\s+[a-z][a-z'’-]*){0,3}\s*(?=[.!?"”]|$)/g },
  { id:'neg-par-nono', sev:'ERROR', why:'Negative parallelism: "no X, no Y, just Z"',
    re:/\bno\s+[a-z'’-]+,\s*no\s+[a-z'’-]+,\s*(?:just|only)\b/gi },
  { id:'neg-par-rather', sev:'ERROR', why:'Negative parallelism reversed: "Y rather than X"',
    re:/\brather than\b/gi },

  // --- vocabulary ---
  { id:'ai-vocab', sev:'ERROR', why:'AI vocabulary (WP:AIVOCAB)',
    re:new RegExp('\\b(?:'+AI_VOCAB.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\b','gi') },
  { id:'puffery', sev:'ERROR', why:'Promotional / advertisement language (WP:AIPUFFERY)',
    re:new RegExp('(?:'+PUFFERY.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','gi') },

  // --- significance and legacy puffing ---
  { id:'significance', sev:'ERROR', why:'Undue emphasis on significance or legacy (WP:AILEGACY)',
    re:/\b(?:is a testament|stands as|serves as a reminder|plays? an? (?:crucial|pivotal|vital|key|significant) role|marks a (?:shift|turning point)|reflects broader|evolving landscape|indelible mark|deeply rooted|setting the stage for|speaks to (?:a|the) broader)\b/gi },

  // --- copula avoidance ---
  { id:'no-copula', sev:'ERROR', why:'Copula avoidance: use is/are/has (WP:AINOCOPULA)',
    re:/\b(?:serves as|stands as|functions as|operates as|represents an?|features an?|maintains an?|offers an?)\s/gi },

  // --- vague association ---
  { id:'vague-assoc', sev:'ERROR', why:'Vague expression of connection (WP:AICONNECT)',
    re:/\b(?:associated with|connected with|in connection with|in association with)\b/gi },

  // --- trailing -ing superficial analysis ---
  { id:'ing-analysis', sev:'ERROR', why:'Sentence-final "-ing" analysis clause (WP:SUPERFICIAL)',
    re:/,\s*(?:highlighting|underscoring|emphasizing|ensuring|reflecting|symbolizing|contributing to|cultivating|fostering|encompassing|enhancing|showcasing|demonstrating|reinforcing|solidifying)\b/gi },

  // --- weasel ---
  { id:'weasel', sev:'ERROR', why:'Vague attribution (WP:AIWEASEL)',
    re:/\b(?:industry reports|observers have|experts (?:argue|say|note)|some critics|several (?:sources|publications)|it is widely (?:believed|held|regarded))\b/gi },

  // --- didactic disclaimers ---
  { id:'didactic', sev:'ERROR', why:'Didactic disclaimer (WP:DIDACTIC)',
    re:/\b(?:it(?:'|’)?s important to (?:note|remember|consider)|it is important to (?:note|remember|consider)|worth noting that|it is crucial to|critically important)\b/gi },

  // --- section summaries ---
  { id:'summary', sev:'ERROR', why:'Canned section summary (WP:INCONCLUSION)',
    re:/(?:^|[.!?]\s|>)\s*(?:In summary|In conclusion|Overall|Ultimately|In essence)[,\s]/g },

  // --- collaborative chatter ---
  { id:'collab', sev:'ERROR', why:'Chatbot correspondence left in the text (WP:COLLABCOMM)',
    re:/\b(?:I hope this helps|Would you like|let me know if|here(?:'|’)?s a (?:breakdown|summary)|feel free to)\b/gi },

  // --- punctuation ---
  { id:'em-dash', sev:'ERROR', why:'Em dash. House rule: middots or a full stop.', re:/—|&mdash;/g },

  // --- watch, not fail ---
  { id:'rule-of-three', sev:'WARN', why:'Possible rule of three. Fine if the three things are real.',
    re:/\b([a-z'’-]+),\s+([a-z'’-]+),?\s+and\s+([a-z'’-]+)\b/g },
  { id:'bold-colon', sev:'WARN', why:'Bold-header-colon list item (WP:AILIST)',
    re:/(?:^|\n)\s*(?:[-*•]|\d+\.)\s*(?:\*\*|<b>|<strong>)[^:\n]{2,60}(?:\*\*|<\/b>|<\/strong>)\s*:/g },
  { id:'title-case-head', sev:'WARN', why:'Title-case heading (WP:AITITLECASE)',
    re:/<h[2-4][^>]*>\s*(?:[A-Z][a-z]+\s+){2,}[A-Z][a-z]+\s*<\/h[2-4]>/g },
];

function loadAllow() {
  const p = join(HERE, 'ai-tells-allow.txt');
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8').split('\n')
    .map(l => l.trim()).filter(l => l && !l.startsWith('#'));
}

// Prose only: drop script, style, svg text coordinates, html tags, entities that are not words.
function proseLines(src, file) {
  let s = src;
  if (/\.html?$/i.test(file)) {
    // A quotation is what a person said. It is never rewritten and never flagged.
    const blank = m => m.replace(/[^\n]/g, ' ');
    s = s.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, blank);
    s = s.replace(/<p class="quote"[\s\S]*?<\/p>/gi, blank);
    s = s.replace(/<script[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '));
    s = s.replace(/<style[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ' '));
    s = s.replace(/<[^>]+>/g, m => m.includes('\n') ? m.replace(/[^\n]/g, ' ') : ' ');
    s = s.replace(/&middot;/g, '·').replace(/&rsquo;/g, '’').replace(/&ldquo;|&rdquo;/g, '"')
         .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
  }
  if (/\.(md|markdown|txt)$/i.test(file)) {
    // Markdown blockquotes are quotations too.
    s = s.split('\n').map(l => /^\s*>/.test(l) ? '' : l).join('\n');
  }
  return s.split('\n');
}

function run(files) {
  const allow = loadAllow();
  let errors = 0, warns = 0;
  for (const file of files) {
    if (!existsSync(file)) { console.error(`missing: ${file}`); errors++; continue; }
    const raw = readFileSync(file, 'utf8');
    const lines = proseLines(raw, file);
    const rel = relative(ROOT, file) || file;
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        let m;
        while ((m = rule.re.exec(line)) !== null) {
          const hit = m[0].trim();
          const ctx = line.slice(Math.max(0, m.index - 45), m.index + hit.length + 45).trim();
          if (allow.some(a => ctx.includes(a) || hit === a)) continue;
          if (rule.sev === 'ERROR') errors++; else warns++;
          console.log(`${rule.sev === 'ERROR' ? '✗' : '·'} ${rel}:${i + 1}  [${rule.id}] ${rule.why}`);
          console.log(`    …${ctx}…`);
          if (m.index === rule.re.lastIndex) rule.re.lastIndex++;
        }
      }
    });
  }
  console.log(`\n${errors} to fix, ${warns} to look at.`);
  return errors === 0 ? 0 : 1;
}

const args = process.argv.slice(2);
if (args[0] === '--list') {
  for (const r of RULES) console.log(`${r.sev.padEnd(5)} ${r.id.padEnd(18)} ${r.why}`);
  process.exit(0);
}
if (!args.length) { console.error('usage: node tools/check-ai-tells.mjs <file> [file...]'); process.exit(2); }
process.exit(run(args));
