'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ComponentsBreakdown } from './components-breakdown';
import { AssemblyInstructions } from './assembly-instructions';
import { SustainabilityImpact } from './sustainability-impact';
import type { ProductComponent, AssemblyStep, SustainabilityData } from '@/lib/types/database';

interface ProductTabsProps {
  components?: ProductComponent[];
  assemblySteps?: AssemblyStep[];
  assemblyTime?: string;
  sustainability?: SustainabilityData;
  className?: string;
}

type TabId = 'components' | 'assembly' | 'sustainability';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  available: boolean;
}

export function ProductTabs({
  components,
  assemblySteps,
  assemblyTime,
  sustainability,
  className,
}: ProductTabsProps) {
  // Determine which tabs are available
  const tabs: Tab[] = [
    {
      id: 'components',
      label: 'Components',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      available: !!components && components.length > 0,
    },
    {
      id: 'assembly',
      label: 'Assembly',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      available: !!assemblySteps && assemblySteps.length > 0,
    },
    {
      id: 'sustainability',
      label: 'Sustainability',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      available: !!sustainability,
    },
  ];

  const availableTabs = tabs.filter((tab) => tab.available);

  // Default to first available tab
  const [activeTab, setActiveTab] = React.useState<TabId>(
    availableTabs[0]?.id || 'components'
  );

  // If no tabs available, don't render
  if (availableTabs.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-6 -mb-px" aria-label="Product information tabs">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 py-4 px-1 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'components' && components && (
          <ComponentsBreakdown components={components} />
        )}
        {activeTab === 'assembly' && assemblySteps && (
          <AssemblyInstructions steps={assemblySteps} assemblyTime={assemblyTime} />
        )}
        {activeTab === 'sustainability' && sustainability && (
          <SustainabilityImpact data={sustainability} />
        )}
      </div>
    </div>
  );
}
