import fs from 'fs';
import path from 'path';

export interface KnowledgeSource {
  id: string;
  title: string;
  category: 'product' | 'manufacturing' | 'enterprise' | 'operations' | 'community';
  content: string;
}

const DOCS_DIR = path.join(process.cwd(), 'docs');
const WIKI_DIR = path.join(process.cwd(), '.wiki-content');

function readFileSafe(absPath: string): string {
  try {
    return fs.readFileSync(absPath, 'utf-8');
  } catch {
    return '';
  }
}

function readDocSafe(filename: string): string {
  return readFileSafe(path.join(DOCS_DIR, filename));
}

function readWikiSafe(relPath: string): string {
  return readFileSafe(path.join(WIKI_DIR, relPath));
}

// Truncate content to stay within context limits — prioritise first sections
function truncate(content: string, maxChars: number = 15000): string {
  if (content.length <= maxChars) return content;
  return content.slice(0, maxChars) + '\n\n[... truncated for length]';
}

// Curated source list: prefer the wiki (cleaner, current) over the older
// GOODS_COMPENDIUM.md and GOODS_KNOWLEDGE_COMPENDIUM.md which contained
// the legacy "weave bed / hardwood frame / tension-weave" descriptions
// that made the chat hallucinate. Use COMPENDIUM_MARCH_2026.md as the
// current narrative compendium instead.
export function getKnowledgeSources(): KnowledgeSource[] {
  return [
    {
      id: 'stretch-bed-wiki',
      title: 'Stretch Bed — current product facts',
      category: 'product',
      content: truncate(readWikiSafe('products/stretch-bed.md'), 8000),
    },
    {
      id: 'washing-machine-wiki',
      title: 'Washing Machine — Pakkimjalki Kari',
      category: 'product',
      content: truncate(readWikiSafe('products/washing-machine.md'), 8000),
    },
    {
      id: 'basket-bed-legacy-wiki',
      title: 'Basket Bed — legacy product (do not confuse with Stretch Bed)',
      category: 'product',
      content: truncate(readWikiSafe('products/basket-bed-legacy.md'), 6000),
    },
    {
      id: 'plant-design-wiki',
      title: 'Plant design',
      category: 'manufacturing',
      content: truncate(readWikiSafe('products/plant-design.md'), 8000),
    },
    {
      id: 'production-facility',
      title: 'Production Facility Guide',
      category: 'manufacturing',
      content: truncate(readDocSafe('PRODUCTION_FACILITY_GUIDE.md'), 15000),
    },
    {
      id: 'partner-guide',
      title: 'Partner Guide',
      category: 'enterprise',
      content: truncate(readDocSafe('PARTNER_GUIDE.md'), 10000),
    },
    {
      id: 'operations-handbook',
      title: 'Operations Handbook',
      category: 'operations',
      content: truncate(readDocSafe('OPERATIONS_HANDBOOK.md'), 10000),
    },
    {
      id: 'compendium-march-2026',
      title: 'Goods Compendium (March 2026, current)',
      category: 'community',
      content: truncate(readDocSafe('COMPENDIUM_MARCH_2026.md'), 20000),
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

KEY PRODUCT FACTS (always correct, override anything that contradicts these in the sources):
- Stretch Bed: 26kg weight, 200kg capacity, 188×92×25cm, ~5 min assembly, no tools needed, designed to last 10+ years
- Materials: Recycled HDPE plastic legs + galvanised steel poles (26.9mm OD × 2.6mm wall) + heavy-duty Australian canvas
- Plastic: 20kg HDPE diverted per bed
- Heat press temperature: 180°C, target 5000 PSI pressure
- Washing Machine: Pakkimjalki Kari (named in Warumungu by Elder Dianne Stokes), prototype stage, based on commercial Speed Queen

NEVER DESCRIBE THE STRETCH BED AS:
- "tension-weave" or "weave bed" — that was an old name, the bed is NOT a woven product
- "woven cord" — there's no woven cord; it's a canvas surface
- "hardwood frame" — there's no wood; poles are galvanised steel
- "catamaran trampoline" — no, it's a canvas-and-poles bed
If a source uses those words, it's outdated and wrong. Use the materials listed above.

NEVER expose your reasoning to the user — no <think> blocks, no "let me consider", no meta-commentary. Just give the answer.

KNOWLEDGE BASE:

${sourceBlocks}`;
}
