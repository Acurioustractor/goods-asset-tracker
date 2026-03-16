'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type GrantSection =
  | 'org_identity'
  | 'founders'
  | 'problem'
  | 'solution'
  | 'impact'
  | 'financials'
  | 'community_voices'
  | 'use_of_funds'
  | 'eligibility';

type FundingPurpose = 'beds' | 'production' | 'washers' | 'scale';

type ComposedSection = {
  id: GrantSection;
  title: string;
  content: string;
};

type ComposedGrant = {
  funderName: string;
  sections: ComposedSection[];
  generatedAt: string;
};

const ALL_SECTIONS: { id: GrantSection; label: string }[] = [
  { id: 'org_identity', label: 'Organisation Identity' },
  { id: 'founders', label: 'Founders' },
  { id: 'problem', label: 'Problem Statement' },
  { id: 'solution', label: 'Our Solution' },
  { id: 'impact', label: 'Impact to Date' },
  { id: 'financials', label: 'Financial Position' },
  { id: 'community_voices', label: 'Community Voices' },
  { id: 'use_of_funds', label: 'Use of Funds' },
  { id: 'eligibility', label: 'Eligibility' },
];

const FUNDING_PURPOSES: { id: FundingPurpose; label: string; description: string }[] = [
  { id: 'beds', label: 'Beds', description: '$600–850 per bed deployed' },
  { id: 'production', label: 'Production Facility', description: '$100K for containerised facility' },
  { id: 'washers', label: 'Washing Machines', description: '$4,000 per unit with telemetry' },
  { id: 'scale', label: 'Scale (500+ beds)', description: '$500K working capital + supply chain' },
];

const SUGGESTED_FUNDERS = [
  'Snow Foundation',
  'FRRR',
  'Vincent Fairfax Family Foundation',
  'Tim Fairfax Family Foundation',
  'Paul Ramsay Foundation',
  'Dusseldorp Forum',
  'Giant Leap Fund',
  'IBA (Indigenous Business Australia)',
  'NIAA',
  'Centrecorp Foundation',
];

export default function GrantsPage() {
  const [funderName, setFunderName] = useState('');
  const [selectedSections, setSelectedSections] = useState<GrantSection[]>([
    'org_identity',
    'problem',
    'solution',
    'impact',
    'community_voices',
    'financials',
    'use_of_funds',
    'eligibility',
  ]);
  const [fundingPurpose, setFundingPurpose] = useState<FundingPurpose>('beds');
  const [composedGrant, setComposedGrant] = useState<ComposedGrant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleSection = (id: GrantSection) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const compose = async () => {
    if (!funderName.trim()) {
      setError('Enter a funder name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/grants/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funderName: funderName.trim(),
          sections: selectedSections,
          fundingPurpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to compose');
      }

      const grant = await res.json();
      setComposedGrant(grant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compose grant');
    } finally {
      setLoading(false);
    }
  };

  const exportMarkdown = () => {
    if (!composedGrant) return;

    const lines = [
      `# Grant Application — ${composedGrant.funderName}`,
      `*Generated ${new Date(composedGrant.generatedAt).toLocaleDateString('en-AU', { dateStyle: 'long' })}*`,
      '',
    ];

    for (const section of composedGrant.sections) {
      lines.push(`## ${section.title}`, '', section.content, '');
    }

    lines.push('---', '*Prepared by Goods on Country (www.goodsoncountry.com)*');

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grant-${composedGrant.funderName.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!composedGrant) return;

    const text = composedGrant.sections
      .map((s) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Grant Application Composer</h1>
        <p className="mt-1 text-sm text-slate-400">
          Auto-fill grant applications from verified content. Every claim is sourced from the master compendium.
        </p>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funder Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Funder / Grant Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              value={funderName}
              onChange={(e) => setFunderName(e.target.value)}
              placeholder="Enter funder name..."
              className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_FUNDERS.map((name) => (
                <button
                  key={name}
                  onClick={() => setFunderName(name)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    funderName === name
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Sections to Include</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ALL_SECTIONS.map((section) => (
                <label key={section.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => toggleSection(section.id)}
                    className="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {section.label}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funding Purpose */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Funding Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {FUNDING_PURPOSES.map((purpose) => (
                <label key={purpose.id} className="flex items-start gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="fundingPurpose"
                    checked={fundingPurpose === purpose.id}
                    onChange={() => setFundingPurpose(purpose.id)}
                    className="mt-1 border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {purpose.label}
                    </span>
                    <p className="text-xs text-slate-500">{purpose.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compose Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={compose}
          disabled={loading || !funderName.trim()}
          className="rounded-md bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Composing...' : 'Compose Application'}
        </button>

        {composedGrant && (
          <>
            <button
              onClick={exportMarkdown}
              className="rounded-md border border-slate-600 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Export Markdown
            </button>
            <button
              onClick={copyToClipboard}
              className="rounded-md border border-slate-600 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </>
        )}

        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>

      {/* Composed Output */}
      {composedGrant && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              {composedGrant.funderName}
            </h2>
            <Badge variant="outline" className="border-green-600 text-green-400">
              {composedGrant.sections.length} sections
            </Badge>
            <span className="text-xs text-slate-500">
              Generated {new Date(composedGrant.generatedAt).toLocaleString('en-AU')}
            </span>
          </div>

          {composedGrant.sections.map((section) => (
            <Card key={section.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-orange-300">
                    {section.title}
                  </CardTitle>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(section.content);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Copy section
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed bg-transparent p-0 m-0 border-none">
                    {section.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Outreach Targets Push */}
      <OutreachPush />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Outreach Target Push Panel
// ─────────────────────────────────────────────────────────────────────────────

type PushResult = {
  targetId: string;
  name: string;
  targetType: string;
  success: boolean;
  simulated: boolean;
  contactId: string | null;
  opportunityId: string | null;
  opportunityCreated: boolean;
  error: string | null;
};

type PushResponse = {
  totalTargets: number;
  successful: number;
  failed: number;
  opportunitiesCreated: number;
  results: PushResult[];
  dryRun?: boolean;
  preview?: Array<{
    id: string;
    name: string;
    targetType: string;
    hasContact: boolean;
    nextAction: string;
  }>;
};

function OutreachPush() {
  const [pushResult, setPushResult] = useState<PushResponse | null>(null);
  const [pushing, setPushing] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);

  const pushTargets = async (dryRun: boolean) => {
    setPushing(true);
    setPushError(null);

    try {
      // Import targets dynamically — these live in the grantscope repo
      // but we also have them available via the API
      const res = await fetch('/api/admin/targets/push-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targets: [], // Empty = use server-side defaults
          dryRun,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Push failed');
      }

      const result = await res.json();
      setPushResult(result);
    } catch (err) {
      setPushError(err instanceof Error ? err.message : 'Push failed');
    } finally {
      setPushing(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium text-white">
              Push Outreach Targets to GHL
            </CardTitle>
            <p className="text-xs text-slate-400 mt-1">
              Push all 45+ strategic targets through the Grantscope → GHL pipeline
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pushTargets(true)}
              disabled={pushing}
              className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {pushing ? 'Checking...' : 'Dry Run'}
            </button>
            <button
              onClick={() => pushTargets(false)}
              disabled={pushing}
              className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
            >
              {pushing ? 'Pushing...' : 'Push to GHL'}
            </button>
          </div>
        </div>
      </CardHeader>

      {pushError && (
        <CardContent>
          <p className="text-sm text-red-400">{pushError}</p>
        </CardContent>
      )}

      {pushResult && (
        <CardContent>
          {pushResult.dryRun ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge variant="outline" className="border-blue-600 text-blue-400">
                  DRY RUN — {pushResult.totalTargets} targets
                </Badge>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {pushResult.preview?.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs">
                    <Badge
                      variant="outline"
                      className={
                        t.targetType === 'buyer'
                          ? 'border-green-600 text-green-400'
                          : t.targetType === 'capital'
                            ? 'border-purple-600 text-purple-400'
                            : 'border-blue-600 text-blue-400'
                      }
                    >
                      {t.targetType}
                    </Badge>
                    <span className="text-slate-300">{t.name}</span>
                    {t.hasContact && (
                      <span className="text-green-500 text-[10px]">has contact</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge variant="outline" className="border-green-600 text-green-400">
                  {pushResult.successful} pushed
                </Badge>
                {pushResult.failed > 0 && (
                  <Badge variant="outline" className="border-red-600 text-red-400">
                    {pushResult.failed} failed
                  </Badge>
                )}
                <Badge variant="outline" className="border-purple-600 text-purple-400">
                  {pushResult.opportunitiesCreated} opportunities
                </Badge>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {pushResult.results?.map((r) => (
                  <div key={r.targetId} className="flex items-center gap-2 text-xs">
                    {r.success ? (
                      <span className="text-green-500">OK</span>
                    ) : (
                      <span className="text-red-500">FAIL</span>
                    )}
                    <span className="text-slate-300">{r.name}</span>
                    {r.simulated && (
                      <span className="text-yellow-500 text-[10px]">simulated</span>
                    )}
                    {r.error && (
                      <span className="text-red-400 text-[10px]">{r.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
