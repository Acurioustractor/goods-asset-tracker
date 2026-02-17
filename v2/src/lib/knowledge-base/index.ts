import fs from 'fs';
import path from 'path';

export interface KnowledgeSource {
  id: string;
  title: string;
  category: 'product' | 'manufacturing' | 'enterprise' | 'operations' | 'community';
  content: string;
}

const DOCS_DIR = path.join(process.cwd(), 'docs');

function readDocSafe(filename: string): string {
  try {
    return fs.readFileSync(path.join(DOCS_DIR, filename), 'utf-8');
  } catch {
    return '';
  }
}

// Truncate content to stay within context limits — prioritise first sections
function truncate(content: string, maxChars: number = 15000): string {
  if (content.length <= maxChars) return content;
  return content.slice(0, maxChars) + '\n\n[... truncated for length]';
}

export function getKnowledgeSources(): KnowledgeSource[] {
  return [
    {
      id: 'production-facility',
      title: 'Production Facility Guide',
      category: 'manufacturing',
      content: truncate(readDocSafe('PRODUCTION_FACILITY_GUIDE.md'), 20000),
    },
    {
      id: 'partner-guide',
      title: 'Partner Guide',
      category: 'enterprise',
      content: truncate(readDocSafe('PARTNER_GUIDE.md')),
    },
    {
      id: 'operations-handbook',
      title: 'Operations Handbook',
      category: 'operations',
      content: truncate(readDocSafe('OPERATIONS_HANDBOOK.md')),
    },
    {
      id: 'goods-compendium',
      title: 'Goods Compendium',
      category: 'community',
      content: truncate(readDocSafe('GOODS_COMPENDIUM.md'), 25000),
    },
    {
      id: 'knowledge-compendium',
      title: 'Knowledge Compendium',
      category: 'community',
      content: truncate(readDocSafe('GOODS_KNOWLEDGE_COMPENDIUM.md'), 20000),
    },
  ];
}

export function buildSystemPrompt(sources: KnowledgeSource[]): string {
  const sourceBlocks = sources
    .filter(s => s.content.length > 0)
    .map(s => `## ${s.title} [Source: ${s.id}]\n\n${s.content}`)
    .join('\n\n---\n\n');

  return `You are "Ask Goods" — the knowledge assistant for Goods on Country community partners.

Your job is to answer questions about:
- Product assembly, maintenance, and troubleshooting (Stretch Bed, Washing Machine)
- Manufacturing processes (plastic recycling, heat pressing, CNC routing)
- Enterprise building (setting up production, community ownership, cooperative models)
- Partnership information and support

IMPORTANT GUIDELINES:
- Speak in plain, warm language — not corporate. You're talking to community members, not executives.
- Keep answers concise and practical. People might be reading on a phone with patchy signal.
- When you know the answer, give clear steps.
- When you're not sure, say so honestly and suggest they "talk to Ben" for help.
- Always cite which source your answer comes from, e.g. "(From the Production Facility Guide)"
- Use Australian English.
- Be culturally respectful — you're supporting Indigenous community enterprises.
- Never make up product specs. If you don't have the data, say "I don't have that specific detail — let me connect you with Ben."

KEY PRODUCT FACTS (always correct):
- Stretch Bed: 26kg weight, 200kg capacity, 188×92×25cm, ~5 min assembly, no tools needed, 5-year warranty
- Materials: Recycled HDPE plastic legs + galvanised steel poles (26.9mm OD × 2.6mm wall) + heavy-duty Australian canvas
- Plastic: 20kg HDPE diverted per bed
- Heat press temperature: 180°C, target 5000 PSI pressure
- Washing Machine: Pakkimjalki Kari (named in Warumungu by Elder Dianne Stokes), prototype stage, based on commercial Speed Queen

KNOWLEDGE BASE:

${sourceBlocks}`;
}
