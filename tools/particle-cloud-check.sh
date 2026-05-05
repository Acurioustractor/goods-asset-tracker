#!/usr/bin/env bash
# Compare each registered Particle coreid's Particle Cloud "last seen" with our
# usage_logs "last_seen_at". Splits "device problem" from "pipeline problem"
# without needing a site visit.
#
# Usage:
#   PARTICLE_ACCESS_TOKEN=your-token ./tools/particle-cloud-check.sh
#
# Get a token from https://console.particle.io → user icon → Settings →
# Access Tokens. A 30-day token is fine. Paste here, do not commit.

set -euo pipefail

if [[ -z "${PARTICLE_ACCESS_TOKEN:-}" ]]; then
  echo "ERROR: PARTICLE_ACCESS_TOKEN not set."
  echo "Get a token from console.particle.io and run:"
  echo "  PARTICLE_ACCESS_TOKEN=xxx $0"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/v2/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found."
  exit 1
fi

SUPA_URL="https://cwsyhpiuepvdjtxaozwf.supabase.co"
SUPA_KEY=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' "$ENV_FILE" | cut -d'"' -f2)

echo "1) Listing devices visible to your Particle account..."
particle_devices=$(curl -fsS "https://api.particle.io/v1/devices" \
  -H "Authorization: Bearer $PARTICLE_ACCESS_TOKEN")

echo "$particle_devices" | python3 -c "
import json, sys, urllib.request, os
from datetime import datetime, timezone

devices = json.load(sys.stdin)
print(f'   Particle account sees {len(devices)} devices.')
print()

# Pull our local last-seen for every coreid via the deployments RPC
key = os.environ['SUPA_KEY']
req = urllib.request.Request(
    'https://cwsyhpiuepvdjtxaozwf.supabase.co/rest/v1/rpc/get_all_washing_deployments',
    data=b'{}',
    headers={'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
    method='POST',
)
deployments = json.load(urllib.request.urlopen(req))
local_by_id = {d['machine_id']: d for d in deployments if d['machine_id']}

print('2) Comparing Particle Cloud last-seen vs our usage_logs last-seen:')
print()
print(f'{'coreid':<32} {'particle_last_seen':<22} {'our_last_seen':<22} {'verdict'}')
print('-' * 110)

now = datetime.now(timezone.utc)
def parse(s):
    if not s: return None
    return datetime.fromisoformat(s.replace('Z','+00:00'))

for d in devices:
    coreid = d.get('id')
    pcloud = d.get('last_heard') or d.get('last_handshake_at')
    pdt = parse(pcloud)
    local = local_by_id.get(coreid)
    odt = parse(local.get('last_seen_at')) if local else None

    if pdt and odt:
        gap_days = (pdt - odt).days
        if abs(gap_days) <= 1:
            verdict = 'AGREES — both recent or both old'
        elif pdt > odt:
            days_diff = (pdt - odt).days
            verdict = f'PIPELINE BREAK — Particle saw it {days_diff}d after our DB stopped'
        else:
            verdict = 'WEIRD — our DB has newer than Particle?'
    elif pdt and not odt:
        verdict = 'NEW DEVICE — Particle has it, our DB does not'
    elif not pdt and odt:
        verdict = 'PARTICLE FORGOT — our DB has it, Particle does not'
    else:
        verdict = 'BOTH BLANK — never seen'

    p_str = pdt.strftime('%Y-%m-%d %H:%M') if pdt else '—'
    o_str = odt.strftime('%Y-%m-%d %H:%M') if odt else '—'
    print(f'{coreid:<32} {p_str:<22} {o_str:<22} {verdict}')

# Also flag local devices Particle does not know about
print()
print('3) Local DB has these coreids but Particle account does NOT:')
particle_ids = {d.get('id') for d in devices}
orphans = [m for m in local_by_id if m and m.startswith('e00fce68') and m not in particle_ids]
if not orphans:
    print('   (none — all our coreids are visible to your Particle account)')
else:
    for o in orphans:
        ls = local_by_id[o].get('last_seen_at') or '—'
        print(f'   {o}  last_seen={ls}')
        print(f'     → these were either deleted from Particle, registered to a different Particle account, or never claimed.')
" SUPA_KEY="$SUPA_KEY"

echo
echo "Done. Read the verdict column:"
echo "  AGREES → device-side fix needed (power, SIM, site visit)"
echo "  PIPELINE BREAK → device alive in Particle but not landing in DB; check Zapier task history + Vercel webhook logs"
echo "  PARTICLE FORGOT → device deleted from Particle account or token doesn't see it"
echo "  ORPHANS LIST → consider claiming under your Particle account"
