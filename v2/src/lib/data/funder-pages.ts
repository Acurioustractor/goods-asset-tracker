/**
 * Funder landing pages. Password-gated investor briefs.
 *
 * To add a new funder:
 *  1. Add an entry below with a unique slug and password
 *  2. Share the URL `/funders/<slug>` and password with the funder
 *  3. (Optional) Override `intro`, `ask`, `whyUs` to tailor the page
 *
 * Shared content (capital stack, buyer pipeline, traction stats) lives in
 * `funder-shared-content.ts`. Only the funder-specific parts get overridden here.
 */

export interface AskOption {
  instrument: string;      // e.g. "Recoverable grant"
  amount: string;          // e.g. "$840K"
  purpose: string;         // one-line use of funds
  label?: string;          // e.g. "Option A. Working capital"
}

export interface FacilitySection {
  title: string;           // e.g. "Facilities on Country"
  intro: string;           // explanation of the infrastructure pathway
  heroImage?: string;      // path to a hero image shown above the facility section
  heroImageAlt?: string;   // alt text for the hero image
  supportImages?: { src: string; alt: string; caption?: string }[]; // supporting image strip
  components: string[];    // what the infrastructure includes
  becomes: string[];       // what it grows into / community ownership pathway
}

export interface ClosingVideo {
  title: string;           // e.g. "Fred Campbell, Oonchiumpa"
  src: string;             // path to a video file or iframe embed URL
  embed?: boolean;         // true if `src` is an iframe URL (Descript, YouTube, Vimeo)
  poster?: string;         // poster image path (only used for native video)
  caption?: string;        // short caption under the video
}

export interface FunderPage {
  slug: string;
  password: string;
  name: string;            // e.g. "Minderoo Foundation"
  contactName?: string;    // person we're addressing
  /**
   * Key into FUNDER_URL_MAP from `funder-url-map.ts`. When set, the page
   * features the recommended storyteller voice for this funder type and
   * surfaces the recommended next-step URL.
   */
  urlMapKey?: string;
  ask: AskOption;          // primary ask
  alternativeAsks?: AskOption[]; // additional or alternative ask options
  facility?: FacilitySection;    // optional infrastructure pathway section
  intro: string;           // 2-3 sentence opening tailored to the funder
  whyUs: string[];         // 3-5 bullets on why this funder specifically
  closeBy?: string;        // target close date for this conversation
  meetingAsk?: string;     // what we want from the first meeting
  closingVideo?: ClosingVideo; // optional video shown at the end of the page
}

export const FUNDER_PAGES: FunderPage[] = [
  {
    slug: 'minderoo',
    password: 'minderoo2026',
    name: 'Minderoo Foundation',
    urlMapKey: 'minderoo-foundation',
    ask: {
      label: 'Option A. Grant',
      instrument: 'Non-repayable grant',
      amount: '$840K',
      purpose:
        'Funds the On-Country manufacturing facility fit-out outright. The site (Townsville, Tennant Creek, Alice Springs, or another location chosen with the community partner depending on need and opportunity) becomes a permanent community-owned asset. Simplest instrument, fastest path to operational, no repayment schedule to negotiate.',
    },
    alternativeAsks: [
      {
        label: 'Option B. Loan',
        instrument: 'Recoverable grant or low-interest loan',
        amount: '$840K',
        purpose:
          'Same dollar figure, structured as a recoverable instrument repaid out of bed revenue across the existing buyer pipeline over two to three years. Anchors working capital while we ramp production and lets Minderoo recycle the capital into the next deal.',
      },
      {
        label: 'Option C. Blend',
        instrument: 'Grant plus loan',
        amount: '$1.5M',
        purpose:
          '$840K non-repayable for the facility fit-out, plus $660K recoverable working capital to ramp production once the plant is built. Funds the bricks and mortar AND the cashflow runway in a single commitment. The most catalytic version: fully meets the QBE match and de-risks SEFA in one move.',
      },
    ],
    facility: {
      title: 'Facilities on Country',
      intro:
        "The On-Country manufacturing facility is the asset Minderoo is funding. The building, the plant, the people, and the platform. The site is open: Townsville, Tennant Creek, Alice Springs, or another location chosen with the community partner depending on need and opportunity. Once it is built, it does not go away. It becomes the infrastructure that lets community-owned production exist, and the foundation that everything else Goods (and other On-Country enterprises) grows from.",
      heroImage: '/images/process/facility-full-site.jpg',
      heroImageAlt: 'The full production facility: shipping container workshops with HDPE press, CNC cutter, and assembly stations',
      supportImages: [
        { src: '/images/process/heat-press-full.jpg', alt: 'HDPE heat press inside the production container', caption: 'HDPE heat press. Shredded recycled plastic in, pressed sheets out.' },
        { src: '/images/process/shredder-granulator.jpg', alt: 'Industrial plastic shredder', caption: 'Shredder and granulator. Household plastic waste collected locally and processed On Country.' },
        { src: '/images/process/cnc-router-full.jpg', alt: 'CNC router cutting bed leg components', caption: 'CNC router cutting Stretch Bed leg components from the pressed HDPE sheets.' },
        { src: '/images/process/pressed-sheets-stacked.jpg', alt: 'Pressed HDPE sheets stacked ready for cutting', caption: 'Pressed HDPE sheets stacked and ready. 20kg of recycled plastic per bed.' },
        { src: '/images/process/cut-legs-stored.jpg', alt: 'Finished bed legs stored ready for assembly', caption: 'Finished leg components stored ready for assembly and dispatch.' },
        { src: '/images/process/parts-rack-sorted.jpg', alt: 'Parts rack with sorted bed components', caption: 'Sorted parts rack. Every bed leaves the facility flat-packed and ready to assemble in five minutes.' },
      ],
      components: [
        'Industrial shed and fit-out on community-controlled land. Site selected with the community partner based on need, demand, and existing infrastructure',
        'HDPE shred, melt and press line. This is what turns collected plastic waste into Stretch Bed leg components, On Country',
        'Canvas cutting and sewing station for the bed surfaces',
        'Steel pole cut-and-finish station',
        'Assembly, QA and dispatch bay',
        'Training area for On-Country apprentices and Elder co-design sessions',
        'Year one operating costs: power, materials buffer, four local FTE wages, site supervisor',
      ],
      becomes: [
        'A community-owned manufacturing asset producing 1,500+ beds a year, with the revenue staying On Country',
        'A training pipeline for young people moving from CDP and Work-for-the-Dole into real wages and trade skills',
        'A circular-economy hub where household plastic waste gets collected and processed locally, ending the rubbish-to-landfill pattern in remote communities',
        'A platform that other On-Country product lines can plug into (washing machine assembly and repair, modular furniture, water tank components)',
        'Aboriginal-controlled IP and design files. Open-sourced where appropriate, licensed where it generates ongoing community revenue',
        "A physical demonstration site that funders, government and procurement buyers can actually visit and walk through. Turns Goods's story into something tangible.",
      ],
    },
    intro:
      "Goods on Country is a First Nations led social enterprise making the Stretch Bed: a flat-pack, washable, 10-year bed built from recycled HDPE, galvanised steel and Australian canvas, designed for remote Indigenous communities. We're in the QBE Catalysing Impact 2026 cohort, putting together a $3M blended capital stack to build the On-Country manufacturing facility and meet the institutional buyer demand we already have on the table.",
    whyUs: [
      "DGR1 status. Minderoo can count sub-market returns toward grant targets without the concessional treatment penalty.",
      'Self-servicing economics. At roughly $750 a bed with cost-to-make well below sale price, the recoverable portion pays itself back across the existing buyer pipeline within two to three years.',
      "Catalytic position. Your commitment is what activates SEFA's senior debt and triggers QBE's $400K dollar-for-dollar match.",
      "Aligned to Minderoo's existing playbook. You've done recoverable grants like this before, and Goods is a clean fit.",
      "First Nations led, On-Country manufacturing. Direct alignment with Minderoo's Generation One and Thrive by Five priorities.",
    ],
    closeBy: 'End of June 2026, to align with the QBE Stage 2 match',
    meetingAsk:
      'A 30-minute call in the next two weeks with whoever leads recoverable grants or program-related investments at Minderoo, to walk through the numbers and the facility plan.',
    closingVideo: {
      title: 'Fred Campbell, Oonchiumpa',
      src: 'https://share.descript.com/embed/YQwAcYfxzkn',
      embed: true,
      caption: 'Fred from the Oonchiumpa Bloomfield family on why community-led manufacturing matters and the path to ownership.',
    },
  },
  {
    slug: 'paul-ramsay',
    password: 'pramsay2026',
    name: 'Paul Ramsay Foundation',
    urlMapKey: 'paul-ramsay-foundation',
    ask: {
      instrument: 'Recoverable grant + program funding',
      amount: '$500K',
      purpose: 'Working capital for community deployments plus outcome measurement',
    },
    intro:
      "Goods on Country is a First Nations led social enterprise making the Stretch Bed: a 10-year, washable, flat-pack bed designed for remote Indigenous housing. We're approaching PRF as part of a $3M blended capital raise through the QBE Catalysing Impact 2026 program, with a focus on the disadvantage and housing outcomes alignment that's central to PRF's mission.",
    whyUs: [
      "Direct alignment with the PRF disadvantage pillar. Quality, durable furniture is a measurable lever for housing outcomes in remote Australia.",
      "Outcomes data is already flowing. Telemetry from the washing machines and the bed deployment tracking system gives PRF measurable impact reporting from day one.",
      "Catalytic position. Joins SEFA, QBE and Minderoo in a coordinated stack that PRF doesn't have to assemble alone.",
      "First Nations leadership and On-Country manufacturing creates jobs in the communities being served.",
    ],
    closeBy: 'End of July 2026',
    meetingAsk:
      'A 30-minute introductory call with the program team responsible for housing or remote disadvantage portfolios.',
  },
  {
    slug: 'tim-fairfax',
    password: 'tfairfax2026',
    name: 'Tim Fairfax Family Foundation',
    urlMapKey: 'tim-fairfax-family-foundation',
    ask: {
      instrument: 'Program grant',
      amount: '$300K',
      purpose: 'Community deployment plus Elder-led co-design program in NPY lands',
    },
    intro:
      "Goods on Country makes the Stretch Bed (a flat-pack, washable, 10-year bed for remote Indigenous communities) and the Pakkimjalki Kari washing machine, named in Warumungu by Elder Dianne Stokes. We're approaching TFFF for community deployment funding aligned with your remote and First Nations focus, as part of our QBE Catalysing Impact 2026 capital raise.",
    whyUs: [
      "TFFF's remote and First Nations focus matches our deployment geography exactly: NPY lands, Tennant Creek, Groote Eylandt, Arnhem Land.",
      'Elder-led co-design is built into the product. Dianne Stokes named the washing machine, and community feedback shapes every iteration.',
      "Active deployments with NPY Women's Council, Miwatj Health and Centrecorp give TFFF visible, photographable impact.",
      'Clean 30% co-funding fit alongside QBE, Snow Foundation and existing grants.',
    ],
    closeBy: 'End of June 2026',
    meetingAsk: 'A short call with the program team to walk through the deployment plan and outcomes framework.',
  },
];

export function getFunderPage(slug: string): FunderPage | undefined {
  return FUNDER_PAGES.find((f) => f.slug === slug);
}
