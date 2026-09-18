/**
 * THE ARTEFACT REGISTER. Every document a funder has asked for, once, with who owes it.
 *
 * Why this file exists. On 18 September 2026 Ben asked where the Sefa attachments actually were
 * and said the Notion register was "super hard to see and get the actual artefact". The register
 * database exists (Notion `0a36ca45bb7f4d27a5bece37bd2cfa10`, 42 rows, built 16 September) and
 * every funder row relates to it, but a relation is a link to a page that holds a link to a file.
 * This module is the same register as code, so /admin/artefacts can print the whole list on one
 * screen with the file one click away, and the guard test fails the build when a row says a
 * file is held that is not shipped.
 *
 * Rules:
 *  - A row with `file` must have that file under public/artefacts (guard).
 *  - A row that is `held` and `built` must carry a file (guard). The other kinds may be held
 *    on the Notion row only (an uploaded PDF from Eloise or Zandra) and say so in `where`.
 *  - Every row names who owes it. "Built from site data" means `npm run build:attachments`.
 *  - No figure lives here. Titles carry the number a funder sees; the number is proven elsewhere.
 *  - Ben, 18 September 2026: the first stock is 400 beds and $300,000, rounded. Three grants of 133
 *    are still 133 each on their own forms; the aggregate prints 400, never 399.
 *
 * Source: the Notion Artefact Register read on 18 September 2026, plus the Sefa page added that day.
 */

export type ArtefactState = 'held' | 'partial' | 'missing' | 'draft' | 'rebuild-pending';

export type ArtefactKind =
  | 'built' // built from the site data by scripts/build-attachments.mjs
  | 'financial'
  | 'board-and-legal'
  | 'funder-correspondence'
  | 'narrative-and-design'
  | 'media';

export type FunderId = 'qbe' | 'sefa' | 'tfff' | 'bmd' | 'snow' | 'dusseldorp' | 'mazda';

export const FUNDERS: Record<FunderId, { name: string; notionId: string }> = {
  qbe: { name: 'QBE Catalysing Impact Stage 2', notionId: '392ebcf981cf8189a85cfbdda8d38f1c' },
  sefa: { name: 'SEFA Backing the Bold', notionId: '392ebcf981cf8139a246fbb6c6161dac' },
  tfff: { name: 'Tim Fairfax Family Foundation', notionId: '392ebcf981cf81deafc1eb47984daead' },
  bmd: { name: 'Brian M. Davis Charitable Foundation', notionId: '3ceebcf981cf80a19f42f243fc526698' },
  snow: { name: 'Snow Foundation', notionId: '3daebcf981cf8034b1cbe5f4f72f6906' },
  dusseldorp: { name: 'Dusseldorp Forum', notionId: '3daebcf981cf80ff8c6fd0e19dc94eff' },
  mazda: { name: 'Mazda Foundation', notionId: '3cbebcf981cf81bf8568cc39506f18c1' },
};

export const ARTEFACT_REGISTER_NOTION_ID = '0a36ca45bb7f4d27a5bece37bd2cfa10';
export const ARTEFACT_REGISTER_READ_AT = '2026-09-18';

export interface Artefact {
  /** The number on the built file, or a short slug for the rest. */
  id: string;
  title: string;
  state: ArtefactState;
  kind: ArtefactKind;
  /** Who finishes it. */
  owner: string;
  /** Which question or condition asks for it. */
  askedFor: string;
  funders: readonly FunderId[];
  /** The Notion register row. */
  notionId: string;
  /** Files under public/artefacts, served at /artefacts/<name>. */
  /** File names uploaded on the Notion row. Never served from public/. */
  files?: readonly string[];
  /** Where the held document sits when it is not shipped here. */
  where?: string;
  /** For anything not held: what finishes it. */
  finishes?: string;
}

export const ARTEFACTS: readonly Artefact[] = [
  // ---- Built from the site data. Rebuild with `npm run build:attachments` after any figure moves.
  { id: '00', title: 'Structure and funding flow, one page', state: 'held', kind: 'built', owner: 'Ben', askedFor: 'QBE Q3; Brian M. Davis; the source for Tim Fairfax 3.5', funders: ['qbe', 'bmd', 'tfff'], notionId: '3dcebcf981cf81f68926cb094baa2345', where: 'PDF on the Notion row. Rendered from the structure diagram module.' },
  { id: '01', title: 'Asset register extract: 540 beds, one row per bed', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'QBE Q10 and Q11; Brian M. Davis; Snow; Dusseldorp', funders: ['qbe', 'bmd', 'snow', 'dusseldorp'], notionId: '3dcebcf981cf81749ba7fd339959a8c7', files: ['01-asset-register-extract.pdf', '01-asset-register-extract.csv'] },
  { id: '02', title: 'Consented story registry: 37 voices cleared to be quoted', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'QBE Q11', funders: ['qbe'], notionId: '3dcebcf981cf81b8a67ed6d3eb0103a9', files: ['02-consented-story-registry.pdf'] },
  { id: '03', title: 'Production log, blank template', state: 'held', kind: 'built', owner: 'Nic', askedFor: 'QBE Q11; Brian M. Davis outcome 1', funders: ['qbe', 'bmd'], notionId: '3dcebcf981cf817e8ec8c31bd0b8dc9a', files: ['03-production-log-template.pdf', '03-production-log-template.csv'] },
  { id: '04', title: 'Theory of change, one page', state: 'held', kind: 'built', owner: 'Ben', askedFor: 'Brian M. Davis', funders: ['bmd'], notionId: '3dcebcf981cf8191b30dc0e4eccdeb81', files: ['04-theory-of-change.pdf'], where: 'Rebuilt 18 Sep for Brian M. Davis: standard theory of change for the 133 beds, from lib/data/theory-of-change.ts.' },
  { id: '05', title: 'Organisation structure and staffing', state: 'held', kind: 'built', owner: 'Ben', askedFor: 'Tim Fairfax 3.5', funders: ['tfff'], notionId: '3dcebcf981cf81aa887af6ba5635fc75', files: ['05-structure-and-staffing.pdf'] },
  { id: '06', title: 'Strategic plan, two years', state: 'draft', kind: 'built', owner: 'The board', askedFor: 'Tim Fairfax 3.6', funders: ['tfff'], notionId: '3dcebcf981cf816da149eb2baba7c2d4', files: ['06-strategic-plan-draft.pdf'], finishes: 'Marked draft on its face. The board adopts it at or before the AGM on 12 October.' },
  { id: '07', title: 'Paid bed trade schedule: five invoices, 320 beds', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'SEFA; the evidence for QBE Q10', funders: ['sefa', 'qbe'], notionId: '3dcebcf981cf81c0a730e4414e8a8292', files: ['07-paid-bed-trade-schedule.pdf'] },
  { id: '08', title: 'Grants received: seven grants, checked against Xero', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'SEFA', funders: ['sefa'], notionId: '3dcebcf981cf81b49153df89785ef030', files: ['08-grants-received.pdf'] },
  { id: '09', title: 'Price model: where the $750 goes', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'SEFA', funders: ['sefa'], notionId: '3dcebcf981cf81aea85cf73b14dfe48b', files: ['09-price-model.pdf'] },
  { id: '10', title: 'Empathy Ledger consent summary', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'Dusseldorp', funders: ['dusseldorp'], notionId: '3dcebcf981cf8101b1afead22863bfe2', files: ['10-empathy-ledger-consent-summary.pdf'] },
  { id: '11', title: 'Goods on Country: the model', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'QBE Q23', funders: ['qbe'], notionId: '3dcebcf981cf8104925be42d015d0a78', files: ['11-goods-on-country-the-model.pdf'] },
  { id: '12', title: 'Goods on Country: the money map', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'QBE Q23', funders: ['qbe'], notionId: '3dcebcf981cf812cb935dc1a1d025497', files: ['12-goods-on-country-money-map.pdf'] },
  { id: '13', title: 'What $300,000 produces', state: 'held', kind: 'built', owner: 'Built from site data', askedFor: 'QBE Q9', funders: ['qbe'], notionId: '3dcebcf981cf813e8c99d0105516c751', files: ['13-what-300000-produces.pdf'] },
  { id: '14', title: 'Sefa lender page: the bed, the year, the repayment case, the entity', state: 'held', kind: 'built', owner: 'Ben', askedFor: "SEFA, Joel Bird's visit 18 September; the lender case behind QBE Q14 and Q18", funders: ['sefa', 'qbe'], notionId: '3deebcf981cf81119dabd97408494ff7', files: ['14-sefa-lender-page.pdf', '14-sefa-loan-test.xlsx'] },

  // ---- Financial statements.
  { id: 'fy26-statements', title: 'FY26 financial statements, signed and then audited', state: 'partial', kind: 'financial', owner: 'Eloise', askedFor: 'QBE Q20 and Q21; SEFA; Tim Fairfax 6.4 to 6.6; Brian M. Davis', funders: ['qbe', 'sefa', 'tfff', 'bmd'], notionId: '3dcebcf981cf816a9075d01df1dea0b1', where: 'Unaudited ten-page set on the Notion row, in the former name.', finishes: 'Signed declaration from the board, then the audit before the AGM on 12 October.' },
  { id: 'fy25-statements', title: 'FY25 financial statements', state: 'missing', kind: 'financial', owner: 'Eloise', askedFor: 'Tim Fairfax 6.4', funders: ['tfff'], notionId: '3dcebcf981cf81a090a3eadafe4c0f73', finishes: 'Export from the charity Xero file.' },
  { id: 'four-year-pl', title: 'Four-year P&L, FY23 to FY26', state: 'missing', kind: 'financial', owner: 'Standard Ledger', askedFor: 'SEFA', funders: ['sefa'], notionId: '3dcebcf981cf8128b2bcdda2bc8235ef', finishes: 'One export from the charity Xero file with four comparison years.' },
  { id: 'sole-trader-record', title: 'Sole-trader trading record FY24 to FY27, and the FY26 carve-out', state: 'partial', kind: 'financial', owner: 'Standard Ledger', askedFor: 'SEFA; QBE missing documents', funders: ['sefa', 'qbe'], notionId: '3dcebcf981cf8189bcbfd265581a109d', where: 'Trading record PDF on the Notion row, read from Xero 18 September: FY24 nil, FY25 $10,909.09, FY26 $313,959.73, FY27 to 15 Sep $92,909.09.', finishes: 'Standard Ledger issue the FY26 letter and document the carve-out; ACT FY26 statements arrive.' },
  { id: 'management-accounts', title: 'Management accounts to 15 September: P&L, balance sheet, cashflow and bank summary', state: 'missing', kind: 'financial', owner: 'Ben', askedFor: 'QBE Q20, Q21 and Q24', funders: ['qbe'], notionId: '3dcebcf981cf81f0a759d77c97538bf4', finishes: 'Reconcile the charity Xero file and export the four reports.' },
  { id: 'funder-workbook', title: 'Funder model workbook', state: 'held', kind: 'financial', owner: 'Built from site data', askedFor: 'QBE Q23; Tim Fairfax 6.3', funders: ['qbe', 'tfff'], notionId: '3dcebcf981cf8131bda5c7636cf9742e', where: 'Built by the funder-model test in the finance worktree; the xlsx is attached on the Notion row.' },

  // ---- Board and legal.
  { id: 'constitution', title: 'Constitution, full signed copy', state: 'partial', kind: 'board-and-legal', owner: 'Zandra', askedFor: 'QBE Q22; Tim Fairfax 4.1, required; SEFA; the Brian M. Davis governance condition', funders: ['qbe', 'tfff', 'sefa', 'bmd'], notionId: '3dcebcf981cf81eeaceed2ca197591ef', where: 'ACNC copy on the QBE row, stops at clause 17.', finishes: 'Full signed copy from Zandra or David Garry.' },
  { id: 'board-resolutions', title: 'Board resolutions and minutes, including the one-entity resolution', state: 'partial', kind: 'board-and-legal', owner: 'Zandra', askedFor: "QBE Q8 and Q22; Brian M. Davis, Anita's condition; SEFA; Tim Fairfax 4.5", funders: ['qbe', 'bmd', 'sefa', 'tfff'], notionId: '3dcebcf981cf813cb5d9c89a60930d01', where: 'June and July 2026 papers held, unsigned.', finishes: 'Dated resolution recording the 12 September ruling, with declarations, by 22 September; the 14 September minute with Kristy\'s declaration.' },
  { id: 'board-members', title: 'Board members and appointment dates', state: 'partial', kind: 'board-and-legal', owner: 'Zandra', askedFor: 'Tim Fairfax 4.2', funders: ['tfff'], notionId: '3dcebcf981cf8148a481c0a316fa500e', finishes: 'One table from the ASIC extract with the casual-vacancy dates.' },
  { id: 'board-skills', title: 'Board skills matrix and risk framework', state: 'missing', kind: 'board-and-legal', owner: 'The board', askedFor: 'Tim Fairfax 4.4 and 4.6', funders: ['tfff'], notionId: '3dcebcf981cf8189aefcd05a62eaf7ed', finishes: 'The board writes both; neither exists.' },
  { id: 'member-register', title: 'Member register, conflict and delegation records', state: 'missing', kind: 'board-and-legal', owner: 'Zandra', askedFor: 'QBE Q22', funders: ['qbe'], notionId: '3dcebcf981cf81e4b904e322b531c4a8', finishes: 'Zandra exports the register and the conflict and delegation records.' },
  { id: 'asic-acnc', title: 'ASIC and ACNC extracts for all three entities', state: 'missing', kind: 'board-and-legal', owner: 'Ben', askedFor: 'QBE Q1, Q4 and Q22', funders: ['qbe'], notionId: '3dcebcf981cf81c4b73ee570b79c66f0', finishes: 'Three current extracts, one per entity.' },
  { id: 'charity-dgr', title: 'Charity registration and deductible gift endorsement', state: 'missing', kind: 'board-and-legal', owner: 'Ben', askedFor: 'QBE Q22; Mazda needs the DGR and ITEC dates', funders: ['qbe', 'mazda'], notionId: '3dcebcf981cf81d28d86c247423bd88d', finishes: 'ACNC certificate and the ATO endorsement letter.' },
  { id: 'founder-contracts', title: 'Founder employment contracts', state: 'missing', kind: 'board-and-legal', owner: 'The board', askedFor: 'SEFA; QBE, constitution clause 16.6', funders: ['sefa', 'qbe'], notionId: '3dcebcf981cf81b9b362f63c83cd3b5b', finishes: 'Clause 16.6 remuneration contracts signed by the board before any wages are paid.' },
  { id: 'site-letters', title: 'Site letter and quote basis per plant, with a cash milestone schedule', state: 'missing', kind: 'board-and-legal', owner: 'Nic', askedFor: 'QBE Q19', funders: ['qbe'], notionId: '3dcebcf981cf8133b022c83d7b9c5f78', finishes: 'Palm Island and Maningrida have not agreed to a build; the letters follow the agreement.' },
  { id: 'consortium-agreement', title: 'Signed Oonchiumpa consortium agreement, and REAL acceptance correspondence', state: 'missing', kind: 'board-and-legal', owner: 'Nic', askedFor: 'QBE missing documents; disclosed at Q8 and Q14', funders: ['qbe'], notionId: '3dcebcf981cf81629ce3c7d3e187243b', finishes: 'Nic with Oonchiumpa; correspondence after 26 August from Tanya and Kristy.' },
  { id: 'child-safety', title: 'Child-safety process', state: 'partial', kind: 'board-and-legal', owner: 'Ben', askedFor: 'Brian M. Davis', funders: ['bmd'], notionId: '3dcebcf981cf81388b69ca2f62eafac7', finishes: 'One page: who holds a Blue Card, how young people are supervised at assembly, who to call.' },
  { id: 'annual-report', title: 'Most recent annual report', state: 'missing', kind: 'board-and-legal', owner: 'Ben', askedFor: 'Tim Fairfax 7.1; a Brian M. Davis link', funders: ['tfff', 'bmd'], notionId: '3dcebcf981cf813faad4f8b7b9ad77b7', finishes: 'None exists for the charity; the Snow report is the nearest thing and is not an annual report.' },

  // ---- Funder correspondence.
  { id: 'funder-bundle', title: 'Private funder bundle: the invitations, the ALIVE invoice and the REAL offer letter', state: 'partial', kind: 'funder-correspondence', owner: 'Ben', askedFor: 'QBE Q15', funders: ['qbe'], notionId: '3dcebcf981cf81749acbcae7006f7936', finishes: 'Add the Snow and Dusseldorp letters of intent when signed, and Sefa\'s acknowledgement of the EOI.' },
  { id: 'contact-schedule', title: 'Private contact schedule for the funders named at Q14', state: 'missing', kind: 'funder-correspondence', owner: 'Ben', askedFor: 'QBE Q16', funders: ['qbe'], notionId: '3dcebcf981cf81528d56d9fe2742aaf5', finishes: 'One table: funder, person, phone, email. Never on a public surface.' },
  { id: 'support-letters', title: 'Support letters: two for Brian M. Davis, one from a beneficiary for Tim Fairfax', state: 'missing', kind: 'funder-correspondence', owner: 'Ben', askedFor: 'Brian M. Davis; Tim Fairfax 5.2', funders: ['bmd', 'tfff'], notionId: '3dcebcf981cf81049b04c95b7184464c', finishes: 'Drafted 17 September; sent to the signatories when Ben says.' },
  { id: 'letter-to-funders', title: 'Catalysing Impact letter to funders', state: 'partial', kind: 'funder-correspondence', owner: 'Ben', askedFor: 'Attached on the Snow row', funders: ['snow'], notionId: '3dcebcf981cf81059a3fd39d0dad35b3', where: 'The Hub\'s 1 April 2026 letter, on the Snow row.' },
  { id: 'budget-template', title: 'Budget template, year-one column', state: 'partial', kind: 'funder-correspondence', owner: 'Ben', askedFor: 'Brian M. Davis', funders: ['bmd'], notionId: '3dcebcf981cf81b4ac9cfcfefc9f5f78', finishes: 'One line: 133 beds at $750. Their template, our number.' },
  { id: 'peer-referee', title: 'Peer organisation referee', state: 'missing', kind: 'funder-correspondence', owner: 'Ben', askedFor: 'Tim Fairfax 5.4', funders: ['tfff'], notionId: '3dcebcf981cf81ce93edd84f26dc5e5c', finishes: 'Ben names one organisation and asks.' },

  // ---- Narrative, design and media.
  { id: 'deck', title: 'Deck PDF, 19 slides', state: 'partial', kind: 'narrative-and-design', owner: 'Ben', askedFor: 'QBE Q23', funders: ['qbe'], notionId: '3dcebcf981cf81bca29ddb28c4272b18', where: 'GOC_QBE_Deck_V0.1.pdf on the QBE row at Q9.', finishes: 'Re-export after the 15 September money went through every slide.' },
  { id: 'placemat', title: 'Placemat image', state: 'held', kind: 'narrative-and-design', owner: 'Done', askedFor: 'QBE Q9, attached on the row', funders: ['qbe'], notionId: '3dcebcf981cf8101a78aee86d66a335d', where: 'goods-placemat2x.png on the QBE row at Q9; rendered from the placemat module.' },
  { id: 'video-photos', title: 'Video and photographs', state: 'held', kind: 'media', owner: 'Done', askedFor: 'Tim Fairfax 7.2', funders: ['tfff'], notionId: '3dcebcf981cf8142a5d2e78f64759567', where: 'Empathy Ledger, cleared media; the community film on goodsoncountry.com.' },
];

export const notionUrl = (id: string) => `https://app.notion.com/p/${id}`;

export const artefactsFor = (funder: FunderId) => ARTEFACTS.filter((a) => a.funders.includes(funder));

export const STATE_LABEL: Record<ArtefactState, string> = {
  held: 'Held',
  partial: 'Partial',
  missing: 'Missing',
  draft: 'Draft',
  'rebuild-pending': 'Rebuild pending',
};

export const KIND_LABEL: Record<ArtefactKind, string> = {
  built: 'Built from the site data',
  financial: 'Financial statement',
  'board-and-legal': 'Board and legal',
  'funder-correspondence': 'Funder correspondence',
  'narrative-and-design': 'Narrative and design',
  media: 'Media',
};

export function countByState(rows: readonly Artefact[] = ARTEFACTS): Record<ArtefactState, number> {
  const out: Record<ArtefactState, number> = { held: 0, partial: 0, missing: 0, draft: 0, 'rebuild-pending': 0 };
  for (const a of rows) out[a.state] += 1;
  return out;
}
