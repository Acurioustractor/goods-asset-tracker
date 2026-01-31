'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CATEGORIES = [
  { value: 'product', label: 'Product Improvement' },
  { value: 'service', label: 'Service Enhancement' },
  { value: 'community', label: 'Community Feature' },
  { value: 'other', label: 'Other' },
];

export default function NewIdeaPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title for your idea');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category: category || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit idea');
      }

      // Redirect to ideas list
      router.push('/community/ideas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit idea');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-xl font-bold">Submit an Idea</h1>
          <p className="text-sm opacity-90">Share your thoughts with us</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Idea</CardTitle>
            <CardDescription>
              Tell us how we can improve our products or services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A short summary of your idea"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-muted border-0 text-sm"
                >
                  <option value="">Select a category (optional)</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your idea in more detail (optional)"
                  rows={4}
                  className="w-full p-2.5 rounded-lg bg-muted border-0 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Idea'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center pt-6">
          <Link href="/community/ideas" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Ideas
          </Link>
        </div>
      </main>
    </div>
  );
}
