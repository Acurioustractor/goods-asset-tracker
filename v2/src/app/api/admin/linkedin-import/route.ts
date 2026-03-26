/**
 * POST /api/admin/linkedin-import
 *
 * Import LinkedIn commenters as GHL contacts with linkedin-supporter tags.
 * Matches existing contacts by name (since we don't have emails from LinkedIn).
 */
import { NextResponse } from 'next/server';

const GHL_API_KEY = process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

interface LinkedInCommenter {
  name: string;
  headline: string;
  linkedinUrl: string;
  tier: 'hot' | 'strategic' | 'warm';
  category: string;
  postsEngaged: string[];
  context: string;
}

// All commenters from LinkedIn scrape 2026-03-26
const LINKEDIN_COMMENTERS: LinkedInCommenter[] = [
  // TIER 1: HOTTEST — Multi-post engagers
  { name: 'Tahlia Isaac', headline: '2026 Westpac Social Change Fellow | CEO & Founder | Formerly Incarcerated', linkedinUrl: 'https://www.linkedin.com/in/tahliaisaac', tier: 'hot', category: 'social-enterprise', postsEngaged: ['nic-tribute', 'alice-springs', 'goods-bed-imagine'], context: 'Westpac Fellow with lived experience — 3 posts engaged' },
  { name: 'Tara Castle', headline: 'CEO at Queensland Community Foundation', linkedinUrl: 'https://www.linkedin.com/in/tara-castle', tier: 'hot', category: 'philanthropy', postsEngaged: ['stretch-bed', 'palm-island'], context: 'QCF CEO — direct funding pathway, husband has Palm Island connection' },
  { name: 'Misty Carey', headline: 'TIDE Education founder, Nurse, Educator & Public Speaker', linkedinUrl: 'https://www.linkedin.com/in/misty-carey-149858128', tier: 'hot', category: 'health-education', postsEngaged: ['goods-bed-v3', 'contained-cta'], context: 'Said "I\'ll message you" — shared diesel/mattress story' },
  { name: 'Salli Cohen', headline: 'Doing work I care about, with people I value, to create change that matters', linkedinUrl: 'https://www.linkedin.com/in/salli-cohen', tier: 'hot', category: 'social-impact', postsEngaged: ['goods-bed-v3', 'palm-island'], context: 'Engaged on both Goods bed AND Palm Island' },
  { name: 'Natalie Chiappazzo', headline: 'Social Impact | Youth Practice Specialist | Solutionary', linkedinUrl: 'https://www.linkedin.com/in/natalie-chiappazzo-170140174', tier: 'hot', category: 'youth-justice', postsEngaged: ['nic-tribute', 'contained-tour'], context: 'Suggested submitting CONTAINED to Youth Justice Inquiry' },
  { name: 'Eloise Hall', headline: 'CEO + Co-founder of TABOO | Social Enterprise Expert in Residence | EY Impact Entrepreneur', linkedinUrl: 'https://www.linkedin.com/in/eloise-hall122', tier: 'hot', category: 'social-enterprise', postsEngaged: ['nic-tribute', 'contained-tour'], context: 'Social enterprise CEO, tagged Flinders Uni for support' },
  { name: 'Christine Thomas', headline: 'Healing-Centred CEO & Community Catalyst | First Nations', linkedinUrl: 'https://www.linkedin.com/in/christine-thomas-618b83119', tier: 'hot', category: 'first-nations', postsEngaged: ['palm-island', 'things-connected'], context: 'First Nations leader, deeply engaged' },
  { name: 'Preye Kari', headline: 'CEO at Invisible Forces', linkedinUrl: 'https://www.linkedin.com/in/preyekari', tier: 'hot', category: 'business', postsEngaged: ['stretch-bed', 'things-connected'], context: 'Business systems thinker, engaged on product + parenting' },
  { name: 'Richard De Martin', headline: 'Creative Director @ Cultures In Action Consulting', linkedinUrl: 'https://www.linkedin.com/in/richard-de-martin-99aa9547', tier: 'hot', category: 'creative', postsEngaged: ['tennant-creek', 'alice-springs'], context: 'Creative director with cultural focus' },
  { name: 'Sally Davison', headline: 'Digital Global Transformation | Project Management', linkedinUrl: 'https://www.linkedin.com/in/sally-davison-73ba37a7', tier: 'hot', category: 'supporter', postsEngaged: ['washing-machine', 'urapuntja'], context: 'Consistent supporter across washing machine + bed building' },
  { name: 'Tina Alexandra', headline: 'Student at Griffith University', linkedinUrl: 'https://www.linkedin.com/in/tina-alexandra-67330016b', tier: 'hot', category: 'supporter', postsEngaged: ['stretch-bed', 'tennant-creek'], context: 'Passionate supporter with bold ideas' },

  // TIER 2: STRATEGIC — High-value single engagers
  // Politicians & Government
  { name: 'Chansey Paech', headline: 'Member for Gwoja | Former NT Deputy Chief Minister & Attorney General', linkedinUrl: 'https://www.linkedin.com/in/chanseypaechmla', tier: 'strategic', category: 'politician', postsEngaged: ['nic-tribute'], context: 'NT politician — key ally for NT operations' },
  { name: 'Jonty Bush', headline: 'Member for Cooper - Queensland Parliament', linkedinUrl: 'https://www.linkedin.com/in/jonty-bush-52431758', tier: 'strategic', category: 'politician', postsEngaged: ['contained-tour'], context: 'Asked "where touring in QLD?" — actively interested' },
  { name: 'Robert Tickner', headline: 'Chair Justice Reform Initiative | Former Minister for Aboriginal Affairs', linkedinUrl: 'https://www.linkedin.com/in/roberttickner1', tier: 'strategic', category: 'politician', postsEngaged: ['contained-tour'], context: 'Wants to drive CONTAINED to Canberra for PM' },
  { name: 'Megan Argent', headline: 'Clinical Practice Leader - Dept of Youth Justice', linkedinUrl: 'https://www.linkedin.com/in/megan-argent-54b763109', tier: 'strategic', category: 'government', postsEngaged: ['contained-tour'], context: 'Inside youth justice — "Townsville absolutely needs this"' },

  // Philanthropy & Funding
  { name: 'Alexandra Lagelee Kean', headline: 'Philanthropy | Snow Foundation | Non-Executive Director', linkedinUrl: 'https://www.linkedin.com/in/alexandralageleekean', tier: 'strategic', category: 'philanthropy', postsEngaged: ['stretch-bed'], context: 'Snow Foundation — already connected via Tennant Creek' },
  { name: 'Bradley Clair', headline: 'Co-Founder PowerWells | QCF Innovation Philanthropist of Year 2022', linkedinUrl: 'https://www.linkedin.com/in/bradleyclair', tier: 'strategic', category: 'philanthropy', postsEngaged: ['goods-bed-imagine'], context: 'Has seen bed in person' },
  { name: 'Nick Miller', headline: 'Managing Partner, Fortitude Investment Partners (~$330m FUM)', linkedinUrl: 'https://www.linkedin.com/in/nickmillerfortitude', tier: 'strategic', category: 'investor', postsEngaged: ['stretch-bed'], context: 'PE partner engaged on product post' },
  { name: 'Rikki Andrews', headline: 'Philanthrocrat and Collective Giving Advocate', linkedinUrl: 'https://www.linkedin.com/in/rikki-andrews-2943b353', tier: 'strategic', category: 'philanthropy', postsEngaged: ['contained-diagrama'], context: 'Philanthropy-focused' },
  { name: 'Adam Robinson', headline: 'Chief of Impact / Founder at StreetSmart Australia', linkedinUrl: 'https://www.linkedin.com/in/adamsrobinson1', tier: 'strategic', category: 'philanthropy', postsEngaged: ['goods-bed-v3'], context: '"Great to be part of the journey" — existing supporter' },

  // Social Enterprise & Impact
  { name: 'Amy Orange', headline: 'Social Enterprise Strategist | Collab4Good | Adelaide', linkedinUrl: 'https://www.linkedin.com/in/amy-orange-32853953', tier: 'strategic', category: 'social-enterprise', postsEngaged: ['contained-tour'], context: 'Offered Adelaide support, works in justice space' },
  { name: 'Rebecca Keeley', headline: 'Founder Yarn Speech | Oxford MBA | Kenneth Myer Innovation Fellow', linkedinUrl: 'https://www.linkedin.com/in/rebecca-keeley', tier: 'strategic', category: 'social-enterprise', postsEngaged: ['goods-bed-v3'], context: '"Genuinely enjoying the evolution of your beds" — long-term follower' },
  { name: 'Sheryl Batchelor', headline: 'Founder/CEO Yiliyapinya Indigenous Corporation', linkedinUrl: 'https://www.linkedin.com/in/sheryl-batchelor-96875084', tier: 'strategic', category: 'first-nations', postsEngaged: ['contained-cta'], context: 'Indigenous org CEO, suggested public campaign' },
  { name: 'Nathaniel Diong', headline: 'CEO Future Minds Network | Forbes 30u30', linkedinUrl: 'https://www.linkedin.com/in/nathaniel-diong-%F0%9F%9A%80-b26914161', tier: 'strategic', category: 'social-enterprise', postsEngaged: ['urapuntja'], context: 'Young leader with platform' },

  // Academics & Researchers
  { name: 'Katrina Raynor', headline: 'Housing Scholar and Social Research Expert', linkedinUrl: 'https://www.linkedin.com/in/dr-katrina-kate-raynor-27634a54', tier: 'strategic', category: 'academic', postsEngaged: ['contained-tour'], context: 'Suggested Melbourne Design Week installation' },
  { name: 'Erika Martino', headline: 'VicHealth Postdoctoral Research Fellow', linkedinUrl: 'https://www.linkedin.com/in/erika-martino-melbourne', tier: 'strategic', category: 'academic', postsEngaged: ['contained-tour'], context: 'Suggested meanwhile-use site on govt land' },
  { name: 'Hayley Passmore', headline: 'Criminology Lecturer | Churchill Fellow | TEDx Speaker', linkedinUrl: 'https://www.linkedin.com/in/hayleympassmore', tier: 'strategic', category: 'academic', postsEngaged: ['contained-tour'], context: '"Can\'t wait to have this in Perth"' },
  { name: 'John Mendoza', headline: 'Co Director ConNetica | Mental Health, Suicide Prevention', linkedinUrl: 'https://www.linkedin.com/in/john-mendoza-553aa718b', tier: 'strategic', category: 'academic', postsEngaged: ['tennant-creek'], context: 'Visited Tennant Creek, impressed by community-led solutions' },
  { name: 'Simon Matuzelski', headline: 'Manager Innovation, Centre for Innovative Justice', linkedinUrl: 'https://www.linkedin.com/in/simon-ski', tier: 'strategic', category: 'academic', postsEngaged: ['oonchiumpa'], context: 'Innovation + justice intersection' },

  // Arts & Storytelling
  { name: 'Nadja Kostich', headline: 'Artistic Director and CEO at St Martins Youth Arts Centre', linkedinUrl: 'https://www.linkedin.com/in/nadja-kostich-a53773b3', tier: 'strategic', category: 'arts', postsEngaged: ['contained-tour'], context: 'Offered Melbourne support, works with young people' },
  { name: 'Maree Giles', headline: 'Award-winning writer and journalist', linkedinUrl: 'https://www.linkedin.com/in/maree-giles-45956025', tier: 'strategic', category: 'media', postsEngaged: ['contained-tour'], context: 'Potential media ally' },

  // Community & Youth Justice
  { name: 'Tracey Newman', headline: 'Engagement Manager | Adelaide', linkedinUrl: 'https://www.linkedin.com/in/tracey-newman-a613a666', tier: 'strategic', category: 'community', postsEngaged: ['contained-tour'], context: 'Actively organizing Adelaide support, tagged multiple people' },
  { name: 'Aaron Baker', headline: 'Future Project Manager & Operations Leader', linkedinUrl: 'https://www.linkedin.com/in/aaron-baker-maipm-cppp-84337826', tier: 'strategic', category: 'community', postsEngaged: ['contained-diagrama'], context: 'Presenting at Adelaide conference, wants to connect' },
  { name: 'Tom Donaghy', headline: 'People Culture Safety Manager - HousingPLUS', linkedinUrl: 'https://www.linkedin.com/in/tom-donaghy-311501-ondemand-strategic-leader', tier: 'strategic', category: 'housing', postsEngaged: ['contained-diagrama'], context: 'Long action-oriented comment, wants to connect' },
  { name: 'Natalie Friday', headline: 'Ranger Coordinator | PCYC | Community Programs', linkedinUrl: 'https://www.linkedin.com/in/nataliefriday', tier: 'strategic', category: 'first-nations', postsEngaged: ['palm-island'], context: 'Deeply personal Palm Island response' },
  { name: 'Bernice Hookey', headline: 'Cultural Strategist | Founder MZB Empowerment', linkedinUrl: 'https://www.linkedin.com/in/bernice-hookey', tier: 'strategic', category: 'first-nations', postsEngaged: ['palm-island'], context: '"You are a beautiful kind human... a true ally"' },
  { name: 'Keesha Morikei Booth', headline: 'Navigate complex systems', linkedinUrl: 'https://www.linkedin.com/in/keeshambooth', tier: 'strategic', category: 'community', postsEngaged: ['palm-island'], context: '"I have loved learning about your work brother"' },
  { name: 'Faye Bourke', headline: 'Transforming child protection and domestic violence responses', linkedinUrl: 'https://www.linkedin.com/in/faye-bourke-6b0b0322a', tier: 'strategic', category: 'child-protection', postsEngaged: ['contained-tour'], context: 'Child protection background' },
  { name: 'Teena Townsend', headline: 'Marketing, Hope Community Services | Perth', linkedinUrl: 'https://www.linkedin.com/in/teenatownsend', tier: 'strategic', category: 'community', postsEngaged: ['contained-tour'], context: 'Asked about Perth dates' },
  { name: 'Simon Quilty', headline: 'COO, Wilya Janta', linkedinUrl: 'https://www.linkedin.com/in/simon-quilty-1195b4298', tier: 'strategic', category: 'partner', postsEngaged: ['tennant-creek'], context: 'Core partner — Tennant Creek housing' },
  { name: 'Sid Vashist', headline: 'Mayor/Policy/Public Relations', linkedinUrl: 'https://www.linkedin.com/in/sid-vashist-96368a24', tier: 'strategic', category: 'politician', postsEngaged: ['urapuntja'], context: 'Local government champion' },

  // TIER 3: WARM — Single-post engagers worth tracking
  { name: 'Gemma Livingston', headline: 'Human Rights and Social Impact | NZ', linkedinUrl: 'https://www.linkedin.com/in/gemma-livingston-b35b1625', tier: 'warm', category: 'human-rights', postsEngaged: ['contained-diagrama'], context: 'NZ expansion opportunity' },
  { name: 'Peter Murchland', headline: 'Advancing inclusive, just Australia', linkedinUrl: 'https://www.linkedin.com/in/peter-murchland', tier: 'warm', category: 'community', postsEngaged: ['contained-diagrama'], context: 'National Community of Practice connection' },
  { name: 'Tanya Pouwhare', headline: 'General Manager | NZ', linkedinUrl: 'https://www.linkedin.com/in/tanya-pouwhare-25244161', tier: 'warm', category: 'community', postsEngaged: ['contained-diagrama'], context: 'NZ connection, wants stats' },
  { name: 'Florence Koenderink', headline: 'Trauma proactivity, disability inclusion', linkedinUrl: 'https://www.linkedin.com/in/florence-koenderink-9b9b482a', tier: 'warm', category: 'health', postsEngaged: ['contained-diagrama'], context: 'Trauma expertise' },
  { name: 'Kim Porter', headline: 'Executive Manager Child Safety', linkedinUrl: 'https://www.linkedin.com/in/kim-porter-4aa13258', tier: 'warm', category: 'government', postsEngaged: ['contained-diagrama'], context: 'Evidence-based approach advocate' },
  { name: 'Georgia Heath', headline: 'Co-Founder Yup Yup Labs', linkedinUrl: 'https://www.linkedin.com/in/georgiaaheath', tier: 'warm', category: 'social-enterprise', postsEngaged: ['alice-springs'], context: 'Personal connection to Adelaide northern suburbs' },
  { name: 'Lathalia Song', headline: 'Interdisciplinary Artist-writer', linkedinUrl: 'https://www.linkedin.com/in/lathalia-song-89b2385a', tier: 'warm', category: 'arts', postsEngaged: ['alice-springs'], context: '"Please keep sharing this news"' },
  { name: 'Helene Keenan', headline: 'Social Worker | Systems Advocate', linkedinUrl: 'https://www.linkedin.com/in/helene-keenan-social-worker-disability-services', tier: 'warm', category: 'social-work', postsEngaged: ['contained-cta'], context: '"With you 100%"' },
  { name: 'Bob Philipson', headline: 'Founder Goulburn Mulwaree Community Sustainability Hub', linkedinUrl: 'https://www.linkedin.com/in/bob-philipson-64a5887', tier: 'warm', category: 'community', postsEngaged: ['stretch-bed'], context: 'Community sustainability focus' },
  { name: 'Sarah Heys', headline: 'Director at The Built Element', linkedinUrl: 'https://www.linkedin.com/in/sarah-heys-559159179', tier: 'warm', category: 'design', postsEngaged: ['stretch-bed'], context: '"Brilliant, Ben & Nic, as always!" — knows you' },
  { name: 'Meriel Chamberlin', headline: 'Founder Full Circle Fibres | Churchill Fellow | Circular Economy', linkedinUrl: 'https://www.linkedin.com/in/merielchamberlin', tier: 'warm', category: 'circular-economy', postsEngaged: ['goods-bed-v3'], context: 'Circular economy overlap' },
  { name: 'Toby Gowland', headline: 'Founder Kalianah Outdoors | Adventure Therapy', linkedinUrl: 'https://www.linkedin.com/in/toby-gowland-8ba55878', tier: 'warm', category: 'youth', postsEngaged: ['goods-bed-v3'], context: 'Adventure therapy for youth' },
  { name: 'Emily Hilder', headline: 'Strategic Direction & Positioning', linkedinUrl: 'https://www.linkedin.com/in/emilyhilder', tier: 'warm', category: 'strategy', postsEngaged: ['nic-tribute'], context: 'Thoughtful comment about rare combination of qualities' },
  { name: 'Juanita Schaffa De Mauri', headline: 'TedX King\'s Park speaker | UWA Criminology', linkedinUrl: 'https://www.linkedin.com/in/juanita-s-1418921a6', tier: 'warm', category: 'academic', postsEngaged: ['nic-tribute'], context: '"Tears to my eyes" — emotional connection' },
  { name: 'Stuart Kiernan', headline: 'Cybersecurity professional', linkedinUrl: 'https://www.linkedin.com/in/stuart-kiernan-294a64', tier: 'warm', category: 'supporter', postsEngaged: ['nic-tribute'], context: '"Looking forward to your company again soon" — personal contact' },
  { name: 'Nicole Evans', headline: 'Connection Consultant', linkedinUrl: 'https://www.linkedin.com/in/nicole-evans-06754561', tier: 'warm', category: 'supporter', postsEngaged: ['nic-tribute'], context: '"Inspiring humans"' },
  { name: 'Andy Kazim', headline: 'Social Policy Innovation', linkedinUrl: 'https://www.linkedin.com/in/andy-kazim-95635215a', tier: 'warm', category: 'policy', postsEngaged: ['contained-tour'], context: 'Referenced Diagrama model specifically' },
  { name: 'Dean Cracknell', headline: 'Co-Founder Town Team Movement | Placemaking', linkedinUrl: 'https://www.linkedin.com/in/dean-cracknell', tier: 'warm', category: 'placemaking', postsEngaged: ['tennant-creek'], context: 'Tagged 5 people — amplifier' },
  { name: 'Joy Woods', headline: 'Founder, Safeguarding Consultant', linkedinUrl: 'https://www.linkedin.com/in/joy-woods', tier: 'warm', category: 'safeguarding', postsEngaged: ['contained-tour'], context: '"Keen to show my support and commitment"' },
  { name: 'Ania Karzek', headline: 'Digital ethics, public policy | Adelaide', linkedinUrl: 'https://www.linkedin.com/in/ania-karzek-3226364', tier: 'warm', category: 'policy', postsEngaged: ['contained-tour'], context: '"Let me know if you need any collab" — Adelaide' },
  { name: 'Sally Anderson', headline: 'Crisis Counsellor', linkedinUrl: 'https://www.linkedin.com/in/sally-anderson-402636323', tier: 'warm', category: 'community', postsEngaged: ['contained-tour'], context: 'Suggested gallery installation — creative thinker' },
  { name: 'Clare Johnson', headline: 'Innovation Research Development', linkedinUrl: 'https://www.linkedin.com/in/clare-johnson-1b625476', tier: 'warm', category: 'innovation', postsEngaged: ['contained-tour'], context: 'Suggested National Gallery tour' },
  { name: 'Lisa Stanford', headline: 'COO', linkedinUrl: 'https://www.linkedin.com/in/lisa-stanford', tier: 'warm', category: 'executive', postsEngaged: ['contained-tour'], context: 'Tagged MCA contact' },
  { name: 'Jacqui Malins', headline: 'Cultural awareness programs | Evolve Communities', linkedinUrl: 'https://www.linkedin.com/in/jacqui-malins-11597068', tier: 'warm', category: 'community', postsEngaged: ['contained-tour'], context: 'Suggested MCA Circular Quay location' },
  { name: 'Kate McKenzie', headline: 'Research Partnerships at UWA', linkedinUrl: 'https://www.linkedin.com/in/kateleannemckenzie', tier: 'warm', category: 'academic', postsEngaged: ['contained-tour'], context: 'Tagged Paul Flatau (homelessness researcher)' },
  { name: 'Viki Hannah', headline: 'Child Youth Family Practitioner', linkedinUrl: 'https://www.linkedin.com/in/viki-hannah-fiml-micda-18b90479', tier: 'warm', category: 'youth', postsEngaged: ['contained-tour'], context: '"Innovative project with only positive outcomes"' },
  { name: 'Christine Small', headline: 'Lived Experience Projects', linkedinUrl: 'https://www.linkedin.com/in/christine-s-ab282922', tier: 'warm', category: 'lived-experience', postsEngaged: ['contained-tour'], context: '"Nothing like lived experience to bring the message home"' },
  { name: 'David Fagg', headline: 'Educator | Researcher | Youth Worker', linkedinUrl: 'https://www.linkedin.com/in/davefagg', tier: 'warm', category: 'youth', postsEngaged: ['contained-tour'], context: 'Wants Bendigo stop' },
  { name: 'Samgiita Hope', headline: 'Heart2Heart Dementia Doula | Perth', linkedinUrl: 'https://www.linkedin.com/in/samgiita-hope-3b456446', tier: 'warm', category: 'community', postsEngaged: ['contained-tour'], context: 'Asked about Perth dates' },
  { name: 'Dominic Brook', headline: 'Founder & CEO connecting businesses and young people through music', linkedinUrl: 'https://www.linkedin.com/in/dominic-brook-5ab26a18', tier: 'warm', category: 'youth', postsEngaged: ['palm-island'], context: 'Music + impact connection' },
  { name: 'Leon Yeatman', headline: 'North Queensland Land Council', linkedinUrl: 'https://www.linkedin.com/in/leon-yeatman-5b29b296', tier: 'warm', category: 'first-nations', postsEngaged: ['contained-tour'], context: '"Actions speak louder than words"' },
  { name: 'Willhemina Wahlin', headline: 'Design Strategist, researcher and facilitator', linkedinUrl: 'https://www.linkedin.com/in/willhemina-wahlin', tier: 'warm', category: 'design', postsEngaged: ['goods-bed-imagine'], context: 'Design strategy overlap' },
  { name: 'Jacqui Storey', headline: 'Circular Economy', linkedinUrl: 'https://www.linkedin.com/in/jacquistorey', tier: 'warm', category: 'circular-economy', postsEngaged: ['goods-bed-imagine'], context: 'Circular economy + product interest' },
  { name: 'Genevieve Deaconos', headline: 'Partnerships, Australian Wildlife Conservancy', linkedinUrl: 'https://www.linkedin.com/in/genevievedeaconos', tier: 'warm', category: 'partnerships', postsEngaged: ['goods-bed-imagine'], context: '"Innovation at its best"' },
  { name: 'Pauline M.', headline: 'Interior Architecture & Property Economics', linkedinUrl: 'https://www.linkedin.com/in/pauline-m-12a52358', tier: 'warm', category: 'design', postsEngaged: ['norman-frank'], context: '"Building futures through culture"' },
  { name: 'Simone Gianelli', headline: 'Policy | Board Chair VicSRC', linkedinUrl: 'https://www.linkedin.com/in/simone-gianelli-4b010463', tier: 'warm', category: 'policy', postsEngaged: ['contained-little-friend'], context: 'Guessed CONTAINED location — following closely' },
  { name: 'Karina Morgan', headline: 'Creative Comms', linkedinUrl: 'https://www.linkedin.com/in/karina-morgan-53737333', tier: 'warm', category: 'communications', postsEngaged: ['contained-little-friend'], context: 'Guessed Mount Druitt — following closely' },
  { name: 'Robyn Walker', headline: 'Developing Human Synergy', linkedinUrl: 'https://www.linkedin.com/in/robynwalker', tier: 'warm', category: 'leadership', postsEngaged: ['contained-diagrama'], context: 'Heart-based leadership alignment' },
  { name: 'Marie-Clare Couper', headline: 'Executive Officer Brain Injury Tasmania', linkedinUrl: 'https://www.linkedin.com/in/marie-clare-couper-253833109', tier: 'warm', category: 'health', postsEngaged: ['contained-diagrama'], context: '"Evidence based response" advocate' },
  { name: 'Mathew Thomas', headline: 'Student at Curtin University', linkedinUrl: 'https://www.linkedin.com/in/mathew-thomas-b1a700384', tier: 'warm', category: 'student', postsEngaged: ['contained-diagrama'], context: '"I love what you are doing here"' },
  { name: 'Sarah Ripper', headline: 'Social Entrepreneur', linkedinUrl: 'https://www.linkedin.com/in/sarah-ripper-59b19082', tier: 'warm', category: 'social-enterprise', postsEngaged: ['contained-tour'], context: 'Tagged BackTrack Youth Works' },
  { name: 'Debbie Rowles', headline: 'Leadership & Strategy', linkedinUrl: 'https://www.linkedin.com/in/debbierowles', tier: 'warm', category: 'leadership', postsEngaged: ['nic-tribute'], context: 'Leadership supporter' },
  { name: 'Amanda Ninnis', headline: 'Brand Visual Storyteller', linkedinUrl: 'https://www.linkedin.com/in/amanda-ninnis-6b439a12', tier: 'warm', category: 'marketing', postsEngaged: ['contained-tour'], context: 'Brand/marketing potential' },
  { name: 'Natalie Andersen', headline: 'Director at Look Design Group', linkedinUrl: 'https://www.linkedin.com/in/natalie-andersen-37944934', tier: 'warm', category: 'design', postsEngaged: ['washing-machine'], context: 'Design firm director' },
];

async function ghlRequest(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(`${GHL_BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GHL ${response.status}: ${text}`);
  }
  return response.json();
}

async function searchContactByName(name: string) {
  try {
    const response = await ghlRequest(
      `/contacts/?locationId=${GHL_LOCATION_ID}&query=${encodeURIComponent(name)}&limit=5`
    );
    return response.contacts || [];
  } catch {
    return [];
  }
}

export async function POST() {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    return NextResponse.json({ error: 'GHL not configured' }, { status: 500 });
  }

  const results: {
    created: string[];
    matched: string[];
    errors: string[];
  } = { created: [], matched: [], errors: [] };

  for (const commenter of LINKEDIN_COMMENTERS) {
    try {
      // Rate limit: GHL allows ~100 req/min
      await new Promise(r => setTimeout(r, 700));

      // Search for existing contact by name
      const existing = await searchContactByName(commenter.name);

      const tags = [
        'goods-linkedin-supporter',
        `goods-linkedin-${commenter.tier}`,
        `goods-linkedin-${commenter.category}`,
        ...commenter.postsEngaged.map(p => `goods-li-${p}`),
      ];

      if (existing.length > 0) {
        // Match found — update with LinkedIn tags
        const contact = existing[0];
        const existingTags = contact.tags || [];
        const newTags = [...new Set([...existingTags, ...tags])];

        await ghlRequest(`/contacts/${contact.id}`, 'PUT', {
          tags: newTags,
          customFields: [
            { id: 'linkedin_url', value: commenter.linkedinUrl },
          ],
        });

        results.matched.push(`${commenter.name} → ${contact.id} (${contact.email || 'no email'})`);
      } else {
        // No match — create new contact with LinkedIn data
        const nameParts = commenter.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        await ghlRequest('/contacts/', 'POST', {
          locationId: GHL_LOCATION_ID,
          firstName,
          lastName,
          name: commenter.name,
          companyName: commenter.headline.split('|')[0]?.trim().substring(0, 100),
          tags,
          source: 'LinkedIn Comment Import',
          customFields: [
            { id: 'linkedin_url', value: commenter.linkedinUrl },
          ],
        });

        results.created.push(`${commenter.name} (${commenter.tier})`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown';
      results.errors.push(`${commenter.name}: ${msg}`);
    }
  }

  return NextResponse.json({
    total: LINKEDIN_COMMENTERS.length,
    ...results,
    summary: {
      created: results.created.length,
      matched: results.matched.length,
      errors: results.errors.length,
    },
  });
}

// GET to preview what will be imported
export async function GET() {
  const byTier = {
    hot: LINKEDIN_COMMENTERS.filter(c => c.tier === 'hot'),
    strategic: LINKEDIN_COMMENTERS.filter(c => c.tier === 'strategic'),
    warm: LINKEDIN_COMMENTERS.filter(c => c.tier === 'warm'),
  };

  return NextResponse.json({
    total: LINKEDIN_COMMENTERS.length,
    byTier: {
      hot: byTier.hot.length,
      strategic: byTier.strategic.length,
      warm: byTier.warm.length,
    },
    contacts: LINKEDIN_COMMENTERS.map(c => ({
      name: c.name,
      tier: c.tier,
      category: c.category,
      linkedin: c.linkedinUrl,
      context: c.context,
      postsEngaged: c.postsEngaged.length,
    })),
  });
}
