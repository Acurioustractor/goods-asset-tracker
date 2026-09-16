/** Reviewed on both canonical and duplicate register rows by Ben, 14 May 2026.
 * These aliases reconcile identity; they do not certify condition or current location.
 */
export const reviewedControllers: Record<string, { assetId: string; duplicateId: string }> = {
  e00fce684086eb2aba8d4f25: { assetId: 'GB0-113', duplicateId: 'GB0-WM-F25' },
  e00fce68c2ba447b66bcd507: { assetId: 'GB0-125', duplicateId: 'GB0-WM-507' },
  e00fce687ae01d08f95694e5: { assetId: 'GB0-154-2', duplicateId: 'GB0-WM-4E5' },
  e00fce682db6d32e15e86098: { assetId: 'GB0-132', duplicateId: 'GB0-WM-098' },
};
export type RegisterWasher = { name?: string | null; place?: string | null; recipient_name?: string | null; contact_household?: string | null; partner_name?: string | null; supply_date?: string | null; last_checkin_date?: string | null; notes?: string | null; gps?: string | null; unique_id: string; machine_id: string | null; community: string | null; status: string | null };
export type FleetEvent = { id: string; machine_id: string | null; asset_id: string | null; created_at: string; timestamp: string; event_type: string | null; power_kwh: number | null };
export type FleetReceipt = { id: string; machine_id: string | null; source: string; status_code: number | null; received_at: string };
export function resolveWasher(event: Pick<FleetEvent, 'machine_id' | 'asset_id'>, assets: RegisterWasher[]) {
 const reviewed = reviewedControllers[event.machine_id || ''];
 if (reviewed) {
  if (!assets.some(a => a.unique_id === reviewed.assetId)) return null;
  if (event.asset_id && ![reviewed.assetId, reviewed.duplicateId].includes(event.asset_id)) return null;
  return reviewed.assetId;
 }
 if (event.asset_id) return assets.some(a => a.unique_id === event.asset_id) ? event.asset_id : null;
 const matches = assets.filter(a => a.machine_id && a.machine_id === event.machine_id);
 return matches.length === 1 ? matches[0].unique_id : null;
}
export function buildWasherMonitor(assets: RegisterWasher[], events: FleetEvent[], receipts: FleetReceipt[], now: number) {
 const testEvents = events.filter(e => e.machine_id === 'test123' && e.event_type === 'test');
 const fieldEvents = events.filter(e => !testEvents.includes(e));
 const unresolved = fieldEvents.filter(e => !resolveWasher(e, assets));
 const rows = assets.map(asset => {
  const duplicate = Object.values(reviewedControllers).find(mapping => mapping.duplicateId === asset.unique_id);
  const history = fieldEvents.filter(e => resolveWasher(e, assets) === asset.unique_id);
  const devices = [...new Set([asset.machine_id, ...history.map(e => e.machine_id), ...Object.entries(reviewedControllers).filter(([,m]) => m.assetId === asset.unique_id).map(([id]) => id)].filter((s): s is string => !!s))];
  const attempts = duplicate ? [] : receipts.filter(r => resolveWasher({machine_id:r.machine_id,asset_id:null},assets) === asset.unique_id);
  const latestReceipt = attempts.reduce<string | null>((latest,r) => Number.isFinite(Date.parse(r.received_at)) && (!latest || Date.parse(r.received_at) > Date.parse(latest)) ? r.received_at : latest,null);
  const latestEvent = history.reduce<string | null>((latest,e) => Number.isFinite(Date.parse(e.created_at)) && (!latest || Date.parse(e.created_at)>Date.parse(latest)) ? e.created_at : latest,null);
  const invalidTimes = history.filter(e => !Number.isFinite(Date.parse(e.created_at)) || Date.parse(e.created_at)>now+300000).length;
  const age = latestReceipt ? now-Date.parse(latestReceipt) : null;
  const reporting = duplicate ? 'Duplicate record' : invalidTimes || (age!==null && age < -300000) ? 'Check timestamps' : age!==null && age<=48*3600000 ? 'Recent receipt' : latestReceipt ? 'No recent receipt' : history.length ? 'History only' : 'Never observed';
  return {...asset, devices, duplicateOf:duplicate?.assetId || null, history, latestReceipt, latestEvent, reporting,
   receiptErrors7d:attempts.filter(r=>Date.parse(r.received_at)>=now-7*86400000 && Date.parse(r.received_at)<=now && (r.status_code===null || r.status_code>=400)).length,
   events7d:history.filter(e=>Date.parse(e.created_at)>=now-7*86400000 && Date.parse(e.created_at)<=now).length,
   mappingRepairs:history.filter(e=>e.asset_id!==asset.unique_id).length,
   identityUnconfirmed:asset.status==='under_investigation',
  };
 });
 return {rows,unresolved,testEvents,allEvents:events};
}
