#!/usr/bin/env python3
"""Build the Washing Machine MASTER LISTING from Supabase + telemetry + hardcoded mappings."""

import collections
import json
import sys
import urllib.request
from datetime import date, datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

def load_env() -> tuple[str, str]:
    env_path = REPO / "v2" / ".env.local"
    url = key = None
    for raw in env_path.read_text().splitlines():
        line = raw.strip()
        if line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        v = v.strip().strip('"').strip("'")
        if k.strip() == "NEXT_PUBLIC_SUPABASE_URL":
            url = v
        elif k.strip() == "SUPABASE_SERVICE_ROLE_KEY":
            key = v
    if not url or not key:
        sys.exit("missing env")
    return url, key


def get_json(url: str, path: str, key: str, headers: dict | None = None) -> list:
    h = {"apikey": key, "Authorization": f"Bearer {key}"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(f"{url}/rest/v1/{path}", headers=h)
    return json.loads(urllib.request.urlopen(req).read())


def main() -> None:
    URL, KEY = load_env()
    assets = get_json(
        URL,
        "assets?select=unique_id,name,community,place,status,supply_date,qr_url,photo&product=eq.Washing%20Machine&order=community.asc,unique_id.asc",
        KEY,
    )
    logs = []
    for off in range(0, 2000, 1000):
        rows = get_json(
            URL,
            "usage_logs?select=machine_id,created_at",
            KEY,
            headers={"Range-Unit": "items", "Range": f"{off}-{off+999}"},
        )
        logs.extend(rows)

    T2A = {
        "GB0-113": ["Norms House", "e00fce684086eb2aba8d4f25"],
        "GB0-154-2": ["Nicoles House", "e00fce687ae01d08f95694e5"],
        "GB0-125": ["Barkley Arts", "e00fce68c2ba447b66bcd507"],
        "GB0-132": ["e00fce682db6d32e15e86098"],
        "GB0-133": ["8D1"],
        "GB0-WM-ORPHAN-c4b9": ["e00fce68c4b97878b9a2b323"],
        "GB0-WM-ORPHAN-fe6c": ["e00fce68fe6c048ccec66ab1"],
        "GB0-WM-ORPHAN-689f": ["e00fce689f1dd0daf5987cf2"],
        "GB0-WM-RD": ["Red Dust"],
        "GB0-WM-DSS": ["Dian Stokes Sons House"],
    }
    agg: dict[str, dict] = {uid: {"events": 0, "first": None, "last": None} for uid in T2A}
    for r in logs:
        m = r.get("machine_id")
        if not m or m == "test123":
            continue
        for uid, ids in T2A.items():
            if m in ids:
                a = agg[uid]
                a["events"] += 1
                ts = r.get("created_at")
                if ts:
                    if a["first"] is None or ts < a["first"]:
                        a["first"] = ts
                    if a["last"] is None or ts > a["last"]:
                        a["last"] = ts

    today = date.today()

    def silent(s):
        if not s:
            return None
        return (today - datetime.fromisoformat(s.replace("Z", "+00:00")).date()).days

    PEOPLE = {
        "GB0-113": "Norman Frank — Wilya Janta direct.",
        "GB0-125": "Barkley Arts community space.",
        "GB0-132": "Jimmy Frank (nephew of Norman Frank).",
        "GB0-133": "Norman Frank — 2nd machine (MISSING per Ben).",
        "GB0-135": "Minga Minga Rangers (Palm Island).",
        "GB0-137": "Billow's house — Rodeo Grounds, Palm Island.",
        "GB0-138": "RETIRED — same physical machine as GB0-147.",
        "GB0-139": "Eb Oui's Aunty, Palm Island.",
        "GB0-147": "Klub Cuta — recipient Mislam Sam, Palm Island.",
        "GB0-154-1": "Pending Assignment (TC Dec 2025 bush camp).",
        "GB0-154-2": "Nicole Frank, Ford Crescent, Tennant Creek.",
        "GB0-154-3": "Pending Assignment.",
        "GB0-154-4": "Pending Assignment.",
        "GB0-154-5": "Pending Assignment.",
        "GB0-154-6": "Pending Assignment.",
        "GB0-154-7": "Pending Assignment.",
        "GB0-154-8": "Pending Assignment.",
        "GB0-154-9": "Pending Assignment.",
        "GB0-154-10": "Pending Assignment.",
        "GB0-WM-DSS": "Dianne Stokes (Empathy Ledger storyteller, Pakkimjalki Kari co-designer).",
        "GB0-WM-RD": "Red Dust Studios (DARWIN — not Tennant Creek).",
        "GB0-WM-F25": "RETIRED — merged into GB0-113 Norman Frank.",
        "GB0-WM-4E5": "RETIRED — merged into GB0-154-2 Nicole Frank.",
        "GB0-WM-507": "RETIRED — merged into GB0-125 Barkley Arts.",
        "GB0-WM-098": "RETIRED — merged into GB0-132 Jimmy Frank.",
        "GB0-WM-8D1": "RETIRED — speculative merge into GB0-133.",
        "GB0-WM-PARTICLE-01": "RETIRED — same coreid as GB0-WM-4E5.",
        "GB0-WM-ORPHAN-c4b9": "Unknown TC household — 550 events of heavy use 2025-08-27 to 2026-03-29.",
        "GB0-WM-ORPHAN-fe6c": "Unknown TC household — 397 events 2025-09-15 to 2026-03-21.",
        "GB0-WM-ORPHAN-689f": "Unknown — only 38 events Sep 2025 then silent.",
        "GB0-136-1": "Oonchiumpa Consultancy & Services, Alice Springs.",
        "GB0-136-2": "Oonchiumpa.",
        "GB0-136-3": "Oonchiumpa.",
        "GB0-143-1": "Phantom — Ben says likely never existed.",
        "GB0-143-2": "Phantom — Ben says likely never existed.",
        "GB0-150-1": "BHAC Laundromat, Maningrida (NEW build, 1 of 2).",
        "GB0-150-2": "BHAC Laundromat, Maningrida (NEW build, 2 of 2).",
        "GB0-150-3": "BHAC Laundromat, Maningrida (BHAC-owned, we re-skinned).",
        "GB0-150-4": "BHAC Laundromat, Maningrida (BHAC-owned, re-skinned).",
        "GB0-150-5": "BHAC Laundromat, Maningrida (BHAC-owned, re-skinned).",
        "GB0-150-6": "BHAC Laundromat, Maningrida (BHAC-owned, re-skinned).",
    }
    CAL = {
        "GB0-113": "2025-07-02 Barkly Backbone meeting, TC. Lucy McGarry.",
        "GB0-125": "2025-07-02 Barkly Backbone meeting, TC.",
        "GB0-132": "2025-07-02 Barkly Backbone meeting, TC.",
        "GB0-133": "2025-07-02 Barkly Backbone meeting, TC.",
        "GB0-135": "PI trip 2025-08-11..16 (DRW->TSV->PI flights).",
        "GB0-137": "PI trip 2025-08-12 (Narelle + Mislam meeting).",
        "GB0-139": "PI trip 2025-08-12.",
        "GB0-143-1": "(no trip — flagged phantom).",
        "GB0-143-2": "(no trip — flagged phantom).",
        "GB0-147": "2025-09-25..28 PI ferry trip. Photo 09-28 (last day).",
        "GB0-150-1": "MNG trip 2025-10-11..14 (flight MNG->DRW 10-14 16:30).",
        "GB0-150-2": "MNG trip 2025-10-11..14.",
        "GB0-150-3": "MNG trip 2025-10-11..14.",
        "GB0-150-4": "MNG trip 2025-10-11..14.",
        "GB0-150-5": "MNG trip 2025-10-11..14.",
        "GB0-150-6": "MNG trip 2025-10-11..14.",
        **{f"GB0-154-{n}": '2025-12-10..15 "Simon in TC Bush Camp + HOUSE" (Wilya Janta) — 10-machine batch.' for n in range(1, 11)},
        "GB0-136-1": "SUSPICIOUS: register date 2025-08-12 = day Ben on PALM ISLAND, not Alice. Likely remote register entry by Tanya/Kristy.",
        "GB0-136-2": "SUSPICIOUS: same.",
        "GB0-136-3": "SUSPICIOUS: same.",
        "GB0-WM-RD": "—",
        "GB0-WM-DSS": "—",
    }
    XERO = {
        "GB0-150-1": "INV-0240 Snow Foundation 16,600 (PAID 2025-06-29) — 1 of 2 NEW machines for BHAC.",
        "GB0-150-2": "INV-0240 — 2 of 2 NEW machines for BHAC.",
        "GB0-150-3": 'INV-0240 line: "Upgrade up to 4 BHAC Speed Queens" — BHAC OWNS hardware, we re-skinned.',
        "GB0-150-4": "INV-0240 line: BHAC-owned, re-skinned.",
        "GB0-150-5": "INV-0240 line: BHAC-owned, re-skinned.",
        "GB0-150-6": "INV-0240 line: BHAC-owned, re-skinned.",
        "GB0-135": "Likely May 2025 1300 Washer batches (I0014374/5, I0014517).",
        "GB0-137": "Likely May 2025 1300 Washer batches.",
        "GB0-138": "RETIRED dup of GB0-147.",
        "GB0-139": "Likely May 2025 1300 Washer batches.",
        "GB0-143-1": "Phantom — no invoice.",
        "GB0-143-2": "Phantom — no invoice.",
        "GB0-147": "Likely May-Jul 2025 1300 Washer batches.",
        "GB0-113": "Likely May 2025 1300 Washer batches.",
        "GB0-125": "Likely May 2025 1300 Washer batches.",
        "GB0-132": "Likely May 2025 1300 Washer batches.",
        "GB0-133": "Likely May 2025 1300 Washer batches. PHYSICALLY MISSING.",
        "GB0-WM-RD": "Likely May 2025 1300 Washer batches.",
        "GB0-WM-DSS": "Likely May 2025 1300 Washer batches.",
        "GB0-WM-F25": "RETIRED dup — coreid mapped to GB0-113 Norman.",
        "GB0-WM-4E5": "RETIRED dup — coreid mapped to GB0-154-2 Nicole.",
        "GB0-WM-507": "RETIRED dup — coreid mapped to GB0-125 Barkley.",
        "GB0-WM-098": "RETIRED dup — coreid mapped to GB0-132 Jimmy.",
        "GB0-WM-8D1": "RETIRED dup — speculative GB0-133.",
        "GB0-WM-PARTICLE-01": "RETIRED dup — same coreid as GB0-WM-4E5.",
        **{f"GB0-154-{n}": "Dec 13 2025 TC bush camp. Likely from Dec 15 2025 1300 Washer purchase (13,980 AUD, ~4 machines) + May-Jul stock. Wilya Janta delivery." for n in range(1, 11)},
        "GB0-WM-ORPHAN-c4b9": "Unmapped Particle coreid (550 events) — unassigned TC machine.",
        "GB0-WM-ORPHAN-fe6c": "Unmapped Particle coreid (397 events) — unassigned TC machine.",
        "GB0-WM-ORPHAN-689f": "Unmapped Particle coreid (38 brief events).",
        "GB0-136-1": "May 2025 1300 Washer batch. supply_date 2025-08-12 SUSPICIOUS (Ben on PI, not Alice).",
        "GB0-136-2": "May 2025 1300 Washer batch — same.",
        "GB0-136-3": "May 2025 1300 Washer batch — same.",
    }

    out_path = REPO / "wiki" / "outputs" / "2026-05-14-washing-machine-master-listing.md"
    out: list[str] = []
    out.append("---")
    out.append("title: Washing Machine MASTER LISTING — every detail per machine")
    out.append("date: 2026-05-14")
    out.append("status: live")
    out.append("audience: Ben + Nic, sense-check before trip")
    out.append("---")
    out.append("")
    out.append("# Washing Machine Master Listing")
    out.append("")
    out.append("All 41 register rows with: name · location · status · telemetry · photo · calendar evidence · Xero invoice provenance · recipient.")
    out.append("")

    groups: dict[str, list] = collections.defaultdict(list)
    for a in assets:
        groups[a.get("community") or "?"].append(a)

    for comm in sorted(groups, key=lambda c: (-len(groups[c]), c)):
        items = groups[comm]
        out.append(f"## {comm} — {len(items)} record(s)")
        out.append("")
        for a in items:
            uid = a["unique_id"]
            nm = a.get("name") or "(unnamed)"
            st = a["status"]
            ts = a.get("supply_date")
            sd = ts[:10] if ts else "(no date)"
            pl = (a.get("place") or "(no place)")
            photo = "YES" if a.get("photo") else "no"
            telem = agg.get(uid, {})
            last = telem.get("last")
            n_events = telem.get("events", 0)
            days = silent(last) if last else None
            mapped = T2A.get(uid, [])
            if last:
                dotchar = "GREEN" if (days is not None and days <= 7) else ("AMBER" if (days is not None and days <= 30) else "RED")
                tline = f"{dotchar} last seen {last[:10]} ({days}d ago), {n_events} events"
            else:
                tline = "GREY never reported" if mapped or st != "retired" else "(retired, n/a)"
            out.append(f"### {uid} — {nm}")
            out.append("")
            out.append(f"- **Status:** {st}")
            out.append(f"- **Community / Place:** {comm} | {pl}")
            out.append(f"- **Supply date (register):** {sd}")
            out.append(f"- **Photo:** {photo}")
            out.append(f"- **Telemetry:** {tline}")
            if mapped:
                out.append(f"- **Mapped telemetry IDs:** " + ", ".join(f"`{x}`" for x in mapped))
            out.append(f"- **Recipient / people:** {PEOPLE.get(uid, '—')}")
            out.append(f"- **Calendar trip evidence:** {CAL.get(uid, '—')}")
            out.append(f"- **Xero provenance (best guess):** {XERO.get(uid, '—')}")
            qr = a.get("qr_url")
            if qr:
                out.append(f"- **QR url:** {qr}")
            out.append(f"- **Edit page:** /admin/assets/{uid}")
            out.append("")

    # Summary
    out.append("---")
    out.append("")
    out.append("## Summary totals")
    out.append("")
    out.append(f"- **Total register rows:** {len(assets)}")
    out.append(f"- **Deployed:** {sum(1 for a in assets if a['status']=='deployed')}")
    out.append(f"- **Under investigation:** {sum(1 for a in assets if a['status']=='under_investigation')}")
    out.append(f"- **Retired:** {sum(1 for a in assets if a['status']=='retired')}")
    out.append("")
    out.append("## Xero ACCPAY purchase ledger — 1300 Washer (Speed Queen distributor)")
    out.append("")
    out.append("| Invoice | Date | AUD | Machines (est) |")
    out.append("|---|---|---:|---:|")
    out.append("| I0014374 | 2025-05-12 | 2,995 | 1 |")
    out.append("| I0014375 | 2025-05-12 | 14,975 | 5 |")
    out.append("| I0014517 | 2025-05-29 | 14,975 | 5 |")
    out.append("| I0014891 | 2025-07-14 | 8,985 | 3 |")
    out.append("| (Dext-scanned, no #) | 2025-12-15 | 13,980 | ~4 |")
    out.append("| **TOTAL** | | **55,910** | **~18** |")
    out.append("")
    out.append("Plus 4 BHAC-owned Speed Queens we upgraded (re-skinned at Defy Design, invoiced via Snow INV-0240).")
    out.append("")
    out.append("**Most defensible count:** **18 Goods-built machines + 4 BHAC re-skins = 22 machines Goods has touched.**")

    out_path.write_text("\n".join(out))
    print(f"Wrote {out_path.relative_to(REPO)}  ({len(out)} lines)")


if __name__ == "__main__":
    main()
