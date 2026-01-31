'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AssetInfo {
  id: string;
  product: string;
  community: string;
  ownerName: string | null;
  lastCheckIn: string | null;
}

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

interface SubmitResult {
  success: boolean;
  message: string;
  reference?: string;
}

function SupportPageContent() {
  const searchParams = useSearchParams();
  const assetIdParam = searchParams.get('asset_id');

  const [assetId, setAssetId] = useState(assetIdParam || '');
  const [asset, setAsset] = useState<AssetInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<SubmitResult | null>(null);

  // Form fields
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState('');

  // Auto-lookup asset when page loads with asset_id
  useEffect(() => {
    if (assetIdParam) {
      lookupAsset(assetIdParam);
    }
  }, [assetIdParam]);

  async function lookupAsset(id: string) {
    if (!id.trim()) return;

    setLoading(true);
    setError('');
    setAsset(null);

    try {
      const response = await fetch(`/api/support?asset_id=${encodeURIComponent(id.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Asset not found');
        return;
      }

      setAsset(data.asset);
      setAssetId(id.trim());
    } catch {
      setError('Failed to look up asset. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userContact.trim() || !issueDescription.trim()) {
      setError('Please provide your contact information and describe the issue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: assetId || 'UNKNOWN',
          userName: userName.trim() || undefined,
          userContact: userContact.trim(),
          issueDescription: issueDescription.trim(),
          priority,
          category: category || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit request');
        return;
      }

      setSubmitted({
        success: true,
        message: data.message,
        reference: data.reference,
      });
    } catch {
      setError('Failed to submit request. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (submitted?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-lg mx-auto px-4">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-green-800">Request Submitted</CardTitle>
              <CardDescription className="text-green-700">
                {submitted.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {submitted.reference && (
                <p className="text-sm">
                  Reference: <strong className="font-mono">{submitted.reference}</strong>
                </p>
              )}
              <p className="text-sm text-gray-600">
                If your issue is urgent, please call us directly at{' '}
                <a href="tel:+61123456789" className="text-blue-600 hover:underline">
                  (02) 1234 5678
                </a>
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(null);
                  setIssueDescription('');
                }}
              >
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Goods Support</h1>
          <p className="text-gray-600 mt-2">
            Need help with your bed or washing machine? We&apos;re here to assist.
          </p>
        </div>

        {/* Asset Lookup (if not already found) */}
        {!asset && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find Your Product</CardTitle>
              <CardDescription>
                Enter the Asset ID from your QR code sticker or enter it manually below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  lookupAsset(assetId);
                }}
                className="flex gap-2"
              >
                <Input
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  placeholder="e.g., GB0-22-001"
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Looking up...' : 'Find'}
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                The Asset ID is found on the QR code sticker on your product.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Asset Info */}
        {asset && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">{asset.product}</h3>
                  <p className="text-sm text-amber-700">Asset ID: {asset.id}</p>
                  {asset.community && (
                    <p className="text-sm text-amber-600">Community: {asset.community}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAsset(null);
                    setAssetId('');
                  }}
                  className="text-amber-600"
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Support Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Support Request</CardTitle>
            <CardDescription>
              Tell us about your issue and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name (optional)</Label>
                <Input
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">
                  Phone or Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="Your phone number or email"
                  required
                />
                <p className="text-xs text-gray-500">
                  We&apos;ll use this to contact you about your request.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Issue Type</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select a category...</option>
                  <option value="damage">Damage or Wear</option>
                  <option value="repair">Needs Repair</option>
                  <option value="replacement">Replacement Request</option>
                  <option value="question">General Question</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="Low">Low - General inquiry</option>
                  <option value="Medium">Medium - Issue needs attention</option>
                  <option value="High">High - Urgent issue</option>
                  <option value="Urgent">Urgent - Safety concern</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Describe the Issue <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Please describe what's happening with your product..."
                  rows={4}
                  required
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            For urgent matters, call us directly at{' '}
            <a href="tel:+61123456789" className="text-blue-600 hover:underline font-medium">
              (02) 1234 5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <SupportPageContent />
    </Suspense>
  );
}
