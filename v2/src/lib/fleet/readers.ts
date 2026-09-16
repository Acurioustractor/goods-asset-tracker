import type { MachineOverview } from '@/lib/types/database';

export class FleetReadError extends Error {
  constructor(public readonly source: string, reason: unknown) {
    super(`${source}: ${reason instanceof Error ? reason.message : String(reason)}`);
    this.name = 'FleetReadError';
  }
}

type ReadResponse<T> = { data: T | null; error: { message: string } | null };

export async function readFleetData<T>(source: string, read: () => PromiseLike<ReadResponse<T>>): Promise<T> {
  try {
    const { data, error } = await read();
    if (error) throw new Error(error.message);
    if (data === null) throw new Error('No data returned');
    return data;
  } catch (error) {
    throw new FleetReadError(source, error);
  }
}

export async function readFleetRows<T>(source: string, page: (start: number, end: number) => PromiseLike<ReadResponse<T[]>>): Promise<T[]> {
  const rows: T[] = [];
  for (let start = 0; ; start += 1000) {
    const data = await readFleetData(source, () => page(start, start + 999));
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

export async function readFleetCount(source: string, read: () => PromiseLike<{ count: number | null; error: { message: string } | null }>): Promise<number> {
  try {
    const { count, error } = await read();
    if (error) throw new Error(error.message);
    if (count === null) throw new Error('No count returned');
    return count;
  } catch (error) {
    throw new FleetReadError(source, error);
  }
}

export type CycleEvent = { machine_id: string | null; power_kwh: number | null; created_at: string; event_type: string };
export type EnergySummary = { cycles: number; energyRecords: number; kwh: number | null; average: number | null };
export type FleetMachine = Omit<MachineOverview, 'week_kwh' | 'avg_kwh_per_cycle'> & {
  week_kwh: number | null;
  avg_kwh_per_cycle: number | null;
  week_cycles: number;
  energy_records: number;
};

export function summarizeCycles(logs: CycleEvent[]): EnergySummary {
  const cycles = logs.filter((log) => log.event_type === 'cycle_complete');
  const known = cycles.filter((log) => typeof log.power_kwh === 'number' && Number.isFinite(log.power_kwh) && log.power_kwh >= 0);
  const kwh = known.length ? known.reduce((total, log) => total + log.power_kwh!, 0) : null;
  return { cycles: cycles.length, energyRecords: known.length, kwh, average: kwh === null ? null : kwh / known.length };
}

export function groupCycleEnergy(logs: CycleEvent[]): Map<string, EnergySummary> {
  const grouped = new Map<string, CycleEvent[]>();
  for (const log of logs) {
    if (!log.machine_id || log.event_type !== 'cycle_complete') continue;
    const group = grouped.get(log.machine_id) || [];
    group.push(log);
    grouped.set(log.machine_id, group);
  }
  return new Map([...grouped].map(([id, group]) => [id, summarizeCycles(group)]));
}

export function energyMedian(values: Array<number | null>): number | null {
  const known = values.filter((value): value is number => value !== null && Number.isFinite(value)).sort((a, b) => a - b);
  if (!known.length) return null;
  const middle = Math.floor(known.length / 2);
  return known.length % 2 ? known[middle] : (known[middle - 1] + known[middle]) / 2;
}

export function dailyCycleEnergy(logs: CycleEvent[]) {
  const grouped = new Map<string, CycleEvent[]>();
  for (const log of logs) {
    if (log.event_type !== 'cycle_complete') continue;
    const date = log.created_at.slice(0, 10);
    const group = grouped.get(date) || [];
    group.push(log);
    grouped.set(date, group);
  }
  return [...grouped].map(([date, group]) => {
    const summary = summarizeCycles(group);
    return { date, cycles: summary.cycles, kwh: summary.kwh, energy_records: summary.energyRecords, machines_active: new Set(group.map(log => log.machine_id).filter(Boolean)).size };
  }).sort((a, b) => a.date.localeCompare(b.date));
}
