'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RequisitionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [community, setCommunity] = React.useState('');
  const [product, setProduct] = React.useState('Stretch Bed');
  const [quantity, setQuantity] = React.useState(1);
  const [partnerName, setPartnerName] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community: community.trim(),
          product,
          quantity,
          partner_name: partnerName.trim() || null,
          notes: notes.trim() || null,
          status: 'requested',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create requisition');
      }

      // Reset form
      setCommunity('');
      setProduct('Stretch Bed');
      setQuantity(1);
      setPartnerName('');
      setNotes('');
      router.refresh();
    } catch (error) {
      console.error('Error creating requisition:', error);
      alert('Failed to create requisition');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New Requisition</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Community *</Label>
            <Input
              placeholder="e.g. Mutitjulu"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Product</Label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="Stretch Bed">Stretch Bed</option>
              <option value="Washing Machine">Washing Machine</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Quantity</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Source / Partner</Label>
            <Input
              placeholder="e.g. Forum, NIAA"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Input
              placeholder="Context or details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !community.trim()}>
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
