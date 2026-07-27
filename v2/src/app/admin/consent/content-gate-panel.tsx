import report from '@/lib/data/content-gate-report.json';

/**
 * The consent → claims → voice gate results for the current draft batch.
 * The data is a committed snapshot written by
 * `npm run check:content-gate -- --report` (drafts live in wiki/, outside the
 * deployed app, so the report travels as JSON). A stale panel means the gate
 * hasn't been re-run since the drafts changed; the fix is re-running it, never
 * editing the JSON.
 */

interface Finding {
  stage: string;
  line: number;
  finding: string;
  rule: string;
}
interface Result {
  file: string;
  storyteller: string | null;
  status: string | null;
  pass: boolean;
  findings: Finding[];
}

const STAGE_TONE: Record<string, string> = {
  consent: 'text-red-700',
  claims: 'text-amber-700',
  voice: 'text-blue-700',
};

export function ContentGatePanel() {
  const results = report.results as Result[];
  const passed = results.filter((r) => r.pass).length;

  return (
    <section className="mb-8 rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-base font-semibold">
          Content gate: consent → claims → voice
        </h2>
        <span
          className={`text-xs font-semibold ${passed === results.length ? 'text-emerald-700' : 'text-amber-700'}`}
        >
          {passed}/{results.length} drafts pass
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground max-w-2xl">
        Every public draft passes three stages before publishing, each finding citing the rule it
        violates. Refresh with <code>npm run check:content-gate -- --report</code> after editing
        drafts. Fix the draft or the rule, never the gate.
      </p>

      <ul className="mt-4 space-y-3">
        {results.map((r) => (
          <li key={r.file} className="rounded-lg border border-border/60 px-3 py-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium">
                {r.file}
                {r.storyteller && (
                  <span className="ml-2 text-xs text-muted-foreground">{r.storyteller}</span>
                )}
              </span>
              <span
                className={`text-xs font-bold ${r.pass ? 'text-emerald-700' : 'text-red-700'}`}
              >
                {r.pass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            {r.findings.map((f, i) => (
              <div key={i} className="mt-1.5 text-xs">
                <span className={`font-semibold uppercase ${STAGE_TONE[f.stage] ?? ''}`}>
                  {f.stage}
                </span>{' '}
                {f.line > 0 && <span className="text-muted-foreground">line {f.line}: </span>}
                {f.finding}
                <div className="text-muted-foreground">rule: {f.rule}</div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
