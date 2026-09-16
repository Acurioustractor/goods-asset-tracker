import { expect, it } from 'vitest';
import { buildWasherMonitor, resolveWasher, type RegisterWasher, type FleetEvent } from './identity';
const assets:RegisterWasher[]=[{unique_id:'GB0-113',machine_id:'Norms House',community:'Tennant Creek',status:'deployed'},{unique_id:'GB0-WM-F25',machine_id:'e00fce684086eb2aba8d4f25',community:'Tennant Creek',status:'retired'},{unique_id:'NEVER',machine_id:null,community:null,status:'deployed'}];
const event=(overrides:Partial<FleetEvent>={}):FleetEvent=>({id:'1',machine_id:'e00fce684086eb2aba8d4f25',asset_id:'GB0-WM-F25',created_at:'2026-09-05T00:00:00Z',timestamp:'2026-09-05T00:00:01Z',event_type:'cycle_complete',power_kwh:null,...overrides});
it('reconciles retired controller aliases without losing stored evidence or double counting',()=>{
 const data=buildWasherMonitor(assets,[event()],[],Date.parse('2026-09-05T01:00:00Z'));
 expect(data.rows[0].history).toHaveLength(1); expect(data.rows[0].history[0].asset_id).toBe('GB0-WM-F25'); expect(data.rows[0].mappingRepairs).toBe(1);
 expect(data.rows[1].history).toHaveLength(0); expect(data.rows[1].duplicateOf).toBe('GB0-113');
});
it('refuses conflicting explicit links and missing canonical targets',()=>{
 expect(resolveWasher(event({asset_id:'OTHER'}),assets)).toBeNull();
 expect(resolveWasher(event(),assets.slice(1))).toBeNull();
});
it('includes never observed washers and separates tests from field history',()=>{
 const test=event({id:'test',machine_id:'test123',asset_id:null,event_type:'test'});
 const data=buildWasherMonitor(assets,[test],[],Date.now());
 expect(data.rows.find(r=>r.unique_id==='NEVER')?.reporting).toBe('Never observed');
 expect(data.testEvents).toHaveLength(1);expect(data.unresolved).toHaveLength(0);expect(data.allEvents).toHaveLength(1);
});
it('uses receipt time for recent delivery, not imported event storage time',()=>{
 const data=buildWasherMonitor(assets,[event({created_at:'2025-01-01T00:00:00Z'})],[],Date.parse('2026-09-05T01:00:00Z'));
 expect(data.rows[0].reporting).toBe('History only');expect(data.rows[0].events7d).toBe(0);
});
it('keeps physical status separate from reporting and surfaces receiver errors',()=>{
 const data=buildWasherMonitor(assets,[event()],[{id:'r',machine_id:event().machine_id,source:'particle',status_code:500,received_at:'2026-09-05T00:00:00Z'}],Date.parse('2026-09-05T01:00:00Z'));
 expect(data.rows[0].reporting).toBe('Recent receipt');expect(data.rows[0].receiptErrors7d).toBe(1);expect(data.rows[0].status).toBe('deployed');
});
