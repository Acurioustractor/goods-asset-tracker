import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getKnowledgeSources, buildSystemPrompt } from '@/lib/knowledge-base';

const anthropic = new Anthropic();

// Cache the system prompt since docs don't change at runtime
let cachedSystemPrompt: string | null = null;

function getSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    const sources = getKnowledgeSources();
    cachedSystemPrompt = buildSystemPrompt(sources);
  }
  return cachedSystemPrompt;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Chat is not configured yet. Please contact Ben.' },
        { status: 503 }
      );
    }

    const systemPrompt = getSystemPrompt();

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const textBlock = response.content.find(b => b.type === 'text');
    const reply = textBlock ? textBlock.text : 'Sorry, I couldn\'t generate a response. Try asking again or talk to Ben.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact Ben directly.' },
      { status: 500 }
    );
  }
}
