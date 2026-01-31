'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SustainabilityData } from '@/lib/types/database';

interface SustainabilityImpactProps {
  data: SustainabilityData;
  className?: string;
}

export function SustainabilityImpact({ data, className }: SustainabilityImpactProps) {
  if (!data) {
    return null;
  }

  const stats = [
    {
      value: data.plastic_diverted_kg,
      unit: 'kg',
      label: 'Plastic Diverted',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      value: data.carbon_saved_kg,
      unit: 'kg CO₂',
      label: 'Carbon Saved',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-sky-600',
      bgColor: 'bg-sky-100 dark:bg-sky-900/30',
    },
    {
      value: data.local_jobs_created,
      unit: data.local_jobs_created === 1 ? 'job' : 'jobs',
      label: 'Local Jobs Created',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      value: data.community_share_percent,
      unit: '%',
      label: 'Returns to Community',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'text-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-lg font-semibold">Environmental Impact</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Every purchase makes a difference
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <div className={cn('w-12 h-12 rounded-full mx-auto flex items-center justify-center', stat.bgColor, stat.color)}>
                {stat.icon}
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Circular Economy Explanation */}
      <Card className="bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/20 dark:to-sky-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icon/Visual */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
                Circular Economy Model
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                Our products are made from recycled materials and designed to last. When they reach end of life,
                components can be returned and recycled into new products. This closed-loop approach
                minimizes waste and maximizes the value of every material.
              </p>
              <Link
                href="/impact"
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-3 hover:underline"
              >
                Learn more about our impact
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
