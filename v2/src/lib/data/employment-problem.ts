/**
 * EMPLOYMENT PROBLEM DATA — paid work in very remote Australia, and the policy window Goods sits
 * inside.
 *
 * Same discipline as `rhd-problem.ts` and `recycling-problem.ts`. Every figure carries what it
 * counts, the period, the source and a grade. Nothing here is an outcome of Goods' work.
 *
 * ---------------------------------------------------------------------------
 * THE GRADIENT IS THE PROBLEM, NOT THE NATIONAL AVERAGE
 * ---------------------------------------------------------------------------
 * Closing the Gap Target 8 is on track nationally: 51.0% in 2016 to 55.7% in 2021, heading for
 * 62% by 2031. Quoting that alone would suggest employment is being solved.
 *
 * The 2021 Census shows why it is not, in the places Goods works. The proportion of First Nations
 * people aged 25 to 64 in work falls steadily with remoteness, from **62% in major cities to 35%
 * in very remote areas**. Every community Goods serves is at the wrong end of that gradient, and
 * the national figure is carried by the cities.
 *
 * ---------------------------------------------------------------------------
 * WHY THE POLICY TIMING MATTERS
 * ---------------------------------------------------------------------------
 * The Community Development Program was replaced on 1 November 2025 by the Remote Australia
 * Employment Service, alongside the Remote Jobs and Economic Development program, which is
 * creating 6,000 jobs to 2030 with wages, superannuation and leave.
 *
 * That is the funded response to this gradient, and it is the same department funding Oonchiumpa's
 * Alice Springs work. A bed carrying two hours of paid making is a job in exactly the frame the
 * Commonwealth has just built. That is a positioning fact, not an impact claim.
 */

export type EmploymentGrade = 'verified' | 'unverified';

export interface EmploymentFigure {
  value: string;
  what: string;
  asAt: string;
  sourceUrl: string;
  grade: EmploymentGrade;
  note?: string;
}

const PC_TARGET8 = 'https://www.pc.gov.au/closing-the-gap-data/dashboard/se/outcome-area8';
const AIHW_ECON =
  'https://www.aihw.gov.au/reports/indigenous-australians/closing-the-gap-targets-key-findings-implications/contents/economic-participation';
const NIAA_REMOTE = 'https://www.niaa.gov.au/our-work/employment-and-economic-development/remote-jobs';
const DEWR_RAES = 'https://www.dewr.gov.au/remote-australia-employment-service';

/** The claim ceiling for this area, as a constant. */
export const EMPLOYMENT_CLAIM_CEILING =
  'These figures describe paid work in very remote Australia and the programs responding to it. ' +
  'Goods counts two modelled hours of paid making per bed, which is a wage allowance divided by ' +
  'an assumed daily output and has never been time-studied. No figure here may be presented as a ' +
  'job Goods created, and no national or regional rate may be attributed to Goods activity.';

/** Where the national target sits, and why it flatters the places Goods works. */
export const TARGET_8: readonly EmploymentFigure[] = [
  {
    value: '55.7%',
    what: 'of Aboriginal and Torres Strait Islander people aged 25 to 64 were employed, against a 51.0% baseline in 2016',
    asAt: '2021',
    sourceUrl: PC_TARGET8,
    grade: 'verified',
  },
  {
    value: '62% by 2031',
    what: 'the Closing the Gap Target 8 goal, assessed as on track nationally',
    asAt: 'National Agreement 2020',
    sourceUrl: PC_TARGET8,
    grade: 'verified',
  },
];

/** The gradient. This is the problem statement for a remote-manufacturing model. */
export const BY_REMOTENESS: readonly EmploymentFigure[] = [
  {
    value: '62% in major cities falling to 35% in very remote areas',
    what: 'the proportion of First Nations people aged 25 to 64 in work, decreasing consistently with remoteness',
    asAt: 'Census 2021',
    sourceUrl: AIHW_ECON,
    grade: 'verified',
    note: 'Every community Goods serves sits at the very remote end of this gradient.',
  },
];

/** The programs. Recent, funded, and the frame a bed-making job already fits. */
export const REMOTE_PROGRAMS: readonly EmploymentFigure[] = [
  {
    value: '1 November 2025',
    what: 'the date the Community Development Program was replaced by the Remote Australia Employment Service',
    asAt: '2025',
    sourceUrl: DEWR_RAES,
    grade: 'verified',
  },
  {
    value: 'about 40,000 job seekers across 1,200 remote communities',
    what: 'the population the Remote Australia Employment Service covers',
    asAt: '2025',
    sourceUrl: DEWR_RAES,
    grade: 'unverified',
    note: 'Reported on the departmental page summary; the primary factsheet has not been opened line by line.',
  },
  {
    value: '6,000 jobs to 2030, more than 3,000 already approved',
    what: 'the Remote Jobs and Economic Development program, paying wages with superannuation and leave',
    asAt: '2025',
    sourceUrl: NIAA_REMOTE,
    grade: 'unverified',
    note: 'Reported consistently across NIAA and departmental pages; the primary program guidelines have not been read.',
  },
];

export function allEmploymentFigures(): EmploymentFigure[] {
  return [...TARGET_8, ...BY_REMOTENESS, ...REMOTE_PROGRAMS];
}

export function needsPrimarySource(): EmploymentFigure[] {
  return allEmploymentFigures().filter((f) => f.grade === 'unverified');
}
