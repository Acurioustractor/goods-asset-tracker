#!/usr/bin/env python3
"""Population, crowding, employment and recycling for the communities Goods works in.

Ben, 16 September 2026: every community with population and matching health, crowding,
employment and recycling data.

WHAT IS GOOD HERE, AND IT IS VERY GOOD. Overcrowding comes from ABS Census 2021, Indigenous
Profile DataPack table I16, matched per Indigenous Location, measured on the Canadian National
Occupancy Standard as "needs one or more extra bedrooms". That is the standard measure, it is
citable, and each community carries its own source string.

WHAT IS NOT, AND THE SCRIPT SAYS SO ON EVERY FIELD:

  population    Unreliable. Every Queensland community in the set returns exactly 150 people
                and 43 households, which is a default. Aurukun alone is an order of magnitude
                larger. Tennant Creek and Alice Springs return nothing at all. Carried here,
                labelled unreliable, and never printed.

  employment    Carried at region level. Maningrida, Wadeye, Galiwinku, Gunbalanya and
                Ramingining all return the same jobseeker count, because the figure is regional
                and repeated down. A region signal, and wrong at community scale.

  recycling     Does not exist. `est_plastic_waste_tpa` is null in all 1,543 rows and no
                community has a waste collection operator recorded. This is the one dimension
                Ben asked for that the data cannot answer.

  health        Only a count of health services, and mostly missing. No health outcome data,
                which is correct: the claim ceiling forbids us claiming one anyway.

Read only, from the shared grantscope project.
Usage: python3 scripts/pull-community-intel.py
"""

import json
import os
import pathlib
import urllib.parse
import urllib.request

ENV = pathlib.Path('/Users/benknight/Code/grantscope/.env')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'community-intel.json'

# The places Goods works, as they are spelled in the shared graph.
PLACES = [
    'Tennant Creek', 'Maningrida', 'Utopia', 'Alice Springs', 'Galiwin', 'Gunbalanya',
    'Ngukurr', 'Borroloola', 'Yuendumu', 'Lajamanu', 'Wadeye', 'Ramingining', 'Mutitjulu',
    'Palm Island', 'Aurukun', 'Cherbourg', 'Doomadgee', 'Kowanyama', 'Woorabinda', 'Yarrabah',
    'Kalgoorlie', 'Kununurra', 'Ceduna', 'Port Augusta',
]

COLS = ','.join([
    'community_name', 'state', 'estimated_population', 'estimated_households',
    'persons_per_dwelling', 'overcrowded_dwellings', 'overcrowded_pct', 'overcrowding_source',
    'overcrowding_as_at', 'dss_jobseeker', 'dss_health_care_cards', 'health_service_count',
    'est_plastic_waste_tpa', 'waste_collection_operator', 'waste_stockpile_flag',
])


def env(path):
    out = {}
    for line in path.read_text().split('\n'):
        if '=' in line and not line.startswith('#'):
            k, _, v = line.partition('=')
            out[k.strip()] = v.strip().strip('"\'')
    return out


def main() -> int:
    e = env(ENV)
    base = e.get('SUPABASE_URL') or e.get('NEXT_PUBLIC_SUPABASE_URL')
    key = e.get('SUPABASE_SERVICE_ROLE_KEY')
    if not base or not key:
        print('no grantscope credentials')
        return 1

    def get(path):
        req = urllib.request.Request(
            f'{base}/rest/v1/{path}',
            headers={'apikey': key, 'Authorization': f'Bearer {key}'},
        )
        return json.load(urllib.request.urlopen(req))

    found = {}
    for place in PLACES:
        q = urllib.parse.quote(place)
        for row in get(f'goods_communities?community_name=ilike.*{q}*&select={COLS}&limit=4'):
            found[row['community_name']] = row

    # The population default. Every Queensland row comes back at exactly this, which is a
    # placeholder. Detected here, so no state exception has to be hard-coded.
    pops = [r.get('estimated_population') for r in found.values() if r.get('estimated_population')]
    default_pop = max(set(pops), key=pops.count) if pops else None
    repeated = sum(1 for p in pops if p == default_pop)

    # Regional jobseeker figures repeat across communities. Counting the repeats makes the
    # caveat a measurement.
    jobs = [r.get('dss_jobseeker') for r in found.values() if r.get('dss_jobseeker')]
    job_repeats = len(jobs) - len(set(jobs))

    rows = []
    for name, r in sorted(found.items(), key=lambda kv: -(kv[1].get('overcrowded_pct') or 0)):
        pop = r.get('estimated_population')
        rows.append({
            'community': name.title(),
            'state': r.get('state'),
            'population': pop,
            'populationReliable': bool(pop) and not (default_pop and pop == default_pop and repeated > 3),
            'households': r.get('estimated_households'),
            'personsPerDwelling': r.get('persons_per_dwelling'),
            'overcrowdedPct': r.get('overcrowded_pct'),
            'overcrowdedDwellings': r.get('overcrowded_dwellings'),
            'overcrowdingSource': r.get('overcrowding_source'),
            'jobseekerRegional': r.get('dss_jobseeker'),
            'healthCareCardsRegional': r.get('dss_health_care_cards'),
            'healthServices': r.get('health_service_count'),
            'plasticWasteTpa': r.get('est_plastic_waste_tpa'),
            'wasteOperator': r.get('waste_collection_operator'),
        })

    out = {
        'readAt': '2026-09-16',
        'source': 'goods_communities in the shared grantscope project',
        'matched': len(rows),
        'quality': {
            'overcrowding': 'ABS Census 2021 Indigenous Profile DataPack table I16, per Indigenous Location, Canadian National Occupancy Standard, needs one or more extra bedrooms. Good, citable, per-community source strings. Note that several ILOCs explicitly EXCLUDE town camps, which is why Tennant Creek reads 10 per cent and Kalgoorlie 2 per cent.',
            'population': f'Unreliable. {repeated} of {len(pops)} communities return the same value ({default_pop}), which is a default. Labelled per row and not to be printed.',
            'employment': f'Carried at region level. {job_repeats} of {len(jobs)} jobseeker values repeat another community in the set, because the figure is regional.',
            'recycling': 'Absent. est_plastic_waste_tpa is null in all 1,543 rows of the table and no community has a waste collection operator recorded. The one dimension asked for that the data cannot answer.',
            'health': 'A count of health services only, mostly missing. No health outcome data, which is as it should be: the claim ceiling forbids claiming one.',
        },
        'communities': rows,
    }
    OUT.write_text(json.dumps(out, indent=2) + '\n')
    crowd = [r for r in rows if r['overcrowdedPct']]
    print(f'{len(rows)} communities, {len(crowd)} with census overcrowding')
    for r in crowd[:6]:
        print(f"  {r['overcrowdedPct']:.0f}% crowded, {r['personsPerDwelling']:.1f} per dwelling  {r['community']}")
    print(f'written to {OUT}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
