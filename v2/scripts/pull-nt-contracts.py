#!/usr/bin/env python3
"""Parse the NT awarded-contracts workbook and find who is already building remote housing.

Ben, 16 September 2026: load the NT contract data, because NT is where most of the work is and
we had zero state-level visibility there.

WHY THIS FILE AND NOT A DATABASE. `state_tenders` in the shared graph holds 199,719 rows and
199,679 of them are Queensland: the NT has never been ingested, despite this workbook sitting
in the grantscope repo since March. So this reads the workbook directly. It is a dated export,
not a live feed, and the `readAt` field says which.

WHAT IT FOUND, and it changes who the customer is.

The NT bed and laundry line items are mostly hospital laundry, which is a dead end. But widen
to housing and fit-out and there are 1,465 contracts worth $1.42 billion, of which $1.07
billion sits with the infrastructure and logistics agencies, and 70 per cent of them went to
Territory Enterprises.

And the head contractors on remote housing, under a program called Room to Breathe whose whole
purpose is reducing overcrowding by adding sleeping space, are Aboriginal corporations. Bukmak
at Galiwin'ku. Binjari at Bulman, Weemol and Beswick. Bawinanga at Maningrida. MacDonnell at
Titjikala and Kintore. ALPA at Ramingining. Julalikari at Tennant Creek.

Two of those already hold Goods product. So the question stops being how to make a community
organisation into a supplier, and becomes how to sell to the ones that are already winning the
work and are already building the rooms the beds go in.

THEN THE FINDING THAT MATTERS MORE, and it is a negative one.

Nobody in the NT Government buys a bed for a remote community house. The housing agencies
spent $817,871,353 across 1,394 contracts and nine of them mention furniture: office chairs in
Darwin, and removalists. Across all 26,591 contracts, 125 mention furniture or whitegoods and
not one is for a remote community. Most are roadside furniture, which is guard rails.

Checked from the other direction too: only six contracts mention housing and bedding together,
and every "bed" in them is the word inside "3 Bedroom Dwelling".

So a head contractor builds the house and hands it over empty. The construction scope stops at
the building. There is $1.7 billion of remote housing here and no procurement channel for the
thing that goes in the bedroom, which means the tenant buys it, which is the problem Goods
exists for.

That correction matters: the contractors are not the customer for a bed inside their build
scope. Where they could be a customer is their MAINTENANCE and tenancy contracts, where
replacing a failed appliance is in scope. Bukmak holds remote housing maintenance at Galiwinku,
Milingimbi and Gapuwiyak, and Binjari holds remote tenancy management at Binjari. That is a
different and much smaller conversation than the build.

Read only. Usage: python3 scripts/pull-nt-contracts.py
"""

import collections
import json
import pathlib
import re
import sys

WORKBOOK = pathlib.Path('/Users/benknight/Code/grantscope/data/state-procurement/nt-contracts.xlsx')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'nt-housing-contractors.json'

# Bedding on its own finds hospital laundry. Housing and fit-out finds the rooms beds go in.
HOUSING = re.compile(
    r'\b(housing|house|houses|dwelling|dwellings|room to breathe|homeland|homelands|'
    r'community living|furniture|fit ?out|whitegood|white goods|appliance)\b', re.I)
BEDDING = re.compile(
    r'\b(bed|beds|bedding|mattress|mattresses|washing machine|washer|laundry|linen)\b', re.I)
INFRA = re.compile(r'infrastructure|logistics|housing', re.I)

# The organisations Goods already has a relationship with, so the output can say which of the
# contractors we already know. Matched on a lowercase substring of the contractor name.
KNOWN = {
    'julalikari': 'Julalikari Council Aboriginal Corporation',
    'bawinanga': 'Bawinanga Aboriginal Corporation',
    'macdonnell': 'MacDonnell Regional Council',
    'tangentyere': 'Tangentyere Council',
    'urapuntja': 'Urapuntja Aboriginal Corporation',
    'anyinginyi': 'Anyinginyi Health Aboriginal Corporation',
    'arnhem land progress': 'ALPA',
}


def main() -> int:
    try:
        import openpyxl
    except ImportError:
        print('openpyxl is required: pip3 install openpyxl', file=sys.stderr)
        return 1
    if not WORKBOOK.exists():
        print(f'workbook not found: {WORKBOOK}', file=sys.stderr)
        return 1

    wb = openpyxl.load_workbook(WORKBOOK, read_only=True, data_only=True)
    ws = wb['Government awarded contracts']
    rows = ws.iter_rows(values_only=True)
    header = next(rows)
    col = {name: i for i, name in enumerate(header) if name}

    def field(row, name):
        i = col.get(name)
        return row[i] if i is not None else None

    total = 0
    housing = []
    for row in rows:
        total += 1
        desc = str(field(row, 'Description of Procurement') or '')
        if HOUSING.search(desc):
            housing.append(row)

    contractors = collections.defaultdict(
        lambda: {'contracts': 0, 'valueAud': 0.0, 'places': collections.Counter(),
                 'agencies': collections.Counter(), 'roomToBreathe': 0, 'bedding': 0,
                 'territoryEnterprise': False, 'sample': None})
    places = collections.defaultdict(lambda: {'contracts': 0, 'valueAud': 0.0, 'top': collections.Counter()})

    for row in housing:
        name = str(field(row, 'Contractor Name') or 'Unknown').strip()
        desc = str(field(row, 'Description of Procurement') or '')
        value = float(field(row, 'Contract Value') or 0)
        agency = str(field(row, 'Agency') or '?').split(' - ')[0]
        place = desc.split(' - ')[0].strip()

        c = contractors[name]
        c['contracts'] += 1
        c['valueAud'] += value
        c['agencies'][agency[:60]] += 1
        if 2 < len(place) < 40:
            c['places'][place] += 1
        if re.search(r'room to breathe', desc, re.I):
            c['roomToBreathe'] += 1
        if BEDDING.search(desc):
            c['bedding'] += 1
        if str(field(row, 'Territory Enterprise') or '').strip() == 'Yes':
            c['territoryEnterprise'] = True
        if c['sample'] is None:
            c['sample'] = desc[:150]

        if 2 < len(place) < 40:
            p = places[place]
            p['contracts'] += 1
            p['valueAud'] += value
            p['top'][name[:50]] += 1

    # The furnishing gap. Computed here, because it is the finding and an assertion would not do.
    furn = re.compile(
        r'\b(furniture|furnishing|whitegood|white goods|domestic appliance|refrigerator|'
        r'fridge|washing machine|mattress|bedding|linen)\b', re.I)
    roadside = re.compile(r'roadside|airfield|road infrastructure', re.I)
    housing_agency = re.compile(r'territory families|department of housing|local government, housing', re.I)

    all_rows = []
    wb2 = openpyxl.load_workbook(WORKBOOK, read_only=True, data_only=True)
    rows2 = wb2['Government awarded contracts'].iter_rows(values_only=True)
    next(rows2)
    for row in rows2:
        all_rows.append(row)

    furn_rows = [r for r in all_rows if furn.search(str(field(r, 'Description of Procurement') or ''))]
    household = [r for r in furn_rows if not roadside.search(str(field(r, 'Description of Procurement') or ''))]
    hous_agency_rows = [r for r in all_rows if housing_agency.search(str(field(r, 'Agency') or ''))]
    hous_agency_furn = [r for r in hous_agency_rows if furn.search(str(field(r, 'Description of Procurement') or ''))]
    remote_furn = [
        r for r in household
        if re.search(r'remote|homeland|town camp', str(field(r, 'Description of Procurement') or ''), re.I)
    ]

    def known_for(name: str):
        low = name.lower()
        for key, label in KNOWN.items():
            if key in low:
                return label
        return None

    ranked = sorted(contractors.items(), key=lambda kv: -kv[1]['valueAud'])
    out = {
        'readAt': '2026-09-16',
        'source': 'NT Government awarded contracts workbook, exported 15 March 2026, held in the grantscope repo and never ingested to any database',
        'totals': {
            'allContracts': total,
            'housingRelated': len(housing),
            'housingValueAud': round(sum(float(field(r, 'Contract Value') or 0) for r in housing)),
            'infraAgencyValueAud': round(sum(
                float(field(r, 'Contract Value') or 0) for r in housing
                if INFRA.search(str(field(r, 'Agency') or '')))),
            'territoryEnterpriseContracts': sum(
                1 for r in housing if str(field(r, 'Territory Enterprise') or '').strip() == 'Yes'),
        },
        'furnishingGap': {
            'furnitureOrWhitegoodsContracts': len(furn_rows),
            'onceRoadsideRemoved': len(household),
            'forARemoteCommunity': len(remote_furn),
            'housingAgencyContracts': len(hous_agency_rows),
            'housingAgencyValueAud': round(sum(float(field(r, 'Contract Value') or 0) for r in hous_agency_rows)),
            'housingAgencyFurnitureContracts': len(hous_agency_furn),
            'verdict': (
                'The NT Government builds remote houses and hands them over empty. Its housing agencies '
                'spent this much and bought office chairs and removalists. No procurement channel exists '
                'for the thing that goes in the bedroom, so the tenant buys it.'
            ),
        },
        'contractors': [
            {
                'name': name,
                'known': known_for(name),
                'contracts': c['contracts'],
                'valueAud': round(c['valueAud']),
                'roomToBreathe': c['roomToBreathe'],
                'beddingMentions': c['bedding'],
                'territoryEnterprise': c['territoryEnterprise'],
                'topPlaces': [p for p, _ in c['places'].most_common(3)],
                'topAgency': c['agencies'].most_common(1)[0][0] if c['agencies'] else None,
                'sample': c['sample'],
            }
            for name, c in ranked[:80]
        ],
        'places': [
            {
                'place': p,
                'contracts': v['contracts'],
                'valueAud': round(v['valueAud']),
                'topContractor': v['top'].most_common(1)[0][0],
            }
            for p, v in sorted(places.items(), key=lambda kv: -kv[1]['valueAud'])[:30]
        ],
    }
    OUT.write_text(json.dumps(out, indent=2) + '\n')
    known = [c for c in out['contractors'] if c['known']]
    print(f"{total} NT contracts, {len(housing)} housing related, ${out['totals']['housingValueAud']:,}")
    print(f"{len(known)} of the top contractors are organisations Goods already knows")
    print(f'written to {OUT}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
