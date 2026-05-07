'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { lintBrandText, type BrandLintResult, type BrandViolation } from '@/lib/brand-lint';

const SAMPLE = `Goods on Country donates beds to remote indigenous communities, helping them unlock dignity and empowerment through our innovative, game-changing solution — leveraging synergies across the ecosystem to scale impact in remote australia.`;

export default function BrandLintPage() {
  const [text, setText] = useState('');
  const result: BrandLintResult = useMemo(() => lintBrandText(text), [text]);

  return (
    <main style={{ backgroundColor: '#FDF8F3', color: '#2E2E2E', minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: '#8B9D77' }}>
            Tools
          </p>
          <h1
            className="text-3xl md:text-4xl font-light leading-tight mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Brand voice linter
          </h1>
          <p className="text-base max-w-2xl" style={{ color: '#5E5E5E' }}>
            Paste any Goods on Country draft. Get every voice violation flagged before you send.
            Rules come from{' '}
            <Link href="/brand" className="underline" style={{ color: '#C45C3E' }}>
              the brand guide
            </Link>{' '}
            and stay in sync with the Notion mirror.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="draft"
                className="text-sm font-medium"
                style={{ color: '#2E2E2E' }}
              >
                Your draft
              </label>
              <button
                onClick={() => setText(SAMPLE)}
                className="text-xs underline underline-offset-2"
                style={{ color: '#7A7A7A' }}
              >
                Load a bad sample
              </button>
            </div>
            <textarea
              id="draft"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste an email, post, deck slide, page copy..."
              rows={20}
              className="w-full p-4 rounded border text-sm font-mono"
              style={{ borderColor: '#E8DED4', backgroundColor: '#fff', resize: 'vertical' }}
            />
            <div className="mt-2 flex items-center justify-between text-xs" style={{ color: '#7A7A7A' }}>
              <span>{text.length} chars</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setText('')}
                disabled={!text}
              >
                Clear
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2">
              <span className="text-sm font-medium">Result</span>
            </div>
            <div
              className="rounded border p-4 text-sm"
              style={{ borderColor: '#E8DED4', backgroundColor: '#fff', minHeight: '480px' }}
            >
              {!text ? (
                <p style={{ color: '#7A7A7A' }}>Paste a draft to see violations.</p>
              ) : result.clean ? (
                <div>
                  <p className="text-base font-medium mb-2" style={{ color: '#8B9D77' }}>
                    ✓ Clean
                  </p>
                  <p style={{ color: '#5E5E5E' }}>
                    No brand voice violations. {result.rulesApplied} rules applied.
                  </p>
                </div>
              ) : (
                <ResultList result={result} text={text} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-sm" style={{ color: '#5E5E5E' }}>
          <div>
            <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>
              Programmatic use
            </h3>
            <pre
              className="text-xs font-mono p-3 rounded overflow-x-auto"
              style={{ backgroundColor: '#fff', border: '1px solid #E8DED4', color: '#2E2E2E' }}
            >{`curl -X POST \\
  /api/brand-lint \\
  -H 'content-type: application/json' \\
  -d '{"text":"draft..."}'`}</pre>
          </div>
          <div>
            <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>
              Press kit JSON
            </h3>
            <p className="mb-2">Verified quotes, photo URLs, specs, contact, voice rules.</p>
            <Link
              href="/api/press-kit"
              className="text-xs font-mono underline"
              style={{ color: '#C45C3E' }}
            >
              GET /api/press-kit
            </Link>
          </div>
          <div>
            <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>
              The full brand guide
            </h3>
            <p className="mb-2">Voice principles, banned words, before/after examples, capitalisation rules.</p>
            <Link href="/brand" className="text-xs underline" style={{ color: '#C45C3E' }}>
              /brand
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function ResultList({ result, text }: { result: BrandLintResult; text: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 pb-3 border-b" style={{ borderColor: '#E8DED4' }}>
        {result.errorCount > 0 && (
          <span
            className="text-xs px-2 py-1 rounded font-medium"
            style={{ backgroundColor: 'rgba(196, 92, 62, 0.15)', color: '#C45C3E' }}
          >
            {result.errorCount} error{result.errorCount === 1 ? '' : 's'}
          </span>
        )}
        {result.warningCount > 0 && (
          <span
            className="text-xs px-2 py-1 rounded font-medium"
            style={{ backgroundColor: 'rgba(212, 165, 116, 0.2)', color: '#8B6F3F' }}
          >
            {result.warningCount} warning{result.warningCount === 1 ? '' : 's'}
          </span>
        )}
      </div>
      <ul className="space-y-3">
        {result.violations.map((v, i) => (
          <ViolationItem key={i} v={v} text={text} />
        ))}
      </ul>
    </div>
  );
}

function ViolationItem({ v, text }: { v: BrandViolation; text: string }) {
  const lineNum = text.substring(0, v.start).split('\n').length;
  const color = v.severity === 'error' ? '#C45C3E' : '#8B6F3F';

  return (
    <li className="border-l-2 pl-3" style={{ borderColor: color }}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color }}>
          {v.severity}
        </span>
        <span className="text-xs" style={{ color: '#7A7A7A' }}>
          line {lineNum}
        </span>
        <code
          className="text-xs px-1.5 py-0.5 rounded font-mono"
          style={{ backgroundColor: 'rgba(46,46,46,0.05)', color: '#2E2E2E' }}
        >
          {v.match}
        </code>
      </div>
      <p className="text-sm" style={{ color: '#5E5E5E' }}>
        {v.message}
      </p>
      {v.suggestion && (
        <p className="text-xs mt-1" style={{ color: '#8B9D77' }}>
          → try: <span className="font-mono">{v.suggestion}</span>
        </p>
      )}
    </li>
  );
}
