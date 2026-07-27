import { Card, CardContent } from '@/components/ui/card';
import {
  COMMUNITY_BED_CANON,
  WASHER_STALE_DEPLOYED_ROWS,
} from '@/lib/data/community-canonical';
import { WASHERS_IN_COMMUNITY_BY_COMMUNITY } from '@/lib/data/asset-canonical';

/**
 * The on-screen twin of scripts/check-register-integrity.mjs: the live
 * register's deployed rows against the per-community count rulings in
 * community-canonical.ts. Same comparison, same ruling citations — this view
 * is for seeing state daily; the script is the gate that blocks a merge.
 * A red line here means either a bad write landed in the register or a real
 * delivery needs a Ben ruling + canon entry. Never patch a surface to hide it.
 */

export interface ScoreboardRow {
  product: string | null;
  community: string | null;
  status: string | null;
  quantity: number;
}

interface Line {
  name: string;
  canonBasket: number;
  regBasket: number;
  canonStretch: number;
  regStretch: number;
  ok: boolean;
  ruling: string;
}

export function RegisterScoreboard({ rows }: { rows: ScoreboardRow[] }) {
  const deployed = rows.filter((r) => r.status === 'deployed');
  const live = new Map<string, Record<string, number>>();
  for (const r of deployed) {
    const c = r.community ?? '(null)';
    const m = live.get(c) ?? {};
    m[r.product ?? ''] = (m[r.product ?? ''] ?? 0) + r.quantity;
    live.set(c, m);
  }

  const lines: Line[] = COMMUNITY_BED_CANON.map((c) => {
    const l = live.get(c.registerName) ?? {};
    const regBasket = l['Basket Bed'] ?? 0;
    const regStretch = l['Stretch Bed'] ?? 0;
    return {
      name: c.registerName,
      canonBasket: c.basketBeds,
      regBasket,
      canonStretch: c.stretchBeds,
      regStretch,
      ok: regBasket === c.basketBeds && regStretch === c.stretchBeds,
      ruling: c.ruling,
    };
  });

  // Communities in the register that canon doesn't know about.
  const canonNames = new Set(COMMUNITY_BED_CANON.map((c) => c.registerName));
  const unknown = [...live.entries()]
    .filter(([name, m]) => {
      const beds = (m['Basket Bed'] ?? 0) + (m['Stretch Bed'] ?? 0);
      return beds > 0 && !canonNames.has(name) && name !== 'Pending Delivery';
    })
    .map(([name]) => name);

  const slugByName = Object.fromEntries(COMMUNITY_BED_CANON.map((c) => [c.registerName, c.id]));
  const washerLines = [...live.entries()]
    .map(([name, m]) => {
      const reg = m['Washing Machine'] ?? 0;
      const slug = slugByName[name] ?? name;
      const canon = WASHERS_IN_COMMUNITY_BY_COMMUNITY[slug] ?? 0;
      const stale = WASHER_STALE_DEPLOYED_ROWS[slug] ?? 0;
      return { name, canon, reg, stale, ok: reg === canon + stale };
    })
    .filter((w) => w.reg > 0 || w.canon > 0);

  const failures = lines.filter((l) => !l.ok);
  const washerFailures = washerLines.filter((w) => !w.ok);
  const allGreen = failures.length === 0 && washerFailures.length === 0 && unknown.length === 0;

  return (
    <Card className={allGreen ? 'border-emerald-200' : 'border-red-300 bg-red-50/30'}>
      <CardContent>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">Register integrity — live vs ruled canon</h2>
          <span className={`text-xs font-semibold ${allGreen ? 'text-emerald-700' : 'text-red-700'}`}>
            {allGreen ? 'ALL COMMUNITIES TIE' : `${failures.length + washerFailures.length + unknown.length} DISCREPANCIES`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-1.5 pr-3">Community</th>
                <th className="py-1.5 pr-3 text-right">Basket (canon / live)</th>
                <th className="py-1.5 pr-3 text-right">Stretch (canon / live)</th>
                <th className="py-1.5 pr-3 text-right">Total</th>
                <th className="py-1.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.name} className={`border-b border-border/50 ${l.ok ? '' : 'bg-red-100/60'}`}>
                  <td className="py-1.5 pr-3 font-medium">{l.name}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">
                    {l.canonBasket} / {l.regBasket}
                  </td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">
                    {l.canonStretch} / {l.regStretch}
                  </td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{l.canonBasket + l.canonStretch}</td>
                  <td className="py-1.5">
                    {l.ok ? (
                      <span className="text-xs font-semibold text-emerald-700">OK</span>
                    ) : (
                      <span className="text-xs font-semibold text-red-700" title={l.ruling}>
                        FAIL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {failures.map((l) => (
          <p key={l.name} className="mt-2 text-xs text-red-800">
            <strong>{l.name}:</strong> register {l.regBasket}B/{l.regStretch}S vs canon {l.canonBasket}B/{l.canonStretch}S.
            {' '}Ruling: {l.ruling}
          </p>
        ))}
        {unknown.length > 0 && (
          <p className="mt-2 text-xs text-red-800">
            <strong>Unruled communities with deployed beds:</strong> {unknown.join(', ')} — a new delivery needs a
            count ruling and a canon entry before public figures move.
          </p>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <span className="font-semibold">Washers</span> (ruled 22 in community; stale rows awaiting restatus are expected):{' '}
          {washerLines.map((w) => (
            <span key={w.name} className={`mr-3 ${w.ok ? '' : 'font-semibold text-red-700'}`}>
              {w.name} {w.canon}
              {w.stale > 0 && ` (+${w.stale} stale)`} → live {w.reg} {w.ok ? '✓' : '✗'}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Same assertion as <code>npm run check:register</code>. Red = a bad register write, or a real delivery that
          needs a ruling + <code>community-canonical.ts</code> entry. Fix the process, not this table.
        </p>
      </CardContent>
    </Card>
  );
}
