'use client';

import { useState, useTransition, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addPipelineEntry, updatePipelineEntry, updatePipelineStatus } from './actions';

type PipelineAsset = {
  unique_id: string;
  product: string | null;
  status: string;
  community: string;
  quantity: number | null;
  partner_name: string | null;
  notes: string | null;
  created_at: string;
};

const STAGES = ['requested', 'allocated', 'demo', 'deployed', 'retired'] as const;

const STAGE_COLORS: Record<string, string> = {
  requested: 'bg-blue-100 text-blue-800',
  allocated: 'bg-yellow-100 text-yellow-800',
  demo: 'bg-purple-100 text-purple-800',
  deployed: 'bg-green-100 text-green-800',
  retired: 'bg-gray-100 text-gray-800',
};

const STAGE_BORDER: Record<string, string> = {
  requested: 'border-t-blue-400',
  allocated: 'border-t-yellow-400',
  demo: 'border-t-purple-400',
  deployed: 'border-t-green-400',
  retired: 'border-t-gray-400',
};

export default function PipelineBoard({ assets }: { assets: PipelineAsset[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'both' | 'batched' | 'individual'>('batched');

  const toggleStageExpansion = (stage: string) => {
    setExpandedStages(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  const [productFilter, setProductFilter] = useState<string>('all');
  const [communityFilter, setCommunityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const products = useMemo(() => {
    const list = new Set(assets.map(a => a.product).filter(Boolean) as string[]);
    return Array.from(list).sort();
  }, [assets]);

  const communities = useMemo(() => {
    const list = new Set(assets.map(a => a.community).filter(Boolean) as string[]);
    return Array.from(list).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      if (productFilter !== 'all' && a.product !== productFilter) return false;
      if (communityFilter !== 'all' && a.community !== communityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          a.unique_id.toLowerCase().includes(q) ||
          (a.community?.toLowerCase() || '').includes(q) ||
          (a.partner_name?.toLowerCase() || '').includes(q) ||
          (a.notes?.toLowerCase() || '').includes(q)
        );
      }
      return true;
    });
  }, [assets, productFilter, communityFilter, searchQuery]);

  const grouped = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = filteredAssets.filter((a) => a.status === stage);
      return acc;
    },
    {} as Record<string, PipelineAsset[]>
  );

  const batchedGroups = useMemo(() => {
    if (viewMode === 'individual') return null;

    const result: Record<string, any[]> = {};
    for (const stage of STAGES) {
      const stageAssets = grouped[stage];
      const map = new Map<string, any>();
      for (const a of stageAssets) {
        const key = `${a.community}|${a.product}|${a.partner_name || ''}`;
        if (!map.has(key)) {
          map.set(key, {
            id: key,
            community: a.community,
            product: a.product,
            partner_name: a.partner_name,
            status: stage,
            total_quantity: 0,
            asset_count: 0,
            assets: [],
          });
        }
        const b = map.get(key);
        b.total_quantity += (a.quantity || 1);
        b.asset_count += 1;
        b.assets.push(a);
      }
      result[stage] = Array.from(map.values()).sort((a, b) => b.total_quantity - a.total_quantity);
    }
    return result;
  }, [grouped, viewMode]);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addPipelineEntry(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowAddForm(false);
      }
    });
  }

  function handleUpdate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updatePipelineEntry(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setExpandedId(null);
      }
    });
  }

  function handleStatusChange(uniqueId: string, newStatus: string) {
    startTransition(async () => {
      await updatePipelineStatus(uniqueId, newStatus);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hardware Pipeline</h1>
          <p className="text-gray-500 mt-1">
            Displaying {filteredAssets.length} items out of {assets.length} total
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-md">
            <button 
              onClick={() => setViewMode('batched')}
              className={`px-3 py-1.5 text-xs rounded-sm transition-all ${viewMode === 'batched' ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Batched Groups
            </button>
            <button 
              onClick={() => setViewMode('individual')}
              className={`px-3 py-1.5 text-xs rounded-sm transition-all ${viewMode === 'individual' ? 'bg-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Individual Items
            </button>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add Entry'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex-1">
          <Label className="text-xs text-gray-500 mb-1 block">Search IDs & Notes</Label>
          <Input 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 bg-white"
          />
        </div>
        <div className="w-full sm:w-48">
          <Label className="text-xs text-gray-500 mb-1 block">Product Type</Label>
          <select 
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Products</option>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-48">
          <Label className="text-xs text-gray-500 mb-1 block">Community / Location</Label>
          <select 
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Communities</option>
            {communities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {(productFilter !== 'all' || communityFilter !== 'all' || searchQuery !== '') && (
          <div className="flex items-end pb-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setProductFilter('all'); setCommunityFilter('all'); setSearchQuery(''); }}
              className="text-gray-500 h-8"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Pipeline Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="unique_id">Unique ID</Label>
                <Input id="unique_id" name="unique_id" required placeholder="SB-001" />
              </div>
              <div>
                <Label htmlFor="product">Product</Label>
                <Input id="product" name="product" required defaultValue="Stretch Bed" placeholder="e.g. Fridge" />
              </div>
              <div>
                <Label htmlFor="community">Community</Label>
                <Input id="community" name="community" required placeholder="e.g. Ali Curung" />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" />
              </div>
              <div>
                <Label htmlFor="partner_name">Partner</Label>
                <Input id="partner_name" name="partner_name" placeholder="Optional" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  defaultValue="requested"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" placeholder="Optional" />
              </div>
              <div className="md:col-span-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add to Pipeline'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <div key={stage} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                {stage}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {grouped[stage].length}
              </Badge>
            </div>

            <div className="space-y-2">
              {grouped[stage].length === 0 ? (
                <div className="border border-dashed rounded-lg p-4 text-center text-sm text-gray-400">
                  No items
                </div>
              ) : viewMode === 'batched' && batchedGroups ? (
                <>
                  {batchedGroups[stage]
                    .slice(0, expandedStages[stage] ? undefined : 20)
                    .map((batch) => (
                      <Card
                        key={batch.id}
                        className={`border-t-4 ${STAGE_BORDER[stage]} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() =>
                          setExpandedId(expandedId === batch.id ? null : batch.id)
                        }
                      >
                        <CardContent className="pt-4 pb-3 px-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">
                              {batch.total_quantity}x {batch.product || 'Unknown Product'}
                            </span>
                            <Badge variant="outline" className="text-[10px] bg-gray-50">
                              {batch.asset_count} units
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{batch.community}</p>
                          {batch.partner_name && (
                            <p className="text-xs text-gray-500">{batch.partner_name}</p>
                          )}
                          
                          {/* Quick status move buttons */}
                          <div className="flex gap-1 pt-1 opacity-60 hover:opacity-100 transition-opacity">
                            {STAGES.filter((s) => s !== stage).map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Move all ${batch.total_quantity} items to ${s}?`)) {
                                    batch.assets.forEach((a: any) => handleStatusChange(a.unique_id, s));
                                  }
                                }}
                                className={`text-[10px] px-1.5 py-0.5 rounded ${STAGE_COLORS[s]} hover:opacity-80`}
                              >
                                {s.slice(0, 3)}
                              </button>
                            ))}
                          </div>

                          {/* Expanded detail */}
                          {expandedId === batch.id && (
                            <div className="pt-3 mt-2 border-t space-y-2">
                              <p className="text-xs font-semibold text-gray-700">Individual Asset IDs:</p>
                              <div className="flex flex-wrap gap-1">
                                {batch.assets.slice(0, 15).map((a: any) => (
                                  <Badge key={a.unique_id} variant="secondary" className="text-[9px] font-mono font-normal">
                                    {a.unique_id}
                                  </Badge>
                                ))}
                                {batch.assets.length > 15 && (
                                  <Badge variant="secondary" className="text-[9px] font-normal">+{batch.assets.length - 15} more</Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  
                  {!expandedStages[stage] && batchedGroups[stage].length > 20 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-xs text-gray-500 hover:text-gray-900 border-dashed border-gray-300 h-8"
                      onClick={() => toggleStageExpansion(stage)}
                    >
                      View {batchedGroups[stage].length - 20} more batches...
                    </Button>
                  )}
                  {expandedStages[stage] && batchedGroups[stage].length > 20 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-xs text-gray-500 hover:text-gray-900 border-dashed border-gray-300 h-8"
                      onClick={() => toggleStageExpansion(stage)}
                    >
                      Collapse view
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {grouped[stage]
                    .slice(0, expandedStages[stage] ? undefined : 20)
                    .map((asset) => (
                      <Card
                        key={asset.unique_id}
                        className={`border-t-4 ${STAGE_BORDER[stage]} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() =>
                          setExpandedId(expandedId === asset.unique_id ? null : asset.unique_id)
                        }
                      >
                        <CardContent className="pt-4 pb-3 px-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-medium">{asset.unique_id}</span>
                            <span className="text-xs font-bold">&times;{asset.quantity ?? 1}</span>
                          </div>
                          <p className="text-sm font-medium">{asset.community}</p>
                          <div className="flex gap-2 text-xs text-gray-500">
                            <span>{asset.product || 'Unknown Product'}</span>
                            {asset.partner_name && (
                              <span className="truncate border-l pl-2 border-gray-300">{asset.partner_name}</span>
                            )}
                          </div>
                          {asset.notes && (
                            <p className="text-xs text-gray-400 truncate">{asset.notes}</p>
                          )}

                          {/* Quick status move buttons */}
                          <div className="flex gap-1 pt-1">
                            {STAGES.filter((s) => s !== stage).map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(asset.unique_id, s);
                                }}
                                className={`text-[10px] px-1.5 py-0.5 rounded ${STAGE_COLORS[s]} hover:opacity-80`}
                              >
                                {s.slice(0, 3)}
                              </button>
                            ))}
                          </div>

                          {/* Expanded edit form */}
                          {expandedId === asset.unique_id && (
                            <form
                              action={handleUpdate}
                              className="space-y-2 pt-2 border-t mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input type="hidden" name="unique_id" value={asset.unique_id} />
                              <div>
                                <Label className="text-xs">Community</Label>
                                <Input
                                  name="community"
                                  defaultValue={asset.community}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input
                                  name="quantity"
                                  type="number"
                                  defaultValue={asset.quantity ?? 1}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Partner</Label>
                                <Input
                                  name="partner_name"
                                  defaultValue={asset.partner_name || ''}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Status</Label>
                                <select
                                  name="status"
                                  defaultValue={asset.status}
                                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                >
                                  {STAGES.map((s) => (
                                    <option key={s} value={s}>
                                      {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs">Notes</Label>
                                <Textarea
                                  name="notes"
                                  defaultValue={asset.notes || ''}
                                  className="text-sm"
                                  rows={2}
                                />
                              </div>
                              <Button type="submit" size="sm" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save'}
                              </Button>
                            </form>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  
                  {!expandedStages[stage] && grouped[stage].length > 20 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-xs text-gray-500 hover:text-gray-900 border-dashed border-gray-300 h-8"
                      onClick={() => toggleStageExpansion(stage)}
                    >
                      View {grouped[stage].length - 20} more...
                    </Button>
                  )}
                  {expandedStages[stage] && grouped[stage].length > 20 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-xs text-gray-500 hover:text-gray-900 border-dashed border-gray-300 h-8"
                      onClick={() => toggleStageExpansion(stage)}
                    >
                      Collapse view
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
