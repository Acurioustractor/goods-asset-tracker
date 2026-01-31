export interface Supporter {
  id: string;
  name: string;
  type: 'individual' | 'organization' | 'foundation';
  location?: string;
  role?: string;
  organization?: string;
  contribution: string;
  quote?: string;
  image?: string;
  website?: string;
  featured: boolean;
}

export const supporters: Supporter[] = [
  {
    id: 'dianne-stokes',
    name: 'Dianne Stokes',
    type: 'individual',
    location: 'Tennant Creek',
    role: 'Community Designer & Collaborator',
    contribution: 'Community designer and collaborator. When Dianne received her first bed, she came back within two weeks requesting twenty more for her community. She has been instrumental in refining bed designs around the fire with her family, ensuring products meet real community needs.',
    quote: 'When she received her first bed, she came back within two weeks requesting twenty more for her community.',
    featured: true,
  },
  {
    id: 'oonchiumpa',
    name: 'Oonchiumpa Bloomfield Family',
    type: 'organization',
    location: 'Central Australia (Alice Springs/Mbantua)',
    organization: 'Oonchiumpa Consultancy',
    contribution: 'Deep consultation partners for bed design and community distribution. The Oonchiumpa partnership represents our "deep roots model" - long-term relationships built on trust and community-led development. 100% Aboriginal-owned since 2022.',
    website: 'https://oonchiumpa.com.au',
    featured: true,
  },
  {
    id: 'kristy-bloomfield',
    name: 'Kristy Bloomfield',
    type: 'individual',
    location: 'Central Australia',
    role: 'Director',
    organization: 'Oonchiumpa Consultancy',
    contribution: 'Kristy leads Oonchiumpa Consultancy, a 100% Aboriginal-owned consultancy that has been instrumental in guiding our approach to community-led design and distribution across Central Australia.',
    featured: true,
  },
  {
    id: 'norman-frank',
    name: 'Norman Frank Jupurrurla',
    type: 'individual',
    location: 'Tennant Creek',
    role: 'Warumungu Elder, Wilya Janta co-founder',
    contribution: 'Housing advocate who helped identify the fundamental need for dignified sleeping and living conditions in remote communities. 2026 Australian of the Year nominee.',
    featured: true,
  },
  {
    id: 'snow-foundation',
    name: 'Snow Foundation',
    type: 'foundation',
    contribution: 'Major philanthropic supporter enabling production scale-up. Funding the Q1 2026 Goods Production Scale-Up program including supply chain development and community ownership model refinement.',
    website: 'https://www.snowfoundation.org.au',
    featured: true,
  },
  {
    id: 'purple-house',
    name: 'Purple House',
    type: 'organization',
    location: 'Central Australia',
    contribution: 'Healthcare partnership exploring beds for renal patients in remote dialysis units.',
    website: 'https://www.purplehouse.org.au',
    featured: false,
  },
];

export function getFeaturedSupporters(): Supporter[] {
  return supporters.filter((s) => s.featured);
}

export function getSupportersByType(type: Supporter['type']): Supporter[] {
  return supporters.filter((s) => s.type === type);
}

export function getSupporter(id: string): Supporter | undefined {
  return supporters.find((s) => s.id === id);
}
