import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">
            You don&apos;t have permission to access the admin area.
          </p>
          <p className="text-sm text-gray-400">
            If you believe this is an error, please contact support.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
            <Link href="/admin/login">
              <Button>Try Another Account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
