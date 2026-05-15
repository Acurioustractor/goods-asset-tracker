#!/usr/bin/env node
// Seed canonical communities + demand from existing data sources:
//   - src/lib/data/compendium.ts (deployments + documentedDemand)
//   - src/lib/data/expansion-targets.ts (priority expansion list)
//   - assets.community distinct values (e.g. "Pending Delivery", "Mount Isa")

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Canonical communities: deployments + expansion targets + admin placeholders
// `name` MUST match the canonical string used in assets.community for the join to work.
const communities = [
  // Deployed
  { id: 'palm-island',    name: 'Palm Island',      traditional_name: 'Bwgcolman',     state: 'QLD', status: 'active', partner: 'PICC',                contacts: ['Eb & Jahvan Oui'], lat: -18.7333, lng: 146.5833 },
  { id: 'tennant-creek',  name: 'Tennant Creek',    traditional_name: 'Wumpurrarni',   state: 'NT',  status: 'active', partner: 'Wilya Janta',         contacts: ['Norman Frank','Dr Simon Quilty'], lat: -19.65, lng: 134.1833 },
  { id: 'alice-springs',  name: 'Alice Springs',    traditional_name: 'Mparntwe',      state: 'NT',  status: 'active', partner: 'Oonchiumpa',          contacts: ['Kristy Bloomfield'], lat: -23.6980, lng: 133.8807,
    name_aliases: ['Alice Homelands'] },
  { id: 'maningrida',     name: 'Maningrida',       traditional_name: null,            state: 'NT',  status: 'active', partner: 'Homeland Schools Co.', contacts: [], lat: -12.0464, lng: 134.2236 },
  { id: 'kalgoorlie',     name: 'Kalgoorlie',       traditional_name: 'Ninga Mia',     state: 'WA',  status: 'active', partner: 'The Community Shed',  contacts: [], lat: -30.7489, lng: 121.4655 },
  { id: 'utopia',         name: 'Utopia Homelands', traditional_name: null,            state: 'NT',  status: 'active', partner: 'Oonchiumpa',          contacts: ['Kristy Bloomfield'], lat: -22.2333, lng: 134.7833 },
  { id: 'mt-isa',         name: 'Mt Isa',           traditional_name: 'Kalkadoon',     state: 'QLD', status: 'testing', partner: "BG Fit & Men's Shed", contacts: [], lat: -20.7256, lng: 139.4927,
    name_aliases: ['Mount Isa'] },
  { id: 'mutitjulu',      name: 'Mutitjulu',        traditional_name: 'Anangu',        state: 'NT',  status: 'active', partner: null,                   contacts: [], lat: -25.3500, lng: 131.0333 },
  { id: 'darwin',         name: 'Darwin',           traditional_name: 'Larrakia',      state: 'NT',  status: 'administrative', partner: null,           contacts: [], lat: -12.4634, lng: 130.8456 },
  { id: 'canberra',       name: 'Canberra',         traditional_name: 'Ngunnawal',     state: 'ACT', status: 'administrative', partner: null,           contacts: [], lat: -35.2809, lng: 149.1300 },

  // Placeholder for newly minted assets pre-allocation
  { id: 'pending-delivery', name: 'Pending Delivery', traditional_name: null,          state: 'NT',  status: 'administrative', partner: null,           contacts: [] },

  // Active prospects (from expansion-targets, top priorities)
  { id: 'groote-archipelago', name: 'Groote Archipelago', traditional_name: 'Warnindilyakwa', state: 'NT', status: 'exploring', partner: 'WHSAC', contacts: ['Simone Grimmond'], lat: -13.9667, lng: 136.4333 },
  { id: 'wadeye',         name: 'Wadeye',           traditional_name: 'Murrinhpatha',  state: 'NT',  status: 'prospect', partner: 'Thamarrurr Development Corp', contacts: [], lat: -14.2333, lng: 129.5167,
    name_aliases: ['Port Keats'] },
  { id: 'yarrabah',       name: 'Yarrabah',         traditional_name: null,            state: 'QLD', status: 'prospect', partner: 'Yarrabah Aboriginal Shire Council', contacts: [], lat: -16.9167, lng: 145.8833 },
  { id: 'galiwinku',      name: "Galiwin'ku",       traditional_name: 'Elcho Island',  state: 'NT',  status: 'prospect', partner: 'East Arnhem Regional Council', contacts: [], lat: -12.0333, lng: 135.5667,
    name_aliases: ['Elcho Island'] },
  { id: 'aurukun',        name: 'Aurukun',          traditional_name: 'Wik',           state: 'QLD', status: 'prospect', partner: 'Aurukun Aboriginal Shire Council', contacts: [], lat: -13.3536, lng: 141.7244 },
  { id: 'torres-strait',  name: 'Torres Strait',    traditional_name: null,            state: 'QLD', status: 'prospect', partner: 'TSIRC', contacts: [], lat: -10.5833, lng: 142.2167 },
  { id: 'gunbalanya',     name: 'Gunbalanya',       traditional_name: null,            state: 'NT',  status: 'prospect', partner: 'Bawinanga Aboriginal Corp', contacts: [], lat: -12.3167, lng: 133.0333,
    name_aliases: ['Oenpelli'] },
  { id: 'doomadgee',      name: 'Doomadgee',        traditional_name: null,            state: 'QLD', status: 'prospect', partner: 'Doomadgee Aboriginal Shire Council', contacts: [], lat: -17.9356, lng: 138.8217 },
  { id: 'borroloola',     name: 'Borroloola',       traditional_name: 'Yanyuwa',       state: 'NT',  status: 'prospect', partner: 'Roper Gulf Regional Council', contacts: [], lat: -16.0717, lng: 136.3097 },
  { id: 'ngukurr',        name: 'Ngukurr',          traditional_name: null,            state: 'NT',  status: 'prospect', partner: 'Roper Gulf Regional Council', contacts: [], lat: -14.7333, lng: 134.7333 },
  { id: 'ramingining',    name: 'Ramingining',      traditional_name: null,            state: 'NT',  status: 'prospect', partner: 'East Arnhem Regional Council', contacts: [], lat: -12.3667, lng: 134.9000 },
  { id: 'kowanyama',      name: 'Kowanyama',        traditional_name: null,            state: 'QLD', status: 'prospect', partner: 'Kowanyama Aboriginal Shire Council', contacts: [], lat: -15.4839, lng: 141.7503 },
  { id: 'woorabinda',     name: 'Woorabinda',       traditional_name: null,            state: 'QLD', status: 'prospect', partner: 'Woorabinda Aboriginal Shire Council', contacts: [], lat: -24.1264, lng: 149.4561 },
  { id: 'cherbourg',      name: 'Cherbourg',        traditional_name: null,            state: 'QLD', status: 'prospect', partner: 'Cherbourg Aboriginal Shire Council', contacts: [], lat: -26.2833, lng: 151.9500 },
  { id: 'lajamanu',       name: 'Lajamanu',         traditional_name: 'Warlpiri',      state: 'NT',  status: 'prospect', partner: 'Central Desert Regional Council', contacts: [], lat: -18.3333, lng: 130.6333 },
  { id: 'yuendumu',       name: 'Yuendumu',         traditional_name: 'Warlpiri',      state: 'NT',  status: 'prospect', partner: 'Central Desert Regional Council', contacts: [], lat: -22.2549, lng: 131.7975 },
];

// Documented demand records — link to community by id (NOT name, to be aliasing-safe)
const demand = [
  { community_id: 'tennant-creek',     requested_by: 'Dianne Stokes',           qty: 20,  estimated_value_cents: 11200000, status: 'requested', source: 'community_voice', notes: 'Offered to self-fund' },
  { community_id: 'tennant-creek',     requested_by: 'Norman Frank',            qty: 3,   estimated_value_cents: 1680000,  status: 'requested', source: 'community_voice', notes: 'In maroon colourway' },
  { community_id: 'utopia',            requested_by: 'Utopia Homelands',        qty: 150, estimated_value_cents: 84000000, status: 'requested', source: 'compendium',      notes: 'Beds for every child' },
  { community_id: 'maningrida',        requested_by: 'Homeland Schools Co.',    qty: 65,  estimated_value_cents: 36400000, status: 'requested', source: 'meeting',         notes: 'Beds for kids in Maningrida homelands' },
  { community_id: 'groote-archipelago', requested_by: 'WHSAC (Simone Grimmond)', qty: 500, estimated_value_cents: 280000000, status: 'exploring', source: 'meeting',       notes: '500 beds + 300 washers; pathway via WHSAC procurement' },
  { community_id: 'utopia',            requested_by: 'Centrecorp Foundation',   qty: 107, estimated_value_cents: 8571200,  status: 'allocated', source: 'meeting',         notes: 'INV-0291 paid; batch GB0-156 minted for Utopia delivery' },
  { community_id: 'palm-island',       requested_by: 'PICC',                    qty: 40,  estimated_value_cents: 3600000,  status: 'requested', source: 'meeting',         notes: '40 beds discussed in last partner update' },
];

async function run() {
  console.log(`Seeding ${communities.length} communities...`);
  const { error: commErr } = await supabase
    .from('communities')
    .upsert(communities, { onConflict: 'id' });
  if (commErr) {
    console.error('communities upsert failed:', commErr);
    process.exit(1);
  }

  console.log(`Seeding ${demand.length} demand records...`);
  // Use deterministic-ish approach: delete + reinsert (idempotent for a fixed seed list)
  // Only delete demand we put here, identified by source != 'manual'
  await supabase.from('community_demand').delete().neq('source', 'manual');
  const { error: demErr } = await supabase.from('community_demand').insert(demand);
  if (demErr) {
    console.error('demand insert failed:', demErr);
    process.exit(1);
  }

  // Quick sanity: rollup view
  const { data: rollup, error: rErr } = await supabase
    .from('community_rollup')
    .select('name, state, status, deployed_beds, allocated_beds, ready_beds, open_demand_qty')
    .order('deployed_beds', { ascending: false })
    .limit(15);
  if (rErr) {
    console.error('rollup query failed:', rErr);
  } else {
    console.log('\nTop 15 by deployed beds:');
    console.table(rollup);
  }
}

run();
