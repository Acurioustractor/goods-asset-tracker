import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'My Items - Goods on Country',
  description: 'View your claimed beds and washing machines',
};

export default async function MyItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/phone-login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, phone')
    .eq('id', user.id)
    .single();

  const displayName = profile?.display_name || user.phone || 'User';
  const maskedPhone = user.phone
    ? user.phone.substring(0, 4) + ' *** ***' + user.phone.substring(user.phone.length - 3)
    : '';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="bed">🛏️</span>
              <div>
                <h1 className="text-lg font-bold">My Items</h1>
                <p className="text-sm opacity-90">{maskedPhone || displayName}</p>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button
                variant="ghost"
                size="sm"
                type="submit"
                className="text-primary-foreground hover:bg-white/20"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/support"
              className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xl">🎫</span>
              <span className="text-xs">Support</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
