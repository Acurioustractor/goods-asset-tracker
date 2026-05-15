#!/usr/bin/env node
/**
 * Fetch all Goods grant-related Gmail attachments and save to
 * wiki/raw/grants-archive/<funder>/. Uses the act-global-infrastructure
 * Google service account with domain-wide delegation.
 *
 * Usage:
 *   node tools/fetch-grant-attachments.mjs           # list mode (no download)
 *   node tools/fetch-grant-attachments.mjs --apply   # download
 */
import '../../act-global-infrastructure/scripts/lib/load-env.mjs';
import { google } from '/Users/benknight/Code/act-global-infrastructure/node_modules/googleapis/build/src/index.js';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const APPLY = process.argv.includes('--apply');
const ROOT = '/Users/benknight/Code/Goods Asset Register/wiki/raw/grants-archive';

// BWS secret loader (mirrors act-global-infrastructure pattern)
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

async function gmailFor(userEmail) {
  const credentials = JSON.parse(getSecret('GOOGLE_SERVICE_ACCOUNT_KEY'));
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    subject: userEmail,
  });
  await auth.authorize();
  return google.gmail({ version: 'v1', auth });
}

// Threads to fetch. Each entry: { id, folder, label }
// Folders match wiki/raw/grants-archive subdirs
const THREADS = [
  // FRRR + VFFF Backing the Future
  { id: '19d00780aba04151', folder: 'frrr', label: 'FRRR-acquittal-thread' },
  { id: '19839b845a4fbf14', folder: 'frrr', label: 'FRRR-grant-agreement' },
  { id: '1971f2d1fda6e0b2', folder: 'frrr', label: 'FRRR-award-next-steps' },
  { id: '19c2bf0d5d74a4a1', folder: 'frrr', label: 'FRRR-mid-point-checkin' },
  // Snow Foundation
  { id: '198cf4083d7e0b07', folder: 'snow-foundation', label: 'Snow-application-NM-draft' },
  { id: '19be87e50a1f077b', folder: 'snow-foundation', label: 'Snow-R4-draft-proposal' },
  // TFN
  { id: '198cad0e9ad9f8b5', folder: 'tfn', label: 'TFN-rehearsal-prep' },
  { id: '19c54c236ce75a86', folder: 'tfn', label: 'TFN-6-month-impact-update' },
  { id: '19ac786b42dde41e', folder: 'tfn', label: 'TFN-grant-distribution' },
  { id: '19b2f713e7c3c8f7', folder: 'tfn', label: 'TFN-final-grant-distribution' },
  { id: '19b0b08358c511b6', folder: 'tfn', label: 'TFN-grant' },
  // AMP Spark
  { id: '18f996177156679f', folder: 'amp-spark', label: 'AMP-application' },
  { id: '18feb575981e2089', folder: 'amp-spark', label: 'AMP-award' },
  { id: '190d97518f59644a', folder: 'amp-spark', label: 'AMP-tomorrow-makers-welcome' },
  // Dusseldorp
  { id: '19b0a14ca8fc43dd', folder: 'dusseldorp', label: 'Dusseldorp-15K-mounty-backyard' },
  // QBE Catalysing Impact
  { id: '19c20b667148cc3a', folder: 'catalysing-impact-eoi', label: 'QBE-EOI-thank-you' },
  { id: '19d47e1cc23ed3d2', folder: 'catalysing-impact-eoi', label: 'QBE-induction-followup' },
  // REAL Innovation Fund
  { id: '19cacf6feb432a09', folder: 'real-innovation-fund', label: 'REAL-Oonchiumpa-application' },
  { id: '19cb10ca54906106', folder: 'real-innovation-fund', label: 'REAL-PICC-EOI' },
  { id: '19cc12588c28ddf5', folder: 'real-innovation-fund', label: 'REAL-additional-info-request' },
  { id: '19d2d3926ec94b32', folder: 'real-innovation-fund', label: 'REAL-status-enquiry' },
  // Rotary
  { id: '19730f44f627fc82', folder: 'rotary-eclub-outback', label: 'Rotary-application-receipt' },
  { id: '19d13685bbf18877', folder: 'rotary-eclub-outback', label: 'Rotary-application-fwd' },
  // Minderoo
  { id: '19d6ba03d76ea3ca', folder: 'minderoo', label: 'Minderoo-thank-you' },
  { id: '19d18192e105254b', folder: 'minderoo', label: 'Minderoo-CONTAINED-tour' },
  // PRF / PFI
  { id: '19a1366188ceeb21', folder: 'paul-ramsay-foundation', label: 'PRF-thank-you-meeting' },
  { id: '1999e7fd3dea423c', folder: 'paul-ramsay-foundation', label: 'PRF-lunch' },
  // TFFF
  { id: '1993607b476a7ea4', folder: 'tim-fairfax-family-foundation', label: 'TFFF-FY25-annual-report' },
  // Bryan Foundation
  { id: '197b9024461655c4', folder: 'bryan-foundation', label: 'Bryan-Goods-intro' },
  // Partner letters
  { id: '1975c2bb32b33b30', folder: 'partner-letters-centrecorp-tennant', label: 'Centrecorp-Goods-intro' },
  { id: '19c2bad8e8a35e52', folder: 'partner-letters-centrecorp-tennant', label: 'Tennant-Creek-bed-funding-Centrecorp' },
  { id: '1961d9ca247b225e', folder: 'partner-letters-centrecorp-tennant', label: 'Healthy-Homes-Tennant' },
  // Anyinginyi
  // covered by Rotary thread
  // Our Community Shed
  { id: '19b3364fddec7a4e', folder: 'our-community-shed', label: 'Our-Shed-CBF-application' },
  { id: '19dc6d2d0cee441c', folder: 'our-community-shed', label: 'Our-Shed-CBF-unsuccessful' },
  // Bunnings
  { id: '191d4567a6ff1d76', folder: 'bunnings', label: 'Bunnings-Goods-intro' },
  { id: '196187f589e81ad1', folder: 'bunnings', label: 'Bunnings-2400-crates' },
  // Civeo
  { id: '1971528b6eccffa0', folder: 'civeo', label: 'Civeo-partnership-pathway' },
  // Zinus
  { id: '196325a40e576ffd', folder: 'zinus', label: 'Zinus-toppers' },
  // PICC
  { id: '199be36bc0cb15bd', folder: 'picc-palm-island', label: 'PICC-Station-activation-plan' },
  { id: '19af5dd21899ff14', folder: 'picc-palm-island', label: 'PICC-payment-processed' },
];

const USERS = ['nicholas@act.place', 'benjamin@act.place'];

function safeName(s) {
  return s.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_').slice(0, 100);
}

function findAttachmentParts(payload) {
  const out = [];
  function walk(part) {
    if (!part) return;
    const fname = part.filename;
    const id = part.body?.attachmentId;
    const size = part.body?.size || 0;
    if (fname && id && size > 0) {
      out.push({ filename: fname, attachmentId: id, mimeType: part.mimeType, size, partId: part.partId });
    }
    if (Array.isArray(part.parts)) for (const p of part.parts) walk(p);
  }
  walk(payload);
  return out;
}

async function fetchThreadAttachments(thread) {
  for (const user of USERS) {
    let gmail;
    try {
      gmail = await gmailFor(user);
    } catch (e) {
      console.log(`  ⚠ auth failed for ${user}: ${e.message}`);
      continue;
    }
    let res;
    try {
      res = await gmail.users.threads.get({ userId: 'me', id: thread.id, format: 'full' });
    } catch (e) {
      if (e.code === 404) continue; // try next user
      console.log(`  ⚠ thread ${thread.id} error for ${user}: ${e.message}`);
      continue;
    }
    const messages = res.data.messages || [];
    const collected = [];
    for (const msg of messages) {
      const parts = findAttachmentParts(msg.payload);
      for (const att of parts) {
        const isPdf = att.mimeType === 'application/pdf' || (att.filename || '').toLowerCase().endsWith('.pdf');
        const isDocx = (att.filename || '').toLowerCase().endsWith('.docx') || (att.filename || '').toLowerCase().endsWith('.doc') || (att.filename || '').toLowerCase().endsWith('.docm');
        const isXlsx = (att.filename || '').toLowerCase().endsWith('.xlsx') || (att.filename || '').toLowerCase().endsWith('.xls');
        if (!(isPdf || isDocx || isXlsx)) continue;
        collected.push({ msgId: msg.id, msgDate: msg.internalDate, ...att });
      }
    }
    return { user, messages: messages.length, collected };
  }
  return null;
}

async function downloadOne(userEmail, msgId, attachmentId) {
  const gmail = await gmailFor(userEmail);
  const res = await gmail.users.messages.attachments.get({ userId: 'me', messageId: msgId, id: attachmentId });
  return Buffer.from(res.data.data, 'base64url');
}

(async () => {
  console.log(`Mode: ${APPLY ? 'APPLY (downloading)' : 'DRY RUN (list only)'}`);
  console.log(`Target root: ${ROOT}`);
  console.log(`Threads to scan: ${THREADS.length}\n`);

  let totalFound = 0, totalSaved = 0, totalSkipped = 0;

  for (const t of THREADS) {
    process.stdout.write(`[${t.folder}/${t.label}] ${t.id} ... `);
    const result = await fetchThreadAttachments(t);
    if (!result) { console.log('no access / not found'); continue; }
    const { user, collected } = result;
    if (collected.length === 0) { console.log(`0 attachments (${user})`); continue; }
    console.log(`${collected.length} attachments (via ${user})`);
    totalFound += collected.length;

    for (const att of collected) {
      const dateStr = new Date(parseInt(att.msgDate)).toISOString().slice(0, 10);
      const filename = `${dateStr}_${safeName(t.label)}_${safeName(att.filename)}`;
      const dir = join(ROOT, t.folder);
      const path = join(dir, filename);
      console.log(`    → ${filename} (${(att.size / 1024).toFixed(0)}KB, ${att.mimeType})`);
      if (!APPLY) continue;
      if (existsSync(path)) { console.log(`      ⏭  already exists, skipping`); totalSkipped++; continue; }
      try {
        const buf = await downloadOne(user, att.msgId, att.attachmentId);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(path, buf);
        console.log(`      ✓ saved (${buf.length} bytes)`);
        totalSaved++;
      } catch (e) {
        console.log(`      ✗ error: ${e.message}`);
      }
    }
  }

  console.log(`\n--- summary ---`);
  console.log(`attachments found: ${totalFound}`);
  console.log(`saved: ${totalSaved}`);
  console.log(`skipped (already exist): ${totalSkipped}`);
  if (!APPLY) console.log(`\nRe-run with --apply to download.`);
})().catch((e) => { console.error(e); process.exit(1); });
