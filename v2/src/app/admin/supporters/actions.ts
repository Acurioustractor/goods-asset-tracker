'use server';

import ghl from '@/lib/ghl';

export interface Supporter {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  source: string;
  dateAdded: string;
  // Derived fields
  tier: 'hot' | 'strategic' | 'warm' | 'gmail' | 'existing';
  category: string;
  linkedinUrl?: string;
  isLinkedin: boolean;
  isGmail: boolean;
  postsEngaged: string[];
}

export interface SupportersOverview {
  supporters: Supporter[];
  stats: {
    total: number;
    linkedinTotal: number;
    gmailTotal: number;
    hot: number;
    strategic: number;
    warm: number;
    funders: number;
    partners: number;
    politicians: number;
    media: number;
    community: number;
  };
}

function deriveCategory(tags: string[]): string {
  const catTag = tags.find(t => t.startsWith('goods-linkedin-') && !['goods-linkedin-supporter', 'goods-linkedin-hot', 'goods-linkedin-strategic', 'goods-linkedin-warm'].includes(t));
  if (catTag) return catTag.replace('goods-linkedin-', '');
  const gmailCat = tags.find(t => t.startsWith('goods-gmail-') && t !== 'goods-gmail-active');
  if (gmailCat) return gmailCat.replace('goods-gmail-', '');
  return 'supporter';
}

function deriveTier(tags: string[]): Supporter['tier'] {
  if (tags.includes('goods-linkedin-hot')) return 'hot';
  if (tags.includes('goods-linkedin-strategic')) return 'strategic';
  if (tags.includes('goods-linkedin-warm')) return 'warm';
  if (tags.includes('goods-gmail-active')) return 'gmail';
  return 'existing';
}

function derivePostsEngaged(tags: string[]): string[] {
  return tags
    .filter(t => t.startsWith('goods-li-'))
    .map(t => t.replace('goods-li-', ''));
}

export async function getSupportersOverview(): Promise<SupportersOverview> {
  const contacts = await ghl.getContacts({ goodsOnly: true });

  // Filter to supporters (LinkedIn imported, Gmail imported, or key tagged contacts)
  const supporterTags = [
    'goods-linkedin-supporter',
    'goods-gmail-active',
    'goods-supporter',
    'goods-partner',
    'goods-funder',
    'goods-advisory',
    'goods-customer',
    'goods-sponsor',
  ];

  const supporters: Supporter[] = contacts
    .filter(c => c.tags?.some(t => supporterTags.includes(t)))
    .map(c => {
      const tags = c.tags || [];
      return {
        id: c.id,
        name: c.contactName || c.firstName + ' ' + (c.lastName || ''),
        email: c.email || '',
        phone: c.phone || '',
        company: c.companyName || '',
        tags,
        source: c.source || '',
        dateAdded: c.dateAdded || '',
        tier: deriveTier(tags),
        category: deriveCategory(tags),
        linkedinUrl: '', // GHL doesn't store custom fields in list response
        isLinkedin: tags.includes('goods-linkedin-supporter'),
        isGmail: tags.includes('goods-gmail-active'),
        postsEngaged: derivePostsEngaged(tags),
      };
    })
    .sort((a, b) => {
      const tierOrder = { hot: 0, strategic: 1, warm: 2, gmail: 3, existing: 4 };
      return tierOrder[a.tier] - tierOrder[b.tier];
    });

  const stats = {
    total: supporters.length,
    linkedinTotal: supporters.filter(s => s.isLinkedin).length,
    gmailTotal: supporters.filter(s => s.isGmail).length,
    hot: supporters.filter(s => s.tier === 'hot').length,
    strategic: supporters.filter(s => s.tier === 'strategic').length,
    warm: supporters.filter(s => s.tier === 'warm').length,
    funders: supporters.filter(s => s.category === 'philanthropy' || s.category === 'funder' || s.category === 'investor').length,
    partners: supporters.filter(s => s.category === 'partner' || s.category === 'social-enterprise').length,
    politicians: supporters.filter(s => s.category === 'politician' || s.category === 'government').length,
    media: supporters.filter(s => s.category === 'media').length,
    community: supporters.filter(s => s.category === 'community' || s.category === 'first-nations').length,
  };

  return { supporters, stats };
}
