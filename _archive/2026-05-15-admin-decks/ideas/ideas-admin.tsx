'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ThumbsUp,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Zap,
  Filter,
} from 'lucide-react';
import { type AdminIdea, type FeedbackStats, updateIdeaStatus, deleteIdea } from './actions';

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted', icon: Clock, color: 'text-gray-500 bg-gray-100' },
  { value: 'reviewing', label: 'Under Review', icon: MessageSquare, color: 'text-blue-600 bg-blue-100' },
  { value: 'planned', label: 'Planned', icon: Zap, color: 'text-amber-600 bg-amber-100' },
  { value: 'in_progress', label: 'In Progress', icon: Zap, color: 'text-purple-600 bg-purple-100' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  { value: 'declined', label: 'Declined', icon: XCircle, color: 'text-red-600 bg-red-100' },
];

const CATEGORY_LABELS: Record<string, string> = {
  product: 'Product',
  service: 'Service',
  community: 'Community',
  other: 'Other',
};

interface Props {
  ideas: AdminIdea[];
  stats: FeedbackStats;
}

export function IdeasAdmin({ ideas, stats }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const router = useRouter();

  const filtered = statusFilter === 'all'
    ? ideas
    : ideas.filter(i => i.status === statusFilter);

  async function handleStatusChange(id: string, status: string) {
    await updateIdeaStatus(id, status);
    router.refresh();
  }

  async function handleSaveNotes(id: string) {
    await updateIdeaStatus(id, ideas.find(i => i.id === id)?.status || 'submitted', noteText);
    setEditingNotes(null);
    setNoteText('');
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteIdea(id);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Ideas</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Votes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Last 30 Days</p>
          <p className="text-2xl font-bold text-gray-900">{stats.recentIdeas}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Needs Review</p>
          <p className="text-2xl font-bold text-amber-600">{stats.byStatus['submitted'] || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-purple-600">
            {(stats.byStatus['planned'] || 0) + (stats.byStatus['in_progress'] || 0)}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({ideas.length})
          </button>
          {STATUS_OPTIONS.map(opt => {
            const count = ideas.filter(i => i.status === opt.value).length;
            if (count === 0) return null;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            No ideas {statusFilter !== 'all' ? `with status "${statusFilter}"` : 'yet'}.
          </div>
        ) : (
          filtered.map(idea => {
            const statusOpt = STATUS_OPTIONS.find(s => s.value === idea.status) || STATUS_OPTIONS[0];
            const StatusIcon = statusOpt.icon;

            return (
              <div key={idea.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-4">
                  {/* Vote Count */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <ThumbsUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">{idea.vote_count}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{idea.title}</h3>
                      {idea.category && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {CATEGORY_LABELS[idea.category] || idea.category}
                        </span>
                      )}
                    </div>
                    {idea.description && (
                      <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{new Date(idea.created_at).toLocaleDateString('en-AU')}</span>
                      {idea.admin_notes && (
                        <span className="text-amber-600 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Has admin notes
                        </span>
                      )}
                    </div>

                    {/* Admin Notes Editor */}
                    {editingNotes === idea.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Internal admin notes..."
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNotes(idea.id)}
                            className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                          >
                            Save Notes
                          </button>
                          <button
                            onClick={() => { setEditingNotes(null); setNoteText(''); }}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show existing notes */}
                    {idea.admin_notes && editingNotes !== idea.id && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800">
                        <strong>Notes:</strong> {idea.admin_notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status Badge + Dropdown */}
                    <select
                      value={idea.status}
                      onChange={e => handleStatusChange(idea.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusOpt.color}`}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    {/* Notes Button */}
                    <button
                      onClick={() => {
                        setEditingNotes(editingNotes === idea.id ? null : idea.id);
                        setNoteText(idea.admin_notes || '');
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Admin notes"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>

                    {/* Delete Button */}
                    {confirmDelete === idea.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(idea.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete idea"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
