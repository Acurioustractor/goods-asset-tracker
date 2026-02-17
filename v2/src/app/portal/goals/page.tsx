'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate?: string;
  source: 'meeting' | 'yarning' | 'personal' | 'elder';
  linkedProjectIds: string[];
  progress: string[];
  createdAt: string;
}

const STORAGE_KEY = 'goods-portal-goals';

function loadGoals(): Goal[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveGoals(goals: Goal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

const GOAL_SUGGESTIONS = [
  { title: 'Every family has a bed', description: 'Ensure every household in our community has a quality Stretch Bed.' },
  { title: 'Local manufacturing', description: 'Set up and run our own production facility on country.' },
  { title: 'Employ local people', description: 'Create paid jobs for community members in manufacturing and distribution.' },
  { title: 'Divert community plastic', description: 'Collect and recycle plastic waste from our community into bed components.' },
  { title: 'Community-owned enterprise', description: 'Full ownership transfer — our community runs the business independently.' },
  { title: 'Train young operators', description: 'Youth training program for shredder, press, and CNC operation.' },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSource, setNewSource] = useState<Goal['source']>('meeting');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [progressNote, setProgressNote] = useState('');

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const createGoal = (suggestion?: typeof GOAL_SUGGESTIONS[0]) => {
    const title = suggestion?.title || newTitle.trim();
    const description = suggestion?.description || newDescription.trim();
    if (!title) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      targetDate: newTargetDate || undefined,
      source: newSource,
      linkedProjectIds: [],
      progress: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    saveGoals(updated);
    setShowNew(false);
    setNewTitle('');
    setNewDescription('');
    setNewTargetDate('');
    if (suggestion) {
      setSelectedGoal(goal);
    }
  };

  const addProgress = () => {
    if (!selectedGoal || !progressNote.trim()) return;
    const updated = goals.map(g =>
      g.id === selectedGoal.id
        ? { ...g, progress: [...g.progress, `${new Date().toLocaleDateString('en-AU')} — ${progressNote.trim()}`] }
        : g
    );
    setGoals(updated);
    saveGoals(updated);
    setSelectedGoal(updated.find(g => g.id === selectedGoal.id) || null);
    setProgressNote('');
  };

  // Goal detail
  if (selectedGoal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedGoal(null)}
            className="p-1 -ml-1 text-stone-500 hover:text-stone-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-stone-900">{selectedGoal.title}</h1>
            <p className="text-xs text-stone-500">
              From {selectedGoal.source}
              {selectedGoal.targetDate && ` · Target: ${selectedGoal.targetDate}`}
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-700 mb-6">{selectedGoal.description}</p>

        {/* Progress notes */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-stone-700 mb-3">Progress</h2>
          {selectedGoal.progress.length === 0 ? (
            <p className="text-sm text-stone-400 italic">No progress notes yet</p>
          ) : (
            <div className="space-y-2">
              {selectedGoal.progress.map((note, i) => (
                <div key={i} className="p-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-700">
                  {note}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add progress */}
        <div className="border-t border-stone-200 pt-4">
          <div className="flex items-end gap-2">
            <textarea
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              placeholder="Add a progress note..."
              rows={2}
              className="flex-1 resize-none rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-stone-50"
            />
            <button
              onClick={addProgress}
              disabled={!progressNote.trim()}
              className="p-3 rounded-full bg-purple-600 text-white flex-shrink-0 hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Goals list
  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/portal" className="p-1 -ml-1 text-stone-500 hover:text-stone-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-stone-900">Where We&apos;re Heading</h1>
          <p className="text-xs text-stone-500">Your community&apos;s goals and aspirations</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors"
        >
          New Goal
        </button>
      </div>

      {/* New goal form */}
      {showNew && (
        <div className="mb-6 space-y-4">
          {/* Suggestions */}
          <div>
            <h2 className="text-sm font-bold text-stone-700 mb-2">Common goals</h2>
            <div className="space-y-2">
              {GOAL_SUGGESTIONS.filter(s => !goals.some(g => g.title === s.title)).map(suggestion => (
                <button
                  key={suggestion.title}
                  onClick={() => createGoal(suggestion)}
                  className="w-full text-left p-3 bg-white border border-stone-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-medium text-stone-900 text-sm">{suggestion.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{suggestion.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom goal */}
          <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3">
            <h2 className="text-sm font-bold text-stone-700">Or write your own</h2>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the goal?"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-stone-50"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe what success looks like"
              rows={2}
              className="w-full resize-none rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-stone-50"
            />
            <div className="flex gap-2">
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value as Goal['source'])}
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm bg-stone-50"
              >
                <option value="meeting">From a meeting</option>
                <option value="yarning">From yarning</option>
                <option value="elder">From an Elder</option>
                <option value="personal">Personal goal</option>
              </select>
              <input
                type="text"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                placeholder="Target (e.g. Dec 2026)"
                className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm bg-stone-50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => createGoal()}
                disabled={!newTitle.trim()}
                className="flex-1 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2.5 text-sm text-stone-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goal list */}
      {goals.length === 0 && !showNew ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">No goals yet</h2>
          <p className="text-stone-500 text-sm mb-4">
            Capture what your community wants for the future.
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            Set Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(goal => (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal)}
              className="w-full text-left p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{goal.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {goal.progress.length} updates
                    {goal.targetDate && ` · Target: ${goal.targetDate}`}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">
                  {goal.source}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
