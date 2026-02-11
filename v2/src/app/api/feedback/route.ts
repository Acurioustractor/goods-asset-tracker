import { NextRequest, NextResponse } from 'next/server';

interface FeedbackPayload {
  page: string;
  message: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackPayload;

    // Validate required fields
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be 2000 characters or less' },
        { status: 400 }
      );
    }

    const page = body.page || '/';
    const email = body.email || 'Anonymous';

    const token = process.env.GITHUB_FEEDBACK_TOKEN;
    const repo = process.env.GITHUB_REPO;

    if (!token || !repo) {
      console.error('[Feedback] Missing GITHUB_FEEDBACK_TOKEN or GITHUB_REPO env vars');
      return NextResponse.json(
        { error: 'Feedback system is not configured' },
        { status: 500 }
      );
    }

    // Create GitHub Issue
    const issueTitle = `Feedback: ${page}`;
    const issueBody = `**Page:** https://goodsoncountry.com${page}
**From:** ${email}

## Feedback
${body.message}

---
*Submitted via site feedback widget*`;

    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['feedback'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[Feedback] GitHub API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    console.log('[Feedback]', { page, email, messageLength: body.message.length });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback. Please try again.' },
      { status: 500 }
    );
  }
}
