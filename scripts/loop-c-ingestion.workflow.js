export const meta = {
  name: 'loop-c-ingestion',
  description: 'Loop C (hardened): ground-and-verify ingestion of Goods backlog docs into canon/artifact-register candidates. Extracts with doc-framing, adversarially verifies every claimed drift against the real source (incl. named code files), dedups + classifies vs known canon sources. Dry-run: returns candidates, writes nothing. RED=count-only.',
  phases: [
    { title: 'Extract', detail: 'Sonnet extractor per doc — fact + sourceSnippet + docFraming' },
    { title: 'Verify', detail: 'skeptical adversarial check of each current-drift claim against the real file' },
    { title: 'Synthesize', detail: 'dedup + classify candidates vs known canon sources' },
  ],
}

// ── Inputs ───────────────────────────────────────────────────────────────────
// args = { repo?: string, files: string[] }   (files = repo-relative paths to scan)
// Incremental mode: caller passes only changed files (e.g. `git diff --name-only <lastrun>`).
// NOTE: the Workflow tool delivers `args` as a JSON STRING, so parse it.
const ARGS = typeof args === 'string' ? (args.trim() ? JSON.parse(args) : {}) : (args || {})
const REPO = ARGS.repo || '/Users/benknight/Code/Goods Asset Register'
const FILES = ARGS.files || []
if (!FILES.length) throw new Error('loop-c-ingestion: pass args.files (repo-relative doc paths). For a full run, generate with find; for incremental, pass git-changed files.')

// ── Reference: canon + ALL canon-adjacent code sources (so we do not re-propose existing facts) ──
const CANON_REF = `CANON facts (canon.ts) id = value | note:
beds-deployed=496 | stretch-beds-deployed=133 | basket-beds=363(legacy) | washers-deployed=28 | washers-working=14 | communities-served=9 (10 distinct) | plastic-kg=2660
revenue-received=741111 AUD(site) | accounts-receivable=143000 | revenue-xero-paid=650910.79 | revenue-carveout=713827
stretch-price=750 | marginal-buykit=685 | marginal-factory=426 | marginal-community=421(MODELLED) | save-per-bed=194
cleared-voices=6 | el-published-stories=0
Money facts AMBER; 3 revenue cuts do NOT reconcile (P0 human gate). marginal-community MODELLED. Storyteller/recipient = RED.`

const KNOWN_SOURCES = `ALREADY IN CANON or canon-adjacent CODE — a candidate matching any of these is NOT new (set existsIn):
- canon.ts: all ids above.
- products.ts (existsIn=products.ts): bed 26kg, 188x92x25cm, 200kg capacity, 20kg plastic/bed, ~5min assembly, 10+yr life, 5yr warranty, steel poles 26.9mm OD x 2.6mm wall x 1950mm, price $750.
- asset-canonical.ts (existsIn=asset-canonical.ts): beds 496 (363 basket + 133 stretch), washers 28 deployed / 14 working, communities 9 / 10 distinct, plastic 2660kg.
- cost-model/engine.ts (existsIn=engine.ts): marginal $684.79/$425.74/$420.74, save $194, fixed block ~$109,500/yr, break-even 1679/338/333, contribution $65/$324/$329, leg-kit $344.05, raw shred $40, 8.6x idiot index, ~$110,046 already invested, freight delta $70/bed, volume gate ~300/yr.
- grant-content.ts / compendium.ts (existsIn=grant-content.ts): totalReceived $741,111, receivables $143,000.
- qbe-areas.json (existsIn=qbe-areas.json): 12 diagnostic areas + V4 now->target scores + keystone (Area 09) + blockers + CASE knockouts.`

// ── Schemas ──────────────────────────────────────────────────────────────────
const EXTRACT_SCHEMA = {
  type: 'object', additionalProperties: true,
  properties: {
    file: { type: 'string' },
    facts: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: true,
        properties: {
          claim: { type: 'string' },
          value: { type: 'string' },
          unit: { type: 'string' },
          sourceSnippet: { type: 'string', description: 'the exact sentence/line from the doc this came from' },
          docFraming: { type: 'string', enum: ['current', 'historical', 'fixed', 'stale-flagged', 'proposed', 'external-ref', 'unknown'], description: 'how the DOC frames this value' },
          refersToCodeFile: { type: 'string', description: 'path if the doc attributes the value to a code/data file, else ""' },
          matchesCanonId: { type: 'string' },
          conflictsCanonId: { type: 'string' },
          conflictNote: { type: 'string' },
          isNewCandidate: { type: 'boolean' },
          suggestedDomain: { type: 'string' },
          confidence: { type: 'string', enum: ['high', 'med', 'low'] },
        },
        required: ['claim', 'value', 'sourceSnippet', 'docFraming', 'matchesCanonId', 'conflictsCanonId', 'isNewCandidate', 'confidence'],
      },
    },
    artifact: {
      type: 'object', additionalProperties: true,
      properties: {
        shouldRegister: { type: 'boolean' },
        suggestedTitle: { type: 'string' },
        pillar: { type: 'string' },
        type: { type: 'string' },
        citesCanon: { type: 'array', items: { type: 'string' } },
        qbeAreas: { type: 'array', items: { type: 'string' } },
        dataClass: { type: 'string' },
        note: { type: 'string' },
      },
      required: ['shouldRegister', 'suggestedTitle', 'pillar', 'citesCanon', 'dataClass'],
    },
    redQuotes: {
      type: 'object', additionalProperties: true,
      properties: {
        count: { type: 'number' },
        speakers: { type: 'array', items: { type: 'string' }, description: 'MUST be [] for RED content' },
        consentMentioned: { type: 'boolean' },
        note: { type: 'string' },
      },
      required: ['count'],
    },
    summary: { type: 'string' },
  },
  required: ['file', 'facts', 'artifact', 'redQuotes', 'summary'],
}

const VERIFY_SCHEMA = {
  type: 'object', additionalProperties: true,
  properties: {
    isLiveDrift: { type: 'boolean' },
    evidenceLine: { type: 'string', description: 'the exact line proving live or not-live' },
    reason: { type: 'string' },
  },
  required: ['isLiveDrift', 'reason'],
}

const SYN_SCHEMA = {
  type: 'object', additionalProperties: true,
  properties: {
    uniqueCandidates: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: true,
        properties: {
          claim: { type: 'string' }, value: { type: 'string' }, unit: { type: 'string' },
          domain: { type: 'string' }, claimLabel: { type: 'string' }, dataClass: { type: 'string' },
          existsIn: { type: 'string' }, recommend: { type: 'string' },
        },
        required: ['claim', 'value', 'domain', 'existsIn', 'recommend'],
      },
    },
  },
  required: ['uniqueCandidates'],
}

// ── Prompts ──────────────────────────────────────────────────────────────────
const extractPrompt = (rel) => `You are the Loop C ingestion extractor for the Goods Alignment Engine. Read ONE backlog doc and extract structured candidates. Read-only.

FILE: ${REPO}/${rel}

${CANON_REF}

CRITICAL GROUNDING RULES (this loop previously produced false positives by ignoring them):
- For EVERY fact, capture sourceSnippet = the exact sentence/line you took it from.
- Set docFraming to how THE DOC frames the value:
  * current = the doc asserts this as a live/true value right now
  * historical = a past/dated/superseded value
  * fixed = the doc says this was WRONG and has been corrected/replaced
  * stale-flagged = the doc warns "stale / do not use / do not repeat / quarantined"
  * proposed = a target/modelled/hypothetical figure
  * external-ref = a value the doc attributes to a code/data file or external system it is AUDITING (not the doc's own present claim)
  * unknown = cannot tell
- Only set conflictsCanonId when the value is docFraming=current AND contradicts canon. A value the doc itself labels fixed/stale/historical/external-ref is NOT a live conflict — record it with that framing and an empty conflictsCanonId.
- If the doc attributes a value to a code/data file (e.g. "impact-model.ts has $550"), set refersToCodeFile to that path. Do NOT assume it is live — that file may already be corrected.
- Never report a value you cannot see verbatim in the file. Watch units (e.g. "25 L tub" is litres, not 25 kg).

Extract:
1. facts[] — claim, value AS WRITTEN, unit, sourceSnippet, docFraming, refersToCodeFile, matchesCanonId, conflictsCanonId+conflictNote (only if current), isNewCandidate (real citable fact not in canon), suggestedDomain, confidence.
2. artifact — shouldRegister + suggestedTitle, pillar, type, citesCanon[] (only canon ids), qbeAreas[] (01-12), dataClass, note.
3. redQuotes — COUNT ONLY. If storyteller/recipient quotes/profiles present (RED): count + consentMentioned + one-line note. speakers MUST be []. Never verbatim, never names. Non-RED: count 0.
4. summary — one line.

Budget: read only this file. Set file to "${rel}".`

const verifyPrompt = (c) => `You are a SKEPTICAL drift verifier for the Goods Alignment Engine. A previous pass claimed a LIVE drift. Prove or refute it. Default to isLiveDrift=FALSE unless the value is unambiguously a current/live truth that contradicts canon.

CLAIMED DRIFT: value "${c.value}" said to conflict canon ${c.canonId} (canon value differs).
SOURCE DOC: ${REPO}/${c.file}
DOC SNIPPET: ${JSON.stringify(c.sourceSnippet || '')}
DOC FRAMING (extractor's call): ${c.docFraming || 'unknown'}
${c.refersToCodeFile ? `ATTRIBUTED CODE FILE: ${REPO}/${c.refersToCodeFile} — READ IT and check whether the value is a LIVE assignment or only appears in a comment / is absent.` : ''}

Steps: Read the source doc region (and the code file if attributed). Decide: is this value asserted as a CURRENT/LIVE truth, or is it documenting something stale/fixed/historical/hypothetical, or only present in a comment, or absent/hallucinated? Return isLiveDrift (true only if a live value genuinely contradicts canon now), evidenceLine (the exact line), reason. Budget: read only what you need.`

// ── Phase 1: Extract ─────────────────────────────────────────────────────────
phase('Extract')
const extracted = await parallel(
  FILES.map((rel) => () => agent(extractPrompt(rel), { label: `x:${rel.split('/').pop().slice(0, 18)}`, phase: 'Extract', schema: EXTRACT_SCHEMA, model: 'sonnet' }))
)
const ok = extracted.filter(Boolean)
const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9.]/g, '').trim()
const allFacts = ok.flatMap((r) => (r.facts || []).map((f) => ({ ...f, file: r.file })))

// matched + framing tallies
const matchedTally = {}
for (const f of allFacts) if (f.matchesCanonId) matchedTally[f.matchesCanonId] = (matchedTally[f.matchesCanonId] || 0) + 1
const framingTally = {}
for (const f of allFacts) framingTally[f.docFraming || 'unknown'] = (framingTally[f.docFraming || 'unknown'] || 0) + 1

// drift candidates = only docFraming=current conflicts (grounding gate)
const driftCandidates = allFacts.filter((f) => f.conflictsCanonId && (f.docFraming || '') === 'current')
const droppedByFraming = allFacts.filter((f) => f.conflictsCanonId && (f.docFraming || '') !== 'current').length
log(`Extract: ${ok.length}/${FILES.length} docs, ${allFacts.length} facts. Conflicts: ${driftCandidates.length} current (to verify) + ${droppedByFraming} dropped by framing (fixed/stale/historical/external-ref). Framing: ${JSON.stringify(framingTally)}`)

// ── Phase 2: Verify (skeptical, adversarial) ─────────────────────────────────
phase('Verify')
const verified = await parallel(
  driftCandidates.map((c) => () =>
    agent(verifyPrompt(c), { label: `v:${c.conflictsCanonId}`, phase: 'Verify', schema: VERIFY_SCHEMA, model: 'sonnet' })
      .then((v) => ({ canonId: c.conflictsCanonId, value: c.value, file: c.file, refersToCodeFile: c.refersToCodeFile || '', sourceSnippet: c.sourceSnippet || '', verdict: v }))
      .catch(() => null)
  )
)
const confirmedDrift = verified.filter(Boolean).filter((v) => v.verdict && v.verdict.isLiveDrift)
const refutedDrift = verified.filter(Boolean).filter((v) => !(v.verdict && v.verdict.isLiveDrift))
log(`Verify: ${confirmedDrift.length} confirmed live drift, ${refutedDrift.length} refuted (false positives caught)`)

// ── Phase 3: Synthesize candidates (dedup + classify vs known sources) ────────
phase('Synthesize')
const candMap = {}
for (const f of allFacts) {
  if (!f.isNewCandidate) continue
  const k = norm(f.claim).slice(0, 44) + '|' + norm(f.value)
  if (!candMap[k]) candMap[k] = { claim: f.claim, value: f.value, unit: f.unit || '', domain: f.suggestedDomain || '', confidence: f.confidence || '', count: 0 }
  candMap[k].count++
}
const candidates = Object.values(candMap).sort((a, b) => b.count - a.count)

const CHUNK = 60
const chunks = []
for (let i = 0; i < candidates.length; i += CHUNK) chunks.push(candidates.slice(i, i + CHUNK))
const synth = await parallel(
  chunks.map((ch, idx) => () =>
    agent(
      `You are the Loop C synthesis/dedup pass.
${KNOWN_SOURCES}

Candidates (chunk ${idx + 1}/${chunks.length}), JS-deduped by exact claim+value. Merge near-duplicates and classify EACH:
${JSON.stringify(ch)}

Return per unique candidate: claim, value, unit, domain (assets/money/cost/product/story/pipeline/governance/market/other), claimLabel (verified/modelled/target/future/internal-only — money & funder PIPELINE targets are NOT verified), dataClass (green/amber/red), existsIn (canon.ts/products.ts/asset-canonical.ts/engine.ts/grant-content.ts/qbe-areas.json/none), recommend (add-to-canon/already-covered/human-review/drop).
Rules: money/revenue NEVER add-to-canon -> human-review. Anything matching known sources -> existsIn + already-covered. Drop trivia/prose/dups. Be conservative: when unsure -> human-review, not add-to-canon. Classify only; invent nothing.`,
      { label: `synth:${idx + 1}/${chunks.length}`, phase: 'Synthesize', schema: SYN_SCHEMA, model: 'sonnet' }
    )
  )
)
let uniqueCandidates = synth.filter(Boolean).flatMap((s) => s.uniqueCandidates || [])
const seen = new Set()
uniqueCandidates = uniqueCandidates.filter((c) => {
  const k = norm(c.claim).slice(0, 44) + '|' + norm(c.value)
  if (seen.has(k)) return false
  seen.add(k)
  return true
})
// keep only genuinely-new, conservatively-recommended
const newForCanon = uniqueCandidates.filter((c) => (c.existsIn || 'none').toLowerCase() === 'none' && c.recommend === 'add-to-canon')
log(`Synthesize: ${uniqueCandidates.length} unique candidates, ${newForCanon.length} genuinely-new add-to-canon`)

return {
  docsProcessed: ok.length,
  docsTotal: FILES.length,
  factsTotal: allFacts.length,
  framingTally,
  matchedTally,
  drift: { confirmed: confirmedDrift, refutedCount: refutedDrift.length, droppedByFramingCount: droppedByFraming },
  candidates: { total: uniqueCandidates.length, newForCanon },
  red: { totalQuoteInstances: ok.reduce((s, r) => s + ((r.redQuotes && r.redQuotes.count) || 0), 0), redFiles: ok.filter((r) => r.redQuotes && r.redQuotes.count > 0).length, note: 'counts only; no names, no verbatim' },
  artifacts: ok.filter((r) => r.artifact && r.artifact.shouldRegister).map((r) => ({ file: r.file, title: r.artifact.suggestedTitle, pillar: r.artifact.pillar })),
}
