'use client';

import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { toggleChecklistItem, type ChecklistState } from './actions';

export interface Step {
  action: string;
  owner: string;
  when: string;
  urgent: boolean;
}

interface ChecklistStepsProps {
  steps: Step[];
  prefix: string; // 'groote' or 'real'
  initialState: ChecklistState;
  accentColor: 'orange' | 'blue';
}

export function ChecklistSteps({ steps, prefix, initialState, accentColor }: ChecklistStepsProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (let i = 0; i < steps.length; i++) {
      const id = `${prefix}-${i}`;
      map[id] = initialState[id]?.checked ?? false;
    }
    return map;
  });
  const [isPending, startTransition] = useTransition();

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const colors = {
    orange: {
      badge: 'bg-orange-100 text-orange-800',
      urgentBorder: 'border-orange-400 bg-orange-50',
      checkBg: 'bg-orange-500',
      checkBorder: 'border-orange-500',
      progressBg: 'bg-orange-100',
      progressFill: 'bg-orange-500',
      progressText: 'text-orange-700',
    },
    blue: {
      badge: 'bg-blue-100 text-blue-800',
      urgentBorder: 'border-blue-400 bg-blue-50',
      checkBg: 'bg-blue-500',
      checkBorder: 'border-blue-500',
      progressBg: 'bg-blue-100',
      progressFill: 'bg-blue-500',
      progressText: 'text-blue-700',
    },
  };

  const c = colors[accentColor];

  function handleToggle(itemId: string, currentChecked: boolean) {
    const newChecked = !currentChecked;
    // Optimistic update
    setCheckedItems(prev => ({ ...prev, [itemId]: newChecked }));

    startTransition(async () => {
      try {
        await toggleChecklistItem(itemId, newChecked);
      } catch {
        // Revert on error
        setCheckedItems(prev => ({ ...prev, [itemId]: currentChecked }));
      }
    });
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="bg-gray-50 px-5 py-3 border-b flex items-center justify-between">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Next Steps — {prefix === 'groote' ? 'Groote' : 'REAL Fund'}
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-16 rounded-full ${c.progressBg} overflow-hidden`}>
            <div
              className={`h-full rounded-full ${c.progressFill} transition-all duration-500 ease-out`}
              style={{ width: `${steps.length > 0 ? (checkedCount / steps.length) * 100 : 0}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${c.progressText} tabular-nums`}>
            {checkedCount}/{steps.length}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {steps.map((s, i) => {
          const itemId = `${prefix}-${i}`;
          const isChecked = checkedItems[itemId] ?? false;

          return (
            <div
              key={itemId}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isChecked ? 'opacity-60' : s.urgent ? '' : 'opacity-70'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggle(itemId, isChecked)}
                disabled={isPending}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 ${
                  isChecked
                    ? `${c.checkBorder} ${c.checkBg}`
                    : s.urgent
                      ? c.urgentBorder
                      : 'border-gray-200 hover:border-gray-400'
                }`}
                aria-label={`Mark "${s.action}" as ${isChecked ? 'incomplete' : 'complete'}`}
              >
                {isChecked ? (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                )}
              </button>
              <div className="flex-1">
                <div className={`text-sm transition-all duration-300 ${
                  isChecked
                    ? 'line-through text-gray-400'
                    : s.urgent
                      ? 'font-semibold'
                      : ''
                }`}>
                  {s.action}
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  isChecked ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {s.owner} &middot; {s.when}
                </div>
              </div>
              {s.urgent && (
                <Badge className={`${c.badge} text-[10px] shrink-0 ${isChecked ? 'opacity-50' : ''}`}>
                  NOW
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
