/**
 * One drawing carried over from The Model artifact (051b93d2, 12 September 2026), with one word
 * changed: Witta is the Goods on Country facility in Queensland on every surface. It relies on the CSS variables the master
 * defines (--goods, --community, --gold, --bad, --surface-2, --rail, --ink, --ink-2, --ink-3,
 * --display). Its figures are the 11 September money, which the master labels legacy pending the
 * flat-pack route costing. The capital drawing was dropped on 14 September: it drew facilitation
 * as a separate A$40,000 line, and Ben ruled that facilitation sits inside the price of a bed.
 */

export const TWO_LOOPS_SVG = `<svg viewBox="0 0 1000 470" role="img" aria-label="Two loops. Catalytic capital funds the Goods loop, which closes on trade. Institutional buyers fund the community loop, which closes in community. Beds cross one way and money does not cross back.">
  <defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="currentColor"/></marker></defs>
  <g style="color:var(--goods)">
    <ellipse cx="252" cy="250" rx="176" ry="140" fill="none" stroke="currentColor" stroke-width="2.6" opacity=".45"/>
    <path d="M252 110 A176 140 0 0 1 396 200" fill="none" stroke="currentColor" stroke-width="3.2" marker-end="url(#m1)"/>
    <path d="M414 296 A176 140 0 0 1 252 390" fill="none" stroke="currentColor" stroke-width="3.2" marker-end="url(#m1)"/>
    <path d="M90 314 A176 140 0 0 1 90 186" fill="none" stroke="currentColor" stroke-width="3.2" marker-end="url(#m1)"/>
  </g>
  <text x="252" y="246" text-anchor="middle" font-family="var(--display)" font-size="25" font-weight="600" fill="var(--goods)">The Goods loop</text>
  <text x="252" y="270" text-anchor="middle" font-size="13" fill="var(--ink-2)">paid beds carry it (provisional 628 a year)</text>
  <g style="color:var(--community)">
    <ellipse cx="748" cy="250" rx="176" ry="140" fill="none" stroke="currentColor" stroke-width="2.6" opacity=".45"/>
    <path d="M748 110 A176 140 0 0 1 898 208" fill="none" stroke="currentColor" stroke-width="3.2" marker-end="url(#m1)"/>
    <path d="M906 300 A176 140 0 0 1 748 390" fill="none" stroke="currentColor" stroke-width="3.2" marker-end="url(#m1)"/>
    <path d="M592 314 A176 140 0 0 1 592 186" fill="none" stroke="currentColor" stroke-width="3.2" marker-end="url(#m1)"/>
  </g>
  <text x="748" y="246" text-anchor="middle" font-family="var(--display)" font-size="25" font-weight="600" fill="var(--community)">The community loop</text>
  <text x="748" y="270" text-anchor="middle" font-size="13" fill="var(--ink-2)">the organisation keeps the whole sale</text>
  <g font-size="12.5" fill="var(--ink)">
    <rect x="140" y="74" width="224" height="46" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="252" y="95" text-anchor="middle" font-weight="700">Catalytic capital</text>
    <text x="252" y="111" text-anchor="middle" font-size="11" fill="var(--ink-2)">QBE, Tim Fairfax, Brian M. Davis, Snow</text>
    <rect x="300" y="192" width="176" height="46" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="388" y="220" text-anchor="middle" font-weight="700">Made in Queensland</text>
    <rect x="140" y="382" width="224" height="48" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="252" y="402" text-anchor="middle" font-weight="700">Goods paid $750 a bed</text>
    <text x="252" y="419" text-anchor="middle" font-size="11" fill="var(--ink-2)">$276 makes it &middot; $474 carries the business &middot; both provisional</text>
    <rect x="26" y="192" width="176" height="46" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="114" y="220" text-anchor="middle" font-weight="700">The next bed</text>
    <rect x="636" y="74" width="224" height="46" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="748" y="95" text-anchor="middle" font-weight="700">First stock arrives</text>
    <text x="748" y="111" text-anchor="middle" font-size="11" fill="var(--ink-2)">100 beds, in each of four communities</text>
    <rect x="806" y="192" width="176" height="46" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="894" y="220" text-anchor="middle" font-weight="700">Buyers pay</text>
    <rect x="636" y="382" width="224" height="48" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="748" y="402" text-anchor="middle" font-weight="700">Local capital</text>
    <text x="748" y="419" text-anchor="middle" font-size="11" fill="var(--ink-2)">$75,000 a pool if all sold, and it stays there</text>
    <rect x="524" y="192" width="176" height="46" rx="4" fill="var(--surface-2)" stroke="var(--rail)"/>
    <text x="612" y="220" text-anchor="middle" font-weight="700">Local production</text>
  </g>
  <g style="color:var(--gold)"><path d="M448 88 C 510 66, 570 66, 622 84" fill="none" stroke="currentColor" stroke-width="3.6" marker-end="url(#m1)"/></g>
  <text x="534" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="var(--gold)">beds cross</text>
  <g style="color:var(--bad)">
    <path d="M620 442 C 550 462, 450 462, 380 442" fill="none" stroke="currentColor" stroke-width="2.6" stroke-dasharray="8 8" opacity=".7"/>
    <line x1="482" y1="440" x2="508" y2="466" stroke="currentColor" stroke-width="3.6"/>
    <line x1="508" y1="440" x2="482" y2="466" stroke="currentColor" stroke-width="3.6"/>
  </g>
</svg>`;
