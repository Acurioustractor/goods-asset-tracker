import crypto from 'node:crypto';

export class InvalidTelemetry extends Error {}

export type ParticleSource = 'particle_webhook' | 'particle_csv_import';
type RecordValue = Record<string, unknown>;

function record(value: unknown, field: string): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidTelemetry(`${field} must be an object`);
  }
  return value as RecordValue;
}

/** Missing is different from a measured zero. Reject partial numeric strings and infinities. */
export function telemetryNumber(value: unknown, field: string, options: { integer?: boolean; min?: number; max?: number } = {}): number | null {
  if (value == null || value === '') return null;
  if (typeof value !== 'number' && typeof value !== 'string') throw new InvalidTelemetry(`${field} must be numeric`);
  if (typeof value === 'string' && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value.trim())) throw new InvalidTelemetry(`${field} must be numeric`);
  const number = Number(value);
  if (!Number.isFinite(number) || (options.integer && !Number.isInteger(number)) || number < (options.min ?? 0) || number > (options.max ?? Number.MAX_SAFE_INTEGER)) {
    throw new InvalidTelemetry(`${field} is outside the supported numeric range`);
  }
  return number;
}

export function telemetryTimestamp(value: unknown, field: string): string {
  const match = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/i) : null;
  if (!match || !Number.isFinite(Date.parse(value as string))) throw new InvalidTelemetry(`${field} must be an ISO timestamp with timezone`);
  const calendar = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (calendar.getUTCFullYear() !== Number(match[1]) || calendar.getUTCMonth() !== Number(match[2]) - 1 || calendar.getUTCDate() !== Number(match[3])) {
    throw new InvalidTelemetry(`${field} has an invalid calendar date`);
  }
  return value as string;
}

export function normalizeParticleEvent(input: unknown, source: ParticleSource) {
  const payload = record(input, 'payload');
  if (typeof payload.coreid !== 'string' || !/^[a-f0-9]{24}$/i.test(payload.coreid)) {
    throw new InvalidTelemetry('coreid must be a 24-character Particle device ID');
  }
  if (typeof payload.event !== 'string' || !payload.event.trim() || payload.event.length > 128) {
    throw new InvalidTelemetry('event is required and must be at most 128 characters');
  }
  const occurredAt = telemetryTimestamp(payload.published_at, 'published_at');
  const aliases: Record<string, string> = {
    wash_event: 'cycle_complete', 'zapier-new-wash': 'cycle_complete', 'new-wash': 'cycle_complete',
    'spark/status': 'heartbeat', 'spark/device/restart': 'restart',
  };
  let eventType = Object.hasOwn(aliases, payload.event) ? aliases[payload.event] : payload.event;
  let data: RecordValue = {};
  if (payload.data != null && payload.data !== '') {
    if (typeof payload.data === 'string') {
      try { data = record(JSON.parse(payload.data), 'data'); }
      catch {
        if (eventType === 'cycle_complete') throw new InvalidTelemetry('Cycle data must be a JSON object');
        // Particle status/restart events can carry plain text; retain it in raw_ping.
      }
    } else {
      data = record(payload.data, 'data');
    }
  }
  if (payload.event === 'spark/status' && (payload.data === 'online' || payload.data === 'offline')) eventType = payload.data;
  const count = telemetryNumber(data.count, 'count', { integer: true, max: 2_147_483_647 });
  const energy = telemetryNumber(data.kWh, 'kWh');
  telemetryNumber(data.A, 'A'); // Validate the retained raw current without inventing measured power.
  const firmware = payload.fw_version;
  if (firmware != null && (typeof firmware !== 'string' && typeof firmware !== 'number')) throw new InvalidTelemetry('fw_version must be a string or number');
  if (typeof firmware === 'number' && !Number.isFinite(firmware)) throw new InvalidTelemetry('fw_version must be finite');
  if (firmware != null && String(firmware).length > 64) throw new InvalidTelemetry('fw_version is too long');

  // Keep the established event-ID contract so re-importing historical exports remains idempotent.
  // Do not change timestamp formatting in this hash without a reviewed legacy-ID migration.
  const eventId = crypto.createHash('sha256')
    .update(`${payload.coreid}-${occurredAt}-${count ?? ''}`)
    .digest('hex').substring(0, 32);
  return {
    event_id: `particle-${eventId}`,
    event_type: eventType,
    machine_id: payload.coreid,
    firmware_version: firmware == null || firmware === '' ? null : String(firmware),
    power_kwh: energy,
    energy_kwh_total: null, // count × this cycle's energy is not a cumulative meter reading.
    cycle_count_total: count,
    online: eventType === 'offline' ? false : ['cycle_complete', 'heartbeat', 'online', 'restart'].includes(eventType) ? true : null,
    status: eventType === 'cycle_complete' ? 'completed' : eventType,
    created_at: occurredAt,
    raw_ping: { source, adapter_version: 1, payload },
  };
}

/** RFC 4180 field boundaries, including escaped quotes and quoted multiline JSON. */
export function parseParticleCSV(csv: string): RecordValue[] {
  const text = csv.replace(/^\uFEFF/, '');
  const records: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closedQuote = false;
  const finishField = () => { row.push(field); field = ''; closedQuote = false; };
  const finishRow = () => { finishField(); if (row.some(value => value !== '')) records.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closedQuote = true; }
      else field += char;
    } else if (char === ',') finishField();
    else if (char === '\n' || char === '\r') { if (char === '\r' && text[i + 1] === '\n') i++; finishRow(); }
    else if (char === '"' && !field && !closedQuote) quoted = true;
    else {
      if (closedQuote || char === '"') throw new InvalidTelemetry('Invalid CSV quoting');
      field += char;
    }
  }
  if (quoted) throw new InvalidTelemetry('Unterminated quoted CSV field');
  if (field || row.length || closedQuote) finishRow();
  if (records.length < 2) return [];
  const headers = records[0].map(value => value.trim().toLowerCase().replace(/\s+/g, '_'));
  if (new Set(headers).size !== headers.length) throw new InvalidTelemetry('CSV contains duplicate column names');
  for (const required of ['event', 'coreid', 'published_at']) {
    if (!headers.includes(required)) throw new InvalidTelemetry(`CSV is missing ${required}`);
  }
  return records.slice(1).map((values, index) => {
    if (values.length !== headers.length) throw new InvalidTelemetry(`CSV record ${index + 2} has ${values.length} fields; expected ${headers.length}`);
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
}
