#!/usr/bin/env python3
"""Every organisation in or serving a community that we could ring about beds and whitegoods.

Ben, 17 September 2026: a filterable list of organisations that buy things. All the orgs that
support, and are in, communities, that we can start talking to about where they buy whitegoods
and beds.

THREE SOURCES, because no single one holds it:

  1. The NT awarded-contracts workbook. Any organisation that won housing, maintenance or
     furnishing work. This is the strongest source because it is evidence: they won a contract,
     so they exist, they can invoice, and somebody at a government has their number.
  2. `goods_procurement_entities` in the shared graph, filtered to community-controlled rows
     only. It is proximity-matched and duplicated, so it is deduplicated on ABN here and used
     ONLY for organisations that carry a government contract value. That leaves a small honest
     set. The 1,205 rows it advertises deduplicate down to 67.
  3. Organisations named in the jurisdiction research and in our own communities table, which
     is where the health services, the regional service providers and our own partners come
     from. Those are written into the script because a name found by reading is not in any table.

WHAT IS NOT CLAIMED. Nothing here says an organisation buys beds. It says they hold contracts,
or serve a community, or we already know them. Whether they buy bedding is the question to ask
them, and it is the whole point of having the list.

Read only. Usage: python3 scripts/pull-organisations.py
"""

import collections
import json
import pathlib
import re
import urllib.request

ENV = pathlib.Path('/Users/benknight/Code/grantscope/.env')
WORKBOOK = pathlib.Path('/Users/benknight/Code/grantscope/data/state-procurement/nt-contracts.xlsx')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'organisations.json'

# Organisations that only a human reading turned up: the research reports and our own records.
# `known` marks the ones Goods already has a relationship with.
NAMED = [
    # Our own partners and procurement contacts
    ('Oonchiumpa Consultancy and Services', 'community_org', 'NT', 'Alice Springs', True, 'Our partner. Kristy Bloomfield directs it and is a director of Goods on Country. The Alice Springs facility submission is with them.'),
    ('Julalikari Council Aboriginal Corporation', 'council', 'NT', 'Tennant Creek', True, 'Our Tennant Creek procurement contact. Holds two of our washing machines and NT housing contracts.'),
    ('Homeland School Company', 'education', 'NT', 'Maningrida', True, 'Bought 40 beds and two washing machines on INV-0303. A paying customer already.'),
    ('Urapuntja Aboriginal Corporation', 'community_org', 'NT', 'Utopia Homelands', True, 'Our Utopia procurement contact. Centrecorp bought the beds for this place instead.'),
    ('Palm Island Community Company', 'community_org', 'QLD', 'Palm Island', True, 'Our Palm Island relationship. Not itself named on the QPP Indigenous council list, so its status needs checking.'),
    ('Wilya Janta', 'community_org', 'NT', 'Tennant Creek', True, 'Housing partner at Tennant Creek.'),
    ('Thamarrurr Development Corporation', 'community_org', 'NT', 'Wadeye', True, 'Our Wadeye partner.'),
    ('The Community Shed', 'community_org', 'WA', 'Kalgoorlie', True, 'Our Kalgoorlie partner.'),
    ('Winnellie Health Service Aboriginal Corporation (WHSAC)', 'health_service', 'NT', 'Groote Archipelago', True, 'Our Groote contact. The signal rests on a single email from May 2025.'),
    # Aboriginal Shire Councils, named on the QPP 2026 Indigenous local council list
    ('Aurukun Shire Council', 'council', 'QLD', 'Aurukun', False, 'Named on the QPP 2026 Indigenous local council list, so it is an Aboriginal business in its own right and needs no directory registration.'),
    ('Cherbourg Aboriginal Shire Council', 'council', 'QLD', 'Cherbourg', False, 'On the QPP 2026 list. Can buy 29 beds with no quotes at all.'),
    ('Doomadgee Aboriginal Shire Council', 'council', 'QLD', 'Doomadgee', False, 'On the QPP 2026 list.'),
    ('Kowanyama Aboriginal Shire Council', 'council', 'QLD', 'Kowanyama', False, 'On the QPP 2026 list.'),
    ('Woorabinda Aboriginal Shire Council', 'council', 'QLD', 'Woorabinda', False, 'On the QPP 2026 list.'),
    ('Yarrabah Aboriginal Shire Council', 'council', 'QLD', 'Yarrabah', False, 'On the QPP 2026 list. Publishes its own tenders and keeps a preferred supplier register.'),
    ('Palm Island Aboriginal Shire Council', 'council', 'QLD', 'Palm Island', False, 'On the QPP 2026 list, and a separate body from the Palm Island Community Company.'),
    ('Torres Strait Island Regional Council', 'council', 'QLD', 'Torres Strait', False, 'On the QPP 2026 list. Runs procurement through VendorPanel and applies a 15 per cent Local Benefits Test weighting.'),
    # Aboriginal community controlled health
    ("Mala'la Health Service Aboriginal Corporation", 'health_service', 'NT', 'Maningrida', True, 'Bought 13 beds on INV-0283. An ACCHO buying bedding as health hardware from its own budget.'),
    ('Anyinginyi Health Aboriginal Corporation', 'health_service', 'NT', 'Tennant Creek', True, 'Four washing machines quoted February 2026 and never answered. The quote is still open.'),
    ('Miwatj Health Aboriginal Corporation', 'health_service', 'NT', 'East Arnhem', True, 'Asked about beds and washing machines for East Arnhem communities in November 2025.'),
    ('Nganampa Health Council', 'health_service', 'SA', 'APY Lands', False, 'Runs the UPK environmental health programme. The 1987 UPK report is where the healthy living practices come from. The most natural partner in the APY Lands for both products.'),
    ('Katherine West Health Board Aboriginal Corporation', 'health_service', 'NT', 'Katherine', False, 'ACCHO with a federal contract record.'),
    ('Central Australian Aboriginal Congress', 'health_service', 'NT', 'Alice Springs', False, 'The largest ACCHO in Central Australia, with $2.0M of federal contracts.'),
    ('Sunrise Health Service Aboriginal Corporation', 'health_service', 'NT', 'Katherine region', False, 'ACCHO. No verifiable ABN or contract found in AusTender, so treat the record as thin.'),
    ('Danila Dilba Health Service', 'health_service', 'NT', 'Darwin', False, 'ACCHO.'),
    # Regional service providers and housing
    ('Ngaanyatjarra Council Aboriginal Corporation', 'housing_provider', 'WA', 'Ngaanyatjarra Lands', False, 'The sole housing regional service provider on the Ngaanyatjarra Lands.'),
    ('Ngaanyatjarra Services Aboriginal Corporation', 'housing_provider', 'WA', 'Ngaanyatjarra Lands', False, 'Head maintenance contractor, $32M contract, described at award as the third largest ever signed with an Aboriginal organisation in WA.'),
    ('Kimberley Regional Service Providers', 'housing_provider', 'WA', 'Kimberley', False, 'Kimberley regional service provider.'),
    ('Pilbara Meta Maya Regional Aboriginal Corporation', 'housing_provider', 'WA', 'Pilbara', False, 'Pilbara and Mid West regional service provider.'),
    ('Nirrumbuk Aboriginal Corporation', 'housing_provider', 'WA', 'Broome', False, 'Supported accommodation.'),
    ('Wunan Foundation', 'housing_provider', 'WA', 'Halls Creek', False, 'Supported accommodation.'),
    ('Mowanjum Aboriginal Corporation', 'housing_provider', 'WA', 'Derby', False, 'Holds housing management to 30 June 2028.'),
    ('Marthakal Homelands and Resource Centre Aboriginal Corporation', 'housing_provider', 'NT', 'Galiwinku', False, 'Holds first response maintenance at Galiwinku and is flagged Aboriginal Enterprise on the public record.'),
    ('Aboriginal Housing Northern Territory', 'housing_provider', 'NT', 'Territory wide', False, 'The Aboriginal community controlled housing peak, and a signatory to the $4bn partnership agreement.'),
    ('SAACCON', 'housing_provider', 'SA', 'South Australia', False, "South Australia's Aboriginal community controlled peak, funded to stand up a community-controlled housing sector."),
    # Stores and freight
    ('The Arnhem Land Progress Aboriginal Corporation (ALPA)', 'store', 'NT', '27 remote locations', False, 'The largest Aboriginal corporation in Australia. Runs stores, does furniture-making, owns Bukmak Constructions, 1,200+ employees.'),
    ('Outback Stores', 'store', 'NT', 'NT, WA, QLD', False, 'Runs about 50 remote stores. The existing retail and freight spine into communities.'),
    # Aboriginal-owned suppliers already winning government work
    ('RIDEM Pty Ltd t/a Dexter Barnes Electrical', 'supplier', 'NT', 'Tennant Creek', False, 'Aboriginal Enterprise on the public record, and already supplies and installs washing machines for the NT Government. A channel partner or an installer, and a template.'),
    ('Birubi Australia Pty Ltd', 'supplier', 'SA', 'Adelaide and Whyalla', False, 'The only Aboriginal-owned firm identifiable on the SA Housing Trust pre-qualified builders list. Supply Nation certified.'),
    ('Bukmak Constructions Pty Ltd', 'builder', 'NT', "Galiwin'ku", False, 'An ALPA subsidiary, 100 per cent Indigenous owned. Building 87 dwellings at Galiwinku for $51.5M and holds remote housing maintenance at three communities.'),
    ('Binjari Community Aboriginal Corporation', 'builder', 'NT', 'Katherine region', False, '25 NT contracts worth $48.9M across Ngukurr, Borroloola, Minyerri, Gunbalanya and Beswick. Also holds remote tenancy management.'),
    ('Bawinanga Aboriginal Corporation', 'builder', 'NT', 'Maningrida', True, 'Room to Breathe at Maningrida. Runs the laundromat that Snow paid to relaunch.'),
    ('Tangentyere Council Aboriginal Corporation', 'council', 'NT', 'Alice Springs', False, 'Runs the Alice Springs town camps with trades and house access. $3.1M of federal contracts and 20 NT contracts worth $23M.'),
    ('MacDonnell Regional Council', 'council', 'NT', 'Central Australia', False, 'Room to Breathe at Titjikala and Kintore. $44.1M of federal contracts.'),
    ('Central Desert Regional Council', 'council', 'NT', 'Central Australia', False, 'Holds a remote housing first-response maintenance period contract covering Yuendumu, Lajamanu and eight other communities.'),
    ('Roper Gulf Regional Council', 'council', 'NT', 'Big Rivers', True, 'Our partner at Borroloola and Ngukurr. $22.2M of federal contracts.'),
    ('East Arnhem Regional Council', 'council', 'NT', 'East Arnhem', True, "Our partner at Galiwin'ku and Ramingining. $2.7M of federal contracts."),
    # Land councils and royalty bodies
    ('Central Land Council', 'land_council', 'NT', 'Central Australia', False, '$20.8M of federal contracts across 44 awards. Royalty distribution is invisible in every dataset, so this is a conversation and never a query.'),
    ('Northern Land Council', 'land_council', 'NT', 'Top End', False, '$7.1M of federal contracts across 50 awards.'),
    ('Anindilyakwa Land Council', 'land_council', 'NT', 'Groote Archipelago', False, 'Uses two local Indigenous construction companies and plans up to 100 new houses.'),
    ('Tiwi Land Council', 'land_council', 'NT', 'Tiwi Islands', False, '$3.0M of federal contracts.'),
    ('Centrecorp Foundation', 'royalty', 'NT', 'Central Australia', True, 'Our largest bed buyer: 167 beds across two invoices, and they came back at a higher price. They buy; they have never given a grant.'),
]


def env(path):
    out = {}
    for line in path.read_text().split('\n'):
        if '=' in line and not line.startswith('#'):
            k, _, v = line.partition('=')
            out[k.strip()] = v.strip().strip('"\'')
    return out


def main() -> int:
    orgs = {}

    def put(name, kind, state, place, known, note, source, value=0, count=0):
        # Normalise before keying, and do NOT truncate. Truncating at 44 characters put "The
        # Arnhem Land Progress Aboriginal Corporation" and the same name with "(ALPA)" appended
        # into two different buckets, so ALPA appeared twice.
        key = re.sub(r'\(.*?\)', '', name.lower())
        key = re.sub(r'\b(pty|ltd|limited|incorporated|inc|the|aboriginal|corporation|council)\b', '', key)
        key = re.sub(r'[^a-z]', '', key)
        cur = orgs.get(key)
        if cur is None:
            orgs[key] = {'name': name, 'kind': kind, 'state': state, 'place': place,
                         'known': known, 'note': note, 'sources': [source],
                         'govtContractValueAud': value, 'govtContractCount': count}
            return
        cur['govtContractValueAud'] = max(cur['govtContractValueAud'], value)
        cur['govtContractCount'] = max(cur['govtContractCount'], count)
        cur['known'] = cur['known'] or known
        if source not in cur['sources']:
            cur['sources'].append(source)
        if len(note) > len(cur['note']):
            cur['note'] = note

    for name, kind, state, place, known, note in NAMED:
        put(name, kind, state, place, known, note, 'research')

    # 1. The NT workbook: anyone who won housing, maintenance or furnishing work.
    try:
        import openpyxl
        wb = openpyxl.load_workbook(WORKBOOK, read_only=True, data_only=True)
        rows = wb['Government awarded contracts'].iter_rows(values_only=True)
        header = next(rows)
        col = {n: i for i, n in enumerate(header) if n}
        want = re.compile(r'\b(housing|dwelling|house|maintenance|room to breathe|homebuild|furniture|whitegood|laundry)\b', re.I)
        agg = collections.defaultdict(lambda: {'v': 0.0, 'n': 0, 'te': False, 'place': ''})
        for row in rows:
            desc = str(row[col['Description of Procurement']] or '')
            if not want.search(desc):
                continue
            name = str(row[col['Contractor Name']] or '').strip()
            if not name:
                continue
            a = agg[name]
            a['v'] += float(row[col['Contract Value']] or 0)
            a['n'] += 1
            a['te'] = a['te'] or str(row[col['Territory Enterprise']] or '').strip() == 'Yes'
            if not a['place']:
                a['place'] = desc.split(' - ')[0][:30]
        for name, a in sorted(agg.items(), key=lambda kv: -kv[1]['v'])[:120]:
            put(name, 'builder', 'NT', a['place'], False,
                f"Won {a['n']} NT housing or maintenance contracts worth ${a['v']:,.0f}."
                + (' Flagged a Territory Enterprise on the public record.' if a['te'] else ''),
                'nt-workbook', round(a['v']), a['n'])
    except Exception as exc:  # noqa: BLE001
        print(f'NT workbook skipped: {exc}')

    # 2. The shared graph, community-controlled rows only, deduplicated on ABN.
    try:
        e = env(ENV)
        base = e.get('SUPABASE_URL') or e.get('NEXT_PUBLIC_SUPABASE_URL')
        key = e.get('SUPABASE_SERVICE_ROLE_KEY')
        seen = {}
        for off in range(0, 3000, 1000):
            req = urllib.request.Request(
                f'{base}/rest/v1/goods_procurement_entities?is_community_controlled=is.true'
                f'&select=entity_name,abn,buyer_role,govt_contract_value,govt_contract_count'
                f'&limit=1000&offset={off}',
                headers={'apikey': key, 'Authorization': f'Bearer {key}'})
            batch = json.load(urllib.request.urlopen(req))
            for r in batch:
                k = r.get('abn') or r['entity_name']
                if k not in seen or (r.get('govt_contract_value') or 0) > (seen[k].get('govt_contract_value') or 0):
                    seen[k] = r
            if len(batch) < 1000:
                break
        for r in seen.values():
            if not (r.get('govt_contract_value') or 0):
                continue
            # State is NOT known for these rows and must not be invented. The first version of
            # this script stamped 'NT' on every one, which put Peak Hill Local Aboriginal Land
            # Council, in central-west New South Wales, into the Territory.
            put(r['entity_name'], r.get('buyer_role') or 'community_org', '', '', False,
                f"Community controlled, with ${r['govt_contract_value']:,.0f} of federal contracts across {r.get('govt_contract_count') or 0} awards.",
                'shared-graph', round(r['govt_contract_value'] or 0), r.get('govt_contract_count') or 0)
    except Exception as exc:  # noqa: BLE001
        print(f'shared graph skipped: {exc}')

    # Drop organisations outside the four states Goods works in. The shared graph is
    # proximity-matched, so it surfaced Peak Hill Local Aboriginal Land Council in central-west
    # NSW as a Goods buyer. It is a real organisation and it is not in our footprint.
    FOOTPRINT = {'NT', 'QLD', 'WA', 'SA', ''}
    dropped = [o['name'] for o in orgs.values() if o['state'] not in FOOTPRINT]
    for name in dropped:
        for k, v in list(orgs.items()):
            if v['name'] == name:
                del orgs[k]
    if dropped:
        print(f"dropped {len(dropped)} outside the NT/QLD/WA/SA footprint: {', '.join(dropped[:4])}")

    out = {
        'readAt': '2026-09-17',
        'organisations': sorted(
            ({**o, 'proximityOnly': o['sources'] == ['shared-graph']} for o in orgs.values()),
            key=lambda o: (-o['govtContractValueAud'], o['name'])),
        'kinds': sorted({o['kind'] for o in orgs.values()}),
        'states': sorted({o['state'] for o in orgs.values() if o['state']}),
        'note': 'Nothing here says an organisation buys beds. It says they hold contracts, or serve a community, or we already know them. Whether they buy bedding is the question to ask them.',
    }
    OUT.write_text(json.dumps(out, indent=2) + '\n')
    known = sum(1 for o in out['organisations'] if o['known'])
    eviden = sum(1 for o in out['organisations'] if o['govtContractValueAud'] > 0)
    print(f"{len(out['organisations'])} organisations, {known} we already know, {eviden} with contract evidence")
    print(f'written to {OUT}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
