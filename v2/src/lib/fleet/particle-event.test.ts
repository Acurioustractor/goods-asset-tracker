import { describe, expect, it } from 'vitest';
import { normalizeParticleEvent, parseParticleCSV } from './particle-event';
const fixture = { coreid: 'e00fce687ae01d08f95694e5', event: 'new-wash', published_at: '2026-03-09T10:55:34.382Z', data: '{"count":0,"kWh":"0"}', fw_version: 0 };

describe('Particle event contract shared by the live receiver and import', () => {
  it('keeps historical deduplication identity stable across live and CSV paths', () => {
    const live = normalizeParticleEvent(fixture, 'particle_webhook');
    const imported = normalizeParticleEvent(fixture, 'particle_csv_import');
    expect(live.event_id).toBe('particle-910c45f4ccfc2115e83d02bf4def9281');
    expect(imported.event_id).toBe(live.event_id);
    expect(live.raw_ping.source).toBe('particle_webhook');
    expect(imported.raw_ping.source).toBe('particle_csv_import');
  });
  it.each(['-0.2', '1.3oops', 'Infinity', '1e999', '0x10', true])('rejects invalid cycle energy %s', energy => {
    expect(() => normalizeParticleEvent({ ...fixture, data: { count: 1, kWh: energy } }, 'particle_webhook')).toThrow();
  });
  it('retains a zero counter and leaves absent energy unknown', () => {
    expect(normalizeParticleEvent({ ...fixture, data: { count: 0 } }, 'particle_webhook')).toMatchObject({
      cycle_count_total: 0, power_kwh: null, energy_kwh_total: null,
    });
  });
  it('records an explicit provider offline status as offline', () => {
    expect(normalizeParticleEvent({ ...fixture, event: 'spark/status', data: 'offline' }, 'particle_webhook')).toMatchObject({ event_type: 'offline', online: false });
  });
  it('does not promote an unknown event into a measured wash or known-online state', () => {
    expect(normalizeParticleEvent({ ...fixture, event: 'constructor' }, 'particle_webhook')).toMatchObject({ event_type: 'constructor', online: null });
  });
  it('rejects impossible calendar dates rather than letting Date.parse normalize them', () => {
    expect(() => normalizeParticleEvent({ ...fixture, published_at: '2026-02-30T10:00:00.000Z' }, 'particle_webhook')).toThrow();
  });
  it('rejects an unterminated quoted CSV field before importing any records', () => {
    expect(() => parseParticleCSV('Event,Coreid,Published At,Data\nwash_event,device,2026-03-09T10:00:00Z,"{')).toThrow('Unterminated');
  });
});
