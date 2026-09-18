#!/usr/bin/env node
/**
 * Wait for the Vercel PRODUCTION deployment of a commit to be READY, then print its URL.
 *
 * Why (18 Sep 2026): a merge to main does deploy production, but the build takes about two
 * minutes after the PR's own Vercel check goes green (that check is the PREVIEW). Reading the
 * live site before this returns READY gives a 404 that looks like a broken integration, and
 * it led to duplicate manual deployments twice. Run this, then read the page in a browser.
 *
 *   node scripts/wait-for-production.mjs <sha>
 * Needs VERCEL_ACCESS_TOKEN in the environment.
 */
const TEAM = 'benjamin-knights-projects';
const PROJECT = 'prj_9XDLD6G1yMhvYdJXtS6jYm62q2dc';
const sha = process.argv[2];
const token = process.env.VERCEL_ACCESS_TOKEN;
if (!sha || !token) { console.error('usage: VERCEL_ACCESS_TOKEN=... node scripts/wait-for-production.mjs <sha>'); process.exit(2); }

const api = async (path) => (await fetch(`https://api.vercel.com${path}${path.includes('?') ? '&' : '?'}teamId=${TEAM}`, { headers: { Authorization: `Bearer ${token}` } })).json();
const deadline = Date.now() + 15 * 60_000;
while (Date.now() < deadline) {
  const { deployments = [] } = await api(`/v6/deployments?projectId=${PROJECT}&target=production&limit=20`);
  const mine = deployments.filter((d) => (d.meta?.githubCommitSha ?? '').startsWith(sha));
  const ready = mine.find((d) => d.state === 'READY');
  if (ready) { console.log(`READY ${ready.uid} https://${ready.url} (source: ${ready.source ?? 'api'})`); process.exit(0); }
  const failed = mine.find((d) => d.state === 'ERROR' || d.state === 'CANCELED');
  if (failed && mine.every((d) => d.state === 'ERROR' || d.state === 'CANCELED')) { console.error(`${failed.state} ${failed.uid}`); process.exit(1); }
  console.log(mine.length ? `building: ${mine.map((d) => d.state).join(', ')}` : 'no production deployment for this commit yet');
  await new Promise((r) => setTimeout(r, 15_000));
}
console.error('timed out after 15 minutes: check Vercel before creating a deployment by hand');
process.exit(1);
