import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Story Templates | Goods Wiki',
  description: 'Templates for creating community impact stories, delivery reports, and testimonials.',
};

export default function StoryTemplatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/wiki" className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-block">
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Templates</h1>
          <p className="text-lg text-gray-600">
            Templates for creating impact stories in Empathy Ledger. All stories require consent from community members.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Template 1: Bed Delivery */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <h2 className="text-xl font-bold text-gray-900">1. Bed Delivery Story</h2>
            <p className="text-sm text-gray-600 mt-1">Use after delivering beds to a community</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Title Format</span>
              <p className="text-gray-900 font-medium">[Number] Beds Delivered to [Community]</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Summary</span>
              <p className="text-gray-600">On [date], we delivered [number] Stretch Beds to families in [community]. Here&apos;s what happened.</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Body Template</span>
              <pre className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">{`## The Journey

Today we delivered [number] Stretch Beds to [community]. After [X] hours of driving, we arrived to [describe reception].

## Community Voices

"[Quote from community member]"
— [Name], [Community]

## Impact

- [Number] families now have comfortable beds
- [Number] children with their own sleeping space
- [Total] kg of recycled plastic given new life

## What's Next

We have [number] more beds requested from this community. Your support makes this possible.

---
*Story shared with permission. Community members control their own narratives.*`}</pre>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Tags</span>
              <div className="flex gap-2 mt-1">
                {['delivery', 'impact', 'stretch-bed', '[community-name]'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Template 2: Community Voice */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-900">2. Community Voice / Testimonial</h2>
            <p className="text-sm text-gray-600 mt-1">A community member shares their experience</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Title Format</span>
              <p className="text-gray-900 font-medium">&quot;[Short quote]&quot; &mdash; [Name], [Community]</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Body Template</span>
              <pre className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">{`## Their Story

[Full quote or story from community member]

## Context

[Name] received their bed on [date] as part of our [community] delivery program. [Brief context about the community and their needs.]

## In Their Words

"[Extended quote if available]"

---
*Shared with explicit consent. [Name] reviewed and approved this story.*`}</pre>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Tags</span>
              <div className="flex gap-2 mt-1">
                {['community-voice', 'testimonial', '[community-name]'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Template 3: Impact Report */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
            <h2 className="text-xl font-bold text-gray-900">3. Impact Report</h2>
            <p className="text-sm text-gray-600 mt-1">Quarterly or milestone impact summaries</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Title Format</span>
              <p className="text-gray-900 font-medium">Impact Report: [Quarter/Year] or [Milestone]</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Body Template</span>
              <pre className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">{`## Overview

This [quarter/period], Goods on Country [key achievement summary].

## By the Numbers

| Metric | This Period | All Time |
|--------|------------|----------|
| Beds deployed | [X] | [Y] |
| Communities reached | [X] | [Y] |
| Plastic diverted (kg) | [X] | [Y] |
| Washing machines active | [X] | [Y] |

## Highlights

1. [Key achievement 1]
2. [Key achievement 2]
3. [Key achievement 3]

## Community Feedback

"[Quote]" — [Name], [Community]

## Looking Ahead

[Next quarter priorities and goals]`}</pre>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Tags</span>
              <div className="flex gap-2 mt-1">
                {['impact-report', 'data', 'quarterly'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Consent Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Consent & Cultural Protocols</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><strong>Always get explicit consent</strong> before sharing anyone&apos;s story, name, or image.</li>
            <li><strong>Community members control their narratives.</strong> They can withdraw consent at any time.</li>
            <li><strong>No photos of children</strong> without guardian consent and community approval.</li>
            <li><strong>Avoid deficit framing.</strong> Lead with strength, agency, and community voice — not charity.</li>
            <li><strong>Check cultural protocols</strong> with local Elders before sharing stories from their country.</li>
            <li><strong>Use Empathy Ledger&apos;s consent system</strong> — it tracks consent status and withdrawal.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
