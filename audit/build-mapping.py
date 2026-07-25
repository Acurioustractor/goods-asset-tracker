#!/usr/bin/env python3
"""Prompt 2 — map the Goods media inventory to Empathy Ledger's schema.

Reads audit/goods-media-inventory.json and writes audit/goods-el-mapping.json.
Each real media file becomes a proposed EL media_assets record (Goods org /
project / tenant, visibility PRIVATE), plus person links to media_storytellers by
matched display name (match only — ids resolved in Prompt 4), with a confidence
flag and an explicit list of any tag that cannot map losslessly. Person matches
come only from explicit inventory tags, never from the image.
"""
import os, json, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# EL targets (baked in per the prompt).
ORG_ID = 'c312323e-02d4-493c-8b5f-9f9b15e2b46a'      # "Goods on Country"
PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047'
TENANT_ID = 'a1adca53-4c80-44b3-a859-e9e12b40e1a8'
PROJECT_CODE = 'goods'

MEDIA_TYPE = {'photo': 'image', 'video': 'video', 'audio': 'audio', 'transcript': 'transcript'}

# Community slug -> the EL communities display name (resolved against EL's
# communities table names; id resolution deferred to a later prompt).
COMMUNITY_NAME = {
    'utopia': 'Utopia Homelands (Urapuntja)', 'tennant-creek': 'Tennant Creek',
    'palm-island': 'Palm Island', 'kalgoorlie': 'Kalgoorlie', 'alice-springs': 'Alice Springs',
    'katherine': 'Katherine / Nitmiluk', 'kununurra': 'Lake Argyle / Kununurra',
    'maningrida': 'Maningrida', 'mt-isa': 'Mount Isa', 'darwin': 'Darwin', 'canberra': 'Canberra',
}

def exif_date(exif):
    d = exif.get('DateTimeOriginal') or exif.get('CreateDate')
    if not d:
        return None
    m = re.match(r'(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})', str(d))
    return f'{m.group(1)}-{m.group(2)}-{m.group(3)}T{m.group(4)}:{m.group(5)}:{m.group(6)}Z' if m else None

def gps(exif):
    lat, lng = exif.get('GPSLatitude'), exif.get('GPSLongitude')
    return {'lat': lat, 'lng': lng} if (lat and lng) else None

def title_from(rel, tags):
    note = next((t['value'] for t in tags if t['kind'] == 'note'), None)
    if note:
        return note[:120]
    stem = os.path.splitext(os.path.basename(rel))[0]
    return re.sub(r'[-_]+', ' ', stem).strip().title()[:120]

# Which tag kinds map cleanly to an EL field vs. don't (the lossless check).
MAPPED_KINDS = {
    'person': 'media_storytellers.storyteller (by name)',
    'community': 'media_assets.nation_or_community',
    'note': 'media_assets.caption',
}
UNMAPPED_KINDS = {
    'canon_slot': 'Goods deck concept — no native EL field (candidate: cultural_tags/attribution)',
    'area': 'Goods folder area — no native EL field (candidate: cultural_tags keyword)',
    'partner': 'delivery partner — no native EL field (candidate: attribution_text/organization)',
    'context': 'product/process context — not a person/community; product media, likely NOT for EL',
    'code-ref': 'internal codebase usage — not migrated',
    'el_media_id': 'ALREADY-IN-EL hint — resolve in the collision check (Prompt 3)',
}

def main():
    inv = json.load(open(os.path.join(ROOT, 'audit/goods-media-inventory.json')))
    items = inv['inventory'] + inv['untagged']  # every real file; missing (placeholders) excluded

    mapping, transcripts = [], []
    for e in items:
        tags = e['tags']
        persons = sorted({t['value'] for t in tags if t['kind'] == 'person'})
        communities = sorted({t['value'] for t in tags if t['kind'] == 'community'})
        el_hint = next((t['value'] for t in tags if t['kind'] == 'el_media_id'), None)
        note = next((t['value'] for t in tags if t['kind'] == 'note'), None)

        # confidence: exact = a storyteller name to match; probable = community only; unmatched = neither
        if persons:
            confidence = 'exact'
        elif communities:
            confidence = 'probable'
        else:
            confidence = 'unmatched'

        nation = None
        if communities:
            c = communities[0]
            nation = COMMUNITY_NAME.get(c, c)  # name if slug known, else raw value

        record = {
            'organization_id': ORG_ID,
            'project_id': PROJECT_ID,
            'project_code': PROJECT_CODE,
            'tenant_id': TENANT_ID,
            'media_type': MEDIA_TYPE.get(e['type'], e['type']),
            'title': title_from(e['rel'], tags),
            'caption': note,
            'nation_or_community': nation,
            'width': e['exif'].get('ImageWidth'),
            'height': e['exif'].get('ImageHeight'),
            'duration': e['exif'].get('Duration'),
            'created_at': exif_date(e['exif']),
            'gps': gps(e['exif']),
            'visibility': 'private',                 # never public on migration
            'consent_granted': False,
            'consent_obtained': False,
            'elder_review_status': 'unreviewed',
            'requires_consent': bool(persons),        # people media needs consent
        }

        links = [{
            'storyteller_display_name': p,   # match only; id resolved in Prompt 4
            'relationship': 'appears_in',
            'consent_status': 'pending',
            'blur_face': False,
            'hide_from_public': False,
            'source': 'batch',
            'match_confidence': 'exact',     # from an explicit inventory tag
        } for p in persons]

        # lossless check: which tags have no clean EL field
        unmapped = []
        for t in tags:
            if t['kind'] in UNMAPPED_KINDS and t['kind'] not in ('el_media_id',):
                unmapped.append({'kind': t['kind'], 'value': t['value'],
                                 'why': UNMAPPED_KINDS[t['kind']], 'source': t['source']})

        mapping.append({
            'rel': e['rel'],
            'sha256': e['sha256'],
            'bytes': e['bytes'],
            'type': e['type'],
            'confidence': confidence,
            'media_asset': record,
            'storyteller_links': links,
            'community_matches': communities,
            'already_in_el_hint': el_hint,      # manifest ref -> existing EL media id
            'unmapped_tags': unmapped,
            'lossless': len(unmapped) == 0,
        })

        if e['type'] == 'transcript':
            transcripts.append({'rel': e['rel'], 'sha256': e['sha256'],
                                'storyteller_display_names': persons, 'project_id': PROJECT_ID})

    from collections import Counter
    conf = Counter(m['confidence'] for m in mapping)
    summary = {
        'total_items': len(mapping),
        'confidence': dict(conf),
        'already_in_el_hint': sum(1 for m in mapping if m['already_in_el_hint']),
        'not_lossless': sum(1 for m in mapping if not m['lossless']),
        'with_storyteller_links': sum(1 for m in mapping if m['storyteller_links']),
        'with_gps': sum(1 for m in mapping if m['media_asset']['gps']),
        'transcripts_local': len(transcripts),
    }

    out = {
        'meta': {
            'generated_by': 'audit/build-mapping.py (Prompt 2)',
            'targets': {'organization_id': ORG_ID, 'project_id': PROJECT_ID, 'tenant_id': TENANT_ID,
                        'media_storytellers_fk': 'media_asset_id (NOT media_id)',
                        'default_visibility': 'private'},
            'rules': 'Person matches are explicit-tag-only (never from the image). ids resolved later. '
                     'Anything whose tags cannot map losslessly is listed in unmapped_tags so nothing is silently dropped.',
            'unmapped_kind_notes': UNMAPPED_KINDS,
            'summary': summary,
        },
        'mapping': mapping,
        'transcripts': transcripts,
    }
    outpath = os.path.join(ROOT, 'audit/goods-el-mapping.json')
    json.dump(out, open(outpath, 'w'), indent=2)
    print('summary:', json.dumps(summary, indent=1))
    print('->', outpath)

if __name__ == '__main__':
    main()
