#!/usr/bin/env bash
# Weekly Goods impact resync: live assets → GHL rollups (Ben's curated mapping).
# Schedule e.g. Mon 7:40am AEST. env -u clears shell-profile vars that shadow --env-file.
set -euo pipefail
cd "/Users/benknight/Code/Goods Asset Register"
env -u NEXT_PUBLIC_SUPABASE_URL -u SUPABASE_URL -u SUPABASE_SERVICE_ROLE_KEY \
    -u NEXT_PUBLIC_SUPABASE_ANON_KEY -u GHL_API_KEY -u GHL_LOCATION_ID \
  node --env-file=v2/.env.local v2/scripts/sync-goods-impact-rollups.mjs --apply
