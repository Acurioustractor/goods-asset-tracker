/**
 * Empathy Ledger accountability client for Goods.
 *
 * Writes to the cross-product trail documented in empathy-ledger-v2
 * `docs/api/accountability.md`:
 *
 *   POST {base}/events    x-api-key  → { ok, id, occurred_at }   (accountability_events)
 *   POST {base}/ai-runs   x-api-key  → { ok, id }                (ai_runs, shown on the
 *                                                                  storyteller's own AI log)
 *
 * This is a different door, and a different key, from the content hub client in
 * `./client.ts`. `EMPATHY_LEDGER_API_KEY` reads syndicated content; it is not the
 * accountability service token and is never sent here.
 *
 * Env (the client is OFF unless the first is set):
 *   EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED   '1' | 'true' turns sending on
 *   EMPATHY_LEDGER_ACCOUNTABILITY_DRY_RUN   '1' | 'true' prints payloads, sends nothing
 *   EMPATHY_LEDGER_ACCOUNTABILITY_URL       base, default https://empathyledger.com/api/v1/accountability
 *   EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN     the value of ACCOUNTABILITY_TOKEN_GOODS on the EL side
 *
 * Every function resolves and never throws. A failed send is logged and reported
 * as `{ ok: false }`; the Goods action that called it carries on. Nothing here
 * decides anything about a person: it records what Goods already did.
 */

export const DEFAULT_ACCOUNTABILITY_URL = 'https://empathyledger.com/api/v1/accountability';

/** Pinned so a re-run can be traced to the code that produced it. Bump when the pipeline changes. */
export const GOODS_ANALYZER_VERSIONS = {
  whisperVoiceNote: 'goods-whisper-voice-note-v1',
} as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function flag(name: string): boolean {
  const v = (process.env[name] ?? '').trim().toLowerCase();
  return v === '1' || v === 'true';
}

export function accountabilityEnabled(): boolean {
  return flag('EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED');
}

export function accountabilityDryRun(): boolean {
  return flag('EMPATHY_LEDGER_ACCOUNTABILITY_DRY_RUN');
}

function baseUrl(): string {
  const raw = (process.env.EMPATHY_LEDGER_ACCOUNTABILITY_URL ?? '').trim();
  return (raw || DEFAULT_ACCOUNTABILITY_URL).replace(/\/$/, '');
}

function token(): string | null {
  const t = (process.env.EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN ?? '').trim();
  return t || null;
}

/** Only pass a cross-ref the API will accept; anything else becomes null rather than a 400. */
export function asUuidOrNull(value: unknown): string | null {
  return typeof value === 'string' && UUID_RE.test(value) ? value : null;
}

export type CulturalSensitivity = 'low' | 'medium' | 'high' | 'sacred';

export type AccountabilityEventType =
  | 'decision.published'
  | 'consent.verified'
  | 'ai.review_required'
  | (string & {});

export interface AccountabilityEventInput {
  eventType: AccountabilityEventType;
  /** User or service id in Goods. */
  actorId?: string | null;
  /** Entity the event is about, in Goods or in Empathy Ledger. */
  subjectId?: string | null;
  subjectType?: 'storyteller' | 'organization' | 'story' | 'consent' | 'ai_run' | (string & {});
  /** Structured, small, no free prose about a person. Stored raw and hashed on the EL side. */
  payload?: Record<string, unknown> | null;
  culturalSensitivity?: CulturalSensitivity;
  /** Empathy Ledger `storytellers.id`, when Goods knows it. Never the placeholder storyteller. */
  empathyLedgerStorytellerId?: string | null;
  empathyLedgerOrganizationId?: string | null;
}

/** The wire shape of POST /events — exactly the documented request body. */
export interface AccountabilityEventPayload {
  event_type: string;
  actor_id: string | null;
  subject_id: string | null;
  subject_type: string | null;
  payload: Record<string, unknown> | null;
  cultural_sensitivity: CulturalSensitivity;
  empathy_ledger_storyteller_id: string | null;
  empathy_ledger_organization_id: string | null;
}

export function buildAccountabilityEvent(input: AccountabilityEventInput): AccountabilityEventPayload {
  return {
    event_type: input.eventType,
    actor_id: input.actorId ?? null,
    subject_id: input.subjectId ?? null,
    subject_type: input.subjectType ?? null,
    payload: input.payload ?? null,
    cultural_sensitivity: input.culturalSensitivity ?? 'low',
    empathy_ledger_storyteller_id: asUuidOrNull(input.empathyLedgerStorytellerId),
    empathy_ledger_organization_id: asUuidOrNull(input.empathyLedgerOrganizationId),
  };
}

export interface AiRunInput {
  model: string;
  analyzerVersion: string;
  operationType?: string;
  /** Empathy Ledger `storytellers.id`, when known. Rejected upstream if not a real storyteller. */
  storytellerId?: string | null;
  organizationId?: string | null;
  storyId?: string | null;
  transcriptId?: string | null;
  /** Hashed on the EL side; first 500 chars kept as an excerpt. */
  inputContent?: string | null;
  promptText?: string | null;
  outputPayload?: Record<string, unknown> | null;
  outputSummary?: string | null;
  costUsd?: number | null;
  guardianScore?: number | null;
  guardianPassed?: boolean | null;
  guardianFlags?: Record<string, unknown> | null;
  culturalSensitivity?: CulturalSensitivity;
  humanReviewer?: string | null;
  overrideReason?: string | null;
  errorMessage?: string | null;
  status?: 'pending' | 'completed' | 'failed' | 'reviewed' | 'overridden';
}

/** The wire shape of POST /ai-runs — exactly the documented request body. */
export interface AiRunPayload {
  model: string;
  analyzer_version: string;
  operation_type: string;
  storyteller_id: string | null;
  organization_id: string | null;
  story_id: string | null;
  transcript_id: string | null;
  input_content: string | null;
  prompt_text: string | null;
  output_payload: Record<string, unknown> | null;
  output_summary: string | null;
  cost_usd: number | null;
  guardian_score: number | null;
  guardian_passed: boolean | null;
  guardian_flags: Record<string, unknown> | null;
  cultural_sensitivity: CulturalSensitivity;
  human_reviewer: string | null;
  override_reason: string | null;
  error_message: string | null;
  status: NonNullable<AiRunInput['status']>;
}

export function buildAiRun(input: AiRunInput): AiRunPayload {
  return {
    model: input.model,
    analyzer_version: input.analyzerVersion,
    operation_type: input.operationType ?? 'sibling_product_inference',
    storyteller_id: asUuidOrNull(input.storytellerId),
    organization_id: asUuidOrNull(input.organizationId),
    story_id: asUuidOrNull(input.storyId),
    transcript_id: asUuidOrNull(input.transcriptId),
    input_content: input.inputContent ?? null,
    prompt_text: input.promptText ?? null,
    output_payload: input.outputPayload ?? null,
    output_summary: input.outputSummary ?? null,
    cost_usd: input.costUsd ?? null,
    guardian_score: input.guardianScore ?? null,
    guardian_passed: input.guardianPassed ?? null,
    guardian_flags: input.guardianFlags ?? null,
    cultural_sensitivity: input.culturalSensitivity ?? 'low',
    human_reviewer: asUuidOrNull(input.humanReviewer),
    override_reason: input.overrideReason ?? null,
    error_message: input.errorMessage ?? null,
    status: input.status ?? 'completed',
  };
}

export interface AccountabilityResult {
  ok: boolean;
  id?: string;
  /** True when nothing was sent: flag off, dry run, or the sink unreachable. */
  degraded: boolean;
  /** True when the payload was printed rather than sent. */
  dryRun?: boolean;
  error?: string;
}

function dryRunResult(kind: string, url: string, payload: unknown): AccountabilityResult {
  try {
    console.info(`[empathy-ledger-accountability] DRY RUN ${kind} → ${url}\n${JSON.stringify(payload, null, 2)}`);
  } catch {
    // printing must never fail the caller either
  }
  return { ok: false, degraded: true, dryRun: true };
}

async function post(path: string, kind: string, payload: unknown): Promise<AccountabilityResult> {
  const url = `${baseUrl()}${path}`;
  if (!accountabilityEnabled()) {
    return { ok: false, degraded: true, error: 'EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED is off' };
  }
  if (accountabilityDryRun()) return dryRunResult(kind, url, payload);
  const key = token();
  if (!key) {
    console.warn(`[empathy-ledger-accountability] ${kind} skipped: EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN unset`);
    return { ok: false, degraded: true, error: 'EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN unset' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4_000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'x-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; id?: string; error?: string } | null;
    if (!res.ok) {
      console.warn(`[empathy-ledger-accountability] ${kind} not recorded (HTTP ${res.status}): ${data?.error ?? 'unknown'}`);
      return { ok: false, degraded: res.status >= 500, error: data?.error ?? `HTTP ${res.status}` };
    }
    return { ok: true, id: data?.id, degraded: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'send failed';
    console.warn(`[empathy-ledger-accountability] ${kind} threw: ${message}`);
    return { ok: false, degraded: true, error: message };
  } finally {
    clearTimeout(timer);
  }
}

/** Log a decision or event into the shared accountability trail. Best-effort. */
export async function logAccountabilityEvent(input: AccountabilityEventInput): Promise<AccountabilityResult> {
  return post('/events', `event ${input.eventType}`, buildAccountabilityEvent(input));
}

/** Record a model run over someone's words in the shared `ai_runs` ledger. Best-effort. */
export async function logAiRun(input: AiRunInput): Promise<AccountabilityResult> {
  return post('/ai-runs', `ai-run ${input.analyzerVersion}`, buildAiRun(input));
}

/**
 * The one model Goods runs over a person's words today is Whisper, over a
 * voice note. Call this where `transcribeAudio()` returns, with whatever ids
 * the caller has; a production-shift note has no storyteller and that is
 * recorded as such rather than attributed to the placeholder.
 */
export async function logWhisperTranscription(args: {
  transcript: string | null;
  storytellerId?: string | null;
  storyId?: string | null;
  context: 'production_shift_voice_note' | 'bed_story_voice_note' | (string & {});
  culturalSensitivity?: CulturalSensitivity;
  errorMessage?: string | null;
}): Promise<AccountabilityResult> {
  const failed = Boolean(args.errorMessage) || args.transcript === null;
  return logAiRun({
    model: 'whisper-1',
    analyzerVersion: GOODS_ANALYZER_VERSIONS.whisperVoiceNote,
    operationType: 'transcription',
    storytellerId: args.storytellerId ?? null,
    storyId: args.storyId ?? null,
    outputPayload: args.transcript ? { text: args.transcript } : null,
    outputSummary: failed
      ? `Whisper transcription of a ${args.context} did not produce text.`
      : `Whisper transcribed a ${args.context}: ${args.transcript!.length} characters.`,
    culturalSensitivity: args.culturalSensitivity ?? 'medium',
    errorMessage: args.errorMessage ?? null,
    status: failed ? 'failed' : 'completed',
  });
}
