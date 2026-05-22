import type { FunderConfig } from './types';
import { centrecorpConfig } from './configs/centrecorp';
import { snowConfig } from './configs/snow';

/**
 * Single source of truth for which funders the report engine knows about.
 * Add a new funder by importing its config and dropping it in here.
 */
export const FUNDERS: Record<string, FunderConfig> = {
  centrecorp: centrecorpConfig,
  snow: snowConfig,
};

export function getFunder(slug: string): FunderConfig | null {
  return FUNDERS[slug] || null;
}

export function listFunders(): FunderConfig[] {
  return Object.values(FUNDERS);
}
