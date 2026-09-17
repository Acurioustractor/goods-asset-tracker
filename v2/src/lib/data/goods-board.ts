/**
 * The directors of Goods on Country Ltd, formerly The Butterfly Movement Ltd. Roles: DECISIONS.md
 * AA (5 September 2026). Biographies reviewed 7 September 2026
 * (thoughts/shared/handoffs/2026-09-07-goods-board-profiles.md). Kristy's portrait is the Goods
 * portrait library; Audrey's and Jeremy's are their official profile photographs, credited, held
 * locally so the page needs no remote image host. The board handover is in progress and no chair
 * has been appointed; do not print one.
 */
export interface GoodsDirector {
  name: string;
  role: 'Director';
  location: string;
  country: string;
  photo: string;
  bio: string;
  goods?: string;
  background: string;
  source: string;
  sourceLabel: string;
}

export const goodsBoard: readonly GoodsDirector[] = [
  {
    name: 'Kristy Bloomfield',
    role: 'Director',
    location: 'Mparntwe / Alice Springs, Northern Territory',
    country: 'Arrernte Country',
    photo: '/images/people/kristy-bloomfield.jpg',
    bio: 'Kristy is a director of Oonchiumpa, an Aboriginal community-controlled organisation in Alice Springs. Her work brings Traditional Owner authority, cultural knowledge and young people’s futures into the decisions made on Arrernte Country.',
    goods: 'Alongside her board role, Kristy leads the Oonchiumpa relationship: designing products in community and developing the Alice Springs production and youth training pathway.',
    background: 'Cultural leadership, community-led design, youth pathways and On-Country enterprise.',
    source: 'https://www.oonchiumpa.com.au/',
    sourceLabel: 'Oonchiumpa',
  },
  {
    name: 'Audrey Deemal',
    role: 'Director',
    location: 'Hope Vale / Cape York, Queensland',
    country: 'Dhirrtharr Warra woman from Hope Vale',
    photo: '/images/people/audrey-deemal-official.jpg',
    bio: 'Audrey joined Cape York Partnership in 2011, leading the Hope Vale Opportunity Hub before managing Opportunity Products and Cape Operations. Her published profile lists her as an advisor with Cape York Solutions, chair of Ngak Min Health and a non-executive director of Bama Services. She was a 2023 Westpac Social Change Fellow.',
    background: 'Community leadership, health governance, operational management and social enterprise.',
    source: 'https://capeyorkpartnership.org.au/person/audrey-deemal/',
    sourceLabel: 'Cape York Partnership profile',
  },
  {
    name: 'Jeremy Donovan',
    role: 'Director',
    location: 'Works across Australia; current base to confirm',
    country: 'Kuku-Yalanji and Gumbaynggirr',
    photo: '/images/people/jeremy-donovan-official.jpg',
    bio: 'Jeremy is a keynote speaker, artist and musician. His work connects Aboriginal culture with leadership, reconciliation and conversations between communities and organisations. He shares his experience through speaking, visual art and didgeridoo performance in Australia and internationally.',
    background: 'Cultural leadership, communication, reconciliation, music and visual arts.',
    source: 'https://jeremydonovan.com/',
    sourceLabel: 'Jeremy’s official profile',
  },
];
