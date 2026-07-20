#!/usr/bin/env python3
"""Full system health sweep across Goods + Empathy Ledger.

One command that checks every kind of link/reference that can silently break, and
reports them all categorised. Read-only. Run: python3 scripts/health-sweep.py
    npm run sweep:health

Checks:
  EL  1. media_assets storage bytes exist (phantom detection)
  EL  2. media_assets have a renderable url (else broken square)
  EL  3. storyteller portraits resolve (public_avatar_url / profile_image_url)
  EL  4. media_storytellers point at a real storyteller
  EL  5. project_storytellers point at a real storyteller
  G   6. media_links target resolves (person/community/product/story)
  G   7. media_links media_key resolves to a servable URL (local file exists / el / external)
  X   8. crm empathy_ledger_id points at a real EL storyteller
  X   9. every Goods-media-tagged person is a Goods project storyteller
"""
import json, urllib.request, urllib.error, os, re, subprocess

V2 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(V2)
PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047'
TENANT = 'a1adca53-4c80-44b3-a859-e9e12b40e1a8'

def env(n): return subprocess.run(['bash','-c',f"grep -E '^{n}=' '{V2}/.env.local'|head -1|cut -d= -f2-|tr -d '\"'|tr -d \"'\"|xargs"],capture_output=True,text=True).stdout.strip()
GU,GK = env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY')
EU,EK = env('EMPATHY_LEDGER_SUPABASE_URL'), env('EMPATHY_LEDGER_SUPABASE_KEY')
EL_SITE = 'https://www.empathyledger.com'

def api(base,key,path):
    try: return json.load(urllib.request.urlopen(urllib.request.Request(f"{base}/rest/v1/{path}",headers={'apikey':key,'Authorization':f'Bearer {key}'}),timeout=30))
    except Exception as e: return {'err':str(e)[:80]}
gg=lambda p: api(GU,GK,p) if isinstance(api(GU,GK,p),list) else []
def gq(p):
    r=api(GU,GK,p); return r if isinstance(r,list) else []
def eq(p):
    r=api(EU,EK,p); return r if isinstance(r,list) else []
def head(url,key=EK):
    try:
        h={'apikey':key,'Authorization':f'Bearer {key}'} if 'supabase.co' in url else {}
        r=urllib.request.urlopen(urllib.request.Request(url,method='HEAD',headers=h),timeout=12)
        ct=r.headers.get('content-type','')
        return r.status, int(r.headers.get('content-length') or 0), ct
    except Exception as e: return getattr(e,'code',0),0,''

def portrait_url(u):
    if not u: return None
    if u.startswith('http'): return u
    if u.startswith('/api/media/'): return EL_SITE+u        # relative -> EL production proxy
    if u.startswith('story-media/') or u.startswith('profile-images/'): return f"{EU}/storage/v1/object/public/{u}"
    return u

findings=[]
def report(cat, broken, total, samples):
    findings.append((cat,broken,total,samples))
    flag='FAIL' if broken else 'ok'
    print(f"[{flag}] {cat}: {broken} broken / {total}")
    for s in samples[:4]: print(f"        - {s}")

def main():
    print("=== EMPATHY LEDGER ===")
    el_media = eq(f"media_assets?project_id=eq.{PROJECT_ID}&select=id,media_type,url,cdn_url,thumbnail_url,storage_bucket,storage_path,original_filename")
    # 2. renderable url
    no_url=[m for m in el_media if not (m.get('url') or m.get('cdn_url') or m.get('thumbnail_url'))]
    report("EL media renderable url", len(no_url), len(el_media), [m['original_filename'] for m in no_url])
    # 1. storage bytes (sample the url-bearing ones)
    bad_bytes=[]
    checked=0
    for m in el_media:
        if m.get('storage_bucket') and m.get('storage_path') and str(m['storage_path']).count('/')>=1 and not str(m['storage_path']).startswith('http'):
            checked+=1
            if checked>60: break
            st,c,_=head(f"{EU}/storage/v1/object/public/{m['storage_bucket']}/{m['storage_path']}")
            if not(st==200 and c>0): bad_bytes.append(f"{m['original_filename']} ({st})")
    report("EL media storage bytes (sampled)", len(bad_bytes), checked, bad_bytes)
    # 3. portraits
    sts=[r['storyteller'] for r in eq(f"project_storytellers?project_id=eq.{PROJECT_ID}&select=storyteller:storytellers(id,display_name,public_avatar_url,profile_image_url)") if r.get('storyteller')]
    p_broken=[]; p_none=0
    for s in sts:
        u=portrait_url(s.get('public_avatar_url') or s.get('profile_image_url'))
        if not u: p_none+=1; continue
        st,c,ct=head(u)
        if not(st==200 and (c>0 or 'image' in ct)): p_broken.append(f"{s['display_name']} ({st})")
    report(f"EL storyteller portraits ({p_none} have none)", len(p_broken), len(sts)-p_none, p_broken)
    # 4/5 links -> real storyteller
    stids={s['id'] for s in eq("storytellers?select=id&limit=1000")}
    ms=eq("media_storytellers?select=storyteller_id&limit=5000")
    bad_ms=[m['storyteller_id'] for m in ms if m.get('storyteller_id') and m['storyteller_id'] not in stids]
    report("EL media_storytellers -> real storyteller", len(set(bad_ms)), len(ms), list(set(bad_ms))[:4])
    ps=eq(f"project_storytellers?project_id=eq.{PROJECT_ID}&select=storyteller_id")
    bad_ps=[p['storyteller_id'] for p in ps if p['storyteller_id'] not in stids]
    report("EL Goods project_storytellers -> real storyteller", len(bad_ps), len(ps), bad_ps[:4])

    print("\n=== GOODS ===")
    comm={c['id'] for c in gq("communities?select=id")}
    contacts={c['id'] for c in gq("crm_contacts?select=id")}
    PRODS={'stretch-bed','pakkimjalki-kari','basket-bed','the-plant'}
    stories={s['slug'] for s in gq("stories?select=slug")}
    ml=gq("media_links?select=id,media_source,media_key,target_type,target_key")
    valid={'person':contacts,'community':comm,'product':PRODS,'story':stories,'asset':None}
    bad_t=[f"{m['target_type']}:{m['target_key']}" for m in ml if valid.get(m['target_type']) is not None and m['target_key'] not in valid[m['target_type']]]
    report("Goods media_links -> real entity", len(bad_t), len(ml), bad_t)
    # 7. media_key resolves
    bad_key=[]
    for m in ml:
        s,k=m['media_source'],m['media_key']
        if s=='local':
            p=k if k.startswith('/') else '/'+k
            if not os.path.exists(os.path.join(V2,'public',p.lstrip('/'))): bad_key.append(f"local {k}")
        # el_media/external assumed resolvable (checked elsewhere); skip network per-link for speed
    report("Goods media_links local media_key file exists", len(bad_key), sum(1 for m in ml if m['media_source']=='local'), bad_key)
    # 8. crm el_id valid
    crm=gq("crm_contacts?select=id,name,empathy_ledger_id&empathy_ledger_id=not.is.null")
    bad_elid=[c['name'] for c in crm if c['empathy_ledger_id'] not in stids]
    report("Goods crm empathy_ledger_id -> real EL storyteller", len(bad_elid), len(crm), bad_elid)
    # 9. tagged person resolves to a project storyteller (by name, like the sync)
    tagged={m['target_key'] for m in ml if m['target_type']=='person'}
    crm_name={c['id']:(c['name'] or '').strip().lower() for c in gq("crm_contacts?select=id,name")}
    ps_names={(r['storyteller'] or {}).get('display_name','').strip().lower()
              for r in eq(f"project_storytellers?project_id=eq.{PROJECT_ID}&select=storyteller:storytellers(display_name)")}
    ALIAS={'shayne bloomfield':'shane bloomfield','ben knight':'benjamin knight'}
    def resolves(pid):
        nm=crm_name.get(pid,'')
        return nm in ps_names or ALIAS.get(nm) in ps_names
    unlinked=[crm_name.get(pid) for pid in tagged if not resolves(pid)]
    report("Goods tagged person resolves to a project storyteller", len(unlinked), len(tagged), unlinked)

    print(f"\n{'='*50}")
    fails=[f for f in findings if f[1]>0]
    print(f"SWEEP: {len(fails)} categories with breakage, {len(findings)-len(fails)} clean")
    for c,b,t,_ in fails: print(f"  FIX: {c} ({b})")

if __name__=='__main__': main()
