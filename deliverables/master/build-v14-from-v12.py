#!/usr/bin/env python3
"""Build master v14 = v12 (all ten screens) + 15 Sep money + v13 interactive section."""
import re, sys, pathlib
here = pathlib.Path(__file__).parent
v12 = (here / 'v12.html').read_text()
v13 = (here / 'v13.html').read_text()
s = v12
misses = []

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n == 0:
        misses.append(old[:90]); return
    if count and n != count:
        misses.append(f'COUNT {n}!={count}: ' + old[:80]); return
    s = s.replace(old, new)

# ---------- Start screen ----------
rep('Goods on Country · the master · built 2026-09-14', 'Goods on Country · the master · version 14 · built 2026-09-15, restored from the 14 September master')
rep('<td>Beds bought and paid for</td><td class="n">320 by four organisations, A$273,966</td>',
    '<td>Beds bought and paid for</td><td class="n">320 by four organisations, A$247,770 net of GST (A$273,966 incl GST, bank basis)</td>')
rep('<tr><td><strong>Brian M. Davis Charitable Foundation</strong><br><span class="small">25 September 2026</span></td><td class="n">A$100,000<br><span class="small">grant</span></td></tr>',
    '<tr><td><strong>Brian M. Davis Charitable Foundation</strong><br><span class="small">25 September 2026 · 133 beds at A$750</span></td><td class="n">A$99,750<br><span class="small">grant</span></td></tr>')
rep('<tr><td><strong>Tim Fairfax Family Foundation, FY27 Resilience: Multi-Year General Operating Support</strong><br><span class="small">9 October 2026, 5pm</span></td><td class="n">A$300,000 over three years<br><span class="small">grant</span></td></tr>',
    '<tr><td><strong>Tim Fairfax Family Foundation, FY27 Resilience: Multi-Year General Operating Support</strong><br><span class="small">9 October 2026, 5pm · each A$100,000 year buys 133 beds at A$750</span></td><td class="n">A$300,000 over three years; A$100,000 in the year<br><span class="small">grant</span></td></tr>')
rep('<tr><td><strong>SEFA, Backing the Bold</strong><br><span class="small">Open, rolling. Queensland stream open.</span></td><td class="n">A$50,000 to 200,000<br><span class="small">loan</span></td></tr>',
    '<tr><td><strong>SEFA, Backing the Bold</strong><br><span class="small">Open, rolling. Queensland stream open. Outside the ask until Ben rules on the loan.</span></td><td class="n">A$50,000 to 200,000<br><span class="small">loan</span></td></tr>')
rep('<tr><td><strong>Snow Foundation</strong><br><span class="small">No date. Unsent.</span></td><td class="n">A$100,000<br><span class="small">grant</span></td></tr>',
    '<tr><td><strong>Snow Foundation</strong><br><span class="small">No date. Unsent. 133 beds at A$750.</span></td><td class="n">A$100,000<br><span class="small">grant</span></td></tr>')
rep('<tr><td><strong>Commonwealth, DEWR through Oonchiumpa (and NIAA in train)</strong><br><span class="small">Not ours to submit</span></td><td class="n">A$150,000 approved, a second A$150,000 likely<br><span class="small">grant to a partner</span></td></tr>',
    '<tr><td><strong>Commonwealth, DEWR REAL Innovation Fund, to Oonchiumpa (NIAA an open door)</strong><br><span class="small">Not ours. Disclosed, never counted.</span></td><td class="n">A$1,695,000 offer over four years, agreement not executed. Once it is, Oonchiumpa pays Goods A$150,000 to develop the Alice Springs facility<br><span class="small">grant to a partner</span></td></tr>')
rep('<p class="small">QBE buys plants. Tim Fairfax buys the organisation. Brian M. Davis buys beds. SEFA lends. One funder is never counted against two jobs. Every bed comes with facilitation and support for the workshopping in community. It sits inside the price of a bed (Ben, 14 September 2026).</p>',
    '<p class="small">QBE buys two plants. Every other grant buys beds, 133 at A$750 (A$99,750): Tim Fairfax each year, Brian M. Davis, Snow. Nobody is asked for the running cost; the A$288 each bed hands back is what carries the organisation (Ben, 15 September 2026). SEFA lends and sits outside the ask until Ben rules. One funder is never counted against two jobs. Facilitation and freight sit inside the price of a bed.</p>')
rep('<p class="big">A$0 <span class="small">secured</span></p>\n      <p class="small">Core year-one lines A$500,000; A$600,000 with the unsent Snow option. Legacy year cost A$747,950; legacy gap A$247,950 with Snow off, A$147,950 on. Recalculate on the flat-pack route before using as evidence.</p>',
    '<p class="big">A$0 <span class="small">secured</span></p>\n      <p class="small">Asked A$599,750: QBE A$300,000, Tim Fairfax A$100,000, Brian M. Davis A$99,750, Snow A$100,000 unsent. The year needs A$736,187. Gap if every ask lands A$136,437, which is 134 beds at A$750 or the distance between 400 beds and the 874 that carry the organisation. Running cost A$251,224. Figures from the finance worktree, 15 September; the make cost is provisional.</p>')
rep('<li><strong>The master (this page)</strong> · <a href="https://claude.ai/code/artifact/56d3eafa-f789-4434-a1a9-acbd7624f664" target="_blank" rel="noreferrer">open</a><br><span class="small">One place: the story, the model, the deck, the QBE answers, the other grants, the questions, the numbers, the blockers and this register. Built from the repo data.</span></li>',
    '<li><strong>The master (this page)</strong> · <a href="https://claude.ai/code/artifact/56d3eafa-f789-4434-a1a9-acbd7624f664" target="_blank" rel="noreferrer">open</a><br><span class="small">One place: the story, the model, the deck, the QBE answers, the other grants, the questions, the numbers, the blockers, this register, and the bed, stack and knobs from the 15 September rebuild. Built from the repo data.</span></li>')

# ---------- About ----------
rep('<p><strong>Team.</strong> Nic Marchesi runs production, supply and the plant build. Ben Knight runs the model, the money and the funder relationships.</p>',
    '<p><strong>Team.</strong> Nic Marchesi runs production, supply and the plant build. Ben Knight runs the model, the money and the funder relationships. Both are employees of Goods on Country and hold no directorship (Ben, 15 September 2026).</p>')
rep('<li><strong>Jeremy Donovan</strong>, Director · Kuku-Yalanji and Gumbaynggirr<br><span class="small">Director of Goods on Country’s legal entity, sharing responsibility for its purpose, assets and decisions. A separate operational portfolio has not been recorded.</span></li>',
    '<li><strong>Sonia Mascolo</strong>, Director until the 12 October AGM<br><span class="small">Director of Goods on Country’s legal entity at submission. Signs the FY26 statements with Eloise.</span></li><li><strong>Jeremy Donovan</strong>, Nominated · Kuku-Yalanji and Gumbaynggirr<br><span class="small">Stands for election at the AGM on 12 October 2026 alongside Kristy and Audrey. Nomination owed this week.</span></li>')
rep('<p class="small">The board handover is in progress and no chair is appointed.',
    '<p class="small">The board at submission is Kristy Bloomfield, Audrey Deemal and Sonia Mascolo; the AGM on 12 October elects Kristy, Audrey and Jeremy Donovan. No chair is appointed.')

# ---------- Model ----------
rep('<li><strong>The raise pays for the start.</strong> <span class="small">QBE A$300,000 for the two facilities. Other philanthropy A$200,000 to A$300,000 for the first 400 beds, and every bed comes with facilitation and support for the workshopping in community. A$500,000 to A$600,000 in total. Nothing is signed yet.</span></li>',
    '<li><strong>The raise pays for the start.</strong> <span class="small">QBE A$300,000 for the two facilities. Every other grant buys beds, 133 at A$750: Tim Fairfax A$100,000 a year, Brian M. Davis A$99,750, Snow A$100,000 unsent. Facilitation and freight sit inside the price. Asked A$599,750. Nothing is signed yet.</span></li>')
rep('<text x="252" y="270" text-anchor="middle" font-size="13" fill="var(--ink-2)">paid beds carry it (provisional 628 a year)</text>',
    '<text x="252" y="270" text-anchor="middle" font-size="13" fill="var(--ink-2)">paid beds carry it (provisional 874 a year)</text>')
rep('<text x="252" y="419" text-anchor="middle" font-size="11" fill="var(--ink-2)">$276 makes it &middot; $474 carries the business &middot; both provisional</text>',
    '<text x="252" y="419" text-anchor="middle" font-size="11" fill="var(--ink-2)">$262 makes it &middot; $100 freight &middot; $100 facilitation &middot; $288 to the organisation &middot; provisional</text>')
rep('<p class="small">Two loops, and they never join. Beds cross one way; money does not cross back. Figures are the 11 September money, legacy pending the flat-pack route costing.</p>',
    '<p class="small">Two loops, and they never join. Beds cross one way; money does not cross back. Figures are the 15 September money; the make cost is provisional until the bought leg-panel yield is known.</p>')
rep('<h2>Capital has three jobs</h2>\n    <p>Plants, first stock, the organisation. QBE’s A$300,000 builds two plants and nothing else. Other philanthropy buys the first 400 beds at the bed price, and every bed comes with facilitation and support for the workshopping in community. it sits inside the price of a bed (ben, 14 september 2026). Tim Fairfax’s invitation runs the organisation and never buys beds. Buyer receipts stay with the community organisation and never return to Goods.</p>\n    <p class="small">The capital drawing from The Model artifact is not carried here: it drew facilitation as a separate A$40,000 line, which the 14 September ruling folds into the bed price, and its year arithmetic is legacy pending the flat-pack route costing. The three-year making drawing was withdrawn with the 12 September route.</p>',
    '<h2>Capital has two jobs</h2>\n    <p>Plants and beds. QBE’s A$300,000 builds two plants and nothing else. Every other grant buys beds at the bed price, 133 at A$750, with facilitation and freight inside the price. Tim Fairfax’s three-year invitation buys 133 beds a year; the A$38,250 of contribution inside them is what its general operating support form is answered with. Nobody is asked for the running cost: the organisation lives on the A$288 each bed hands back, and 874 paid beds a year carries it (Ben, 15 September 2026). Buyer receipts stay with the community organisation and never return to Goods.</p>\n    <p class="small">The capital drawing from The Model artifact is not carried here: it drew facilitation as a separate A$40,000 line, which the 14 September ruling folds into the bed price. The interactive stack below this master (The bed, the stack and the knobs) is the current drawing of the same thing.</p>')

# ---------- Deck ----------
rep('<p class="lead">Nineteen slides in the deck master’s order, 2026-09-14. v2/public/strategy/Goods Final Deck.pen · board BEXfI · PDF export 10 September 2026.</p>',
    '<p class="lead">Nineteen slides in the deck master’s order, 2026-09-14. v2/public/strategy/Goods Final Deck.pen · board BEXfI · PDF export 10 September 2026.</p>\n  <p class="warn">Slides S12, S13, S15, S16, S18 and S19 were rebuilt on 15 September to the 133-beds-a-grant money and swapped on the deck master. The rows below are the 14 September plan for each slide; the deck master carries the current copy.</p>')

# ---------- QBE answers ----------
rep('<p class="small">Written answers are the file deliverables/master/sources/qbe-answers-2026-09-10.md, revised 12 September, rendered as written, with one substitution: where that file says Witta this page says The Harvest Plant, per the 13 September ruling. The groups that had no text on 13 September carry drafts from qbe-answers-drafts-2026-09-14.md, marked as drafts. Working notes for Ben and Nic are not on this page.</p>',
    '<p class="small">Written answers are the file deliverables/master/sources/qbe-answers-2026-09-10.md, revised 12 September, rendered as written, with one substitution: where that file says Witta this page says The Harvest Plant, per the 13 September ruling. The groups that had no text on 13 September carry drafts from qbe-answers-drafts-2026-09-14.md, marked as drafts. Money figures were brought to the 15 September rulings on this page (133 beds a grant, A$262 make, A$288 contribution, A$251,224 running, REAL as an unsigned offer). <strong>The Notion opportunity record carries the answers as they stand today and wins where the two differ.</strong> Working notes for Ben and Nic are not on this page.</p>')
rep('<p>The Butterfly Movement Ltd: Kristy Bloomfield, Audrey Deemal, Jeremy Donovan.</p>',
    '<p>The Butterfly Movement Ltd: Kristy Bloomfield, Audrey Deemal, Sonia Mascolo. Jeremy Donovan stands for election at the AGM on 12 October 2026.</p>')
rep('<p class="small"><strong>Where it stands.</strong> Butterfly’s three directors are settled, stated by Ben as a director.',
    '<p class="small"><strong>Where it stands.</strong> Butterfly’s three directors at submission are Kristy Bloomfield, Audrey Deemal and Sonia Mascolo (Ben, 15 September); Jeremy Donovan joins at the 12 October AGM. Ben and Nic are employees, not directors.')
rep('<p>Alice Springs is a third site and is not in this request. Its $150,000 is approved through Oonchiumpa\'s Commonwealth money.</p>',
    '<p>Alice Springs is a third site and is not in this request. Oonchiumpa holds a Commonwealth REAL Innovation Fund offer of $1,695,000 over four years, agreement not yet executed; once it is, Oonchiumpa pays Goods on Country $150,000 to develop that facility.</p>')
rep('<p>The beds themselves are funded separately, by asks to the Brian M. Davis Charitable Foundation and the Snow Foundation. The Tim Fairfax Family Foundation has invited a three-year application for the organisation itself, and their money is counted on that line alone. All of those remain unawarded. QBE\'s $300,000 is allocated to the two plants and to nothing else.</p>',
    '<p>The beds themselves are funded separately. Every other grant buys beds, 133 at $750: the Brian M. Davis Charitable Foundation, the Snow Foundation, and each year of the Tim Fairfax Family Foundation\'s three-year invitation. Nobody is asked for the running cost. All of those remain unawarded. QBE\'s $300,000 is allocated to the two plants and to nothing else.</p>')
rep('Both Commonwealth $150,000 tranches relate to Alice Springs, outside the two QBE sites; one is approved per director statement, the second likely. Neither releases QBE capital into beds.',
    'The Commonwealth money is one REAL Innovation Fund offer of $1,695,000 to Oonchiumpa over four years, agreement not executed, no cash received (Ben, 15 September). It is Alice Springs, outside the two QBE sites, and it does not release QBE capital into beds.')
rep('<tr><td class="">Brian M. Davis Charitable Foundation</td><td class="">Up to $100,000 for 80 beds and youth facilitation</td>',
    '<tr><td class="">Brian M. Davis Charitable Foundation</td><td class="">$99,750 for 133 beds at $750, facilitation inside the price</td>')
rep('<td class="">Due 9 October. Decides late November. Runs the organisation and never buys beds.</td>',
    '<td class="">Due 9 October. Decides late November. Each $100,000 year buys 133 beds at $750; the contribution inside them is the operating support.</td>')
rep('<tr><td class="">Department of Employment and Workplace Relations, through Oonchiumpa</td><td class="">About $150,000 to build the Alice Springs plant</td><td class="">Oonchiumpa\'s Commonwealth offer of $1,695,000 over four years, dated 12 August 2026, agreement to be executed</td><td class="">Outside this request and disclosed at Q8. A further amount of up to $150,000 for plant equipment is in train with the National Indigenous Australians Agency; no invitation has been issued.</td></tr>',
    '<tr><td class="">Department of Employment and Workplace Relations, REAL Innovation Fund, to Oonchiumpa</td><td class="">$1,695,000 over four years to Oonchiumpa; once executed, Oonchiumpa pays Goods on Country $150,000 to develop the Alice Springs plant</td><td class="">Offer letter of 12 August 2026; it says it is not a grant agreement. None is executed and no cash has been received.</td><td class="">Outside this request and disclosed at Q8. Never counted. NIAA Local Investments (up to $150,000 an activity) is an open door, not an invitation; Goods and Oonchiumpa work on it together once the DEWR agreement is executed.</td></tr>')
rep('Ben ruled on 14 September that facilitation sits inside the price of a bed, so the phrase “the beds and the youth facilitation” and the Brian M. Davis budget split are re-cut before submission.',
    'Ben ruled on 14 September that facilitation sits inside the price of a bed, and on 15 September that the Brian M. Davis ask is 133 beds at $750, $99,750, one budget line; the old 80 beds plus $40,000 split is withdrawn.')
rep('<p>Our illustrative $200,000 loan has annual payments of about $47,523. At a provisional contribution of $474.26 per bed, 101 bed contributions would cover those payments before organisation costs. The contribution is provisional because the leg sheets are bought in now, and the yield off a bought panel is still to be confirmed, so the 101 moves with it.',
    '<p>Our illustrative $200,000 loan has annual payments of about $47,523. At a provisional contribution of $288 per bed, after $262 of making, $100 of freight and $100 of facilitation, about 165 bed contributions would cover those payments before organisation costs, and 696 repay the whole facility. The contribution is provisional because the leg sheets are bought in now, and the yield off a bought panel is still to be confirmed, so the 165 moves with it.')
rep('Its directors are Kristy Bloomfield, Audrey Deemal and Jeremy Donovan. The board meets on 14 September',
    'Its directors at submission are Kristy Bloomfield, Audrey Deemal and Sonia Mascolo; Jeremy Donovan stands for election at the AGM on 12 October. The board met on 14 September')
rep('Making is paid work: $80 a bed, about two hours, at the factory rate.',
    'Making is paid work: about $67 a bed at six kits a day, about two hours, inside the provisional $262 make cost.')
rep('Running the organisation costs $297,550 a year. A bed sells at $750 at the factory door. The $275.74 it costs to make and the $474.26 it leaves are both provisional: that making allowance was costed when we pressed both sheets ourselves, and now that the leg sheets are bought it is the yield off a bought panel that sets the number. Nic is confirming that yield with Defy. The $80 of paid making, about two hours, sits inside the provisional allowance and is the one part of it we have set ourselves. Freight is charged on top, at cost, per community.',
    'Running the organisation costs $251,224 a year: founders $151,200, travel $51,000, rent $27,000, marketing $10,000, maintenance $8,350, accounting and audit $3,674. A bed sells at $750 and nothing is added to it. The $262 it costs to make is provisional: that allowance was costed when we pressed both sheets ourselves, and now that the leg sheets are bought it is the yield off a bought panel that sets the number. Nic is confirming that yield with Defy. Out of the $750 the organisation pays $100 of freight and $100 of facilitation itself, so $288 reaches it; 874 paid beds a year carries the running cost with no grant at all.')
rep('The loan test in it is the one we hold ourselves to: a $200,000 facility needs a provisional 101 paid beds a year to service.',
    'The loan test in it is the one we hold ourselves to: a $200,000 facility needs a provisional 165 paid beds a year to service at $288 a bed, and 696 to repay.')

# ---------- Other grants ----------
rep('<p class="lead">They are not interchangeable. QBE buys plants. Tim Fairfax buys the organisation. Brian M. Davis buys beds. SEFA lends. Treating them as one pool is what produced a $99,500 double count in September.</p>\n  <p class="warn">Every bed comes with facilitation and support for the workshopping in community. It sits inside the price of a bed (Ben, 14 September 2026). The finance model, the live sheet and the Brian M. Davis budget still carry a separate A$40,000 facilitation line across four communities; they are re-cut to the ruling.</p>',
    '<p class="lead">They are not interchangeable. QBE buys two plants. Every other grant buys beds, 133 at A$750. SEFA lends. Nobody is asked for the running cost. Treating them as one pool is what produced a $99,500 double count in September.</p>\n  <p class="warn">Every bed comes with facilitation and freight inside the price, A$100 each, paid by the organisation out of its share (Ben, 14 and 15 September 2026). The separate A$40,000 facilitation line is withdrawn from the finance model and the Brian M. Davis budget. SEDI is out of the stack: it buys capability services, never beds; Oonchiumpa may apply to its First Nations stream. Every bed figure that was once attached to a place that asked (Utopia, Maningrida, Palm Island, Tennant Creek, Groote, NPY) is withdrawn; the only demand record is the paid trade.</p>')
rep('<tr><td>Amount</td><td>A$100,000</td></tr>\n      <tr><td>Buys</td><td>80 beds, and every bed comes with facilitation and support for the workshopping in community. One line, no split (Ben, 14 September). The draft budget still shows 80 beds at A$60,000 plus A$40,000 of youth facilitation; it is rewritten as the one line before it goes. On this grant that is A$1,250 a bed all in, against a A$750 sale price, so the finance model needs an all-in first-stock price or a facilitation-per-bed figure. Ben to rule which.</td></tr>',
    '<tr><td>Amount</td><td>A$99,750</td></tr>\n      <tr><td>Buys</td><td>133 beds at A$750, facilitation and freight inside, one budget line (Ben, 15 September 2026). The old 80 beds at A$60,000 plus A$40,000 of youth facilitation is withdrawn. The beds are community trading stock; A$38,250 of the grant reaches the organisation as the contribution inside them.</td></tr>')
rep('<tr><td>State</td><td>Drafted against their form. The child safety process is still a draft; do not submit until it is finished. The budget is rewritten as one line: 80 beds with facilitation inside.</td></tr>',
    '<tr><td>State</td><td>Final block on the Notion row: 133 beds, A$99,750. The child safety answer and a board resolution are owed; do not submit until they are in.</td></tr>')
rep('<tr><td>Needs</td><td>Child safety process, finished · The budget names QBE as the other funding body · Budget rewritten as one line: 80 beds with facilitation inside</td></tr>',
    '<tr><td>Needs</td><td>Child safety answer, finished · Board resolution · The budget names QBE as the other funding body · Budget as one line: 133 beds at A$750</td></tr>')
rep('<tr><td>Buys</td><td>The organisation: operating support, three years. Never beds.</td></tr>',
    '<tr><td>Buys</td><td>133 beds a year at A$750, A$99,750 of each A$100,000 payment (Ben, 15 September 2026). The form asks for general operating support; the answer says what the beds hand the organisation: A$38,250 a year of contribution, first stock in year one, the reserve in year two, the handover stock in year three.</td></tr>')
rep('<tr><td>State</td><td>14 required attachments, we hold 3. It tests governance, not the model, and requires an AI-use declaration.</td></tr>',
    '<tr><td>State</td><td>Final answers on the Notion row. 14 required attachments, 11 owed. It tests governance, not the model, and requires an AI-use declaration.</td></tr>')
rep('<tr><td>Buys</td><td>Repayable capital: the second press (about A$22,500) and working capital at a provisional A$276 a bed. A first ask of A$50,000 to 100,000 sits inside the programme band.</td></tr>',
    '<tr><td>Buys</td><td>Repayable capital: yield improvements (a second press die, CNC tooling and jig, shred handling, extraction, a cold press for canvas, power; all needing quotes from Nic) and working capital at a provisional A$262 a bed. There is no second press; the A$22,500 was the shredder (Ben, 15 September). A first ask of A$50,000 to 100,000 sits inside the programme band. Whether a A$150,000 loan sits inside the ask is Ben’s open ruling.</td></tr>')
rep('<tr><td>Condition</td><td>Debt, not a grant: it asks whether the money generates enough to repay itself. 101 paid beds a year services A$200,000 at the provisional A$474 a bed, and that alone does not establish affordability.</td></tr>',
    '<tr><td>Condition</td><td>Debt, not a grant: it asks whether the money generates enough to repay itself. At the provisional A$288 a bed, about 165 paid beds a year service A$200,000 and 696 repay it, inside one mature plant’s 720 a year. That alone does not establish affordability.</td></tr>')
rep('<tr><td>Buys</td><td>Beds, in one named scope. No Snow percentage prints anywhere; the dollars print with the scope named.</td></tr>',
    '<tr><td>Buys</td><td>133 beds at A$750 (Ben, 15 September 2026). No Snow percentage prints anywhere; the dollars print with the scope named.</td></tr>')
rep('<h2>Commonwealth, DEWR through Oonchiumpa (and NIAA in train) <span class="chip ready">grant to a partner</span></h2>\n    <table class="kv">\n      <tr><td>Amount</td><td>A$150,000 approved, a second A$150,000 likely</td></tr>\n      <tr><td>Buys</td><td>The Alice Springs plant, built by Goods on Country for Oonchiumpa under its A$1,695,000 four-year Commonwealth offer of 12 August 2026.</td></tr>\n      <tr><td>Due</td><td>Not ours to submit</td></tr>\n      <tr><td>State</td><td>First tranche approved per director statement; second likely. Both are Alice Springs, outside the two QBE sites, so they neither release QBE money for beds nor close the gap. Disclosed at Q8. If a second tranche ever lands on a QBE site it must be declared at Q14 and Q15.</td></tr>',
    '<h2>Commonwealth, DEWR REAL Innovation Fund, to Oonchiumpa (NIAA an open door) <span class="chip ready">grant to a partner</span></h2>\n    <table class="kv">\n      <tr><td>Amount</td><td>A$1,695,000 excluding GST over four years to Oonchiumpa, A$423,750 a year to 30 June 2030. Not A$150,000, not approved to the applicant, no second tranche (Ben, 15 September 2026).</td></tr>\n      <tr><td>Buys</td><td>Oonchiumpa’s program. Once the agreement is executed, Oonchiumpa pays Goods on Country A$150,000 to develop the Alice Springs facility (stated by Ben as a director, 15 September).</td></tr>\n      <tr><td>Due</td><td>Not ours to submit</td></tr>\n      <tr><td>State</td><td>Offer letter of 12 August 2026; it says it is not a grant agreement. None is executed and no cash has been received. Alice Springs is outside the two QBE sites, so it neither releases QBE money for beds nor closes the gap. Disclosed at Q1, Q2, Q8 and Q14, never counted. NIAA Local Investments, up to A$150,000 an activity, is an open door, not an invitation.</td></tr>')
rep('<tr><td>Needs</td><td>Original evidence, recipient, conditions and cash timing for each tranche</td></tr>',
    '<tr><td>Needs</td><td>Where REAL acceptance stands (Tanya and Kristy) · The executed agreement, when it exists</td></tr>')
rep('<ol class="inline"><li><strong>A$750</strong> one bed</li><li><strong>A$7,500</strong> ten beds</li><li><strong>A$22,500</strong> the second press</li><li><strong>A$75,000</strong> a hundred-bed pool</li><li><strong>A$150,000</strong> one plant</li><li><strong>A$300,000</strong> two plants</li></ol>',
    '<ol class="inline"><li><strong>A$750</strong> one bed</li><li><strong>A$7,500</strong> ten beds</li><li><strong>A$75,000</strong> a hundred-bed pool</li><li><strong>A$99,750</strong> 133 beds, the standard grant lot</li><li><strong>A$150,000</strong> one plant</li><li><strong>A$300,000</strong> two plants</li></ol>')

# ---------- FAQ ----------
rep('<dt>Is A$500,000 to 600,000 the income? </dt><dd>No. It is the raise: QBE A$300,000 for two production facilities, and A$200,000 to 300,000 of other philanthropy for the first 400 beds and the support around the trade.',
    '<dt>Is A$599,750 the income? </dt><dd>No. It is the raise: QBE A$300,000 for two production facilities, and A$299,750 of other grants buying beds, 133 at A$750 each, with the support around the trade inside the price.')
rep('The other A$200,000 to 300,000 buys the first 400 beds at The Harvest Plant, 100 for each of 4 community organisations. Every bed comes with facilitation and support for the workshopping in community; that sits inside the price of a bed. The beds are the community organisations’ to sell.',
    'The other A$299,750 buys the first 400 beds at The Harvest Plant, 133 a grant at A$750, 100 for each of 4 community organisations. Facilitation and freight sit inside the price of a bed. The beds are the community organisations’ to sell. Nobody is asked for the running cost.')
rep('<dt>What does it cost to make a bed? <span class="chip doc">partly</span></dt><dd>About A$276 on the flat-pack route: tab sheets pressed at The Harvest Plant, leg panels bought in, kits dispatched flat and assembled in community. On a A$750 bed that leaves A$474 with the community organisation, with freight paid by the buyer and shown beside the bed, left out of the make cost. The A$276 is provisional',
    '<dt>What does it cost to make a bed? <span class="chip doc">partly</span></dt><dd>About A$262 on the flat-pack route: tab sheets pressed at The Harvest Plant, leg panels bought in, kits dispatched flat and assembled in community. A bed is A$750 and nothing is added to it: the organisation pays A$100 of freight and A$100 of facilitation out of its share, so A$288 reaches it, and 874 paid beds a year carries the A$251,224 running cost with no grant. The A$262 is provisional')
rep('<dt>What happens if the cost to make comes in over A$276? </dt>', '<dt>What happens if the cost to make comes in over A$262? </dt>')
rep('<dt>What does Goods on Country get out of it? </dt><dd>What it is paid for making the first stock, and the money that runs the organisation, which we raise separately and say which is which. Sales money never funds it: the buyer pays the community organisation, not Goods on Country.',
    '<dt>What does Goods on Country get out of it? </dt><dd>A$288 of every A$750 bed, once it is made, moved and facilitated. Nobody is asked for the running cost; 874 paid beds a year carries it, and the year plans 400. Sales money never funds it: the buyer pays the community organisation, not Goods on Country.')

# ---------- Numbers ----------
rep('<tr><td>Other philanthropy</td><td class="n">A$200,000 to 300,000 · The first 400 beds. Every bed comes with facilitation and support for the workshopping in community.</td></tr>\n        <tr><td>Total</td><td class="n">A$500,000 to 600,000</td></tr>',
    '<tr><td>Tim Fairfax, year one</td><td class="n">A$100,000 · 133 beds at A$750</td></tr>\n        <tr><td>Brian M. Davis</td><td class="n">A$99,750 · 133 beds at A$750</td></tr>\n        <tr><td>Snow, unsent</td><td class="n">A$100,000 · 133 beds at A$750</td></tr>\n        <tr><td>Asked</td><td class="n">A$599,750</td></tr>')
rep('<tr><td>Costs to make</td><td class="n">A$276 provisional</td></tr>\n        <tr><td>Stays with the community organisation</td><td class="n">A$474, freight paid by the buyer</td></tr>\n        <tr><td>Freight, shown beside the bed</td><td class="n">A$150</td></tr>\n        <tr><td>Paid making inside the make cost</td><td class="n">$80, about two hours, modelled</td></tr>',
    '<tr><td>Costs to make</td><td class="n">A$262 provisional (plastic 55, poles 27, canvas 93.50, hardware 5.24, power 15, labour 66.67)</td></tr>\n        <tr><td>Freight, paid by the organisation</td><td class="n">A$100</td></tr>\n        <tr><td>Facilitation, paid by the organisation</td><td class="n">A$100</td></tr>\n        <tr><td>Reaches the organisation</td><td class="n">A$288</td></tr>\n        <tr><td>Running cost</td><td class="n">A$251,224 a year</td></tr>\n        <tr><td>Break-even</td><td class="n">874 paid beds a year</td></tr>')
rep('What that does to the A$474 on a first-stock bed is for the finance model to recompute.</p>',
    'The community organisation keeps the whole A$750 when it sells a bed it was given as stock.</p>')
rep('<tr><td>Paid trade</td><td class="n">320 beds, five invoices, four organisations, A$273,966</td></tr>',
    '<tr><td>Paid trade</td><td class="n">320 beds, five invoices, four organisations, A$247,770 net of GST (A$273,966 incl GST)</td></tr>')
rep('which Nic holds and which fixes the A$276.</p>', 'which Nic holds and which fixes the A$262.</p>')
rep('<h2>The money position, 2026-09-12</h2>\n    <table class="kv">\n      <tr><td>Legacy year cost</td><td class="n">A$747,950</td></tr>\n      <tr><td>Core year-one application and invitation lines</td><td class="n">A$500,000; A$600,000 including the unsent Snow option</td></tr>\n      <tr><td>Secured</td><td class="n">A$0</td></tr>\n      <tr><td>Legacy fixed-scope gap</td><td class="n">A$247,950 with Snow off; A$147,950 with Snow on</td></tr>\n      <tr><td>Beds of first stock unfunded</td><td class="n">187 if Snow funds 133; 320 otherwise</td></tr>\n    </table>\n    <p class="warn">The year cost and the gap use the legacy fixed scope at the old A$276 making allowance and A$474 contribution. The 12 September flat-pack route makes the cost of a bed provisional until the bought leg-panel yield is confirmed. Recalculate before using the margin, the gap or the break-even as evidence. Not a confirmed current cash shortfall.</p>',
    '<h2>The money position, 2026-09-15</h2>\n    <table class="kv">\n      <tr><td>The year needs</td><td class="n">A$736,187 · two plants A$300,000, making 400 beds A$104,963, facilitation A$40,000, freight A$40,000, running A$251,224</td></tr>\n      <tr><td>Asked, four lines</td><td class="n">A$599,750 (A$499,750 with Snow unsent)</td></tr>\n      <tr><td>Secured</td><td class="n">A$0</td></tr>\n      <tr><td>Gap if every ask lands</td><td class="n">A$136,437 · 134 beds at A$750, or the distance between 400 beds and the 874 that carry the organisation</td></tr>\n      <tr><td>Beds of first stock covered by sent asks</td><td class="n">266 of 400; 133 more in the unsent Snow ask</td></tr>\n    </table>\n    <p class="warn">Figures from the finance worktree modules, 15 September (the-year-and-the-raise.ts, capital-stack-flex.ts). The make cost and everything derived from it are provisional until the bought leg-panel yield is confirmed. A A$150,000 SEFA loan inside the ask (asked A$749,750, A$13,563 over the gap) is in code and on the QBE and SEFA rows but not yet ruled by Ben; it is not printed here until he rules. Not a confirmed current cash shortfall.</p>')

# ---------- Blockers ----------
rep('<td><strong>Alice Springs allocation decided; retain tranche evidence</strong></td><td>Ben</td><td>Both Commonwealth tranches are for Alice Springs, outside the two QBE sites, so this does not release QBE money for beds or close the gap. Approval and receipt evidence remain separate for each tranche.</td>',
    '<td><strong>REAL acceptance: where it stands</strong></td><td>Tanya and Kristy</td><td>The Commonwealth money is one A$1,695,000 offer to Oonchiumpa, agreement not executed, no cash. Alice Springs is outside the two QBE sites, so it does not release QBE money for beds or close the gap. Once executed, Oonchiumpa pays Goods A$150,000 to develop the facility.</td>')
rep('which Nic holds and which fixes the A$276.</td>', 'which Nic holds and which fixes the A$262.</td>')
rep('<td><strong>Kristy Bloomfield’s related-party minute</strong></td><td>Board, 14 September</td><td>QBE Q8 and Q22.</td></tr>',
    '<td><strong>Kristy Bloomfield’s related-party minute</strong></td><td>Zandra</td><td>QBE Q8 and Q22. The 14 September minute, with board appointment dates and the full constitution (the ACNC copy stops at clause 17).</td></tr>')
rep('The recorded FY26 deficit is about A$42,854; EBITDA needs confirmation.', 'Butterfly’s FY26 report shows a loss of A$42,854 and cash of A$4,041; the declaration is unsigned.')

# ---------- Register / footer ----------
rep('<li><strong>The master (this page)</strong> <span class="small">artifact · 2026-09-14</span>', '<li><strong>The master (this page)</strong> <span class="small">artifact · 2026-09-15, version 14</span>')
rep('<footer>Built 2026-09-14 from the repo data', '<footer>Version 14, built 2026-09-15 from the 14 September master with the 15 September money (finance worktree modules, uncommitted loan changes excluded) and the bed, stack and knobs from the 15 September rebuild. The 14 September master was built from the repo data')

# ---------- New screen: the bed, the stack and the knobs (from v13) ----------
def between(src, a, b):
    i = src.index(a); j = src.index(b, i)
    return src[i:j]
bed = between(v13, '<section class="screen" id="bed">', '<section class="screen" id="model">')
stack = between(v13, '<section class="screen" id="stack">', '<section class="screen" id="knobs">')
knobs = between(v13, '<section class="screen" id="knobs">', '<section class="screen" id="trade">')
trade = between(v13, '<section class="screen" id="trade">', '<section class="screen" id="asks">')
asks = between(v13, '<section class="screen" id="asks">', '<section class="screen" id="calendar">')
calendar = between(v13, '<section class="screen" id="calendar">', '<section class="screen" id="owed">')
owed = between(v13, '<section class="screen" id="owed">', '<section class="screen" id="questions">')
faq13 = between(v13, '<section class="screen" id="questions">', '<footer>') + '</section>'

def inner(sec):
    body = sec[sec.index('>')+1:]
    body = body[:body.rindex('</section>')]
    return body.replace('class="kicker"', 'class="eyebrow"').replace('<div class="rule"></div>', '').replace('class="stand"', 'class="lead"')
new_screen = ('<section class="screen" id="s-stack" aria-label="The bed, the stack and the knobs">\n  <h1>The bed, the stack, the knobs and the 15 September tables</h1>\n'
  '  <p class="lead">From the 15 September rebuild: the $750 bar, the funder switches, the two sliders, the five paid invoices, the fourteen application rows, the calendar, what is owed and by whom, and the short answers. Every figure is read from the finance worktree snapshot embedded in this page; none is typed.</p>\n'
  '  <div class="card">' + inner(bed) + '</div>\n  <div class="card">' + inner(stack) + '</div>\n  <div class="card">' + inner(knobs) + '</div>\n'
  '  <div class="card">' + inner(trade) + '</div>\n  <div class="card">' + inner(asks) + '</div>\n  <div class="card">' + inner(calendar) + '</div>\n  <div class="card">' + inner(owed) + '</div>\n'
  '  <div class="card">' + inner(faq13).replace('<h2>The answers as they stand.</h2>', '<h2>The answers as they stand, 15 September.</h2>') + '</div>\n</section>\n')
# v13 CSS for the controls (rename var names to v12 palette)
css13 = between(v13, '/* controls */', '/* stops */')
css13 = css13.replace('var(--paper-2)', 'var(--surface-2)').replace('var(--paper)', 'var(--surface)').replace('var(--muted)', 'var(--ink-3)').replace('var(--sage-2)', 'var(--green)').replace('var(--warn)', 'var(--bad)')
css13 += between(v13, '/* stops */', '/* flow svg */').replace('var(--paper-2)', 'var(--surface-2)') + '.photos{display:grid;gap:14px}@media(min-width:700px){.photos{grid-template-columns:repeat(4,1fr)}}.photos img{aspect-ratio:4/3;object-fit:cover;width:100%;border-radius:8px}.owner{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);font-weight:700}#s-stack dl.faq dt{font-size:18px}#s-stack dl.faq dd{color:var(--ink-2);margin:0 0 6px}' + '.tile{padding:14px 0;border-top:1px solid var(--rail)}.tile .n{font-family:var(--display);font-size:40px;line-height:1;font-weight:600}.tile .l{font-size:13.5px;color:var(--ink-2);margin-top:6px}.cur{font-weight:600;font-size:.72em;vertical-align:.08em}.g3{display:grid;gap:16px}@media(min-width:820px){.g3{grid-template-columns:repeat(3,1fr)}}\n'
rep('@media print{nav.tabs,.themebtn{display:none}', css13 + '@media print{nav.tabs,.themebtn{display:none}')
# nav + screen insertion after model
rep('<a id="t-model" href="#model">The model</a>', '<a id="t-model" href="#model">The model</a><a id="t-stack" href="#stack">Bed · stack · knobs</a>')
rep('<section class="screen" id="s-deck" aria-label="The deck">', new_screen + '<section class="screen" id="s-deck" aria-label="The deck">')
rep('var ids=["start","about","model","deck",', 'var ids=["start","about","model","stack","deck",')
# v13 script: M + helpers + bed bar + stack + knobs only
js = between(v13, 'const M = {', '/* raise table */')
js += between(v13[v13.index('<script>'):], '/* bed bar */', '/* nav + theme */')
js = 'const M = {' + js[len('const M = {'):]
# strip the withdrawn demand figures and the who-has-asked ladder from the embedded snapshot
js = re.sub(r'"RECORDED_DEMAND": \[.*?\n  \],\n', '"RECORDED_DEMAND": [],\n', js, flags=re.S)
js = re.sub(r'"DEMAND_CLAIM_CEILING": ".*?",\n', '', js)
js = re.sub(r' "asked": \{.*?\n \}\n\};', '};', js, flags=re.S)
assert 'Groote' not in js and 'NPY' not in js and 'Utopia",\n    "beds": 150' not in js, 'demand figures still in snapshot'

s = s.replace('</script>', '</script>\n<script>\n' + js + '\n</script>', 1) if s.count('</script>') == 1 else None
assert s, 'script insertion failed'


# ---------- Notion row differences carried (15 Sep) ----------
rep('<a href="#q-Q12"><span class="q">Q12</span> If a document above cannot be provided, explain why <span class="chip bad">Blocked</span></a>',
    '<a href="#q-Q12"><span class="q">Q12</span> If a document above cannot be provided, explain why <span class="chip ready">Withdrawn: constitution in hand</span></a>')
rep('<h2>If a document above cannot be provided, explain why</h2>\n        <span class="chip bad">Blocked</span>',
    '<h2>If a document above cannot be provided, explain why</h2>\n        <span class="chip ready">Withdrawn: constitution in hand</span>')
rep('<p class="small"><strong>Where it stands.</strong> Explain only genuine retrieval gaps. A Curious Tractor’s constitution is not Butterfly’s and cannot stand in for it. This is the only item blocking two questions, because Q22 needs the same document.</p>',
    '<p class="small"><strong>Where it stands.</strong> Withdrawn on 15 September: the constitution is in hand from the ACNC register (12 pages, to clause 17). The full signed copy is owed by Zandra. Nothing is now missing, so this answer is not needed unless another document fails.</p>')
rep('<p class="small"><strong>Where it stands.</strong> The constitution is unlocated and Q12 explains that. Assemble the control, delegation and conflict records. Community ownership stays a pathway until rights and transfers are evidenced.</p>',
    '<p class="small"><strong>Where it stands.</strong> The constitution is in hand (ACNC copy, 12 pages to clause 17; the full signed copy is owed by Zandra). Assemble the control, delegation and conflict records. Community ownership stays a pathway until rights and transfers are evidenced.</p>')
rep('<p class="small"><strong>Where it stands.</strong> The FY26 set is found and audit is not required. What is missing is current management cashflow for the entity and reconciled opening balances. A programme forecast is not entity cashflow.</p>',
    '<p class="small"><strong>Where it stands.</strong> The FY26 set is found and is unaudited at submission; the constitution (clause 12.1) requires an auditor’s report at each AGM, the audit is under way and the AGM is set for 12 October 2026. What is missing is current management cashflow for the entity and reconciled opening balances. A programme forecast is not entity cashflow.</p>')
rep('<p class="small"><strong>Where it stands.</strong> The authorised applicant assesses the ability to pay debts as they fall due, on current information. An old balance or a forecast does not establish it, and it must not be pre-ticked.</p>',
    '<p class="small"><strong>Where it stands.</strong> The authorised applicant assesses the ability to pay debts as they fall due, on current information. FY26 closing cash was $4,041 and the operating account on 15 September shows $264, so the declaration cannot rest on cash held; it rests on money contracted to arrive under the 12 September ruling. It must not be pre-ticked.</p>')
rep('Ben Knight runs the model, the money and the funder relationships. Making is paid work:',
    'Ben Knight runs the model, the money and the funder relationships. Both are employees of the applicant and hold no directorship. Making is paid work:')
rep('<p><strong>Contact person.</strong> [Ben Knight or Nic Marchesi. Ben decides who signs. Phone and email stay off this page.]</p>',
    '<p><strong>Contact person.</strong> [Ben Knight or Nic Marchesi. Ben decides who signs. Phone and email stay off this page.] Both are employed by the applicant to run Goods on Country and hold no directorship.</p>')
rep('<p class="big">9 <span class="small">written and checker-clean of 21 groups</span></p>\n      <p class="small">1 ready pending a check · 6 owed a document · 4 only a person can answer · 1 blocked.',
    '<p class="big">25 <span class="small">answers written on the Notion row</span></p>\n      <p class="small">Every question has an answer on the opportunity record. What is left is documents (constitution signed copy, 14 September minute, site letters, cashflow, audited FY26) and the four declarations. Nothing is blocked.')



# ---------- Ben, 15 Sep 11:20: round everywhere ($600,000 asked, $300,000 beds); applications keep exact ----------
rep('<p class="small">Asked A$599,750: QBE A$300,000, Tim Fairfax A$100,000, Brian M. Davis A$99,750, Snow A$100,000 unsent.',
    '<p class="small">Asked A$600,000: QBE A$300,000 for two plants and A$300,000 of beds (Tim Fairfax A$100,000, Brian M. Davis A$99,750, Snow A$100,000 unsent). The applications carry the exact figures, A$599,750 in all; every other surface rounds (Ben, 15 September).')
rep('Facilitation and freight sit inside the price. Asked A$599,750. Nothing is signed yet.</span></li>',
    'Facilitation and freight sit inside the price. Asked A$600,000. Nothing is signed yet.</span></li>')
rep('<dt>Is A$599,750 the income? </dt><dd>No. It is the raise: QBE A$300,000 for two production facilities, and A$299,750 of other grants buying beds,',
    '<dt>Is A$600,000 the income? </dt><dd>No. It is the raise: QBE A$300,000 for two production facilities, and A$300,000 of other grants buying beds,')
rep('The other A$299,750 buys the first 400 beds at The Harvest Plant,', 'The other A$300,000 buys the first 400 beds at The Harvest Plant,')
rep('<tr><td>Asked</td><td class="n">A$599,750</td></tr>', '<tr><td>Asked</td><td class="n">A$600,000 on the sheet; A$599,750 on the applications</td></tr>')
rep('<tr><td>Asked, four lines</td><td class="n">A$599,750 (A$499,750 with Snow unsent)</td></tr>',
    '<tr><td>Asked, four lines</td><td class="n">A$600,000 rounded; A$599,750 exact on the applications (A$499,750 with Snow unsent)</td></tr>')
rep('Every figure is read from the finance worktree snapshot embedded in this page; none is typed.</p>',
    'Every figure is read from the finance worktree snapshot embedded in this page; none is typed. These tables carry the exact asks (A$99,750 a grant, A$599,750 in all); the placemat and the pitch round to A$600,000.</p>')
rep('Centre of the loop: “Community-owned trade”, unconfirmed as the title.', 'Centre of the loop: “Made and sold in community” (Ben, 15 September).')

# ---------- tells gate ----------
rep('Not ours. Disclosed, never counted.', 'Not ours. Disclosed and never counted.')
rep('Community partners are independent organisations with their own boards, never part of the charity.', 'Community partners are independent organisations with their own boards and sit outside the charity.')
rep('Scabies and rheumatic heart disease are the reason, never a claimed result.', 'Scabies and rheumatic heart disease are the reason for the work. We claim no result from it.')
rep('Now: “What we will measure, not what we assume.”', 'Now: “What we will measure.”')
rep('Four quiet evidence areas. Describe measures, not promised outcomes.', 'Four quiet evidence areas. Describe measures. Promise no outcomes.')
rep('AUD 150,000 per site is a planning allowance, not a quote. Sites, costs and agreements remain to settle.', 'AUD 150,000 per site is a planning allowance and no site has been quoted. Sites, costs and agreements remain to settle.')
rep('Leverage is answered as a sequence with a condition on every link, never as a multiplier.', 'The catalytic question is answered as a sequence with a condition on every link. No multiplier is claimed.')
rep('Ben and Nic are employees, not directors. A Curious Tractor’s', 'Ben and Nic are employees and hold no directorship. A Curious Tractor’s')
rep('<td class="">A curated count, not derived from rows</td>', '<td class="">A curated count. It is held separately from the bed rows</td>')
rep('Disclosed at Q1, Q2, Q8 and Q14, never counted. NIAA Local Investments, up to A$150,000 an activity, is an open door, not an invitation.', 'Disclosed at Q1, Q2, Q8 and Q14 and never counted. NIAA Local Investments, up to A$150,000 an activity, is an open door; no invitation has been issued.')
rep('<p class="small">A price model, never cost-plus. The make cost', '<p class="small">A price model. Cost-plus is never used. The make cost')
rep('<p class="small">Context, not results. None of these is an outcome of Goods’ work.</p>', '<p class="small">Context only. None of these is an outcome of Goods’ work.</p>')
rep('<p><strong>A$300,000 for two proposed production facilities.</strong> A$150,000 per site is a planning allowance, not a quote.', '<p><strong>A$300,000 for two proposed production facilities.</strong> A$150,000 per site is a planning allowance and no site has been quoted.')
rep('<p class="small">Rules and records, not surfaces to send.</p>', '<p class="small">Rules and records. Send nobody these.</p>')
rep('<p class="small">In the artifact list, not in the raise.</p>', '<p class="small">In the artifact list and outside the raise.</p>')

# ---------- guards ----------
sg = re.sub(r'data:[^"]{200,}', 'DATA', s)
for bad in ['provisional 628', '$276', '$474', '747,950', '247,950', '147,950', 'A$500,000 to 600,000', '80 beds', 'A$40,000 of youth', 'second A$150,000', 'A$150,000 approved', 'Groote', 'NPY', '200 to 350']:
    if bad in sg:
        idx = [m.start() for m in re.finditer(re.escape(bad), sg)]
        ok = all('withdrawn' in sg[i-400:i+400] for i in idx)
        if not ok:
            misses.append('LEFTOVER ' + bad + f' x{len(idx)}')
if misses:
    print('MISSES:'); [print(' -', m) for m in misses]; sys.exit(1)
(here / 'v14.html').write_text(s)
print('ok', len(s), 'bytes')
