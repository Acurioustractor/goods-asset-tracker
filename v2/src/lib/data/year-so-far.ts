/**
 * THE YEAR SO FAR: a two-page record for funders who ask for an annual report before the
 * charity has published one (Brian M. Davis first; Ben, 18 September 2026). Verified records
 * only. It is labelled as not an annual report: the first annual report follows the October
 * 2026 AGM with the audited FY26 statements. Links go to live goodsoncountry.com pages.
 */
import { CANONICAL_ASSETS } from './asset-canonical';
import { GRANTS_RECEIVED, GRANTS_RECEIVED_TOTAL_AUD } from './grants-received';
import { BUYERS, PAID_WASHERS } from './pitch-chapters';
import { PAID_AUD, PAID_BEDS } from './story-questions';

export const YSF_AS_AT = '18 September 2026';
export const YSF_NOT_ANNUAL_REPORT =
  'This is not an annual report. The charity is a Small charity and lodges an Annual Information Statement with the ACNC. Its first annual report, for FY26, follows the AGM in October 2026 with the audited statements.';

export const YSF_RECORD = [
  { what: 'Beds in homes', value: `${CANONICAL_ASSETS.bedsDeployed}`, note: `across ${CANONICAL_ASSETS.communitiesServed} communities, each recorded against a community and a date`, label: 'verified' },
  { what: 'Beds bought and paid for', value: `${PAID_BEDS}`, note: `four buyers, $${PAID_AUD.toLocaleString('en-AU')} including GST, every one on a settled invoice`, label: 'verified' },
  { what: 'Washing machines paid for', value: `${PAID_WASHERS}`, note: 'Julalikari Council, Homeland School Company and Our Community Shed', label: 'verified' },
  { what: 'Beds pressed at our own facility', value: '40', note: 'assembled at Gamardi, Maningrida, by local young workers', label: 'verified' },
  { what: 'Grants received', value: `$${GRANTS_RECEIVED_TOTAL_AUD.toLocaleString('en-AU')}`, note: `${GRANTS_RECEIVED.length} grants since 2023, each checked against the books`, label: 'verified' },
] as const;

export const YSF_MOMENTS = [
  'June 2026. The board became Aboriginal-led: Kristy Bloomfield and Audrey Deemal, with Jeremy Donovan standing at the October AGM.',
  'August 2026. The ALIVE National Centre at the University of Melbourne paid for 100 beds in full before one was made.',
  'August 2026. The work moved into the charity, and The Butterfly Movement Ltd became Goods on Country Ltd. Same ABN, same DGR endorsement.',
  'September 2026. The production log opened, so paid hours and plastic weights become measured numbers.',
] as const;

export const YSF_BUYERS = BUYERS.rows;

export const YSF_VOICES = [
  { quote: 'To see kids’ faces with joy after making a bed, it just really hits you.', who: 'Karen Liddle, Alice Springs' },
  { quote: 'Yeah, I’ll be rocking up every day to make them.', who: 'Mykel, Utopia' },
] as const;

export const YSF_NOT_CLAIMED = [
  'No health outcome. Scabies and rheumatic heart disease are why the bed is washable and off the ground; the claim stops there.',
  'Community ownership of the making is a pathway. It has not moved yet.',
  'Plastic per bed is a design figure of 20 kg until the production log weighs it.',
  'Nothing in the current raise is signed.',
] as const;

export const YSF_LINKS = [
  { label: 'The whole story, chapter by chapter', url: 'https://www.goodsoncountry.com/pitch' },
  { label: 'Who we are: the board, the entity, the team', url: 'https://www.goodsoncountry.com/who-we-are' },
  { label: 'The Stretch Bed, and how organisations order', url: 'https://www.goodsoncountry.com/beds' },
  { label: 'The facilities', url: 'https://www.goodsoncountry.com/facilities' },
  { label: 'What we count and how', url: 'https://www.goodsoncountry.com/impact' },
] as const;
