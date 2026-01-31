'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AssemblyStep } from '@/lib/types/database';

interface AssemblyInstructionsProps {
  steps: AssemblyStep[];
  assemblyTime?: string;
  className?: string;
}

export function AssemblyInstructions({
  steps,
  assemblyTime,
  className,
}: AssemblyInstructionsProps) {
  const [expandedStep, setExpandedStep] = React.useState<number | null>(0);

  if (!steps || steps.length === 0) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold">Assembly Instructions</h3>
          {assemblyTime && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estimated time: {assemblyTime}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Instructions
        </Button>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <Card
            key={step.step}
            className={cn(
              'overflow-hidden transition-all',
              expandedStep === index ? 'ring-2 ring-primary' : ''
            )}
          >
            {/* Step Header */}
            <button
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
            >
              {/* Step Number */}
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold flex-shrink-0">
                {step.step}
              </div>

              {/* Step Title */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{step.title}</h4>
              </div>

              {/* Expand/Collapse Icon */}
              <svg
                className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform',
                  expandedStep === index && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded Content */}
            {expandedStep === index && (
              <CardContent className="pt-0 pb-4 px-4">
                <div className="ml-14 space-y-4">
                  {/* Step Image */}
                  {step.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={step.image}
                        alt={`Step ${step.step}: ${step.title}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Step Description */}
                  <p className="text-muted-foreground">{step.description}</p>

                  {/* Navigation */}
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStep(index > 0 ? index - 1 : null);
                      }}
                      disabled={index === 0}
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStep(index < steps.length - 1 ? index + 1 : null);
                      }}
                      disabled={index === steps.length - 1}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Completion message */}
      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Need help?</p>
            <p className="text-sm text-muted-foreground">
              Contact us if you need assistance with assembly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
