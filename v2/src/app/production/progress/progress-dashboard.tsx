'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Shift {
  id: string;
  operator: string;
  shift_date: string;
  sheets_produced: number;
  sheets_cooling: number;
  plastic_shredded_kg: number;
  beds_assembled: number;
  diesel_level: string;
  issues: string[];
  created_at: string;
}

interface EfficiencyTest {
  id: string;
  title: string;
  hypothesis: string;
  status: 'planned' | 'running' | 'complete';
  result?: string;
  started_at?: string;
}

// Efficiency tests we're tracking — these can be extended via the journal
const EFFICIENCY_TESTS: EfficiencyTest[] = [
  {
    id: 'press-closer',
    title: 'Move heat press & cooling press closer',
    hypothesis: 'Reduces sheet handling risk and time by cutting carry distance',
    status: 'planned',
  },
  {
    id: 'jig-rotation',
    title: 'Rotate pre-drilling jig every 50 uses',
    hypothesis: 'Prevents hole boring that causes alignment drift in assembly',
    status: 'planned',
  },
  {
    id: 'shredder-to-bandsaw',
    title: 'Move shredding station to bandsaw area',
    hypothesis: 'Frees container space for storage, safer plastic cutting with bandsaw',
    status: 'planned',
  },
  {
    id: 'blue-tub-dust',
    title: 'Get blue tub back for plastic dust containment',
    hypothesis: 'Reduces cleanup time and keeps production area cleaner',
    status: 'planned',
  },
  {
    id: 'assembly-jig-v2',
    title: 'Improved assembly jig design',
    hypothesis: 'Faster bed assembly with more consistent results',
    status: 'running',
  },
  {
    id: 'tolerance-window',
    title: 'Define acceptable quality tolerance',
    hypothesis: 'Removes perfectionism bottleneck — beds that work should ship',
    status: 'running',
  },
];

const STATUS_BADGES: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-800',
  running: 'bg-blue-100 text-blue-800',
  complete: 'bg-green-100 text-green-800',
};

export function ProgressDashboard() {
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/production/shifts')
      .then((r) => r.json())
      .then((data) => {
        if (data.shifts) setShifts(data.shifts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Calculate stats
  const totalShifts = shifts.length;
  const totalSheets = shifts.reduce((sum, s) => sum + (s.sheets_produced || 0), 0);
  const totalBeds = shifts.reduce((sum, s) => sum + (s.beds_assembled || 0), 0);
  const totalPlastic = shifts.reduce((sum, s) => sum + (s.plastic_shredded_kg || 0), 0);
  const totalIssues = shifts.reduce((sum, s) => sum + (s.issues?.length || 0), 0);
  const issueFreeShifts = shifts.filter((s) => !s.issues || s.issues.length === 0).length;

  // Last 7 days performance
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentShifts = shifts.filter((s) => new Date(s.shift_date) >= sevenDaysAgo);
  const recentSheets = recentShifts.reduce((sum, s) => sum + (s.sheets_produced || 0), 0);
  const recentBeds = recentShifts.reduce((sum, s) => sum + (s.beds_assembled || 0), 0);

  // Best day
  const bestSheetDay = shifts.length > 0
    ? shifts.reduce((best, s) => s.sheets_produced > best.sheets_produced ? s : best, shifts[0])
    : null;

  // Average sheets per shift
  const avgSheets = totalShifts > 0 ? (totalSheets / totalShifts).toFixed(1) : '0';

  // Streak: consecutive shifts without issues
  let currentStreak = 0;
  const sortedShifts = [...shifts].sort((a, b) => b.shift_date.localeCompare(a.shift_date));
  for (const s of sortedShifts) {
    if (!s.issues || s.issues.length === 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-3xl font-bold tabular-nums">{totalSheets}</p>
            <p className="text-sm text-muted-foreground">Total Sheets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-3xl font-bold tabular-nums">{totalBeds}</p>
            <p className="text-sm text-muted-foreground">Beds Assembled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-3xl font-bold tabular-nums">{totalPlastic}<span className="text-lg">kg</span></p>
            <p className="text-sm text-muted-foreground">Plastic Recycled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-3xl font-bold tabular-nums">{totalShifts}</p>
            <p className="text-sm text-muted-foreground">Shifts Logged</p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Bests & Averages */}
      <Card>
        <CardContent>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Your Numbers
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Average sheets/shift</span>
              <span className="font-semibold text-lg tabular-nums">{avgSheets}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Target sheets/day</span>
              <span className="font-semibold text-lg tabular-nums">6</span>
            </div>
            {bestSheetDay && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Best day (sheets)</span>
                <span className="font-semibold text-lg tabular-nums">
                  {bestSheetDay.sheets_produced} <span className="text-sm text-muted-foreground font-normal">
                    ({new Date(bestSheetDay.shift_date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })})
                  </span>
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Issue-free shifts</span>
              <span className="font-semibold text-lg tabular-nums">
                {issueFreeShifts}/{totalShifts}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Current clean streak</span>
              <span className="font-semibold text-lg tabular-nums">
                {currentStreak} shift{currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Week */}
      <Card>
        <CardContent>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Last 7 Days
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl font-bold tabular-nums">{recentShifts.length}</p>
              <p className="text-xs text-muted-foreground">Shifts</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl font-bold tabular-nums">{recentSheets}</p>
              <p className="text-xs text-muted-foreground">Sheets</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl font-bold tabular-nums">{recentBeds}</p>
              <p className="text-xs text-muted-foreground">Beds</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardContent>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Production Goals
          </h2>
          <div className="space-y-4">
            <GoalProgress
              label="6 sheets per day (max press capacity)"
              current={Number(avgSheets)}
              target={6}
            />
            <GoalProgress
              label="5-6 beds assembled per day"
              current={recentShifts.length > 0 ? recentBeds / recentShifts.length : 0}
              target={5}
            />
            <GoalProgress
              label="Zero-issue shifts (reliability)"
              current={totalShifts > 0 ? (issueFreeShifts / totalShifts) * 100 : 0}
              target={80}
              unit="%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Tests */}
      <Card>
        <CardContent>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Efficiency Tests
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ideas we&apos;re testing to make production safer and faster
          </p>
          <div className="space-y-3">
            {EFFICIENCY_TESTS.map((test) => (
              <div key={test.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm">{test.title}</p>
                  <Badge className={STATUS_BADGES[test.status]}>
                    {test.status === 'complete' ? 'Done' : test.status === 'running' ? 'Testing' : 'Planned'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{test.hypothesis}</p>
                {test.result && (
                  <p className="text-xs text-green-700 mt-1 font-medium">{test.result}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Got a new idea? Log it in the <a href="/production/journal" className="underline">Process Journal</a> as a &quot;Cost Idea&quot;
          </p>
        </CardContent>
      </Card>

      {/* Common Issues Breakdown */}
      {totalIssues > 0 && (
        <Card>
          <CardContent>
            <h2
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Issue Breakdown
            </h2>
            <div className="space-y-2">
              {getIssueBreakdown(shifts).map(({ issue, count }) => (
                <div key={issue} className="flex items-center justify-between py-1">
                  <span className="text-sm">{issue}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{ width: `${(count / totalShifts) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm tabular-nums font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function GoalProgress({
  label,
  current,
  target,
  unit = '',
}: {
  label: string;
  current: number;
  target: number;
  unit?: string;
}) {
  const pct = Math.min(100, (current / target) * 100);
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">
          {current.toFixed(1)}{unit} / {target}{unit}
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function getIssueBreakdown(shifts: Shift[]): { issue: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const s of shifts) {
    for (const issue of s.issues || []) {
      counts[issue] = (counts[issue] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count);
}
