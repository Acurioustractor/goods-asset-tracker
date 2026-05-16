import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getKnowledgeSources, buildSystemPrompt } from '@/lib/knowledge-base';
import { createServiceClient } from '@/lib/supabase/server';

// Minimax via OpenAI-compatible endpoint.
// Docs: https://platform.minimax.io/docs/api-reference/text-openai-api
const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1';
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2';

const openai = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY || 'unset',
  baseURL: MINIMAX_BASE_URL,
});

// Cache the system prompt since docs don't change at runtime
let cachedSystemPrompt: string | null = null;

function getSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    const sources = getKnowledgeSources();
    cachedSystemPrompt = buildSystemPrompt(sources);
  }
  return cachedSystemPrompt;
}

async function getAssetContextBlock(assetId: string): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data: asset } = await supabase
      .from('assets')
      .select('unique_id, product, community, place, status, supply_date')
      .eq('unique_id', assetId)
      .single();
    if (!asset) return null;
    const lines = [
      `You are helping someone who has scanned the QR code on a Goods asset. They are most likely the person who received it — a community member at home, not a Goods staffer or a production worker.`,
      ``,
      `THIS ASSET:`,
      `Asset ID: ${asset.unique_id}`,
      asset.product ? `Product: ${asset.product}` : null,
      asset.community ? `Community: ${asset.community}` : null,
      asset.place ? `Place: ${asset.place}` : null,
      asset.status ? `Status: ${asset.status}` : null,
      asset.supply_date ? `Supplied: ${new Date(asset.supply_date).toLocaleDateString('en-AU')}` : null,
      ``,
      `HOW TO TALK:`,
      `- Warm, short, plain English. No jargon. No marketing voice.`,
      `- Lead with the answer. Don't preamble.`,
      `- Speak as Goods ("we"), not as an AI. Don't say you're a language model. Don't apologise for being a bot.`,
      `- It's fine to say "I'm not sure — let me get a person to follow up" if you genuinely don't know.`,
      `- Avoid em dashes; use plain punctuation.`,
      ``,
      `WHEN TO HAND OFF:`,
      `- Damage, safety risk, or anything broken → point them at /support?asset_id=${asset.unique_id}.`,
      `- They want to share a story or photo → point them back to /bed/${asset.unique_id} and the "Share a photo or story" button.`,
      `- They want messages or to request a blanket/pillow → /claim/${asset.unique_id} (phone login) → My Items.`,
      `- They need to talk to a human → /support gives them a form and Goods staff respond.`,
    ].filter((line) => line !== null);
    return `\n\n--- BED CONTEXT ---\n${lines.join('\n')}\n--- END BED CONTEXT ---`;
  } catch (err) {
    console.error('[chat] asset context lookup failed:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, assetId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    if (!process.env.MINIMAX_API_KEY) {
      return NextResponse.json(
        { error: 'Chat is not configured yet. Please contact Ben.' },
        { status: 503 }
      );
    }

    let systemPrompt = getSystemPrompt();
    if (typeof assetId === 'string' && assetId.trim()) {
      const block = await getAssetContextBlock(assetId.trim());
      if (block) systemPrompt = systemPrompt + block;
    }

    // OpenAI-format messages — system prompt rides as the first message.
    const chatMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: MINIMAX_MODEL,
      max_tokens: 1024,
      messages: chatMessages,
    });

    const raw = completion.choices?.[0]?.message?.content || '';
    // Strip Minimax M2 reasoning blocks (<think>...</think>) — they shouldn't reach the user.
    const reply =
      raw
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
        .trim() ||
      "Sorry, I couldn't generate a response. Try asking again or talk to Ben.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact Ben directly.' },
      { status: 500 }
    );
  }
}
