#!/usr/bin/env node
/**
 * Upload all files from wiki/raw/grants-archive/<funder>/ into the matching
 * Drive subfolder. Impersonates hi@act.place (owner of the Drive folders)
 * via the act-global-infrastructure service account.
 */
import { google } from '/Users/benknight/Code/act-global-infrastructure/node_modules/googleapis/build/src/index.js';
import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { Readable } from 'stream';

const APPLY = process.argv.includes('--apply');
const ROOT = '/Users/benknight/Code/Goods Asset Register/wiki/raw/grants-archive';

let _secretCache = null;
function loadSecrets() {
  if (_secretCache) return _secretCache;
  const token = execSync('security find-generic-password -a "bws" -s "act-personal-ai" -w 2>/dev/null', { encoding: 'utf8' }).trim();
  const result = execSync(`BWS_ACCESS_TOKEN="${token}" ~/bin/bws secret list --output json 2>/dev/null`, { encoding: 'utf8' });
  const secrets = JSON.parse(result);
  _secretCache = {};
  for (const s of secrets) _secretCache[s.key] = s.value;
  return _secretCache;
}
function getSecret(name) { return loadSecrets()[name] || process.env[name]; }

async function driveAs(userEmail) {
  const credentials = JSON.parse(getSecret('GOOGLE_SERVICE_ACCOUNT_KEY'));
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
    subject: userEmail,
  });
  await auth.authorize();
  return google.drive({ version: 'v3', auth });
}

// Local subfolder name -> Drive folder ID
const FOLDER_MAP = {
  'frrr':                                '1p3TNvx6CU43eRpCDmnpq5SJ-ND8VFIRn',
  'snow-foundation':                     '1FPZDZYFnoRNv7GrLHTuuy_PcJbhxdn45',
  'tfn':                                 '15oocRspfMR8uYNbqbv2e_X5gHKFpkd3L',
  'amp-spark':                           '1CTOpYiKvALlmZ-cVAMuwraao-FrJkSfR',
  'dusseldorp':                          '1hP920RZkaZRV3GaxTzovSTy8qnwlcNkq',
  'catalysing-impact-eoi':               '1OaFiEqlvB27G38J9aUn5aww3kEY6QdaT',
  'real-innovation-fund':                '18z7G7BmdyAPCYsBbCpLmnJsin4GCoXM_',
  'rotary-eclub-outback':                '1oDNLJHfif31KESQ5IyMbbzZXHInmr6_E',
  'rotary':                              '1oDNLJHfif31KESQ5IyMbbzZXHInmr6_E',
  'minderoo':                            '1ZZvywVPtpnyYbdZRrD_7Cygg-I8i7Srf',
  'paul-ramsay-foundation':              '10idV_MHKq1S5XazSDr04Tx6gX7LH2G4O',
  'pfi-paul-ramsay':                     '10idV_MHKq1S5XazSDr04Tx6gX7LH2G4O',
  'tim-fairfax-family-foundation':       '1mB8AgykVA6lZe4mrZh7jKgSsSjjFoc2d',
  'tffff':                               '1mB8AgykVA6lZe4mrZh7jKgSsSjjFoc2d',
  'bryan-foundation':                    '1jzocxYHZb_d8PgpmYqrkc69ExIUeejwg',
  'partner-letters-centrecorp-tennant':  '1KgNCd0jIvYDrlNqWzhdkhTZH_PHlSDwB',
  'partner-letters':                     '1KgNCd0jIvYDrlNqWzhdkhTZH_PHlSDwB',
  'anyinginyi-health':                   '1bjN3iuXZ3Yaui5BdFlkVslwS24I6CMx5',
  'anyinginyi':                          '1bjN3iuXZ3Yaui5BdFlkVslwS24I6CMx5',
  'our-community-shed':                  '1Fa7ng2tlPaYGXrFiYA0cJnQHk9hElCon',
  'bunnings':                            '1O6pyuehaKWpOwdIAlKY0db11IMTKDKmq',
  'civeo':                               '1w34xVJ8KReyDWCpz57tmmJU9tpRNeLnX',
  'zinus':                               '1mTS88lc1KKW1AW3l5I5WSqTupusk3fBS',
  'picc-palm-island':                    '197HPl7ZvL3_qp4Vt3vx3kQxPDNtIvCi7',
  'picc':                                '197HPl7ZvL3_qp4Vt3vx3kQxPDNtIvCi7',
};

const MIME = {
  '.pdf':  'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc':  'application/msword',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

async function listExisting(drive, folderId) {
  const out = new Set();
  let pageToken;
  do {
    const r = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name)',
      pageSize: 1000,
      pageToken,
    });
    for (const f of r.data.files || []) out.add(f.name);
    pageToken = r.data.nextPageToken;
  } while (pageToken);
  return out;
}

async function uploadFile(drive, folderId, localPath, name) {
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'));
  const mimeType = MIME[ext] || 'application/octet-stream';
  const r = await drive.files.create({
    requestBody: { name, parents: [folderId], mimeType },
    media: { mimeType, body: Readable.from(readFileSync(localPath)) },
    fields: 'id, name, size',
    supportsAllDrives: true,
  });
  return r.data;
}

(async () => {
  const userEmail = process.env.GDRIVE_AS || 'hi@act.place';
  console.log(`Mode: ${APPLY ? 'APPLY (uploading)' : 'DRY RUN'}`);
  console.log(`Impersonating: ${userEmail}\n`);

  let drive;
  try {
    drive = await driveAs(userEmail);
  } catch (e) {
    console.error(`✗ auth failed for ${userEmail}: ${e.message}`);
    console.error('  Try: GDRIVE_AS=benjamin@act.place node tools/upload-grants-to-drive.mjs');
    process.exit(1);
  }

  let totalFound = 0, totalUploaded = 0, totalSkipped = 0, totalErrored = 0;

  for (const [subfolder, driveFolderId] of Object.entries(FOLDER_MAP)) {
    const dir = join(ROOT, subfolder);
    let files;
    try { files = readdirSync(dir).filter(f => /\.(pdf|docx|doc|xlsx)$/i.test(f)); }
    catch { continue; }
    if (!files.length) continue;

    console.log(`[${subfolder}] ${files.length} local files`);
    let existing;
    try { existing = await listExisting(drive, driveFolderId); }
    catch (e) { console.log(`  ✗ cannot list folder ${driveFolderId}: ${e.message}`); continue; }

    for (const f of files) {
      totalFound++;
      const local = join(dir, f);
      const size = statSync(local).size;
      if (existing.has(f)) {
        console.log(`  ⏭  ${f} (already in Drive)`);
        totalSkipped++;
        continue;
      }
      console.log(`  ${APPLY ? '↑' : '·'} ${f} (${(size / 1024).toFixed(0)}KB)`);
      if (!APPLY) continue;
      try {
        await uploadFile(drive, driveFolderId, local, f);
        console.log(`    ✓ uploaded`);
        totalUploaded++;
      } catch (e) {
        console.log(`    ✗ ${e.message}`);
        totalErrored++;
      }
    }
  }

  console.log(`\n--- summary ---`);
  console.log(`local files:     ${totalFound}`);
  console.log(`uploaded:        ${totalUploaded}`);
  console.log(`already in drive: ${totalSkipped}`);
  console.log(`errored:         ${totalErrored}`);
  if (!APPLY) console.log(`\nRe-run with --apply to upload.`);
})().catch((e) => { console.error(e); process.exit(1); });
