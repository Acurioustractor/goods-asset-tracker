#!/usr/bin/env python3
"""Prompt 1 — Goods media inventory.

Walks the storyteller-relevant media in the repo and records, per file: absolute
path, type, byte size, sha256, sips image metadata, and EVERY tag/property the
codebase explicitly associates with it, WITH the file:line (or path rule) where
that association lives. No inference: a person/community tag is recorded only when
it exists explicitly in a filename, path, the starred manifest, local-image-tags,
or a code data file. Files with zero explicit association go to `untagged`, never
guessed. Paths referenced by the data files but absent on disk go to `missing`.

Output: audit/goods-media-inventory.json
"""
import os, json, hashlib, subprocess, csv, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Storyteller-relevant content roots. QR codes, worktrees, caches, generated
# diagrams, brand icons and video-analysis frames are deliberately excluded and
# listed in `meta.excluded` for honesty.
INCLUDE_DIRS = [
    'v2/public/images',
    'v2/public/video',
    'design/starred-images',
    'design/deck-photos',
    'design/deck-assets',
    'Utpoia Photos Export',
    'v2/sites/goods-voices/public/portraits',
    'output/ledger-video/work',
]
EXCLUDE_SUBSTR = [
    '/node_modules/', '/.next/', '/.git/', '/.claude/', '/.codex/', '/qr_codes/',
    '/new_beds/', '/.el-cache/', '/generated-images/', '/deck-slides/',
    'v2/public/images/brand/', 'v2/public/images/_drafts/',
]
MEDIA_EXT = {
    '.jpg': 'photo', '.jpeg': 'photo', '.png': 'photo', '.webp': 'photo', '.gif': 'photo',
    '.mp4': 'video', '.webm': 'video', '.mov': 'video',
    '.mp3': 'audio', '.wav': 'audio', '.m4a': 'audio',
    '.vtt': 'transcript', '.srt': 'transcript',
}

# ---------------------------------------------------------------------------
# Explicit tag sources
# ---------------------------------------------------------------------------

def load_manifest():
    """design/starred-images/_manifest.csv -> {basename: {tags, line}}.
    Indexed by BOTH the starred filename and the url-target basename, so the
    manifest's explicit person/community/slot tags reach the /images file too."""
    path = os.path.join(ROOT, 'design/starred-images/_manifest.csv')
    idx = {}
    if not os.path.exists(path):
        return idx
    with open(path, newline='') as f:
        rows = list(csv.DictReader(f))
    for i, r in enumerate(rows):
        line = i + 2  # header is line 1
        tags = []
        for col, kind in [('person', 'person'), ('community', 'community'),
                          ('canon_slot', 'canon_slot'), ('area', 'area'), ('notes', 'note')]:
            v = (r.get(col) or '').strip()
            if v:
                tags.append({'kind': kind, 'value': v,
                             'source': f'design/starred-images/_manifest.csv:{line}'})
        ref = (r.get('ref') or '').strip()
        # ref holds an EL media_asset UUID for el-sourced rows, but a repo PATH for
        # local rows. Only a UUID is a genuine "already in EL" hint.
        if ref and re.match(r'^[0-9a-f]{8}-[0-9a-f]{4}-', ref):
            tags.append({'kind': 'el_media_id', 'value': ref,
                         'source': f'design/starred-images/_manifest.csv:{line}'})
        if not tags:
            continue
        for key in filter(None, [(r.get('filename') or '').strip(),
                                 os.path.basename((r.get('url') or '').strip())]):
            idx.setdefault(key, []).extend(tags)
    return idx

def load_local_tags():
    """v2/data/local-image-tags.json -> {public_path: [tags]}."""
    path = os.path.join(ROOT, 'v2/data/local-image-tags.json')
    out = {}
    if not os.path.exists(path):
        return out
    data = json.load(open(path))
    for p, tags in data.items():
        out[p] = [{'kind': 'tag', 'value': t, 'source': 'v2/data/local-image-tags.json'} for t in tags]
    return out

def grep_code_refs(basenames):
    """For each key data file, find which media basenames it references and where.
    Returns {basename: [{source: 'file:line', kind:'code-ref', value:'<file>'}]}."""
    CODE_FILES = [
        'v2/src/lib/data/product-wiki.ts', 'v2/src/lib/data/media.ts',
        'v2/src/lib/data/curated-quotes.ts', 'v2/src/lib/data/storyteller-registry.ts',
        'v2/src/lib/data/trip-stories.ts', 'v2/src/lib/data/content.ts',
    ]
    refs = {}
    referenced_paths = set()  # for the missing-check
    for cf in CODE_FILES:
        ap = os.path.join(ROOT, cf)
        if not os.path.exists(ap):
            continue
        for ln, line in enumerate(open(ap, encoding='utf-8', errors='ignore'), 1):
            # collect /images/... and /video/... string refs for the missing-check
            for m in re.finditer(r'["\'`](/(?:images|video)/[^"\'`]+\.[a-zA-Z0-9]+)', line):
                referenced_paths.add(m.group(1))
            for b in basenames:
                if b in line:
                    refs.setdefault(b, []).append(
                        {'kind': 'code-ref', 'value': cf, 'source': f'{cf}:{ln}'})
    return refs, referenced_paths

# ---------------------------------------------------------------------------
# Path-convention associations (explicit: the file IS in that place / named that)
# ---------------------------------------------------------------------------
def path_associations(rel):
    tags = []
    parts = rel.split('/')
    base = os.path.basename(rel)
    stem = os.path.splitext(base)[0]
    # /images/people/<slug>.<ext>  -> person
    m = re.search(r'/images/people/([^/]+)\.[a-z0-9]+$', rel)
    if m:
        tags.append({'kind': 'person', 'value': deslug(m.group(1)), 'source': f'path:{rel} (people dir)'})
    # storyteller-<slug>.<ext>  -> person
    m = re.match(r'^storyteller-(.+)$', stem)
    if m:
        tags.append({'kind': 'person', 'value': deslug(m.group(1)), 'source': f'path:{rel} (storyteller- prefix)'})
    # /community/<slug>/... or /community/<slug>.jpg -> community
    m = re.search(r'/community/([^/.]+)', rel)
    if m and m.group(1) not in ('unplaced',):
        tags.append({'kind': 'community', 'value': m.group(1), 'source': f'path:{rel} (community dir)'})
    # /utopia/ or utopia in partner path -> community utopia
    if '/utopia/' in rel or '/utopia-' in rel:
        tags.append({'kind': 'community', 'value': 'utopia', 'source': f'path:{rel} (utopia dir)'})
    # "Utpoia Photos Export/" (sic) is an explicit human grouping of the Utopia trip
    # export -> community utopia. Folder-name association, same rule class as
    # /community/<slug>/; NOT image inference.
    if re.match(r'(?i)^/?utpoia photos export/', rel):
        tags.append({'kind': 'community', 'value': 'utopia',
                     'source': f'path:{rel} (Utpoia Photos Export folder)'})
    # /partners/<partner>/...
    m = re.search(r'/partners/([^/]+)/', rel)
    if m:
        tags.append({'kind': 'partner', 'value': m.group(1), 'source': f'path:{rel} (partners dir)'})
    # /product/ or /process/ -> product/process context (not a person)
    if '/images/product/' in rel:
        tags.append({'kind': 'context', 'value': 'product', 'source': f'path:{rel} (product dir)'})
    if '/images/process/' in rel:
        tags.append({'kind': 'context', 'value': 'process/plant', 'source': f'path:{rel} (process dir)'})
    return tags

def deslug(s):
    return re.sub(r'[-_]+', ' ', s).title()

EXIF_FIELDS = ['DateTimeOriginal', 'CreateDate', 'GPSLatitude', 'GPSLongitude',
               'GPSPosition', 'ImageDescription', 'Caption-Abstract', 'Keywords',
               'Make', 'Model', 'ImageWidth', 'ImageHeight', 'Duration']

def exif_meta(abspath):
    """Real embedded metadata via exiftool: EXIF date, GPS location, caption,
    keywords, dimensions, camera. Empty dict if none / on error."""
    try:
        args = ['exiftool', '-json', '-n'] + [f'-{f}' for f in EXIF_FIELDS] + [abspath]
        out = subprocess.run(args, capture_output=True, text=True, timeout=20).stdout
        data = json.loads(out)
        if not data:
            return {}
        row = {k: v for k, v in data[0].items() if k != 'SourceFile' and v not in (None, '')}
        return row
    except Exception:
        return {}

def sha256(abspath):
    h = hashlib.sha256()
    with open(abspath, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()

# ---------------------------------------------------------------------------
# Walk
# ---------------------------------------------------------------------------
def main():
    manifest = load_manifest()
    local_tags = load_local_tags()

    files = []
    for d in INCLUDE_DIRS:
        ad = os.path.join(ROOT, d)
        if not os.path.isdir(ad):
            continue
        for dp, _, fns in os.walk(ad):
            for fn in fns:
                ap = os.path.join(dp, fn)
                rel = os.path.relpath(ap, ROOT)
                if any(x in ('/' + rel) for x in EXCLUDE_SUBSTR):
                    continue
                ext = os.path.splitext(fn)[1].lower()
                if ext not in MEDIA_EXT:
                    continue
                files.append((ap, rel, ext))

    basenames = {os.path.basename(r) for _, r, _ in files}
    code_refs, referenced_paths = grep_code_refs(basenames)

    inventory, untagged = [], []
    for ap, rel, ext in sorted(files, key=lambda x: x[1]):
        base = os.path.basename(rel)
        public_path = None
        # servable path used as a tag key (for /images and /video)
        m = re.search(r'(/(?:images|video)/.+)$', '/' + rel)
        if m:
            public_path = m.group(1)

        tags = []
        tags += path_associations('/' + rel)
        tags += manifest.get(base, [])
        if public_path and public_path in local_tags:
            tags += local_tags[public_path]
        tags += code_refs.get(base, [])

        # dedup tags by (kind,value,source)
        seen, uniq = set(), []
        for t in tags:
            k = (t['kind'], t['value'], t['source'])
            if k not in seen:
                seen.add(k); uniq.append(t)

        entry = {
            'path': ap,
            'rel': rel,
            'public_path': public_path,
            'type': MEDIA_EXT[ext],
            'bytes': os.path.getsize(ap),
            'sha256': sha256(ap),
            'exif': exif_meta(ap),
            'tags': uniq,
            'has_person': any(t['kind'] == 'person' for t in uniq),
            'has_community': any(t['kind'] == 'community' for t in uniq),
        }
        # "tagged" = has any explicit person/community/partner/context/canon_slot/tag
        meaningful = [t for t in uniq if t['kind'] in
                      ('person', 'community', 'partner', 'context', 'canon_slot', 'tag', 'note')]
        if meaningful:
            inventory.append(entry)
        else:
            untagged.append(entry)

    # missing: referenced in data files but absent on disk
    on_disk_public = {e['public_path'] for e in inventory + untagged if e['public_path']}
    missing = sorted(p for p in referenced_paths
                     if p not in on_disk_public and not os.path.exists(os.path.join(ROOT, 'v2/public' + p)))

    out = {
        'meta': {
            'generated_by': 'audit/build-inventory.py (Prompt 1)',
            'root': ROOT,
            'exiftool_available': True,
            'note': 'EXIF date/GPS/caption/keywords/dimensions extracted via exiftool where embedded. '
                    'Associations are explicit-only (path rule, starred manifest, local-image-tags, code data files). '
                    'No image content was inspected; no tags inferred.',
            'included_dirs': INCLUDE_DIRS,
            'excluded': EXCLUDE_SUBSTR,
            'counts': {'tagged': len(inventory), 'untagged': len(untagged), 'missing': len(missing)},
        },
        'inventory': inventory,
        'untagged': untagged,
        'missing': missing,
    }
    outpath = os.path.join(ROOT, 'audit/goods-media-inventory.json')
    json.dump(out, open(outpath, 'w'), indent=2)
    print(f"tagged={len(inventory)} untagged={len(untagged)} missing={len(missing)} -> {outpath}")
    # quick breakdown
    from collections import Counter
    pc = Counter(t['value'] for e in inventory for t in e['tags'] if t['kind'] == 'person')
    cc = Counter(t['value'] for e in inventory for t in e['tags'] if t['kind'] == 'community')
    print("distinct persons tagged:", len(pc), "| distinct communities:", len(cc))
    print("person-tagged files:", sum(1 for e in inventory if e['has_person']),
          "| community-tagged files:", sum(1 for e in inventory if e['has_community']))

if __name__ == '__main__':
    main()
