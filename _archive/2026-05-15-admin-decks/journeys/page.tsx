'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getJourneyEvents, getAssetIds, addJourneyEvent } from './actions';
import type { BedJourney } from '@/lib/types/database';

const EVENT_TYPES = [
  'created',
  'in_production',
  'quality_check',
  'ready',
  'shipped',
  'in_transit',
  'delivered',
  'setup',
  'photo_update',
] as const;

const EVENT_COLORS: Record<string, string> = {
  created: 'bg-blue-100 text-blue-800',
  in_production: 'bg-yellow-100 text-yellow-800',
  quality_check: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  shipped: 'bg-orange-100 text-orange-800',
  in_transit: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  setup: 'bg-teal-100 text-teal-800',
  photo_update: 'bg-gray-100 text-gray-800',
};

export default function JourneysPage() {
  const [events, setEvents] = useState<BedJourney[]>([]);
  const [assets, setAssets] = useState<{ unique_id: string; community: string }[]>([]);
  const [filterAsset, setFilterAsset] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssetIds().then(setAssets);
    getJourneyEvents().then(setEvents);
  }, []);

  function loadEvents(assetId?: string) {
    getJourneyEvents(assetId || undefined).then(setEvents);
  }

  function handleFilterChange(assetId: string) {
    setFilterAsset(assetId);
    loadEvents(assetId);
  }

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addJourneyEvent(formData);
      if (result?.error) setError(result.error);
      else {
        setShowAddForm(false);
        loadEvents(filterAsset);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bed Journeys</h1>
          <p className="text-gray-500 mt-1">{events.length} events</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Event'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by asset:</Label>
        <select
          value={filterAsset}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All assets</option>
          {assets.map((a) => (
            <option key={a.unique_id} value={a.unique_id}>
              {a.unique_id} — {a.community}
            </option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Journey Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Asset</Label>
                <select
                  name="asset_id"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select asset</option>
                  {assets.map((a) => (
                    <option key={a.unique_id} value={a.unique_id}>
                      {a.unique_id} — {a.community}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Event Type</Label>
                <select
                  name="event_type"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  name="event_date"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input name="location" placeholder="e.g. Ali Curung" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea name="description" rows={2} />
              </div>
              <div className="md:col-span-3">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No journey events yet</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 py-3 border-b last:border-0"
            >
              <div className="flex-shrink-0 w-24 text-xs text-gray-500 pt-1">
                {new Date(event.event_date).toLocaleDateString('en-AU')}
              </div>
              <div className="flex-shrink-0">
                <Badge className={EVENT_COLORS[event.event_type] || 'bg-gray-100 text-gray-800'}>
                  {event.event_type.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex-1">
                {event.asset_id && (
                  <span className="font-mono text-xs text-gray-400 mr-2">
                    {event.asset_id}
                  </span>
                )}
                {event.description && (
                  <span className="text-sm">{event.description}</span>
                )}
                {event.location && (
                  <span className="text-xs text-gray-500 ml-2">
                    @ {event.location}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
