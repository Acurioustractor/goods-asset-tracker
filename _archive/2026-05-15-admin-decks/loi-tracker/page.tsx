'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  CheckCircle,
  Clock,
  FileCheck,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

type LoiStatus =
  | 'loi_received'
  | 'approved'
  | 'verbal'
  | 'invoiced'
  | 'exploring'
  | 'quoted'
  | 'requested';

interface LoiBuyer {
  buyer: string;
  product: string;
  qty: string;
  estValue: number;
  status: LoiStatus;
  statusDetail: string;
  contact: string | null;
  nextStep: string;
}

// -------------------------------------------------------------------
// Data
// -------------------------------------------------------------------

const STATUS_CONFIG: Record<LoiStatus, { label: string; color: string }> = {
  loi_received: { label: 'LOI Received', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
  invoiced: { label: 'Invoiced', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  verbal: { label: 'Verbal', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  exploring: { label: 'Exploring', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  quoted: { label: 'Quoted', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  requested: { label: 'Requested', color: 'bg-orange-100 text-orange-800 border-orange-200' },
};

const BUYERS: LoiBuyer[] = [
  {
    buyer: 'Centre Corp Foundation',
    product: 'Stretch Bed',
    qty: '107',
    estValue: 59_920,
    status: 'approved',
    statusDetail: 'APPROVED (Jan 30 2026) -- needs formal LOI',
    contact: 'Randle Walker',
    nextStep: 'Get written LOI/PO on letterhead',
  },
  {
    buyer: 'Miwatj Health',
    product: 'Stretch Bed + Washer',
    qty: '50 beds + 8 washers',
    estValue: 50_000,
    status: 'exploring',
    statusDetail: 'Exploring fleet deployment across 8 clinics',
    contact: 'Jessica Allardyce',
    nextStep: 'Request formal expression of interest',
  },
  {
    buyer: 'NPY Women\'s Council',
    product: 'Stretch Bed',
    qty: '200-350',
    estValue: 140_000,
    status: 'verbal',
    statusDetail: '"Always looking for beds" -- verbal',
    contact: 'Angela Lynch',
    nextStep: 'Request written LOI with volume estimate',
  },
  {
    buyer: 'WHSAC (Groote Eylandt)',
    product: 'Mattress + Washer',
    qty: '500 + 300',
    estValue: 580_000,
    status: 'requested',
    statusDetail: 'Request form submitted',
    contact: 'Simone Grimmond',
    nextStep: 'Follow up on procurement pathway',
  },
  {
    buyer: 'Homeland Schools Company',
    product: 'Stretch Bed',
    qty: '65',
    estValue: 34_086,
    status: 'invoiced',
    statusDetail: 'INVOICED ($34K outstanding)',
    contact: null,
    nextStep: 'Chase payment -- this IS the LOI',
  },
  {
    buyer: 'Palm Island Community Co',
    product: 'Stretch Bed',
    qty: '100+',
    estValue: 56_000,
    status: 'verbal',
    statusDetail: '141 deployed, expansion discussions',
    contact: 'Narelle',
    nextStep: 'Request LOI for next 100',
  },
  {
    buyer: 'Anyinginyi Health',
    product: 'Washer',
    qty: '4+',
    estValue: 16_000,
    status: 'quoted',
    statusDetail: 'Quote sent Feb 2026',
    contact: 'Tony',
    nextStep: 'Follow up quote -- convert to LOI',
  },
  {
    buyer: 'QIC Brisbane',
    product: 'Stretch Bed',
    qty: '50',
    estValue: 28_000,
    status: 'exploring',
    statusDetail: 'NAIDOC week staff build event',
    contact: null,
    nextStep: 'Confirm commitment in writing',
  },
  {
    buyer: 'Utopia Homelands (via Centre Corp)',
    product: 'Stretch Bed',
    qty: '167',
    estValue: 93_520,
    status: 'verbal',
    statusDetail: 'Survey documented demand',
    contact: null,
    nextStep: 'Route through Centre Corp procurement',
  },
];

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusBadge(status: LoiStatus) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`${config.color} text-xs`}>
      {config.label}
    </Badge>
  );
}

// -------------------------------------------------------------------
// Component
// -------------------------------------------------------------------

export default function LoiTrackerPage() {
  const [statusFilter, setStatusFilter] = useState<LoiStatus | 'all'>('all');

  const filtered =
    statusFilter === 'all'
      ? BUYERS
      : BUYERS.filter((b) => b.status === statusFilter);

  const totalPipelineValue = BUYERS.reduce((sum, b) => sum + b.estValue, 0);
  const loiCount = BUYERS.filter(
    (b) => b.status === 'loi_received' || b.status === 'invoiced'
  ).length;
  const conversionRate =
    BUYERS.length > 0
      ? Math.round((loiCount / BUYERS.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-orange-600" />
          LOI Tracker
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Letters of Intent pipeline for QBE Stage 2 grant leverage.
          Every LOI strengthens the case for $250K catalytic funding.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2">
                <FileCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">LOIs Received</p>
                <p className="text-2xl font-bold">{loiCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pipeline Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Buyers Contacted</p>
                <p className="text-2xl font-bold">{BUYERS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">LOI Pipeline</CardTitle>
              <CardDescription>
                {filtered.length} of {BUYERS.length} buyers shown
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LoiStatus | 'all')}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Buyer</th>
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium text-right">Qty</th>
                  <th className="pb-3 pr-4 font-medium text-right">Est. Value</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Next Step</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.buyer}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-900">{row.buyer}</td>
                    <td className="py-3 pr-4 text-gray-600">{row.product}</td>
                    <td className="py-3 pr-4 text-right text-gray-600">{row.qty}</td>
                    <td className="py-3 pr-4 text-right font-medium text-gray-900">
                      {formatCurrency(row.estValue)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(row.status)}
                        <span className="text-xs text-gray-500">{row.statusDetail}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {row.contact ?? (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600 max-w-[200px]">{row.nextStep}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No buyers match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td className="pt-3 pr-4">Total</td>
                    <td className="pt-3 pr-4" />
                    <td className="pt-3 pr-4" />
                    <td className="pt-3 pr-4 text-right">
                      {formatCurrency(filtered.reduce((s, b) => s + b.estValue, 0))}
                    </td>
                    <td colSpan={3} className="pt-3" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom cards: Multiplier Evidence + LOI Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multiplier Evidence */}
        <Card className="border-orange-200 bg-orange-50/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              Multiplier Evidence
            </CardTitle>
            <CardDescription>
              How buyer commitments strengthen the QBE Stage 2 pitch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white/80 border border-orange-100 p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-orange-700">
                  {formatCurrency(totalPipelineValue)}
                </span>{' '}
                in pipeline buyer revenue across{' '}
                <span className="font-semibold">{BUYERS.length} organisations</span>.
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-700">
                  {Math.round(totalPipelineValue / 250_000).toFixed(1)}x
                </span>
                <span className="text-sm text-gray-500">
                  demand-to-grant ratio (pipeline vs $250K ask)
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 italic">
              &ldquo;Every $1 of committed buyer revenue proves market demand that unlocks
              investor capital.&rdquo;
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">QBE Stage 2 ask</span>
                <span className="font-medium">$250,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Committed pipeline</span>
                <span className="font-medium text-orange-700">{formatCurrency(totalPipelineValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Formal LOIs in hand</span>
                <span className="font-medium">{loiCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buyers in pipeline</span>
                <span className="font-medium">{BUYERS.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LOI Template */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              LOI Template Guide
            </CardTitle>
            <CardDescription>
              What a good Letter of Intent should contain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { icon: CheckCircle, text: 'Buyer organisation name and ABN' },
                { icon: FileText, text: 'Description of intended purchase (product, use case)' },
                { icon: DollarSign, text: 'Estimated quantity and value' },
                { icon: Clock, text: 'Expected timeframe for delivery' },
                {
                  icon: FileCheck,
                  text: 'Not legally binding caveat (standard LOI language)',
                },
                { icon: Users, text: 'Signed by an authorised person' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 p-4">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Tip:</span> Even an email from a decision-maker
                stating intent to purchase counts as a preliminary LOI. A formal letter on
                letterhead with ABN and signature is the gold standard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
