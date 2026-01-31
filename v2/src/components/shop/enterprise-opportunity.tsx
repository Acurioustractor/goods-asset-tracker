'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { EnterpriseOpportunity as EnterpriseOpportunityType } from '@/lib/types/database';

interface EnterpriseOpportunityProps {
  data: EnterpriseOpportunityType;
  className?: string;
}

export function EnterpriseOpportunity({ data, className }: EnterpriseOpportunityProps) {
  if (!data || !data.enabled) {
    return null;
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{data.title}</h3>
            <p className="mt-2 text-white/90">{data.description}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6 md:p-8">
        {/* Benefits */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4">What we provide:</h4>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial Placeholder */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm italic text-muted-foreground">
                &ldquo;Running this enterprise has created employment for 6 community members and given us a sense of pride
                in what we create. The support from Goods has been incredible.&rdquo;
              </p>
              <p className="text-sm font-medium mt-2">Community Enterprise Partner</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
            <Link href="/contact?subject=enterprise">
              {data.contact_cta}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about#enterprise">
              Learn More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
