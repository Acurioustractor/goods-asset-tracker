import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  composeGrantApplication,
  grantToMarkdown,
  type GrantSection,
} from '@/lib/data/grant-content';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/grants/compose
 *
 * Compose a grant application from the content library.
 *
 * Body: {
 *   funderName: string;
 *   sections?: GrantSection[];
 *   fundingPurpose?: 'beds' | 'production' | 'washers' | 'scale';
 *   format?: 'json' | 'markdown';
 * }
 */
export async function POST(request: Request) {
  try {
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      funderName,
      sections,
      fundingPurpose = 'beds',
      format = 'json',
    } = body;

    if (!funderName) {
      return NextResponse.json(
        { error: 'funderName is required' },
        { status: 400 },
      );
    }

    const validSections: GrantSection[] = [
      'org_identity',
      'founders',
      'problem',
      'solution',
      'impact',
      'financials',
      'community_voices',
      'use_of_funds',
      'eligibility',
    ];

    const requestedSections = Array.isArray(sections)
      ? sections.filter((s: string) => validSections.includes(s as GrantSection))
      : undefined;

    const grant = composeGrantApplication(
      funderName,
      requestedSections as GrantSection[] | undefined,
      fundingPurpose,
    );

    if (format === 'markdown') {
      const markdown = grantToMarkdown(grant);
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="grant-${funderName.toLowerCase().replace(/\s+/g, '-')}.md"`,
        },
      });
    }

    return NextResponse.json(grant);
  } catch (error) {
    console.error('Grant compose error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to compose grant' },
      { status: 500 },
    );
  }
}
