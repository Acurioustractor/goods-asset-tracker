import { unstable_cache } from 'next/cache';
import { Card } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MessageSquareIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Feedback | Dashboard | Goods on Country',
  description: 'View visitor feedback submitted via the site',
};

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  created_at: string;
  html_url: string;
  labels: { name: string }[];
}

interface ParsedFeedback {
  number: number;
  page: string;
  excerpt: string;
  from: string;
  status: 'open' | 'closed';
  date: string;
  url: string;
}

function parseIssueBody(issue: GitHubIssue): ParsedFeedback {
  const body = issue.body || '';

  // Parse **Page:** and **From:** from issue body
  const pageMatch = body.match(/\*\*Page:\*\*\s*(.*)/);
  const fromMatch = body.match(/\*\*From:\*\*\s*(.*)/);
  const feedbackMatch = body.match(/## Feedback\n([\s\S]*?)(\n---|\n*$)/);

  const page = pageMatch?.[1]?.trim() || '';
  // Strip the domain prefix for display
  const pageDisplay = page.replace('https://goodsoncountry.com', '') || '/';

  return {
    number: issue.number,
    page: pageDisplay,
    excerpt: (feedbackMatch?.[1]?.trim() || body).slice(0, 120),
    from: fromMatch?.[1]?.trim() || 'Unknown',
    status: issue.state as 'open' | 'closed',
    date: new Date(issue.created_at).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    url: issue.html_url,
  };
}

const getFeedbackIssues = unstable_cache(
  async (): Promise<ParsedFeedback[]> => {
    const token = process.env.GITHUB_FEEDBACK_TOKEN;
    const repo = process.env.GITHUB_REPO;

    if (!token || !repo) {
      console.error('[Feedback Dashboard] Missing GITHUB_FEEDBACK_TOKEN or GITHUB_REPO');
      return [];
    }

    const response = await fetch(
      `https://api.github.com/repos/${repo}/issues?labels=feedback&state=all&per_page=50&sort=created&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      console.error('[Feedback Dashboard] GitHub API error:', response.status);
      return [];
    }

    const issues: GitHubIssue[] = await response.json();
    return issues.map(parseIssueBody);
  },
  ['dashboard-feedback-issues'],
  { revalidate: 300 }
);

export default async function FeedbackDashboardPage() {
  const feedback = await getFeedbackIssues();
  const openCount = feedback.filter((f) => f.status === 'open').length;
  const closedCount = feedback.filter((f) => f.status === 'closed').length;

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
              <Link href="/dashboard" className="hover:text-neutral-700">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-neutral-900">Feedback</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Site Feedback
            </h1>
            <p className="text-neutral-600 mt-1">
              Visitor feedback submitted via the site widget
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-neutral-500">Total</div>
              <div className="text-2xl font-bold text-neutral-900">
                {feedback.length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-neutral-500">Open</div>
              <div className="text-2xl font-bold text-neutral-900">
                {openCount}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-neutral-500">Closed</div>
              <div className="text-2xl font-bold text-neutral-900">
                {closedCount}
              </div>
            </Card>
          </div>

          {/* Feedback Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              All Feedback
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-200">
                  <tr>
                    <th className="text-left pb-3 font-semibold">Page</th>
                    <th className="text-left pb-3 font-semibold">Feedback</th>
                    <th className="text-left pb-3 font-semibold">From</th>
                    <th className="text-left pb-3 font-semibold">Status</th>
                    <th className="text-left pb-3 font-semibold">Date</th>
                    <th className="text-right pb-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-neutral-500"
                      >
                        <MessageSquareIcon className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                        No feedback yet
                      </td>
                    </tr>
                  ) : (
                    feedback.map((item) => (
                      <tr
                        key={item.number}
                        className="border-b border-neutral-100 hover:bg-neutral-50"
                      >
                        <td className="py-3 pr-4">
                          <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded">
                            {item.page}
                          </code>
                        </td>
                        <td className="py-3 pr-4 max-w-xs truncate text-neutral-700">
                          {item.excerpt}
                        </td>
                        <td className="py-3 pr-4 text-neutral-600 whitespace-nowrap">
                          {item.from}
                        </td>
                        <td className="py-3 pr-4">
                          {item.status === 'open' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              Open
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                              Closed
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-neutral-600 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3 text-right">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700"
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-4 text-center text-sm text-neutral-500">
            Data refreshes every 5 minutes
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
