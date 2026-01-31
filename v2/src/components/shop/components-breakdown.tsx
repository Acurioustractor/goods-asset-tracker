'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProductComponent } from '@/lib/types/database';

interface ComponentsBreakdownProps {
  components: ProductComponent[];
  className?: string;
}

export function ComponentsBreakdown({ components, className }: ComponentsBreakdownProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">What&apos;s Included</h3>
        <span className="text-sm text-muted-foreground">{components.length} components</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((component, index) => (
          <Card
            key={index}
            className={cn(
              'overflow-hidden transition-shadow hover:shadow-md cursor-pointer',
              expandedIndex === index && 'ring-2 ring-primary'
            )}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            {/* Component Image */}
            <div className="relative aspect-[4/3] bg-muted">
              {component.image ? (
                <Image
                  src={component.image}
                  alt={component.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-muted-foreground/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h4 className="font-medium">{component.name}</h4>
              <p
                className={cn(
                  'text-sm text-muted-foreground mt-1 transition-all',
                  expandedIndex === index ? '' : 'line-clamp-2'
                )}
              >
                {component.description}
              </p>
              {component.description && component.description.length > 80 && (
                <button
                  className="text-xs text-primary mt-2 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }}
                >
                  {expandedIndex === index ? 'Show less' : 'Read more'}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
