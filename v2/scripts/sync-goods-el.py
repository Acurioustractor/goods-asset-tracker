#!/usr/bin/env python3
"""Two-way Goods <-> Empathy Ledger sync (npm run sync:el).

Philosophy (wiki/canon/el-goods-alignment.md): EL is the source of truth for
people, media files and consent; Goods references and enriches. This keeps the
two aligned:

  Goods -> EL : for every Goods media_links tag on media that lives in EL (an
                el_media id, or an external EL-proxy URL), push the enrichment to
                EL — community place + VERIFIED nation, and storyteller links
                (person -> crm name -> EL project_storyteller id). Never guesses a
                nation; never uploads a duplicate file.
  EL -> Goods : report EL Goods storytellers + media not yet referenced in Goods,
                so new EL content surfaces in Goods.

Read-only by default; write with --apply.
    python3 scripts/sync-goods-el.py [--apply]
"""
import json, urllib.request, urllib.error, os, re, subprocess, sys

APPLY = '--apply' in sys.argv
V2 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047'
TENANT = 'a1adca53-4c80-44b3-a859-e9e12b40e1a8'

def env(name):
    return subprocess.run(['bash','-c',
        f"grep -E '^{name}=' '{V2}/.env.local' | head -1 | cut -d= -f2- | tr -d '\"' | tr -d \"'\" | xargs"],
        capture_output=True, text=True).stdout.strip()
G_URL, G_KEY = env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY')
E_URL, E_KEY = env('EMPATHY_LEDGER_SUPABASE_URL'), env('EMPATHY_LEDGER_SUPABASE_KEY')

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
g = lambda p: call(G_URL, G_KEY, p)[1] or []
e = lambda p: call(E_URL, E_KEY, p)[1] or []

PLACE = {'utopia':'Utopia Homelands (Urapuntja)','tennant-creek':'Tennant Creek','palm-island':'Palm Island',
         'kalgoorlie':'Kalgoorlie','alice-springs':'Alice Springs','katherine':'Katherine / Nitmiluk',
         'kununurra':'Lake Argyle / Kununurra','maningrida':'Maningrida','mt-isa':'Mount Isa','darwin':'Darwin','canberra':'Canberra'}
VERIFIED_NATION = {'palm-island':['Bwgcolman','Manbarra'],'alice-springs':['Mparntwe','Arrernte Country']}
ALIAS = {'shayne bloomfield':'shane bloomfield','ben knight':'benjamin knight'}

def el_id_from(source, key):
    if source == 'el_media': return key
    if source == 'external':
        m = re.search(r'/media/([0-9a-f-]{36})/', key or '')
        return m.group(1) if m else None
    return None

def main():
    # --- resolvers ---
    contacts = {c['id']: c['name'] for c in g('crm_contacts?select=id,name')}
    ps = e(f"project_storytellers?project_id=eq.{PROJECT_ID}&select=storyteller:storytellers(id,display_name)")
    name2st = {}
    for r in ps:
        s = r.get('storyteller') or {}
        if s.get('display_name'): name2st[s['display_name'].strip().lower()] = s['id']
    resolve_st = lambda nm: name2st.get(nm.strip().lower()) or name2st.get(ALIAS.get(nm.strip().lower()))

    # --- Goods -> EL: push tags on EL-referenced media ---
    ml = g("media_links?select=media_source,media_key,target_type,target_key")
    # group by the EL media id
    by_el = {}
    for r in ml:
        eid = el_id_from(r['media_source'], r['media_key'])
        if eid: by_el.setdefault(eid, []).append(r)
    # current EL state for those ids
    ids = list(by_el)
    cur, links = {}, {}
    for i in range(0, len(ids), 40):
        for r in e(f"media_assets?id=in.({','.join(ids[i:i+40])})&select=id,country_or_place,nation_or_community"):
            cur[r['id']] = r
        for l in e(f"media_storytellers?media_asset_id=in.({','.join(ids[i:i+40])})&select=media_asset_id,storyteller_id"):
            links.setdefault(l['media_asset_id'], set()).add(l['storyteller_id'])

    place_set = nation_set = links_added = 0
    nation_flag, st_review = set(), set()
    for eid, rows in by_el.items():
        if eid not in cur: continue  # not a Goods-project EL asset
        patch = {}
        comms = [r['target_key'] for r in rows if r['target_type'] == 'community']
        if comms:
            slug = comms[0]
            if not cur[eid].get('country_or_place'): patch['country_or_place'] = PLACE.get(slug, slug)
            v = VERIFIED_NATION.get(slug)
            if v and not cur[eid].get('nation_or_community'): patch['nation_or_community'] = v
            elif not v: nation_flag.add(slug)
        want_st = []
        for r in rows:
            if r['target_type'] != 'person': continue
            nm = contacts.get(r['target_key'])
            if not nm: continue
            sid = resolve_st(nm)
            if sid and sid not in links.get(eid, set()): want_st.append(sid)
            elif not sid: st_review.add(nm)
        if APPLY:
            if patch:
                st, _ = call(E_URL, E_KEY, f"media_assets?id=eq.{eid}", 'PATCH', patch, 'return=minimal')
                if st in (200, 204):
                    place_set += 1 if 'country_or_place' in patch else 0
                    nation_set += 1 if 'nation_or_community' in patch else 0
            for sid in want_st:
                st, _ = call(E_URL, E_KEY, 'media_storytellers', 'POST',
                             {'media_asset_id': eid, 'storyteller_id': sid, 'tenant_id': TENANT,
                              'relationship': 'appears_in', 'consent_status': 'pending', 'source': 'batch'},
                             'resolution=ignore-duplicates,return=minimal')
                if st in (200, 201, 204): links_added += 1
        else:
            place_set += 1 if patch.get('country_or_place') else 0
            nation_set += 1 if patch.get('nation_or_community') else 0
            links_added += len(want_st)

    # --- EL -> Goods: what EL has that Goods doesn't reference yet ---
    el_media = e(f"media_assets?project_id=eq.{PROJECT_ID}&select=id")
    el_ids = {r['id'] for r in el_media}
    goods_refs = set(by_el)
    el_not_in_goods = el_ids - goods_refs
    goods_contact_names = {n.strip().lower() for n in contacts.values() if n}
    st_not_in_goods = [nm for nm in name2st if nm not in goods_contact_names]

    print(f"{'APPLIED' if APPLY else 'DRY-RUN'} — two-way Goods <-> EL sync\n")
    print("Goods -> EL (enrich EL from Goods tags on shared media):")
    print(f"  media matched (EL-referenced Goods links): {sum(1 for eid in by_el if eid in cur)}")
    print(f"  country_or_place set: {place_set}   verified nation set: {nation_set}   storyteller links added: {links_added}")
    print(f"  communities w/o verified nation (community input needed, not guessed): {sorted(nation_flag)}")
    print(f"  person tags unresolved to a project storyteller (skipped, not guessed): {sorted(st_review)}")
    print("\nEL -> Goods (new in EL, surface in Goods):")
    print(f"  EL Goods media not yet referenced by Goods media_links: {len(el_not_in_goods)} / {len(el_ids)}")
    print(f"  EL project storytellers with no matching Goods crm contact: {len(st_not_in_goods)}")
    if not APPLY: print("\nRe-run with --apply to push Goods -> EL enrichments.")

if __name__ == '__main__':
    main()
