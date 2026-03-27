'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Truck,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export interface CommittedOrder {
  id: string;
  title: string;
  customer: string;
  beds: number;
  value: number;
  maker: 'defy' | 'act' | 'tbc';
  status: 'in-production' | 'awaiting-stock' | 'overdue' | 'quoted' | 'delivered';
  notes?: string;
}

export interface SupplierQuote {
  id: string;
  reference: string;
  supplier: string;
  description: string;
  amount: number;
  bedsEquivalent: number;
  expires: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface SupplyDemandCardProps {
  bedsPossible: number;
  orders: CommittedOrder[];
  quotes: SupplierQuote[];
  rawPlasticKg: number;
}

function formatDollars(dollars: number): string {
  return `$${dollars.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

const MAKER_LABELS: Record<string, { label: string; color: string }> = {
  defy: { label: 'Defy', color: 'bg-blue-100 text-blue-700' },
  act: { label: 'ACT (In-house)', color: 'bg-green-100 text-green-700' },
  tbc: { label: 'TBC', color: 'bg-gray-100 text-gray-600' },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  'in-production': { label: 'In Production', color: 'bg-blue-50 text-blue-700' },
  'awaiting-stock': { label: 'Awaiting Stock', color: 'bg-amber-50 text-amber-700' },
  overdue: { label: 'Overdue', color: 'bg-red-50 text-red-700' },
  quoted: { label: 'Quoted', color: 'bg-purple-50 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-green-50 text-green-700' },
};

export function SupplyDemandCard({ bedsPossible, orders, quotes, rawPlasticKg }: SupplyDemandCardProps) {
  const totalDemand = orders.filter(o => o.status !== 'delivered').reduce((sum, o) => sum + o.beds, 0);
  const inProductionDefy = orders.filter(o => o.maker === 'defy' && o.status === 'in-production').reduce((sum, o) => sum + o.beds, 0);
  const needFromACT = orders.filter(o => o.maker === 'act' && o.status !== 'delivered').reduce((sum, o) => sum + o.beds, 0);
  const tbcBeds = orders.filter(o => o.maker === 'tbc' && o.status !== 'delivered').reduce((sum, o) => sum + o.beds, 0);
  const totalValue = orders.filter(o => o.status !== 'delivered').reduce((sum, o) => sum + o.value, 0);

  // Gap analysis
  const actSupply = bedsPossible;
  const actGap = needFromACT + tbcBeds - actSupply;
  const hasGap = actGap > 0;

  // Plastic needed: ~20kg per bed
  const plasticNeeded = (needFromACT + tbcBeds) * 20;
  const plasticGap = plasticNeeded - rawPlasticKg;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Supply & Demand</h3>

        {/* Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalDemand}</p>
            <p className="text-xs text-gray-500">Beds Committed</p>
            <p className="text-xs text-gray-400">{formatDollars(totalValue)} value</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{inProductionDefy}</p>
            <p className="text-xs text-blue-600">Defy Making</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{needFromACT + tbcBeds}</p>
            <p className="text-xs text-green-600">ACT to Make</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${hasGap ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <p className={`text-2xl font-bold ${hasGap ? 'text-red-700' : 'text-emerald-700'}`}>
              {hasGap ? `-${actGap}` : `+${Math.abs(actGap)}`}
            </p>
            <p className={`text-xs ${hasGap ? 'text-red-600' : 'text-emerald-600'}`}>
              {hasGap ? 'Stock Gap' : 'Stock Surplus'}
            </p>
            <p className="text-xs text-gray-400">vs {actSupply} possible</p>
          </div>
        </div>

        {/* Plastic position for ACT orders */}
        {(needFromACT + tbcBeds) > 0 && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${plasticGap > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2">
              {plasticGap > 0
                ? <AlertTriangle className="h-4 w-4 text-amber-600" />
                : <CheckCircle className="h-4 w-4 text-green-600" />
              }
              <span className="font-medium">
                Plastic for ACT orders: need {plasticNeeded}kg, have {rawPlasticKg}kg
              </span>
              {plasticGap > 0 && (
                <span className="text-amber-700 font-semibold ml-auto">
                  Need {plasticGap}kg more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b text-xs uppercase tracking-wide">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Beds</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium">Made By</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const maker = MAKER_LABELS[order.maker];
                const status = STATUS_LABELS[order.status];
                return (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2.5">
                      <p className="font-medium text-gray-900">{order.title}</p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </td>
                    <td className="py-2.5 font-bold tabular-nums">{order.beds}</td>
                    <td className="py-2.5 tabular-nums text-gray-600">{formatDollars(order.value)}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${maker.color}`}>
                        {maker.label}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pending Quotes */}
        {quotes.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4" /> Pending Supplier Quotes
            </h4>
            <div className="space-y-2">
              {quotes.map(q => (
                <div key={q.id} className={`rounded-lg border p-3 ${
                  q.status === 'pending' ? 'border-purple-200 bg-purple-50/50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{q.reference} — {q.supplier}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{q.description}</p>
                      {q.bedsEquivalent > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          ~{q.bedsEquivalent} beds equivalent
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900">{formatDollars(q.amount)}</p>
                      <p className="text-xs text-gray-400">
                        expires {new Date(q.expires).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
