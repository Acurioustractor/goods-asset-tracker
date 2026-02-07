'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  category: string;
}

// Wiki pages index - in production this would come from a database or search index
const WIKI_PAGES: SearchResult[] = [
  {
    title: 'Facility Manual',
    url: '/wiki/manufacturing/facility-manual',
    description:
      'Complete operations manual for Goods on Country containerized production facilities',
    category: 'Manufacturing',
  },
  {
    title: 'Stretch Bed Guide',
    url: '/wiki/products/stretch-bed',
    description:
      'Specifications, assembly instructions, maintenance, and troubleshooting for the Stretch Bed',
    category: 'Products',
  },
  {
    title: 'Pakkimjalki Kari (Washing Machine)',
    url: '/wiki/products/washing-machine',
    description:
      'Commercial-grade washing machine guide - operation, maintenance, and troubleshooting',
    category: 'Products',
  },
  {
    title: 'Products Overview',
    url: '/wiki/products',
    description:
      'Complete product catalog with specifications and comparison guide',
    category: 'Products',
  },
  {
    title: 'Wiki Home',
    url: '/wiki',
    description:
      'Goods on Country knowledge base - manufacturing, products, support, and guides',
    category: 'General',
  },
];

export function WikiSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Simple keyword search
    const searchLower = query.toLowerCase();
    const filtered = WIKI_PAGES.filter(
      (page) =>
        page.title.toLowerCase().includes(searchLower) ||
        page.description.toLowerCase().includes(searchLower) ||
        page.category.toLowerCase().includes(searchLower)
    );

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query]);

  const handleResultClick = (url: string) => {
    router.push(url);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <Input
          type="search"
          placeholder="Search wiki pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // Delay to allow click events on results
            setTimeout(() => setIsOpen(false), 200);
          }}
          className="pl-10 pr-4 py-3 text-base"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result) => (
              <button
                key={result.url}
                onClick={() => handleResultClick(result.url)}
                className="w-full px-4 py-3 text-left hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-neutral-900">
                        {result.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {result.description}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <div className="px-4 py-6 text-center text-neutral-500 text-sm">
            No pages found for &quot;{query}&quot;
          </div>
        </Card>
      )}
    </div>
  );
}
