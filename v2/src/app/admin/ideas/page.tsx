'use client';

import { useState, useTransition, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getIdeas, updateIdeaStatus } from './actions';
import type { CommunityIdea } from '@/lib/types/database';

const IDEA_STATUSES = [
  'submitted',
  'reviewing',
  'planned',
  'in_progress',
  'completed',
  'declined',
] as const;

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  planned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getIdeas().then(setIdeas);
  }, []);

  function refresh() {
    getIdeas().then(setIdeas);
  }

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      await updateIdeaStatus(id, status);
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Community Ideas</h1>
        <p className="text-gray-500 mt-1">{ideas.length} ideas submitted</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Votes</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ideas.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No community ideas yet
                </td>
              </tr>
            ) : (
              ideas.map((idea) => (
                <>
                  <tr
                    key={idea.id}
                    className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setExpandedId(expandedId === idea.id ? null : idea.id)
                    }
                  >
                    <td className="py-3 font-medium">{idea.title}</td>
                    <td className="py-3 text-gray-600">{idea.category || '—'}</td>
                    <td className="py-3">
                      <Badge className={STATUS_COLORS[idea.status] || 'bg-gray-100 text-gray-800'}>
                        {idea.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-medium">{idea.vote_count}</td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(idea.created_at).toLocaleDateString('en-AU')}
                    </td>
                    <td className="py-3">
                      <select
                        value={idea.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(idea.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border border-gray-300 px-2 py-1 text-xs"
                        disabled={isPending}
                      >
                        {IDEA_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedId === idea.id && idea.description && (
                    <tr key={`${idea.id}-desc`}>
                      <td colSpan={6} className="py-3 px-4 bg-gray-50 text-sm text-gray-600">
                        {idea.description}
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
