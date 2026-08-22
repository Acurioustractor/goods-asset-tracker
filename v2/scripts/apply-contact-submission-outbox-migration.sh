#!/bin/bash
# Applies only the durable public-contact outbox migration to the Goods project.
# Do not replace this with `supabase db push`: the remote migration ledger has
# existing unrelated drift.
set -euo pipefail

project_ref='cwsyhpiuepvdjtxaozwf'
script_dir="$(cd "$(dirname "$0")" && pwd)"
migration="$script_dir/../supabase/migrations/20260822090000_contact_submission_outbox.sql"
access_token="$(cat ~/.supabase/access-token 2>/dev/null || security find-generic-password -s 'Supabase CLI' -w)"
request_body="$(python3 -c 'import json,sys; print(json.dumps({"query": open(sys.argv[1]).read()}))' "$migration")"

curl -fsS -X POST "https://api.supabase.com/v1/projects/${project_ref}/database/query" \
  -H "Authorization: Bearer ${access_token}" \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: supabase-cli' \
  --data "$request_body"

echo 'Contact submission outbox migration applied.'
