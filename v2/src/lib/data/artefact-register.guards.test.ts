import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ARTEFACTS, FUNDERS, artefactsFor } from './artefact-register';

const PUBLIC = join(__dirname, '../../../public');
const BUILT = join(__dirname, '../../../../deliverables/application-attachments-2026-09');

describe('artefact register', () => {
  it('has unique ids and Notion ids', () => {
    expect(new Set(ARTEFACTS.map((a) => a.id)).size).toBe(ARTEFACTS.length);
    expect(new Set(ARTEFACTS.map((a) => a.notionId)).size).toBe(ARTEFACTS.length);
    for (const a of ARTEFACTS) expect(a.notionId, a.id).toMatch(/^[0-9a-f]{32}$/);
  });

  it('never serves a register file from the public site', () => {
    expect(existsSync(join(PUBLIC, 'artefacts')), 'public/artefacts must not exist').toBe(false);
    for (const a of ARTEFACTS) for (const f of a.files ?? []) expect(existsSync(join(PUBLIC, f)), `${a.id}: ${f} is in public/`).toBe(false);
  });

  it('every built PDF a row names is in the attachments build', () => {
    for (const a of ARTEFACTS) for (const f of a.files ?? []) {
      if (/^\d\d-/.test(f) && f.endsWith('.pdf') && !f.startsWith('14-')) expect(existsSync(join(BUILT, f)), `${a.id}: ${f}`).toBe(true);
    }
  });

  it('a held built artefact is either shipped here or says where it is', () => {
    for (const a of ARTEFACTS.filter((x) => x.kind === 'built' && x.state === 'held')) {
      expect((a.files?.length ?? 0) > 0 || Boolean(a.where), a.id).toBe(true);
    }
  });

  it('anything not held says what finishes it, or where the partial copy sits', () => {
    for (const a of ARTEFACTS.filter((x) => x.state !== 'held')) expect(Boolean(a.finishes || a.where), a.id).toBe(true);
  });

  it('names an owner and at least one funder on every row', () => {
    for (const a of ARTEFACTS) {
      expect(a.owner.length, a.id).toBeGreaterThan(0);
      expect(a.funders.length, a.id).toBeGreaterThan(0);
      for (const f of a.funders) expect(FUNDERS[f], `${a.id}: ${f}`).toBeDefined();
    }
  });

  it('matches the Notion register counts read on 18 September 2026', () => {
    expect(ARTEFACTS).toHaveLength(42);
    expect(artefactsFor('qbe')).toHaveLength(25);
    expect(artefactsFor('sefa')).toHaveLength(10);
    expect(artefactsFor('tfff')).toHaveLength(14);
    expect(artefactsFor('bmd')).toHaveLength(11);
  });
});
