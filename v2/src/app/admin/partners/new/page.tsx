'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createContact } from '../actions';

const ROLES = [
  'storyteller',
  'partner',
  'supplier',
  'staff',
  'advisory',
  'supporter',
  'inquiry',
  'buyer',
  'funder',
  'community_leader',
] as const;

export default function NewContactPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function handleSubmit(formData: FormData) {
    formData.set('roles', selectedRoles.join(','));
    setError(null);
    startTransition(async () => {
      const result = await createContact(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin/partners');
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/partners" className="text-sm text-blue-600 hover:underline">
        ← Back to People
      </Link>

      <h1 className="text-2xl font-bold">Add Contact</h1>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" />
              </div>
              <div>
                <Label>Organization</Label>
                <Input name="organization" />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input name="job_title" />
              </div>
              <div>
                <Label>Location</Label>
                <Input name="location" placeholder="e.g. Tennant Creek, NT" />
              </div>
              <div>
                <Label>Website</Label>
                <Input name="website" type="url" />
              </div>
              <div>
                <Label>Status</Label>
                <select name="status" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label>Relationship</Label>
                <select name="relationship_status" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="prospect">Prospect</option>
                  <option value="warm">Warm</option>
                  <option value="active">Active</option>
                  <option value="dormant">Dormant</option>
                </select>
              </div>
              <div>
                <Label>First Contact Date</Label>
                <Input name="first_contact_date" type="date" />
              </div>
            </div>

            {/* Roles */}
            <div>
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedRoles.includes(role)
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {role.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input name="tags" placeholder="e.g. health, manufacturing, NT" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_elder" value="true" id="is_elder" />
              <Label htmlFor="is_elder" className="mb-0">Elder</Label>
            </div>

            <div>
              <Label>Cultural Background</Label>
              <Input name="cultural_background" />
            </div>

            <div>
              <Label>Bio / Notes</Label>
              <Textarea name="bio" rows={4} />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Contact'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
