/**
 * EVERY SURFACE THE RAISE HAS PRODUCED, with a verdict. Read for the master on 14 September 2026:
 * the fifty most recent Claude artifacts (Artifact tool listing), the reconciliation of
 * 14 September (design/brand/goods-diagrams/models/ARTIFACT-RECONCILIATION-2026-09-14.md), the
 * Notion front door and the pages built today. A `living` surface is one of the places to come
 * back to; `absorbed` means the master carries what it held; `reference` is kept for its rules
 * or its record; `retired` should not be sent to anyone.
 */

export type Verdict = 'living' | 'absorbed' | 'reference' | 'retired' | 'other project';

export interface RegisteredSurface {
  title: string;
  kind: 'artifact' | 'app page' | 'notion' | 'file' | 'sheet';
  date: string;
  url?: string;
  job: string;
  verdict: Verdict;
  note?: string;
}

export const REGISTER: readonly RegisteredSurface[] = [
  // Living
  { title: 'The master (this page)', kind: 'artifact', date: '2026-09-14', url: 'https://claude.ai/code/artifact/56d3eafa-f789-4434-a1a9-acbd7624f664', job: 'One place: the story, the model, the deck, the QBE answers, the other grants, the questions, the numbers, the blockers and this register. Built from the repo data.', verdict: 'living' },
  { title: 'The pitch', kind: 'app page', date: '2026-09-14', url: 'http://localhost:3007/pitch', job: 'The one scrolling pitch: the crux over the film, the four figures, the seven road stops with their voices, the bed you can press and zoom, the facility you can walk, the trade that builds as you scroll, the placemat, the board, the money, the four panels and the gates, the close and the 25 questions. Takes the best of the road pitch, the story page and the placemat.', verdict: 'living', note: 'Worktree goods-model-wt, uncommitted. The /pitch redirect to /pitch/road is removed.' },
  { title: 'The story, scrolled', kind: 'app page', date: '2026-09-14', url: 'http://localhost:3007/pitch/story', job: 'Nine chapters plus the questions, in the deck’s order; the trade as a sticky scrolly drawn from the same data as the placemat. Slides 13 to 19 get cut from it.', verdict: 'absorbed', note: 'Worktree goods-model-wt, uncommitted. The pitch carries every chapter of it with the interactive pieces added; keep it until Ben says which one ships.' },
  { title: 'The placemat', kind: 'app page', date: '2026-09-14', url: 'http://localhost:3007/admin/model', job: 'The whole model on one A3 sheet, the poster in Goods clothes. Feeds deck slide S13.', verdict: 'living', note: 'Worktree goods-model-wt, uncommitted.' },
  { title: 'QBE Foundation / Stage 2, the opportunity record', kind: 'notion', date: '2026-09-13', url: 'https://app.notion.com/p/392ebcf981cf8189a85cfbdda8d38f1c', job: 'Every question, its recorded state, slides, attachments and owner. Ben’s single application page in Notion.', verdict: 'living' },
  { title: 'QBE deck master', kind: 'notion', date: '2026-09-14', url: 'https://app.notion.com/p/3d1ebcf981cf817598d8f15ee4f89c32', job: 'The nineteen slides, the slide-by-slide review and the visual choices.', verdict: 'living' },
  { title: 'Goods on Country, the raise, start here', kind: 'notion', date: '2026-09-12', url: 'https://app.notion.com/p/3d8ebcf981cf8128bd9aee918f49733f', job: 'The Notion front door: the four applications, the blockers, the work list, the wiki.', verdict: 'living' },
  { title: 'Live model and finance sheet', kind: 'sheet', date: '2026-09-12', url: 'https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit', job: 'Production, stock, money, scenarios. The Canon tab is the bridge to canon.ts. Already on the flat-pack route.', verdict: 'living', note: 'Saved without cached values: recalculate with soffice --headless before reading.' },
  { title: 'Goods Final Deck.pen', kind: 'file', date: '2026-09-10', job: 'The nineteen frames in board BEXfI. PDF export of 10 September predates the route change.', verdict: 'living' },
  { title: 'Goods Visual System', kind: 'artifact', date: '2026-09-14', url: 'https://claude.ai/code/artifact/cbb7d411-e1d1-40e1-9055-bec7046168c3', job: 'How Goods draws, chooses photographs and builds a surface. The rules page.', verdict: 'reference' },
  { title: 'What Goods Can Say', kind: 'artifact', date: '2026-09-13', url: 'https://claude.ai/code/artifact/b2361aba-8a37-4337-ae78-58cd2d971722', job: 'How 36 Empathy Ledger conversations become a claim a funder can check: 27 people, 18 themes, 62 quotes, and what cannot yet be said. Housing sovereignty is the strongest evidenced theme.', verdict: 'reference', note: 'Feeds Q10 and Q11 voices. Nothing in it authorises publishing a reading.' },
  { title: 'TFN Impact Report Answers', kind: 'artifact', date: '2026-09-11', url: 'https://claude.ai/code/artifact/eb4bd86c-20b7-4027-a3b4-1a77ca49477c', job: 'The Funding Network’s 12-month report, answered for cut and paste.', verdict: 'living' },
  // Absorbed into the master
  { title: 'The 25 Questions', kind: 'artifact', date: '2026-09-11', url: 'https://claude.ai/code/artifact/92ad473f-91e5-4ec8-b68c-2c3580102cb5', job: 'Every QBE answer verbatim with slides, files and figures, and the backwards pass.', verdict: 'absorbed', note: 'The QBE screen here carries the same answers from the same source file, with the 13 September states.' },
  { title: 'QBE Control Room', kind: 'artifact', date: '2026-09-11', url: 'https://claude.ai/code/artifact/b45c45a0-378b-41a0-b635-eaa461d0957f', job: 'About seventy graded claims, the funder register, the calendar, the scenario player.', verdict: 'absorbed', note: 'Its money is the 11 September legacy arithmetic. The Numbers and Blockers screens here carry what still holds; the scenario player is retired with the sheet as the model.' },
  { title: 'The Model', kind: 'artifact', date: '2026-09-12', url: 'https://claude.ai/code/artifact/051b93d2-24be-4a6b-b6ff-0390889ddff7', job: 'Three drawings and one sentence: where the money stops, how the making moves, the capital model.', verdict: 'absorbed', note: 'Two of its drawings are on the Model screen here with Witta renamed. Its production figures (three beds a day, 576 a year, 36 kg) were withdrawn on 12 September.' },
  { title: 'The Two Loops', kind: 'artifact', date: '2026-09-11', url: 'https://claude.ai/code/artifact/58d96a4b-616e-49ac-b274-8237929ae68a', job: 'The money drawing on its own, with the full argument.', verdict: 'absorbed' },
  { title: 'Three Plates for the Deck', kind: 'artifact', date: '2026-09-11', url: 'https://claude.ai/code/artifact/69266095-8cfc-43ab-b81f-ed71b4e2b3de', job: 'The bottleneck, the two loops and the ladder of who has asked, at slide size.', verdict: 'absorbed', note: 'Feeds slides S12, S15 and S16 when they are rebuilt.' },
  { title: 'How the Trade Works', kind: 'artifact', date: '2026-09-14', url: 'https://claude.ai/code/artifact/76b886cb-b70e-4d63-a141-0625b7a18128', job: 'The canvas placemat attempt, version 3.', verdict: 'absorbed', note: 'Superseded by the placemat and the story page the same day.' },
  { title: 'How a Bed Becomes an Enterprise', kind: 'artifact', date: '2026-09-11', url: 'https://claude.ai/code/artifact/90e5a525-b65b-48ae-8a34-95bf6268a728', job: 'The eleven-plate public explainer.', verdict: 'absorbed', note: 'The story page is its successor; its plates are the source for the story’s later chapters.' },
  // Retired
  { title: 'Goods on Country Model', kind: 'artifact', date: '2026-09-09', url: 'https://claude.ai/code/artifact/0b235115-7bbb-436f-bbe8-f716c283dcf5', job: 'A scrolling explainer with a scenario engine.', verdict: 'retired', note: 'Carries a share-to-Goods lever that should not exist, a Witta first-stock box and five-layers language.' },
  { title: 'Goods Money Map', kind: 'artifact', date: '2026-09-10', url: 'https://claude.ai/code/artifact/eeb96c11-6564-45ca-af68-69b7f4bac84d', job: 'The money drawn: a bed, three pots, the year, plant modules.', verdict: 'retired', note: 'Optional Q23 attachment at most. Centrecorp on quote and Palm Island plant are stale.' },
  { title: 'QBE Raise Review', kind: 'artifact', date: '2026-09-10', url: 'https://claude.ai/code/artifact/c3a9260a-c99f-4f63-b6b4-80e7fd8b4ab1', job: 'A dated readiness audit.', verdict: 'retired', note: 'Every number in it is superseded.' },
  // Other projects, listed so nothing is lost
  { title: 'Who Can Open What · What To Do Next · How a Reading Leaves', kind: 'artifact', date: '2026-09-12 to 13', job: 'Empathy Ledger platform work: access, the day’s commits, the consent chain.', verdict: 'other project', note: 'Not the raise. Not re-read for this master beyond their titles and What To Do Next.' },
  { title: 'ACT Growth Rings · ACT Money Paths · ACT Residencies · ACT Funder Radar', kind: 'artifact', date: '2026-08 to 09', job: 'A Curious Tractor ecosystem pages.', verdict: 'other project' },
  { title: 'Caring Card Studio · Caring Campaign Run · Caring Campaign Alignment · Caring Wall', kind: 'artifact', date: '2026-09', job: 'The caring campaign.', verdict: 'other project' },
  { title: 'JusticeHub, CivicGraph, MeLinks, Atnarpa, The Milk Run and the rest of the fifty', kind: 'artifact', date: '2026-08 to 09', job: 'Other ventures and one-off reviews.', verdict: 'other project' },
];
