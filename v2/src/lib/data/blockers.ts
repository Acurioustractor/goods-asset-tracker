/**
 * WHAT IS BLOCKING WHAT, as the Notion front door lists it on 12 September 2026
 * (3d8ebcf981cf8128bd9aee918f49733f), with the 12 September edits. The work list in Notion
 * (database 0eac4e79-dd38-452e-94d0-d25944c17b85) is the list; this is the summary.
 */

export interface Blocker {
  n: number;
  what: string;
  who: string;
  blocks: string;
}

export const BLOCKERS: readonly Blocker[] = [
  { n: 1, what: 'The accountant’s letter', who: 'Unassigned', blocks: 'Recorded as the QBE submission blocker. It cannot be signed until the historic books have a cost of goods sold line.' },
  { n: 2, what: 'Butterfly’s constitution', who: 'Eloise', blocks: 'QBE Q12 and Q22, and Tim Fairfax 4.1, which is required.' },
  { n: 3, what: 'Entity decided; implement the transition', who: 'Ben, Nic, board; legal advice from MinterEllison', blocks: 'Ben’s 12 September ruling: Butterfly holds grants, Goods trade, wages and resources, and is renamed Goods on Country. Filings and transfer remain open. The recorded FY26 deficit is about A$42,854; EBITDA needs confirmation.' },
  { n: 4, what: 'Alice Springs allocation decided; retain tranche evidence', who: 'Ben', blocks: 'Both Commonwealth tranches are for Alice Springs, outside the two QBE sites, so this does not release QBE money for beds or close the gap. Approval and receipt evidence remain separate for each tranche.' },
  { n: 5, what: 'Defy quotes QU0494 and QU0495: closed 14 September', who: 'Done, Nic', blocks: 'Nothing now. The press-against-panels decision went to panels: 85 leg panels bought from Defy on two invoices, INV-2021 (25, paid 13 September) and INV-2023 (60, paid 14 September), both invoiced to A Curious Tractor. The quotes are superseded. Still open on the same thread: the shred invoice of 28 August, whose payment is not shown, with the 18 September date as the planning estimate; and the leg-set yield per bought panel, which Nic holds and which fixes the A$276.' },
  { n: 6, what: 'Q19’s six documents: site letters and a cash milestone schedule', who: 'Nic', blocks: 'QBE Q19.' },
  { n: 7, what: 'Current management cashflow and opening balances', who: 'Eloise', blocks: 'QBE Q20 and Q21.' },
  { n: 8, what: 'Kristy Bloomfield’s related-party minute', who: 'Board, 14 September', blocks: 'QBE Q8 and Q22.' },
  { n: 9, what: 'Child safety process, currently draft', who: 'Ben', blocks: 'A Brian M. Davis question. Do not submit it until finished.' },
  { n: 10, what: 'Reconcile the remaining workbook assumptions', who: 'Session', blocks: 'Snow scenario defaults, missing canon keys, current route costs and dated snapshots. Service-account access is a separate automation issue.' },
];
