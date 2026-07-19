#!/bin/bash
# Applies scripts/migrations/2026-07-19-community-os-columns.sql to the Goods
# project (cwsyhpiuepvdjtxaozwf) via the Supabase Management API, using the
# access token from your own shell (supabase login). Run by Ben with `!`.
set -euo pipefail
TOK=$(cat ~/.supabase/access-token 2>/dev/null || security find-generic-password -s 'Supabase CLI' -w)
SQL=$(grep -v '^--' "$(dirname "$0")/migrations/2026-07-19-community-os-columns.sql" | tr '\n' ' ')
python3 - "$TOK" "$SQL" <<'EOF'
import json, sys, urllib.request
tok, sql = sys.argv[1], sys.argv[2]
req = urllib.request.Request(
    "https://api.supabase.com/v1/projects/cwsyhpiuepvdjtxaozwf/database/query",
    data=json.dumps({"query": sql}).encode(),
    headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
    method="POST",
)
try:
    print(urllib.request.urlopen(req).read().decode())
    print("MIGRATION APPLIED OK")
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())
    sys.exit(1)
EOF
