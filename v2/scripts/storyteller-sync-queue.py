#!/usr/bin/env python3
"""Resolve the "auto-create storytellers?" question the RIGHT way.

People tagged in Goods media_links who are NOT yet Goods project storytellers fall
into three buckets — and blind auto-create would wrongly mint storyteller records
for funders and reference people. So:

  LINK   — already an EL storyteller (crm empathy_ledger_id set, or exact/alias
           name match) AND a genuine community storyteller (crm role includes
           'storyteller', not a funder org). Action (safe, additive, reversible):
           add EL project_storytellers row + backfill crm.empathy_ledger_id.
  REVIEW — appears in Goods media but is a funder / partner / advisory / no-role
           person (Georgina Byron/Snow, Tanya Turner, Shaun Fisher, Dr Boe
           Reményi). NEVER auto-linked; a human decides.
  CREATE — genuine storyteller not in EL at all (Xavier, Katrina). NEVER auto-
           created; a human confirms, then creation happens in EL (the source of
           truth for people).

Read-only by default; --apply performs LINK only. Creating a person is never
automatic.  python3 scripts/storyteller-sync-queue.py [--apply]
"""
import json, urllib.request, urllib.error, os, re, subprocess, sys

APPLY = '--apply' in sys.argv
V2 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047'
TENANT = 'a1adca53-4c80-44b3-a859-e9e12b40e1a8'
ALIAS = {'shayne bloomfield': 'shane bloomfield', 'ben knight': 'benjamin knight'}
FUNDER_RE = re.compile(r'foundation|minderoo|philanthrop|trust\b|fund\b', re.I)
TITLE_RE = re.compile(r'^(dr|prof|professor|hon|sir)\b', re.I)  # professional/reference -> review
# Known non-community-storytellers (funders/reference) whose crm role says
# 'storyteller' but who should not be filed as Goods project storytellers without
# a human nod. Extend as needed.
NAME_REVIEW = {'georgina byron am', 'georgina byron'}

def env(name):
    return subprocess.run(['bash','-c',
        f"grep -E '^{name}=' '{V2}/.env.local' | head -1 | cut -d= -f2- | tr -d '\"' | tr -d \"'\" | xargs"],
        capture_output=True, text=True).stdout.strip()
GU, GK = env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY')
EU, EK = env('EMPATHY_LEDGER_SUPABASE_URL'), env('EMPATHY_LEDGER_SUPABASE_KEY')

def call(base, key, path, method='GET', body=None, prefer=None):
    h = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}
    if prefer: h['Prefer'] = prefer
    r = urllib.request.Request(f"{base}/rest/v1/{path}", headers=h, method=method,
                               data=json.dumps(body).encode() if body is not None else None)
    try:
        resp = urllib.request.urlopen(r, timeout=25); t = resp.read().decode()
        return resp.status, (json.loads(t) if t else None)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:160]
gg = lambda p: call(GU, GK, p)[1] or []
ee = lambda p: call(EU, EK, p)[1] or []

def main():
    pids = {r['target_key'] for r in gg("media_links?select=target_key&target_type=eq.person")}
    contacts = {c['id']: c for c in gg("crm_contacts?select=id,name,roles,organization,is_elder,empathy_ledger_id")}
    ps_names = {(r.get('storyteller') or {}).get('display_name', '').strip().lower()
                for r in ee(f"project_storytellers?project_id=eq.{PROJECT_ID}&select=storyteller:storytellers(display_name)")}
    els = {s['display_name'].strip().lower(): s['id'] for s in ee("storytellers?select=id,display_name&limit=600") if s.get('display_name')}
    already_ps_ids = {r['storyteller_id'] for r in ee(f"project_storytellers?project_id=eq.{PROJECT_ID}&select=storyteller_id")}

    def el_id_for(nm):
        k = nm.strip().lower()
        return els.get(k) or els.get(ALIAS.get(k))

    link, review, create = [], [], []
    for pid in pids:
        c = contacts.get(pid)
        if not c: continue
        nm = (c['name'] or '').strip()
        if not nm or nm.lower() in ps_names:
            continue
        roles = c.get('roles') or []
        org = c.get('organization') or ''
        is_storyteller_role = 'storyteller' in roles
        funder = bool(FUNDER_RE.search(org)) or nm.lower() in NAME_REVIEW
        titled = bool(TITLE_RE.match(nm))  # Dr/Prof -> professional/reference
        elid = c.get('empathy_ledger_id') or el_id_for(nm)
        entry = {'crm_id': pid, 'name': nm, 'roles': roles, 'org': org, 'el_id': elid, 'funder': funder}
        if elid and is_storyteller_role and not funder and not titled:
            link.append(entry)
        elif elid:  # exists in EL but funder / titled / non-storyteller role -> human decides
            entry['why'] = 'known funder/reference' if funder else ('professional title (verify)' if titled else f'role {roles or "none"} not storyteller')
            review.append(entry)
        elif is_storyteller_role:
            create.append(entry)  # genuine storyteller, not in EL
        else:
            entry['why'] = f'not in EL, role {roles or "none"}'
            review.append(entry)

    print(f"{'APPLY' if APPLY else 'DRY-RUN'} — storyteller sync queue\n")
    print(f"LINK (auto — add to Goods project + backfill crm el_id): {len(link)}")
    for e in link: print(f"  + {e['name']:22} roles={e['roles']}")
    print(f"\nREVIEW (human decides — NOT auto): {len(review)}")
    for e in review: print(f"  ? {e['name']:22} — {e.get('why')} (org={e['org'] or '-'})")
    print(f"\nCREATE (genuine storyteller, not in EL — human confirms, never auto): {len(create)}")
    for e in create: print(f"  ! {e['name']:22} roles={e['roles']}")

    if APPLY:
        linked = 0
        for e in link:
            if e['el_id'] not in already_ps_ids:
                st, _ = call(EU, EK, 'project_storytellers', 'POST',
                             {'project_id': PROJECT_ID, 'storyteller_id': e['el_id'], 'tenant_id': TENANT,
                              'role': 'storyteller', 'status': 'active'},
                             'resolution=ignore-duplicates,return=minimal')
                if st in (200, 201, 204, 409): linked += 1
                else: print(f"  link fail {e['name']}: {st}")
            # backfill the durable Goods->EL link on the crm side
            if not contacts[e['crm_id']].get('empathy_ledger_id'):
                call(GU, GK, f"crm_contacts?id=eq.{e['crm_id']}", 'PATCH',
                     {'empathy_ledger_id': e['el_id']}, 'return=minimal')
        print(f"\nAPPLIED: linked {linked} to Goods project + backfilled crm empathy_ledger_id. REVIEW/CREATE untouched.")
    else:
        print("\nRe-run with --apply to perform the LINK actions only (review/create stay human-gated).")

if __name__ == '__main__':
    main()
