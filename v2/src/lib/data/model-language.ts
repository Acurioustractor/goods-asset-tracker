/**
 * The lines worth keeping from the QBE pitch session, and the ones that must not be reused.
 *
 * Ben, 11 September 2026, after reading the session transcript: some good language here.
 *
 * A line survives here when it is true against the guarded modules, passes the writing checker,
 * and says something the deck does not already say better. A line is recorded as retired when it
 * is good English and false, because those are the ones that come back.
 *
 * Every kept line carries the surface it belongs on, so it is used once rather than sprayed.
 */

export const READ_AT = '2026-09-11';
export const SOURCE = 'Voice session on the QBE pitch, transcript pasted by Ben 11 September 2026.';

export type Surface = 'thesis' | 'deck' | 'form' | 'diagram' | 'internal';
export type Verdict = 'keep' | 'sharpen' | 'retire';

export interface Line {
  readonly said: string;
  readonly by: 'Ben' | 'the assistant';
  readonly verdict: Verdict;
  readonly surface: Surface;
  /** The version to actually use. Null when the line is retired. */
  readonly use: string | null;
  readonly why: string;
}

export const LINES: readonly Line[] = [
  {
    said: 'whether buying something that communities want and need can become seed capital for locally owned manufacturing',
    by: 'the assistant',
    verdict: 'sharpen',
    surface: 'thesis',
    use: 'Buying something a community already wants is how a community-owned factory gets started.',
    why: 'The best sentence in the session and the whole thesis in one line. "Want and need" is a doublet and "seed capital for locally owned manufacturing" is three abstractions in a row. The shortened version says the same thing and can be spoken.',
  },
  {
    said: 'What does QBE\'s money make possible that otherwise can\'t happen?',
    by: 'the assistant',
    verdict: 'keep',
    surface: 'form',
    use: 'What does this money make possible that otherwise cannot happen?',
    why: 'The catalytic test as a question we can answer, which beats claiming the word. Q18 is written to it already.',
  },
  {
    said: 'If QBE puts 400,000 in, what are we actually proving?',
    by: 'the assistant',
    verdict: 'sharpen',
    surface: 'deck',
    use: 'What $300,000 proves is that a community-made bed has a measured cost. Nobody lends against one today because nobody knows what it costs.',
    why: 'The question is right and the amount is wrong, it is $300,000. Ruling 5 already answers it and the ruling is sharper than any general answer, because it names a falsifiable thing that will exist in twelve months.',
  },
  {
    said: 'a loop, not a funnel',
    by: 'the assistant',
    verdict: 'keep',
    surface: 'diagram',
    use: 'Draw it as a loop.',
    why: 'Right, and it matches deck slide 08. The negative half is a writing tell, so drop it and keep the instruction.',
  },
  {
    said: 'institutional spend redirected into community-owned enterprise',
    by: 'the assistant',
    verdict: 'sharpen',
    surface: 'diagram',
    use: 'Procurement shifted. Money that was going to be spent anyway, landing somewhere else.',
    why: 'The strongest new idea in the session. It names the counterfactual, which "money kept in community" never did. Countable per sale and nobody is counting it yet.',
  },
  {
    said: 'Make it feel like a living system, not a flowchart',
    by: 'the assistant',
    verdict: 'keep',
    surface: 'internal',
    use: 'A brief for whoever draws it. It stays off the page.',
    why: 'A good instruction to a designer. It is not copy and must not end up on a slide.',
  },
  {
    said: 'we can almost have a shared service where those facilities are able to distribute those beds to anyone that they want',
    by: 'Ben',
    verdict: 'sharpen',
    surface: 'deck',
    use: 'A community plant sells to whoever it wants. Goods is a shared service it can use, and never a channel it has to sell through.',
    why: 'This is stronger than what slide 18 says today, which lists shared procurement, design, finance, training and communications without saying the plant is free to ignore all of it. Freedom to sell elsewhere is what makes the ownership claim real.',
  },
  {
    said: 'create capital to create their own production facilities or other choices',
    by: 'Ben',
    verdict: 'keep',
    surface: 'deck',
    use: 'The money funds whatever the community decides next. It may be a plant, it may be more stock, it may be something we have not thought of.',
    why: 'The three words that matter are "or other choices". A model that names what the community must do with its own money is not an ownership model.',
  },
  {
    said: 'the majority of the first beds come from the factory in Witta, but then as we grow need we will implement the production facilities',
    by: 'Ben',
    verdict: 'keep',
    surface: 'form',
    use: 'Witta makes the first stock while the plants are built, and hands over as each one comes up.',
    why: 'The phasing, and it ties to the capacity model: Witta 576 beds a year, a new plant 200 in its first year reaching 720.',
  },
  {
    said: 'the home school company and Suncorp and the Alive Foundation',
    by: 'Ben',
    verdict: 'retire',
    surface: 'deck',
    use: null,
    why: 'Suncorp has never bought anything from us and appears in no record we hold. It is Centrecorp, misheard by the voice model. Naming a listed company as a customer would be a fabricated claim. ALIVE is the ALIVE National Centre at the University of Melbourne. It is a research centre and calling it a foundation is wrong.',
  },
  {
    said: 'a full capital raise of between 500 and 600,000',
    by: 'Ben',
    verdict: 'retire',
    surface: 'form',
    use: null,
    why: 'The ask is $600,000 across five lines and the year needs $747,950. A $500,000 floor understates by up to $148,000 and would be read as the number we need.',
  },
  {
    said: 'four small scorecards: employment, enterprise, recycling, health. Simple dials',
    by: 'the assistant',
    verdict: 'retire',
    surface: 'diagram',
    use: null,
    why: 'Health is the reason the work exists and is never a claimed outcome. A dial implies a measurement we do not have and will not make. The four areas stay; health carries no number.',
  },
  {
    said: 'back to community revenue, then to local production, and back around',
    by: 'the assistant',
    verdict: 'retire',
    surface: 'diagram',
    use: null,
    why: 'One circle puts an arrow from community revenue back to catalytic capital and implies Goods is repaid out of community sales. The full $750 stays with the enterprise, ruled 10 September. Ruling 9 calls it the two kinds of money that never meet, so the drawing is two loops.',
  },
];

export const KEPT = LINES.filter((l) => l.verdict !== 'retire');
export const RETIRED = LINES.filter((l) => l.verdict === 'retire');

export function forSurface(s: Surface): readonly Line[] {
  return KEPT.filter((l) => l.surface === s);
}

export const THE_THESIS = KEPT.find((l) => l.surface === 'thesis')!.use!;

export const WHY_RETIRED_LINES_ARE_KEPT =
  'A retired line is recorded with its reason because good English that is false is the kind that comes back. Suncorp reads well in a list of three buyers and would survive several drafts before anybody checked it.';

export const THE_TEST =
  'A line stays when it is true against the guarded modules, passes the writing checker, and says something the deck does not already say better. Two of the kept lines fail the third test on their own and are kept because they sharpen a line we already had.';
