/**
 * The Goods accountability client sends exactly what empathy-ledger-v2's
 * `docs/api/accountability.md` says it accepts, and sends nothing unless it
 * has been switched on.
 *
 * Why the wire shape is asserted field by field: JusticeHub carried a client
 * for this same API for months that used the wrong header, the wrong fields
 * and the wrong consent path, and `accountability_events` on production held
 * zero rows the whole time. Nothing in that repo said what the API wanted, so
 * nothing could tell. The lists below are copied from the doc's tables; if EL
 * changes its schema, change them here on purpose.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildAccountabilityEvent,
  buildAiRun,
  logAccountabilityEvent,
  logAiRun,
  logWhisperTranscription,
  DEFAULT_ACCOUNTABILITY_URL,
  GOODS_ANALYZER_VERSIONS,
} from './accountability';

/** POST /api/v1/accountability/events — request body fields, per the doc. */
const DOCUMENTED_EVENT_FIELDS = [
  'event_type',
  'actor_id',
  'subject_id',
  'subject_type',
  'payload',
  'cultural_sensitivity',
  'empathy_ledger_storyteller_id',
  'empathy_ledger_organization_id',
].sort();

/** POST /api/v1/accountability/ai-runs — request body fields, per the doc. */
const DOCUMENTED_AI_RUN_FIELDS = [
  'model',
  'analyzer_version',
  'operation_type',
  'storyteller_id',
  'organization_id',
  'story_id',
  'transcript_id',
  'input_content',
  'prompt_text',
  'output_payload',
  'output_summary',
  'cost_usd',
  'guardian_score',
  'guardian_passed',
  'guardian_flags',
  'cultural_sensitivity',
  'human_reviewer',
  'override_reason',
  'error_message',
  'status',
].sort();

const STORYTELLER = '550e8400-e29b-41d4-a716-446655440000';
/** The Goods placeholder storyteller ("ACT Production Team"). A real id, never a person. */
const PLACEHOLDER = 'ac700001-0000-0000-0000-000000000002';

const ENV_KEYS = [
  'EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED',
  'EMPATHY_LEDGER_ACCOUNTABILITY_DRY_RUN',
  'EMPATHY_LEDGER_ACCOUNTABILITY_URL',
  'EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN',
] as const;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('Empathy Ledger accountability client (Goods)', () => {
  const saved: Record<string, string | undefined> = {};
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    for (const k of ENV_KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    fetchMock.mockReset();
    fetchMock.mockRejectedValue(new Error('network must not be touched by this test'));
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('payload shape', () => {
    it('an event carries exactly the documented fields, and only cross-refs that are UUIDs', () => {
      const payload = buildAccountabilityEvent({
        eventType: 'decision.published',
        actorId: 'goods-admin',
        subjectId: 'story-1',
        subjectType: 'story',
        payload: { decision: 'publish' },
        empathyLedgerStorytellerId: STORYTELLER,
        empathyLedgerOrganizationId: 'not-a-uuid',
      });
      expect(Object.keys(payload).sort()).toEqual(DOCUMENTED_EVENT_FIELDS);
      expect(payload.cultural_sensitivity).toBe('low');
      expect(payload.empathy_ledger_storyteller_id).toBe(STORYTELLER);
      expect(payload.empathy_ledger_organization_id).toBeNull();
    });

    it('an ai-run carries exactly the documented fields with the required pair set', () => {
      const payload = buildAiRun({ model: 'whisper-1', analyzerVersion: 'goods-whisper-voice-note-v1' });
      expect(Object.keys(payload).sort()).toEqual(DOCUMENTED_AI_RUN_FIELDS);
      expect(payload.model).toBe('whisper-1');
      expect(payload.analyzer_version).toBe('goods-whisper-voice-note-v1');
      expect(payload.operation_type).toBe('sibling_product_inference');
      expect(payload.status).toBe('completed');
    });

    it('a Whisper run with no storyteller is recorded as unattributed, never as the placeholder', () => {
      const payload = buildAiRun({
        model: 'whisper-1',
        analyzerVersion: GOODS_ANALYZER_VERSIONS.whisperVoiceNote,
        storytellerId: null,
      });
      expect(payload.storyteller_id).toBeNull();
      expect(payload.storyteller_id).not.toBe(PLACEHOLDER);
    });
  });

  describe('switched off (the default)', () => {
    it('sends nothing and reports degraded, never throws', async () => {
      const event = await logAccountabilityEvent({ eventType: 'decision.published' });
      const run = await logAiRun({ model: 'whisper-1', analyzerVersion: 'v' });
      expect(event).toMatchObject({ ok: false, degraded: true });
      expect(run).toMatchObject({ ok: false, degraded: true });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('enabled but without a token still sends nothing', async () => {
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED = '1';
      const event = await logAccountabilityEvent({ eventType: 'consent.verified' });
      expect(event.error).toBe('EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN unset');
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('dry run', () => {
    it('prints the payload and sends nothing', async () => {
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED = '1';
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_DRY_RUN = 'true';
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN = 'secret';
      const info = vi.mocked(console.info);

      const result = await logAccountabilityEvent({ eventType: 'ai.review_required', subjectType: 'ai_run' });

      expect(result).toMatchObject({ ok: false, degraded: true, dryRun: true });
      expect(fetchMock).not.toHaveBeenCalled();
      const printed = info.mock.calls.map((c) => String(c[0])).join('\n');
      expect(printed).toContain('DRY RUN event ai.review_required');
      expect(printed).toContain(`${DEFAULT_ACCOUNTABILITY_URL}/events`);
      expect(printed).toContain('"event_type": "ai.review_required"');
      expect(printed).not.toContain('secret');
    });
  });

  describe('switched on', () => {
    beforeEach(() => {
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_ENABLED = 'true';
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_TOKEN = 'goods-token';
      process.env.EMPATHY_LEDGER_ACCOUNTABILITY_URL = 'https://el.test/api/v1/accountability/';
    });

    it('POSTs an event with x-api-key and the documented body, and returns the id', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true, id: 'evt-1', occurred_at: 'now' }));

      const result = await logAccountabilityEvent({
        eventType: 'decision.published',
        subjectId: 'story-1',
        subjectType: 'story',
        payload: { decision: 'publish' },
        empathyLedgerStorytellerId: STORYTELLER,
      });

      expect(result).toEqual({ ok: true, id: 'evt-1', degraded: false });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://el.test/api/v1/accountability/events');
      expect(init.method).toBe('POST');
      const headers = init.headers as Record<string, string>;
      expect(headers['x-api-key']).toBe('goods-token');
      expect(headers.authorization).toBeUndefined();
      const body = JSON.parse(String(init.body));
      expect(Object.keys(body).sort()).toEqual(DOCUMENTED_EVENT_FIELDS);
      expect(body.empathy_ledger_storyteller_id).toBe(STORYTELLER);
    });

    it('a Whisper transcription lands at /ai-runs with the documented body', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true, id: 'run-1' }));

      const result = await logWhisperTranscription({
        transcript: 'Five beds ready',
        context: 'production_shift_voice_note',
      });

      expect(result.ok).toBe(true);
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://el.test/api/v1/accountability/ai-runs');
      const body = JSON.parse(String(init.body));
      expect(Object.keys(body).sort()).toEqual(DOCUMENTED_AI_RUN_FIELDS);
      expect(body.model).toBe('whisper-1');
      expect(body.analyzer_version).toBe(GOODS_ANALYZER_VERSIONS.whisperVoiceNote);
      expect(body.operation_type).toBe('transcription');
      expect(body.storyteller_id).toBeNull();
      expect(body.status).toBe('completed');
    });

    it('a 401 from EL is reported, not thrown', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Invalid or missing accountability service token' }, 401));
      const result = await logAccountabilityEvent({ eventType: 'decision.published' });
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Invalid or missing');
    });

    it('a network failure is reported, not thrown', async () => {
      const result = await logAccountabilityEvent({ eventType: 'decision.published' });
      expect(result).toMatchObject({ ok: false, degraded: true });
    });
  });
});
