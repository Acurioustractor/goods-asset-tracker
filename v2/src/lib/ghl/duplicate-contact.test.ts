import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Found by testing the live site rather than by reading the code.
 *
 * One real bulk order enquiry went through goodsoncountry.com on 17 September with a new email
 * address and a phone number that already existed in the account. GHL refused the create with
 * "This location does not allow duplicated contacts", and everything downstream of the contact
 * stopped: no tags, no card on GOODS - Buyers, no reply to the person. The website still said
 * "Your message has been received".
 *
 * The code searched for an existing contact by email, so a match on any other field arrived as a
 * 400 it did not expect. GHL puts the id of the matched contact in the error body, which is what
 * makes the recovery possible at all.
 *
 * These read source because the failure is in a path that only fires against the live API, and a
 * mock of GHL's error shape would be a test of my memory of it rather than of the code.
 */

const SRC = fs.readFileSync(path.join(__dirname, 'index.ts'), 'utf8');

describe('a duplicate contact does not lose the enquiry', () => {
  it('knows how to read the id out of the refusal', () => {
    expect(SRC).toContain('function duplicateContactIdFrom');
    expect(
      SRC.includes('duplicated contacts'),
      'The matcher has to look for the phrase GHL actually returns',
    ).toBe(true);
    expect(
      SRC.includes('meta?.contactId') || SRC.includes('meta.contactId'),
      'The id lives at meta.contactId in the error body',
    ).toBe(true);
  });

  it('updates the matched contact instead of throwing', () => {
    const create = SRC.slice(SRC.indexOf("'[GHL] Creating new contact with data:'"));
    const block = create.slice(0, create.indexOf('return { success: true, contact:'));
    expect(block, 'the create is not wrapped, so a duplicate still throws').toContain('catch');
    expect(block).toContain('duplicateContactIdFrom');
    expect(
      block.includes("'PUT'"),
      'Recovery means updating the contact GHL matched, not retrying the create',
    ).toBe(true);
  });

  it('still throws anything that is not a duplicate', () => {
    const create = SRC.slice(SRC.indexOf("'[GHL] Creating new contact with data:'"));
    const block = create.slice(0, create.indexOf('return { success: true, contact:'));
    expect(
      block.includes('if (!duplicateId) throw error'),
      'Swallowing every create error would turn a real outage into a silent one',
    ).toBe(true);
  });
});
