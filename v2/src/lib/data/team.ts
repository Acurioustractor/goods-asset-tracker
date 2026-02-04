export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
}

export const team: TeamMember[] = [
  {
    id: 'nic',
    name: 'Nicholas Marchesi',
    role: 'Co-founder & Project Lead',
    bio: 'Nic leads Goods on Country with a deep commitment to community-led design. Working alongside Traditional Owners and community members, he bridges the gap between manufacturing capability and community need. His approach centers on listening first, designing second - ensuring every product reflects the wisdom and preferences of the communities they serve.',
    image: 'https://s3-us-west-2.amazonaws.com/public.notion-static.com/6d2c0498-ea4c-44f2-a0da-451f77e77c05/NM_Bio_Phot_ACT.jpeg',
    email: 'nicholas@act.place',
  },
  {
    id: 'ben',
    name: 'Benjamin Knight',
    role: 'Co-founder & Technology',
    bio: 'Ben brings design and technology expertise to Goods, building the systems that connect products to communities. His background spans social enterprise, Indigenous partnerships, and digital platforms. He believes in technology as a tool for community empowerment, not extraction.',
    image: '/images/people/ben-knight.jpg',
    email: 'benjamin@act.place',
  },
];

export function getTeamMember(id: string): TeamMember | undefined {
  return team.find((member) => member.id === id);
}
