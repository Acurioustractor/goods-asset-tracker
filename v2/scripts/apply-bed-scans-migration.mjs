// One-shot migration applier. Reads the bed_scans migration file and POSTs
// it to /rest/v1/rpc/exec_sql with the service-role key. If exec_sql isn't
// installed in this project, prints the SQL for manual paste into Supabase
// Studio's SQL editor.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '20260520000002_bed_scans.sql');
const sql = readFileSync(sqlPath, 'utf-8');

const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify({ sql }),
});

const body = await res.text();
if (!res.ok) {
  console.error(`exec_sql failed (${res.status}):`, body);
  console.error('\nFallback: paste the SQL below into Supabase Studio → SQL Editor:');
  console.error('---');
  console.error(sql);
  process.exit(1);
}

console.log('Migration applied:', body || '(no body)');
