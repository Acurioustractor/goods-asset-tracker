#!/bin/bash
# Applies scripts/migrations/2026-07-20-media-links.sql to the Goods
# project (cwsyhpiuepvdjtxaozwf) via the Supabase Management API, using the
# access token from your own shell (supabase login).
# Sends the file verbatim (newlines preserved — the SQL has inline -- comments,
# so collapsing newlines comments out the rest of the statement) with a curl
# User-Agent, since the default urllib UA gets a Cloudflare 403.
# APPLIED 2026-07-20; idempotent, safe to re-run.
set -euo pipefail
TOK=$(cat ~/.supabase/access-token 2>/dev/null || security find-generic-password -s 'Supabase CLI' -w)
DIR=$(dirname "$0")
BODY=$(python3 -c 'import json,sys; print(json.dumps({"query": open(sys.argv[1]).read()}))' "$DIR/migrations/2026-07-20-media-links.sql")
curl -sf -X POST "https://api.supabase.com/v1/projects/cwsyhpiuepvdjtxaozwf/database/query" \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -H "User-Agent: supabase-cli" -d "$BODY" \
  && echo "MIGRATION APPLIED OK"
