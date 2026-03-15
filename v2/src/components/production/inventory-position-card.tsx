'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProductionInventory } from '@/lib/types/database';
import { saveInventorySnapshot } from '@/app/admin/production/actions';

// BOM per bed
const BOM: Record<string, { perBed: number; key: keyof ProductionInventory }> = {
  Legs: { perBed: 4, key: 'legs_ready' },
  Tabs: { perBed: 8, key: 'tabs_ready' },
  'Steel Poles': { perBed: 2, key: 'steel_poles' },
  Canvas: { perBed: 1, key: 'canvas_ready' },
};

interface InventoryPositionCardProps {
  snapshot: ProductionInventory | null;
  avgDailyBurnKg?: number;
  plasticRunwayDays?: number;
}

export function InventoryPositionCard({ snapshot, avgDailyBurnKg = 0, plasticRunwayDays = -1 }: InventoryPositionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      await saveInventorySnapshot(formData);
      setIsEditing(false);
    });
  };

  if (!snapshot && !isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Inventory Position</h3>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Initial Stocktake</Button>
          </div>
          <p className="text-gray-500 text-sm">No inventory counts recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Find the bottleneck
  const componentBeds = Object.entries(BOM).map(([name, { perBed, key }]) => ({
    name,
    count: snapshot ? snapshot[key] as number : 0,
    bedsWorth: Math.floor((snapshot ? snapshot[key] as number : 0) / perBed),
    perBed,
  }));
  const minBeds = Math.min(...componentBeds.map((c) => c.bedsWorth));

  const pipelineItems = [
    { label: 'Chipped Sheets', value: snapshot?.chipped_plastic_sheets || 0 },
    { label: 'Tab Sheets (finished)', value: snapshot?.tab_sheets_finished || 0 },
    { label: 'Tab Sheets (cooker)', value: snapshot?.tab_sheets_in_cooker || 0 },
    { label: 'Tab Sheets (cooling)', value: snapshot?.tab_sheets_cooling || 0 },
    { label: 'Leg Sheets (uncut)', value: snapshot?.leg_sheets_uncut || 0 },
  ];

  const snapshotDate = snapshot ? new Date(snapshot.snapshot_date + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : 'Today';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Inventory Position</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Edit' : 'Update Stock'}
            </Button>
          </div>
          <span className="text-xs text-gray-400">Count: {snapshotDate}</span>
        </div>

        {isEditing ? (
          <form action={handleUpdate} className="space-y-6">
            {snapshot?.id && <input type="hidden" name="id" value={snapshot.id} />}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="col-span-2 lg:col-span-5 border-b pb-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Raw Materials</h4>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Raw Plastic (kg)</Label>
                <Input name="raw_plastic_kg" type="number" defaultValue={snapshot?.raw_plastic_kg || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Steel Poles</Label>
                <Input name="steel_poles" type="number" defaultValue={snapshot?.steel_poles || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Canvas Ready</Label>
                <Input name="canvas_ready" type="number" defaultValue={snapshot?.canvas_ready || 0} />
              </div>

              <div className="col-span-2 lg:col-span-5 border-b pb-2 mb-2 mt-4">
                <h4 className="text-sm font-semibold text-gray-700">Sub-Assemblies</h4>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Chipped Sheets</Label>
                <Input name="chipped_plastic_sheets" type="number" defaultValue={snapshot?.chipped_plastic_sheets || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Leg Sheets (Uncut)</Label>
                <Input name="leg_sheets_uncut" type="number" defaultValue={snapshot?.leg_sheets_uncut || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Legs Ready</Label>
                <Input name="legs_ready" type="number" defaultValue={snapshot?.legs_ready || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Tab Sheets (Cooker)</Label>
                <Input name="tab_sheets_in_cooker" type="number" defaultValue={snapshot?.tab_sheets_in_cooker || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Tab Sheets (Cooling)</Label>
                <Input name="tab_sheets_cooling" type="number" defaultValue={snapshot?.tab_sheets_cooling || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Tab Sheets (Finished)</Label>
                <Input name="tab_sheets_finished" type="number" defaultValue={snapshot?.tab_sheets_finished || 0} />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Tabs Ready</Label>
                <Input name="tabs_ready" type="number" defaultValue={snapshot?.tabs_ready || 0} />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Inventory'}
              </Button>
            </div>
          </form>
        ) : (
          <>
            {/* Raw Material Runway */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">Raw Plastic Stock</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Current burn rate: <span className="font-medium text-gray-900">{avgDailyBurnKg}kg / day</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold tabular-nums ${plasticRunwayDays >= 0 && plasticRunwayDays < 14 ? 'text-red-600' : 'text-gray-900'}`}>
                {snapshot?.raw_plastic_kg || 0}<span className="text-sm font-medium text-gray-500 ml-1">kg</span>
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${plasticRunwayDays >= 0 && plasticRunwayDays < 14 ? 'text-red-600' : 'text-gray-500'}`}>
                {plasticRunwayDays >= 0 ? `${plasticRunwayDays} days runway` : 'No burn data'}
              </p>
            </div>
          </div>
          
          {plasticRunwayDays >= 0 && plasticRunwayDays < 14 && (
            <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-100 font-medium">
              ⚠️ Critical Stock Level: Reorder raw plastic immediately to prevent production stall.
            </div>
          )}
        </div>

        {/* Assembly-ready components */}
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Assembly Ready</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {componentBeds.map((comp) => {
            const isBottleneck = comp.bedsWorth === minBeds;
            return (
              <div
                key={comp.name}
                className={`rounded-lg p-3 text-center ${
                  isBottleneck ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                }`}
              >
                <p className="text-2xl font-bold tabular-nums">{comp.count}</p>
                <p className="text-xs text-gray-500">{comp.name}</p>
                <p className={`text-xs mt-1 ${isBottleneck ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                  {comp.bedsWorth} beds
                </p>
              </div>
            );
          })}
        </div>

        {/* Pipeline items */}
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Pipeline</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {pipelineItems.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-lg font-bold tabular-nums">{item.value}</p>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {snapshot?.notes && (
          <p className="text-sm text-gray-500 mt-3 pt-3 border-t">{snapshot.notes}</p>
        )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
